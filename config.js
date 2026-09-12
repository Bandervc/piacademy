/* ═══════════════════════════════════════════════════════════════
   config.js — Ajustes técnicos que el Panel de Administrador NO toca.

   El panel reescribe datos.js entero desde una plantilla fija con las
   secciones que él conoce (marca, contacto, precios, cursos…). Todo lo
   que se guarde ahí y no esté en esa plantilla desaparece al pulsar
   "Guardar". Por eso los identificadores de analítica viven en este
   archivo aparte: aquí nada los borra.

   Este archivo casi nunca cambia. Si algún día cambias de píxel, pega
   el nuevo número abajo y listo.
   ═══════════════════════════════════════════════════════════════ */

window.PI_CONFIG = {

  // Píxel de Meta (Facebook / Instagram).
  // Meta Business Suite → Administrador de eventos → Conjuntos de datos.
  // Déjalo vacío ("") para desactivar el seguimiento por completo.
  metaPixelId: "2268623923895732"

};
