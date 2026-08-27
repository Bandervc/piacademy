/* ═══════════════════════════════════════════════════════════════
   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
   ═══════════════════════════════════════════════════════════════ */

window.DATOS = {

  // ═══ 1. TU MARCA ═══
  marca: {},

  // ═══ 2. TU CONTACTO ═══
  contacto: {
      "whatsapp": "934894501",
      "telefonoVisible": "",
      "correo": ""
  },

  // ═══ 3. MENSAJES DE WHATSAPP ═══
  mensajes: {},

  // ═══ 4. PROMOCIÓN Y CUENTA REGRESIVA ═══
  promocion: {
      "fechaLimite": "2026-09-15T23:59",
      "textoContador": "!No dejes pasar esta oportunidad!",
      "mostrarContador": true,
      "avisoBanner": "TEXTO DEL BANNER",
      "enlaceBanner": "TEXTO DEL ENLACE"
  },

  // ═══ 5. PRECIO ═══
  precio: {
      "normal": 300,
      "promocional": 150,
      "nota": "pago único"
  },

  // ═══ 6. TURNOS Y HORARIOS ═══
  horarios: [
      {
          "nombre": "Turno Noche",
          "rango": "7:00 pm - 8:30 pm",
          "disponible": true
      },
      {
          "nombre": "Turno Tarde",
          "rango": "5:00 pm - 6:30 pm",
          "disponible": true
      }
  ],

  // ═══ 6.1 ENCABEZADOS Y TÍTULOS EDITABLES ═══
  textos: {
      "heroPildora": "PILDORA SUPERIOR DEL HERO",
      "heroTitulo": "TEXTO PRINCIPAL",
      "heroSubtitulo": "SUBTITULO",
      "beneficiosTitulo": "TITULO BENEF",
      "audienciaTitulo": "AUDIENCIA",
      "cursosTitulo": "CURSOS",
      "inversionTitulo": "INVERSION"
  },

  // ═══ 7. A QUIÉN ESTÁ DIRIGIDO ═══
  audiencia: [],

  // ═══ 8. POR QUÉ ELEGIRTE ═══
  beneficios: [],

  // ═══ 9. CURSOS ═══
  cursos: [],

  // ═══ 10. TEST DE NIVEL Y PREMIOS GAMIFICADOS ═══
  test: {
      "mostrar": true,
      "tiempoSegundos": 1200,
      "premios": [
          {
              "minAciertos": 1,
              "maxAciertos": 5,
              "codigo": "LIVE20",
              "mensaje": "¡Excelente! Ganaste el descuento especial LIVE20"
          },
          {
              "minAciertos": 6,
              "maxAciertos": 10,
              "codigo": "LIVE20",
              "mensaje": "¡Excelente! Ganaste el descuento especial LIVE20"
          }
      ]
  },

  // ═══ 11. TESTIMONIOS ═══
  testimonios: {},

  // ═══ 12. PREGUNTAS FRECUENTES ═══
  faq: [],

  // ═══ 13. REDES SOCIALES ═══
  redes: {
      "tiktok": "https://www.tiktok.com/@elprofemanu30",
      "facebook": "https://www.facebook.com/profile.php?id=61575697357110",
      "instagram": "https://www.instagram.com/piacademy314",
      "youtube": "https://www.youtube.com/@ElProfeManu30/videos"
  },

  // ═══ 14. CÓDIGOS DE DESCUENTO ═══
  codigos: [
      {
          "codigo": "LIVE20",
          "descuento": 20,
          "vence": "2026-09-11",
          "descripcion": "CÓDIGO PARA LIVE DE TIKTOK"
      }
  ],

  // ═══ 15. PAGO CON YAPE / PLIN ═══
  pago: {
      "yape": {
          "titular": "Bander Var*",
          "numero": "934894501",
          "numeroVisible": "934894501",
          "qrImagen": "qr-yape.png"
      },
      "plin": {
          "titular": "Bander Vargas",
          "numero": "934894501",
          "numeroVisible": "934894501",
          "qrImagen": "qr-plin.png"
      }
  },
};
