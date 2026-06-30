/**
 * Configuración de Firebase y Cloudinary — fuente única de credenciales.
 *
 * ── CÓMO ACTIVAR EL CMS ──────────────────────────────────────────────
 * 1. En la Consola de Firebase > Configuración del proyecto > Tus apps (App Web)
 *    copia el objeto `firebaseConfig` que te muestra y pega aquí sus valores
 *    en FIREBASE_CONFIG (reemplazando los "TU_...").
 * 2. (Cloudinary ya configurado: cloud name + upload preset unsigned + folder.)
 * 3. No se necesita nada más: el sitio y el panel /admin detectan
 *    automáticamente que la configuración está completa y se activan.
 *
 * HOSTING: el sitio se publica con GitHub Pages, no con Firebase Hosting.
 * Firebase se usa solo como base de datos (Firestore) y autenticación (Auth).
 *
 * NOTA DE SEGURIDAD: el firebaseConfig de web (apiKey incluida) es público por
 * diseño, no es un secreto. El acceso real lo controlan las reglas de Firestore
 * (ver firestore.rules) + Firebase Auth. Por eso es seguro versionar este archivo.
 * ─────────────────────────────────────────────────────────────────────
 */

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAqMZ5JidfJ0nadZzqgZ80WZ31WN2ru1ak",
  authDomain: "wawanakan.firebaseapp.com",
  projectId: "wawanakan",
  storageBucket: "wawanakan.firebasestorage.app",
  messagingSenderId: "185859985715",
  appId: "1:185859985715:web:44c755d160150634222e46",
  measurementId: "G-4J2R1XY6C8"
};

export const CLOUDINARY = {
  cloudName: "dwb74j9jl",
  uploadPreset: "wawanakan_cms",
  folder: "wawanakan"
};

/** Devuelve true solo cuando las credenciales reales ya fueron colocadas. */
export function isFirebaseConfigured() {
  return Boolean(FIREBASE_CONFIG.apiKey) && !FIREBASE_CONFIG.apiKey.startsWith("TU_");
}

/** Devuelve true cuando Cloudinary está listo para subir imágenes. */
export function isCloudinaryConfigured() {
  return Boolean(CLOUDINARY.cloudName) && !CLOUDINARY.cloudName.startsWith("TU_");
}
