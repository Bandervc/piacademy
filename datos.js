/* ═══════════════════════════════════════════════════════════════
   ✏️  ESTE ES EL ÚNICO ARCHIVO QUE NECESITAS EDITAR

   Reglas para no romper nada:
   1. Cambia solo lo que está entre "comillas".
   2. No borres las comas del final de cada línea.
   3. Los números (precios) van SIN comillas.
   4. Después de guardar, actualiza la página en el navegador (F5).
   5. Si algo sale mal, verás un aviso rojo arriba explicándote qué revisar.
   ═══════════════════════════════════════════════════════════════ */

window.DATOS = {

  // ═══ 1. TU MARCA ═══
  marca: {
    nombre: "PiAcademy",
    lema: "Academia Virtual de Alto Rendimiento",
    descripcionPie: "Academia virtual de alto rendimiento especializada en la preparación exclusiva para postulantes a la Pontificia Universidad Católica del Perú (PUCP) y becarios Beca 18 (PRONABEC).",
    anioCopyright: "2026",
  },

  // ═══ 2. TU CONTACTO ═══
  // Cambia el número aquí y se actualiza en TODA la página automáticamente.
  contacto: {
    whatsapp: "51934894501",          // código de país + número, solo dígitos
    telefonoVisible: "+51 934 894 501",
    correo: "informe@piacademy.edu.pe",
  },

  // ═══ 3. MENSAJES DE WHATSAPP ═══
  // Es el texto que YA APARECE ESCRITO en el chat cuando alguien te escribe
  // desde cada botón. Así sabes de qué parte de la página viene la consulta.
  mensajes: {
    bannerSuperior: "Hola PiAcademy 👋 Vi el aviso de vacantes con descuento en su página. ¿Sigue vigente la promoción del Ciclo Integral?",
    heroConsulta: "Hola PiAcademy 👋 Estoy interesado(a) en el Ciclo Integral. ¿Me pueden enviar el prospecto y los horarios disponibles?",
    interesPUCP: "Hola PiAcademy 👋 Quiero postular a la PUCP. ¿Cómo es la preparación del Ciclo Integral y cuándo inicia el próximo grupo?",
    interesBeca18: "Hola PiAcademy 👋 Voy a rendir el Examen Nacional de Preselección de Beca 18. ¿Cómo me prepara el Ciclo Integral?",
    mediosDePago: "Hola PiAcademy 👋 ¿Qué medios de pago aceptan para el Ciclo Integral? (Yape, Plin o transferencia)",
    // {aciertos} y {total} se reemplazan solos con el puntaje del alumno.
    testCompletado: "Hola PiAcademy 👋 Acabo de hacer el test de nivel de su página y obtuve {aciertos} de {total}. ¿Me ayudan a saber qué debo reforzar?",
    botonFlotante: "Hola PiAcademy 👋 Tengo una consulta sobre el Ciclo Integral PUCP y Beca 18.",
    footer: "Hola PiAcademy 👋 Vengo desde su página web y quisiera más información.",
    // Mensaje del formulario. Lo que va entre llaves lo completa el alumno.
    // Si deja un campo vacío, esa línea desaparece del mensaje.
    inscripcion: "Hola PiAcademy 👋 Deseo inscribirme al *Ciclo Integral*.\n\n*Mis datos:*\n• Nombre: {nombre}\n• Teléfono: {telefono}\n• Me preparo para: {modalidad}\n• Turno que prefiero: {turno}\n\n(Vengo de: {origen})",
  },

  // ═══ 4. PROMOCIÓN Y CUENTA REGRESIVA ═══
  promocion: {
    mostrarContador: true,            // pon false para ocultar el contador
    // Fecha REAL en que vence el descuento. Formato: "AAAA-MM-DDTHH:MM"
    // Cuando llegue a cero, el contador desaparece solo.
    fechaLimite: "2026-09-15T23:59",
    textoContador: "El descuento especial vence en:",
    mensajeVencido: "¡La promoción cerró! Escríbenos por WhatsApp para consultar el próximo grupo.",
    avisoBanner: "Ciclo Integral PUCP & Beca 18 — Vacantes Limitadas.",
    enlaceBanner: "¡Reserva tu cupo con descuento aquí!",
  },

  // ═══ 5. PRECIO ═══ (números SIN comillas)
  precio: {
    normal: 380,
    promocional: 220,
    nota: "pago único",
  },

  // ═══ 6. TURNOS ═══
  horarios: [
    { nombre: "Turno Mañana", rango: "8:00 am - 1:00 pm" },
    { nombre: "Turno Tarde/Noche", rango: "4:00 pm - 8:30 pm" },
  ],

  // ═══ 7. A QUIÉN ESTÁ DIRIGIDO (las 2 tarjetas moradas) ═══
  // acento: color de la tarjeta ("morado" o "ambar")
  audiencia: [
    {
      etiqueta: "Modalidad 01",
      titulo: "Postulantes PUCP",
      icono: "fa-solid fa-university",
      acento: "morado",
      descripcion: "Dirigido a alumnos que buscan ingresar a la Pontificia Universidad Católica del Perú en sus diversas modalidades (Evaluación del Talento, ITS, POP, Bachillerato).",
      puntos: [
        "Dominio completo de <strong>Lectura Crítica</strong> y <strong>Redacción</strong> según las guías oficiales PUCP.",
        "Resolución rápida de <strong>Matemática PUCP</strong> (Álgebra, Geometría, Trigonometría, Aritmética).",
        "Simulacros ajustados a los tiempos y nivel de dificultad del Examen de Admisión.",
      ],
      textoBoton: "Ver Vacantes PUCP",
      mensaje: "interesPUCP",          // usa mensajes.interesPUCP
    },
    {
      etiqueta: "Modalidad 02",
      titulo: "Beca 18 (PRONABEC)",
      icono: "fa-solid fa-award",
      acento: "ambar",
      descripcion: "Diseñado para estudiantes de secundaria y egresados que rendirán el <strong>Examen Nacional de Preselección (ENP)</strong> para asegurar su vacante becada integral.",
      puntos: [
        "Estrategias de resolución veloz para <strong>Razonamiento Matemático</strong>.",
        "Comprensión lectora avanzada y <strong>Razonamiento Verbal</strong> directo.",
        "Estrategias de control de estrés y optimización de puntaje por pregunta.",
      ],
      textoBoton: "Ver Vacantes Beca 18",
      mensaje: "interesBeca18",
    },
  ],

  // ═══ 8. POR QUÉ ELEGIRTE (las 6 tarjetas blancas) ═══
  // Para agregar una más, copia un bloque { ... } completo y pégalo con su coma.
  beneficios: [
    { icono: "fa-solid fa-laptop-code", titulo: "Clases En Vivo en HD", texto: "Interactúa en tiempo real con docentes especialistas. Haz preguntas en vivo y resuelve ejercicios en directo con la pizarra digital HD." },
    { icono: "fa-solid fa-photo-film", titulo: "Grabaciones 24/7", texto: "¿No pudiste asistir a una sesión? Todas las clases quedan ordenadas en tu aula virtual para que las repases a tu propio ritmo cuantas veces quieras." },
    { icono: "fa-solid fa-chart-line", titulo: "Simulacros Evaluativos", texto: "Mide tu nivel semanalmente. Recibe estadísticas de rendimiento por materia para identificar y reforzar tus puntos débiles." },
    { icono: "fa-solid fa-file-pdf", titulo: "Material Didáctico Exclusivo", texto: "Descarga compendios teóricos, boletines de práctica guiada y claves resueltas paso a paso elaboradas por nuestro equipo pedagógico." },
    { icono: "fa-solid fa-comments", titulo: "Asesoría Permanente", texto: "Acceso a grupos de consultas académicas continuas. Ninguna duda queda sin resolver durante tu preparación." },
    { icono: "fa-solid fa-bullseye", titulo: "Plana Docente Selecta", texto: "Profesores con amplia trayectoria en la preparación de alumnos ingresantes a la PUCP y seleccionados de Beca 18." },
  ],

  // ═══ 9. CURSOS (las pestañas del temario) ═══
  cursos: [
    {
      clave: "rm",
      pestana: "Razonamiento Matemático",
      iconoPestana: "fa-solid fa-calculator",
      etiqueta: "Materia Clave",
      titulo: "Razonamiento Matemático",
      descripcion: "Desarrolla la rapidez de análisis lógico y resolución directa sin fórmulas extensas. Indispensable para los exámenes tipo admisión PUCP y evaluación Beca 18.",
      temas: [
        "Planteo de Ecuaciones y Fracciones",
        "Porcentajes, Razones y Proporciones",
        "Lógica Recreativa e Inferencial",
        "Sucesiones y Áreas Sombreadas",
      ],
      tituloNota: "Técnica PiAcademy:",
      nota: "Enseñamos el \"Método de Descarte Veloz\" y atajos algebraicos aprobados para responder cada pregunta de RM en menos de 90 segundos.",
      iconoDestacado: "fa-solid fa-lightbulb",
      destacado: "Incluye Banco de 500+ Preguntas Resueltas en Video.",
    },
    {
      clave: "lc",
      pestana: "Lectura Crítica (PUCP)",
      iconoPestana: "fa-solid fa-book-open",
      etiqueta: "Formato Exclusivo PUCP",
      titulo: "Lectura Crítica",
      descripcion: "Domina el formato más exigente del examen PUCP: análisis de argumentos, debilidades, reforzamientos, intenciones del autor y diálogos contrapuestos.",
      temas: [
        "Estructura del Argumento (Tesis y Premisas)",
        "Debilitamiento y Reforzamiento",
        "Puntos de Acuerdo y Discrepancia",
        "Falacias Argumentativas Comunes",
      ],
      tituloNota: "Diferencial PiAcademy:",
      nota: "Descomponemos los textos largos en diagramas lógicos simples para que evites caer en las distractoras clásicas del examen PUCP.",
      iconoDestacado: "fa-solid fa-book-reader",
      destacado: "Guías teóricas actualizadas según el último prospecto.",
    },
    {
      clave: "red",
      pestana: "Redacción y Ortografía",
      iconoPestana: "fa-solid fa-pen-nib",
      etiqueta: "Dominio del Lenguaje",
      titulo: "Redacción y Normativa",
      descripcion: "Aprende las reglas de acentuación, puntuación, conectores lógicos y concordancia exigidas en la prueba de Redacción de la PUCP y Beca 18.",
      temas: [
        "Ortografía y Acentuación Diacrítica/Especial",
        "Uso Correcto de la Coma, Punto y Coma y Dos Puntos",
        "Cohesión y Conectores Textuales",
        "Corrección Idiomática y Queísmo/Dequeísmo",
      ],
      tituloNota: "Práctica Orientada:",
      nota: "Evaluaciones semanales de corrección de textos para automatizar las reglas clave sin aburrirte con teoría memorística.",
      iconoDestacado: "fa-solid fa-pen-fancy",
      destacado: "Talleres de aplicación directa con corrección personalizada.",
    },
    {
      clave: "mat",
      pestana: "Matemática Académica",
      iconoPestana: "fa-solid fa-chart-pie",
      etiqueta: "Fundamentos Matemáticos",
      titulo: "Matemática Académica (Álgebra / Aritmética)",
      descripcion: "Consolida la base sólida en temas algebraicos, geométricos y numéricos para responder con exactitud sin titubear.",
      temas: [
        "Productos Notables y Factorización",
        "Funciones, Inecuaciones y Logaritmos",
        "Geometría Plana y Geometría del Espacio",
        "Trigonometría Fundamental",
      ],
      tituloNota: "Acompañamiento Gradual:",
      nota: "Desde el nivel básico inicial hasta el nivel avanzado exigido en el examen de admisión, garantizando que nadie se quede atrás.",
      iconoDestacado: "fa-solid fa-square-root-variable",
      destacado: "Formularios en PDF y trucos algebraicos interactivos.",
    },
  ],

  // ═══ 10. TEST DE NIVEL ═══
  // "correcta" es la POSICIÓN de la respuesta correcta empezando en 0.
  // (0 = primera alternativa, 1 = segunda, 2 = tercera, 3 = cuarta)
  // Puedes agregar más preguntas copiando un bloque { ... } completo.
  test: {
    mostrar: true,
    preguntas: [
      {
        enunciado: "En un examen de preselección, si el 20% del 30% de un número N es igual a 18, ¿cuál es el valor del 50% de N?",
        alternativas: ["120", "150", "180", "200"],
        correcta: 1,
      },
      {
        enunciado: "Indique cuál es la opción que presenta adecuada puntuación para la Redacción PUCP:",
        alternativas: [
          "Aunque estudió mucho sin embargo, no obtuvo el resultado esperado.",
          "Aunque estudió mucho, no obtuvo el resultado esperado.",
          "Aunque, estudió mucho no obtuvo, el resultado esperado.",
          "Aunque estudió mucho; no obtuvo el resultado esperado.",
        ],
        correcta: 1,
      },
      {
        enunciado: "En un texto de Lectura Crítica, la \"tesis principal\" se define mejor como:",
        alternativas: [
          "Un ejemplo específico presentado al inicio del texto.",
          "La postura o posición central que defiende el autor sustentada en argumentos.",
          "Una cita textual tomada de un autor famoso.",
          "La conclusión que refuta la idea del autor.",
        ],
        correcta: 1,
      },
    ],
  },

  // ═══ 11. TESTIMONIOS ═══
  // ⚠️ Los de abajo son EJEMPLOS INVENTADOS y por eso están ocultos.
  // Reemplázalos por alumnos reales (con su permiso) y cambia mostrar a true.
  testimonios: {
    mostrar: false,
    items: [
      { nombre: "Andrea Ramírez", detalle: "Ingresante PUCP - Ingeniería", iniciales: "AR", texto: "EJEMPLO – REEMPLAZAR: Gracias a los trucos en Razonamiento Matemático y a las guías de Lectura Crítica logré mi ingreso a la PUCP a la primera." },
      { nombre: "Mateo Castillo", detalle: "Ganador Beca 18 PRONABEC", iniciales: "MC", texto: "EJEMPLO – REEMPLAZAR: Postulé al Examen Nacional de Preselección con mucho miedo, pero aquí me dieron la seguridad para resolver cada pregunta." },
      { nombre: "Sofía Vargas", detalle: "Ingresante PUCP - Gestión", iniciales: "SV", texto: "EJEMPLO – REEMPLAZAR: Los simulacros semanales son idénticos al examen real y la atención por WhatsApp siempre fue rápida." },
    ],
  },

  // ═══ 12. PREGUNTAS FRECUENTES ═══
  // Para agregar una, copia un bloque { pregunta: "...", respuesta: "..." },
  faq: [
    {
      pregunta: "¿Cómo es la modalidad de clases en el Ciclo Integral?",
      respuesta: "Las clases son 100% en vivo a través de Zoom HD. Interactúas con los profesores en tiempo real. Además, todas las sesiones quedan grabadas y subidas a la plataforma virtual 24/7 para repasar cuando desees.",
    },
    {
      pregunta: "¿El ciclo sirve tanto para PUCP como para Beca 18 al mismo tiempo?",
      respuesta: "¡Sí! El temario del Ciclo Integral abarca la intersección perfecta entre las preguntas del examen PUCP (Lectura Crítica, Redacción, Matemática) y la prueba ENP de Beca 18 (Razonamiento Lógico-Matemático y Verbal).",
    },
    {
      pregunta: "¿Cuáles son los medios de pago disponibles?",
      respuesta: "Aceptamos transferencias bancarias (BCP, Interbank, BBVA), Yape, Plin y tarjetas de débito/crédito. Escríbenos por WhatsApp y te facilitamos las cuentas.",
    },
    {
      pregunta: "¿Incluye materiales y simulacros?",
      respuesta: "Sí, incluye todos los PDF digitales de teoría, listas de ejercicios, simulacros semanales calificados y sus respectivos solucionarios explicados.",
    },
  ],

  // ═══ 13. REDES SOCIALES ═══
  // Pega la dirección completa de cada red. Si dejas "" esa red NO se muestra.
  redes: {
    facebook: "",
    youtube: "",
    tiktok: "",
    instagram: "",
  },
};
