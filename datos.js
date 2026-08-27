/* ═══════════════════════════════════════════════════════════════
   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR
   ═══════════════════════════════════════════════════════════════ */

window.DATOS = {

  // ═══ 1. TU MARCA ═══
  marca: {
      "anioCopyright": "2026",
      "descripcionPie": "Todos los derechos reservados",
      "nombre": "PiAcademy",
      "nav1": "Metodología PiAcademy",
      "nav2": "Enfoque PUCP & Beca 18",
      "nav3": "Plan de Cursos",
      "nav4": "Ciclo Integral & Inversión",
      "nav5": "Test de Nivel Gratuito"
  },

  // ═══ 2. TU CONTACTO ═══
  contacto: {
      "whatsapp": "934894501",
      "telefonoVisible": "+51934894501",
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
          "disponible": false
      }
  ],

  // ═══ 6.1 ENCABEZADOS Y TÍTULOS EDITABLES ═══
  textos: {
      "heroPildora": "Aprende con especialistas en ingreso directo",
      "heroTitulo": "Asegura tu Ingreso a la PUCP y tu Beca en Beca 18",
      "heroSubtitulo": "Prepara tu camino al éxito con nuestro exclusivo Ciclo Integral. La metodología virtual más sólida de Perú con clases en vivo, simulacros tipo examen real y acompañamiento personalizado continuo.",
      "beneficiosTitulo": "¿Por qué PiAcademy es tu mejor alternativa virtual?",
      "audienciaTitulo": "¿A quién está dirigido el Ciclo Integral de PiAcademy?",
      "cursosTitulo": "Estructura de Cursos del Ciclo Integral",
      "inversionTitulo": "Invierte en tu Futuro Universitario"
  },

  // ═══ 7. A QUIÉN ESTÁ DIRIGIDO ═══
  audiencia: [
      {
          "etiqueta": "Modalidad 01",
          "titulo": "Postulantes PUCP",
          "icono": "fa-solid fa-university",
          "descripcion": "Dirigido a alumnos que buscan ingresar a la Pontificia Universidad Católica del Perú en sus diversas modalidades (Evaluación del Talento, ITS, POP, Bachillerato).",
          "puntos": [
              "Dominio completo de <strong>Lectura Crítica</strong> y <strong>Redacción</strong> según las guías oficiales PUCP.",
              "Resolución rápida de <strong>Matemática PUCP</strong> (Álgebra, Geometría, Trigonometría, Aritmética).",
              "Simulacros ajustados a los tiempos y nivel de dificultad del Examen de Admisión."
          ],
          "textoBoton": "Ver Vacantes PUCP",
          "mensaje": "interesPUCP"
      },
      {
          "etiqueta": "Modalidad 02",
          "titulo": "Beca 18 (PRONABEC)",
          "icono": "fa-solid fa-award",
          "descripcion": "Diseñado para estudiantes de secundaria y egresados que rendirán el <strong>Examen Nacional de Preselección (ENP)</strong> para asegurar su vacante becada integral.",
          "puntos": [
              "Estrategias de resolución veloz para <strong>Razonamiento Matemático</strong>.",
              "Comprensión lectora avanzada y <strong>Razonamiento Verbal</strong> directo.",
              "Estrategias de control de estrés y optimización de puntaje por pregunta."
          ],
          "textoBoton": "Ver Vacantes Beca 18",
          "mensaje": "interesBeca18"
      }
  ],

  // ═══ 8. POR QUÉ ELEGIRTE ═══
  beneficios: [
      {
          "icono": "fa-solid fa-laptop-code",
          "titulo": "Clases En Vivo en HD",
          "texto": "Interactúa en tiempo real con docentes especialistas. Haz preguntas en vivo y resuelve ejercicios en directo con la pizarra digital HD."
      },
      {
          "icono": "fa-solid fa-photo-film",
          "titulo": "Grabaciones 24/7",
          "texto": "¿No pudiste asistir a una sesión? Todas las clases quedan ordenadas en tu aula virtual para que las repases a tu propio ritmo cuantas veces quieras."
      },
      {
          "icono": "fa-solid fa-chart-line",
          "titulo": "Simulacros Evaluativos",
          "texto": "Mide tu nivel semanalmente. Recibe estadísticas de rendimiento por materia para identificar y reforzar tus puntos débiles."
      },
      {
          "icono": "fa-solid fa-file-pdf",
          "titulo": "Material Didáctico Exclusivo",
          "texto": "Descarga compendios teóricos, boletines de práctica guiada y claves resueltas paso a paso elaboradas por nuestro equipo pedagógico."
      },
      {
          "icono": "fa-solid fa-comments",
          "titulo": "Asesoría Permanente",
          "texto": "Acceso a grupos de consultas académicas continuas. Ninguna duda queda sin resolver durante tu preparación."
      },
      {
          "icono": "fa-solid fa-bullseye",
          "titulo": "Plana Docente Selecta",
          "texto": "Profesores con amplia trayectoria en la preparación de alumnos ingresantes a la PUCP y seleccionados de Beca 18."
      }
  ],

  // ═══ 9. CURSOS ═══
  cursos: [
      {
          "clave": "rm",
          "pestana": "Razonamiento Matemático",
          "iconoPestana": "fa-solid fa-calculator",
          "etiqueta": "Materia Clave",
          "titulo": "Razonamiento Matemático",
          "descripcion": "Desarrolla la rapidez de análisis lógico y resolución directa sin fórmulas extensas. Indispensable para los exámenes tipo admisión PUCP y evaluación Beca 18.",
          "temas": [
              "Planteo de Ecuaciones y Fracciones",
              "Porcentajes, Razones y Proporciones",
              "Lógica Recreativa e Inferencial",
              "Sucesiones y Áreas Sombreadas"
          ],
          "tituloNota": "Técnica PiAcademy:",
          "nota": "Enseñamos el \"Método de Descarte Veloz\" y atajos algebraicos aprobados para responder cada pregunta de RM en menos de 90 segundos.",
          "iconoDestacado": "fa-solid fa-lightbulb",
          "destacado": "Incluye Banco de 500+ Preguntas Resueltas en Video."
      },
      {
          "clave": "lc",
          "pestana": "Lectura Crítica (PUCP)",
          "iconoPestana": "fa-solid fa-book-open",
          "etiqueta": "Formato Exclusivo PUCP",
          "titulo": "Lectura Crítica",
          "descripcion": "Domina el formato más exigente del examen PUCP: análisis de argumentos, debilidades, reforzamientos, intenciones del autor y diálogos contrapuestos.",
          "temas": [
              "Estructura del Argumento (Tesis y Premisas)",
              "Debilitamiento y Reforzamiento",
              "Puntos de Acuerdo y Discrepancia",
              "Falacias Argumentativas Comunes"
          ],
          "tituloNota": "Diferencial PiAcademy:",
          "nota": "Descomponemos los textos largos en diagramas lógicos simples para que evites caer en las distractoras clásicas del examen PUCP.",
          "iconoDestacado": "fa-solid fa-book-reader",
          "destacado": "Guías teóricas actualizadas según el último prospecto."
      },
      {
          "clave": "red",
          "pestana": "Redacción y Ortografía",
          "iconoPestana": "fa-solid fa-pen-nib",
          "etiqueta": "Dominio del Lenguaje",
          "titulo": "Redacción y Normativa",
          "descripcion": "Aprende las reglas de acentuación, puntuación, conectores lógicos y concordancia exigidas en la prueba de Redacción de la PUCP y Beca 18.",
          "temas": [
              "Ortografía y Acentuación Diacrítica/Especial",
              "Uso Correcto de la Coma, Punto y Coma y Dos Puntos",
              "Cohesión y Conectores Textuales",
              "Corrección Idiomática y Queísmo/Dequeísmo"
          ],
          "tituloNota": "Práctica Orientada:",
          "nota": "Evaluaciones semanales de corrección de textos para automatizar las reglas clave sin aburrirte con teoría memorística.",
          "iconoDestacado": "fa-solid fa-pen-fancy",
          "destacado": "Talleres de aplicación directa con corrección personalizada."
      },
      {
          "clave": "mat",
          "pestana": "Matemática Académica",
          "iconoPestana": "fa-solid fa-chart-pie",
          "etiqueta": "Fundamentos Matemáticos",
          "titulo": "Matemática Académica (Álgebra / Aritmética)",
          "descripcion": "Consolida la base sólida en temas algebraicos, geométricos y numéricos para responder con exactitud sin titubear.",
          "temas": [
              "Productos Notables y Factorización",
              "Funciones, Inecuaciones y Logaritmos",
              "Geometría Plana y Geometría del Espacio",
              "Trigonometría Fundamental"
          ],
          "tituloNota": "Acompañamiento Gradual:",
          "nota": "Desde el nivel básico inicial hasta el nivel avanzado exigido en el examen de admisión, garantizando que nadie se quede atrás.",
          "iconoDestacado": "fa-solid fa-square-root-variable",
          "destacado": "Formularios en PDF y trucos algebraicos interactivos."
      }
  ],

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
              "enunciado": "Un camión transporta 50 cajas que contienen botellas llenas de agua. Cada caja contiene 20 botellas de 1,5 litros cada una. Si cada caja vacía pesa 0,04 kg, cada botella vacía pesa 0,05 kg y 1 litro de agua pesa 1 kg, ¿cuánto pesa, en total, la carga que transporta el camión?",
              "alternativas": [
                  "1552 kg",
                  "1570 kg",
                  "1582 kg",
                  "1590 kg"
              ],
              "correcta": 0
          },
          {
              "enunciado": "Resuelve el siguiente sistema: \\[ \\begin{cases} 2(x-1)-5(1-y)=-1 \\\\ 2(2x-1)-3(4-y)=12 \\end{cases} \\]",
              "alternativas": [
                  "x = 3, y = 2",
                  "x = 1, y = 2",
                  "x = 2, y = 3",
                  "x = 4, y = 1"
              ],
              "correcta": 0
          },
          {
              "enunciado": "Halle el intervalo de todos los valores que puede tomar x si se cumple lo siguiente: \n\\[\n\\frac{3}{2}\\leq\\frac{2}{3x+1}+1<\\frac{5}{2}\n\\]",
              "alternativas": [
                  "\\left[ \\frac{1}{3}; \\frac{2}{3} \\right[",
                  "\\left] \\frac{1}{3}; \\frac{2}{3} \\right]",
                  "\\left[ \\frac{1}{9}; 1 \\right[",
                  "\\left] \\frac{1}{9}; 1 \\right]"
              ],
              "correcta": 3
          }
      ]
  },

  // ═══ 11. TESTIMONIOS ═══
  testimonios: {},

  // ═══ 12. PREGUNTAS FRECUENTES ═══
  faq: [
      {
          "pregunta": "¿Cómo es la Modalidad de Clases?",
          "respuesta": "Las clases son 100% en vivo a través de Zoom HD. Interactúas con los profesores en tiempo real. Además, todas las sesiones quedan grabadas y subidas a la plataforma virtual 24/7 para repasar cuando desees."
      },
      {
          "pregunta": "¿El ciclo sirve tanto PUCP como para BECA 18?",
          "respuesta": "¡Sí! El temario del Ciclo Integral abarca la intersección perfecta entre las preguntas del examen PUCP (Lectura Crítica, Redacción, Matemática) y la prueba ENP de Beca 18 (Razonamiento Lógico-Matemático y Verbal). Además que las preguntas del ENP tienen base de temarios de la PUCP."
      },
      {
          "pregunta": "¿Cuáles son los medios de pago disponible?",
          "respuesta": "Aceptamos transferencias bancarias (BCP, Interbank, BBVA), Yape, Plin y tarjetas de débito/crédito. Escríbenos a nuestro WhatsApp +51 93489450 para facilitarte las cuentas."
      },
      {
          "pregunta": "¿Incluye materiales y simulacros?",
          "respuesta": "Sí, incluye todos los PDF digitales de teoría, listas de ejercicios, simulacros semanales calificados y sus respectivos solucionarios explicados."
      }
  ],

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
      },
      {
          "codigo": "POLLITO",
          "descuento": 20,
          "vence": "2026-11-14",
          "descripcion": "PARA LOS QUE RESUELVES MAX 5 BUENAS"
      },
      {
          "codigo": "GALACTICO",
          "descuento": 50,
          "vence": "",
          "descripcion": "PARA LOS QUE RESUELVAN 5 A MÁS PREGUNTAS"
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
