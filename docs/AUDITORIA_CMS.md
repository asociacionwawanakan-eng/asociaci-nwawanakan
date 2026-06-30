# Auditoría Completa del Sistema CMS — Hallazgos y Mitigaciones

**Fecha:** 2026-06-29  
**Estado:** ✅ Completada — 8 problemas identificados y mitigados  
**Ramas:** `leo-firebase-integration` (implementación completa)

---

## 1. Hidratación de Arrays Dinámicos ❌→✅

### Problema
Cuando se añadían nuevos elementos a arrays (requisitos, beneficios, valores, etc.), la web NO mostraba los cambios en tiempo real, solo cuando se recargaba.

**Root cause:** 
- La hidratación originalmente solo manejaba arrays dentro de `<ul>`
- Otros arrays estaban en `<div>`, `<article>`, etc. y se ignoraban
- Cuando iteraba sobre elementos con `data-cms-text="array.0"`, obtenía strings, no arrays
- No regeneraba el contenedor cuando el tamaño del array cambiaba

### Impacto
- ✅ Requisitos de Pasantía (4 elementos iniciales → dinámico)
- ✅ Beneficios de Voluntariado (4 elementos iniciales → dinámico)
- ✅ Formas de Ayuda (5 elementos iniciales → dinámico)
- ✅ Pasos de Voluntariado (3 elementos iniciales → dinámico)
- ✅ Valores (5 elementos iniciales → dinámico)
- ✅ Directorio (6 elementos iniciales → dinámico)
- ✅ Cualquier array futuro (automático)

### Solución
```javascript
// Detectar arrays automáticamente
const arrayPaths = new Map(); // raíz → {índices, minIndex, maxIndex}

// Regenerar si el tamaño cambió
if (currentSize !== newSize) {
  // Reemplazar todos los elementos del array
  // Maneja tanto arrays de strings como de objetos
}
```

**Commit:** `5c70684` — Auditoría y mitigación completa: hidratación robusta para arrays dinámicos

---

## 2. Listeners en Tiempo Real Sin Desuscripción ❌→✅

### Problema
Los listeners de Firestore nunca se desuscribían. Cada recarga de página agregaba nuevos listeners sin limpiar los anteriores.

**Root cause:**
- `startRealtimeListeners()` guardaba las funciones `unsub` en variables locales, nunca las llamaba
- `beforeunload` no existía para limpiar

### Impacto
- Memory leak: cada navegación/recarga = más listeners activos
- Duplicación de actualizaciones (si hay N listeners, se actualiza N veces)
- Consumo innecesario de banda de Firestore (Realtime Database billing)

### Solución
```javascript
let unsubscribeFunctions = [];

// Guardar cada función unsub
const unsub = fs.onSnapshot(...);
unsubscribeFunctions.push(unsub);

// Limpiar al descargar
window.addEventListener("beforeunload", () => {
  unsubscribeFunctions.forEach(unsub => unsub());
  unsubscribeFunctions = [];
});
```

**Commit:** `d820825` — Auditoría completa: timing, memory leaks, error handling

---

## 3. Múltiples Listeners Duplicados ❌→✅

### Problema
`startRealtimeListeners()` podía ser llamada más de una vez (aunque no lo hacía en la práctica), agregando listeners duplicados.

### Solución
```javascript
if (unsubscribeFunctions.length > 0) {
  console.log("[CMS] Listeners ya activos, skipping...");
  return;
}
```

**Commit:** `d820825`

---

## 4. Timing de Inicialización — Firestore vs. JSON Local ❌→✅

### Problema
`main.js` ejecutaba `loadData()` inmediatamente, pero `firebase-content.js` aún se estaba inicializando.

**Root cause:**
```javascript
// Antes (INCORRECTO)
loadData().then(...);  // Ejecuta ANTES de que Firebase esté listo
```

**Resultado:**
- La primera carga ignoraba datos de Firestore
- Usaba JSON local como fallback
- Solo después de recarga mostraba datos de Firestore
- Inconsistencia: primera carga ≠ cargas posteriores

### Solución
```javascript
// Esperar a que firebase-content.js dispare evento
document.addEventListener("wawa:content-ready", initializeCenters, { once: true });

// Fallback por seguridad
setTimeout(initializeCenters, 3000);
```

**Commit:** `d820825`

---

## 5. Error Handling Deficiente en Firestore ❌→✅

### Problema
`loadContent()` esperaba indefinidamente a Firestore sin timeout. Si había conexión lenta o falla, el sitio se bloqueaba.

### Solución
```javascript
// Timeout 5 segundos
const docSnaps = await Promise.race([
  Promise.all(docSnapsPromise),
  new Promise((_, reject) => 
    setTimeout(() => reject(new Error("Timeout")), 5000)
  )
]);

// Manejo de errores individuales
getDoc(...).catch((err) => {
  console.warn(`[CMS] Error en sitio/${id}:`, err.code);
  return null;
})
```

**Commit:** `d820825`

---

## 6. Listener Especial en Pasantía Sin Actualización Real-time ❌→✅

### Problema
`pasantia.html` tenía un script que escuchaba `wawa:content-ready` pero NO `wawa:content-updated`.

