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
      "avisoBanner": "Ciclo Integral PUCP & Beca 18 — Vacantes Limitadas.",
      "enlaceBanner": "¡Reserva tu cupo con descuento aquí!"
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
      "mostrar": false,
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
      ],
      "preguntas": [
          {
              "enunciado": "Un camión transporta 50 cajas que contienen\nbotellas llenas de agua. Cada caja contiene\n20 botellas de 1,5 litros cada una. Si cada caja\nvacía pesa 0,04 kg, cada botella vacía pesa\n0,05 kg y 1 litro de agua pesa 1 kg, ¿cuánto\npesa, en total, la carga que transporta el\ncamión?",
              "alternativas": [
                  "1552 kg",
                  "1570 kg",
                  "1582 kg",
                  "1590 kg"
              ],
              "correcta": 0
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