**Resultado:**
- Cambios en estado de convocatoria solo se veían al recargar
- Listeners en tiempo real no se reflejaban

### Solución
```javascript
function updateConvocatoriaState(event) {
  // ... lógica ...
}
document.addEventListener("wawa:content-ready", updateConvocatoriaState);
document.addEventListener("wawa:content-updated", updateConvocatoriaState); // ← NUEVO
```

**Commit:** `5c70684`

---

## 7. Validación de Tipos de Datos Ausente ❌→✅

### Problema
No había validación de que los datos cargados de Firestore tuvieran los tipos correctos.

**Riesgos:**
- Si alguien guardaba un string en un array, no se detectaba
- Arrays vacíos se trataban diferente a null
- Corrupción de datos silenciosa

### Solución
```javascript
function validateContent(content) {
  const validations = [
    { path: "heroSlides.slides", type: "array" },
    { path: "valores", type: "array" },
    // ... más validaciones ...
  ];
  
  validations.forEach(({ path, type }) => {
    const value = get(content, path);
    if (type === "array" && !Array.isArray(value)) {
      console.warn(`[CMS] ${path} debería ser array`);
    }
  });
}
```

**Arrays validados automáticamente:**
- `heroSlides.slides`
- `misionSlides.slides`
- `visionSlides.slides`
- `valores`
- `directorio`
- `pasantia.requisitos`
- `voluntariado.beneficios`
- `voluntariado.formasAyuda`
- `voluntariado.pasos`

**Commit:** `d820825`

---

## 8. Falta de Debounce en Actualizaciones en Tiempo Real ⚠️→✅

### Problema
Cada cambio en Firestore disparaba `loadContent()` y `hydrate()` inmediatamente.

**Riesgo:**
- Si se editan múltiples campos seguidos, la página parpadea X veces
- Consumo innecesario de CPU

### Solución
```javascript
let updateTimeout;
const updateContent = () => {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(async () => {
    // Actualizar después de 200ms sin cambios
  }, 200);
};
```

**Commit:** `5c70684`

---

## Matriz de Riesgos — Antes vs. Después

| Riesgo | Severidad | Antes | Después |
|--------|-----------|-------|---------|
| Arrays no se actualizan al crecer | 🔴 Alta | ❌ Falla | ✅ Funciona |
| Memory leaks en listeners | 🔴 Alta | ❌ Ocurre | ✅ Previene |
| Duplicación de listeners | 🟡 Media | ⚠️ Posible | ✅ Previene |
| Timing de Firebase vs. JSON | 🔴 Alta | ❌ Inconsistente | ✅ Sincronizado |
| Bloqueo en Firestore lento | 🟡 Media | ❌ Ocurre | ✅ Timeout 5s |
| Cambios no reflejan en real-time | 🔴 Alta | ❌ Requiere recarga | ✅ Instantáneo |
| Datos corruptos no detectados | 🟡 Media | ⚠️ Silencioso | ✅ Logs de alerta |
| Parpadeos múltiples | 🟢 Baja | ⚠️ Posible | ✅ Debounce |

---

## Testing Realizado

### Test 1: Añadir Requisito
- ✅ Agregar 5to requisito en pasantía
- ✅ Guardar en admin
- ✅ Aparece inmediatamente en web (sin recarga)

### Test 2: Editar Valor Existente
- ✅ Cambiar texto de requisito existente
- ✅ Aparece en <1s en web

### Test 3: Múltiples Páginas
- ✅ Editar en voluntariado → se refleja en web
- ✅ Editar directorio → se refleja en web
- ✅ Editar valores → se refleja en web

### Test 4: Timeout
- ✅ Desconectar Firestore → sitio sigue funcionando con defaults
- ✅ Reconectar → datos se sincronizan

---

## Recomendaciones Futuras

### Nivel 1 (Crítico)
- [ ] Agregar logging centralizado (enviar errores a Sentry o similar)
- [ ] Monitoreo de rendimiento (Firebase Performance Monitoring)
- [ ] Alertas si listeners fallan

### Nivel 2 (Importante)
- [ ] Caché local (Service Worker) para offline-first
- [ ] Compresión de imagenes en Cloudinary
- [ ] Rate limiting en uploads

### Nivel 3 (Optimización)
- [ ] Lazy load de collections grandes
- [ ] Caché en memoria de datos leídos
- [ ] Prefetch de datos en rutas relacionadas

---

## Cambios de Archivo

| Archivo | Cambios |
|---------|---------|
| `public/js/firebase-content.js` | +200 líneas de validación, error handling, listeners mejorados |
| `public/js/main.js` | Timing de inicialización sincronizado con Firebase |
| `public/pasantia.html` | Listener agregado para `wawa:content-updated` |
| `public/admin/js/app.js` | (sin cambios en auditoría) |

---

## Estado Final

✅ **Auditoría Completada**  
✅ **8 problemas identificados y mitigados**  
✅ **Testing básico realizado**  
✅ **Documentación actualizada**  

**Próximo paso:** Merge a `main` cuando esté listo.

---

*Auditoría realizda con criterios de confiabilidad, performance y mantenibilidad.*
