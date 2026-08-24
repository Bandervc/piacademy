# Landing PiAcademy editable — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Separar todo el contenido de la landing en un único archivo `datos.js` editable por un profesor sin conocimientos de programación, centralizar el número de WhatsApp y dar a cada botón su mensaje previo.

**Architecture:** Cuatro scripts planos cargados con `<script src>` (sin módulos ES, que el protocolo `file://` bloquea): `datos.js` define `window.DATOS`; `nucleo.js` expone funciones puras en `globalThis.PiNucleo` — se carga tanto en el navegador como con `require()` en Node, lo que permite probarlas de verdad; `app.js` lee `DATOS` y rellena el DOM a través de atributos `data-*` declarados en `index.html`.

**Tech Stack:** HTML + Tailwind CSS por CDN + JavaScript sin dependencias. Pruebas con `node --test` (integrado en Node 24, no instala nada).

## Global Constraints

- **Debe funcionar abriendo `index.html` con doble clic** (`file://`). Prohibido: `type="module"`, `import`/`export`, `fetch()` de archivos locales.
- **Cero dependencias nuevas.** No crear `package.json` con dependencias; `node --test` es parte de Node.
- **Tailwind sigue por CDN.** No introducir build step.
- **El diseño visual no cambia:** mismos colores (`brand.purple #5B21B6`, `brand.amber #F59E0B`), misma tipografía Poppins, mismas secciones en el mismo orden.
- **Todo lo que el profesor lee está en español**: nombres de claves en `datos.js`, comentarios y mensajes de error.
- **Marca:** siempre `PiAcademy` (nunca "PI ACADEMY", nunca "Pi Academy").
- **Número de WhatsApp correcto:** `51934894501`. Aparece **solo** en `datos.js`.
- **`nucleo.js` no toca el DOM.** Si una función usa `document` o `window`, va en `app.js`.
- Un commit por tarea, en español, sin `Co-Authored-By` salvo indicación contraria.

## Estructura de archivos

| Archivo | Responsabilidad | Creado en |
|---|---|---|
| `nucleo.js` | Funciones puras: rutas, plantillas, URL de WhatsApp, cuenta regresiva, validación | Tarea 1 |
| `pruebas/nucleo.test.js` | Pruebas de `nucleo.js` con `node --test` | Tarea 1 |
| `datos.js` | Todo el contenido editable (`window.DATOS`) | Tarea 2 |
| `pruebas/datos.test.js` | Verifica que `datos.js` es válido y completo | Tarea 2 |
| `app.js` | Motor de render + comportamientos (DOM) | Tarea 3 |
| `index.html` | Estructura y diseño, con atributos `data-*` | Tareas 3–9 |
| `LEEME.md` | Guía de edición para el profesor | Tarea 10 |

---

### Task 1: Núcleo de funciones puras

**Files:**
- Create: `nucleo.js`
- Test: `pruebas/nucleo.test.js`

**Interfaces:**
- Consumes: nada.
- Produces: `globalThis.PiNucleo` con exactamente estas funciones:
  - `leerRuta(objeto, ruta)` → valor en `ruta` (ej. `"contacto.whatsapp"`), o `undefined` si algún tramo falta.
  - `normalizarNumero(numero)` → string solo con dígitos (`"+51 934 894 501"` → `"51934894501"`).
  - `aplicarPlantilla(texto, valores)` → string con `{clave}` reemplazado; las **líneas** que conserven un marcador sin valor se eliminan enteras.
  - `urlWhatsApp(numero, mensaje)` → `"https://wa.me/<digitos>?text=<mensaje codificado>"`. Si `mensaje` es vacío o `undefined`, devuelve la URL sin `?text=`.
  - `enlaceTelefono(numero)` → `"tel:+<digitos>"`.
  - `tiempoRestante(fechaLimite, ahora)` → `{ vencido, dias, horas, minutos, segundos }` con números enteros.
  - `dosDigitos(n)` → string de al menos 2 caracteres (`3` → `"03"`).
  - `validarDatos(datos)` → array de strings con los problemas encontrados; array vacío si todo está bien.

- [ ] **Step 1: Escribir las pruebas que fallan**

Crear `pruebas/nucleo.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
require('../nucleo.js');
const N = globalThis.PiNucleo;

test('leerRuta devuelve valores anidados', () => {
  const datos = { contacto: { whatsapp: '51934894501' } };
  assert.strictEqual(N.leerRuta(datos, 'contacto.whatsapp'), '51934894501');
});

test('leerRuta devuelve undefined si falta un tramo', () => {
  assert.strictEqual(N.leerRuta({ a: 1 }, 'a.b.c'), undefined);
  assert.strictEqual(N.leerRuta({}, 'contacto.whatsapp'), undefined);
});

test('leerRuta acepta indices de array', () => {
  const datos = { faq: [{ pregunta: '¿Cuánto cuesta?' }] };
  assert.strictEqual(N.leerRuta(datos, 'faq.0.pregunta'), '¿Cuánto cuesta?');
});

test('normalizarNumero deja solo digitos', () => {
  assert.strictEqual(N.normalizarNumero('+51 934 894 501'), '51934894501');
  assert.strictEqual(N.normalizarNumero('51-934-894-501'), '51934894501');
});

test('aplicarPlantilla reemplaza marcadores', () => {
  assert.strictEqual(N.aplicarPlantilla('Hola {nombre}', { nombre: 'Ana' }), 'Hola Ana');
});

test('aplicarPlantilla acepta numeros', () => {
  assert.strictEqual(N.aplicarPlantilla('Obtuve {a} de {b}', { a: 2, b: 3 }), 'Obtuve 2 de 3');
});

test('aplicarPlantilla elimina la linea completa de un marcador sin valor', () => {
  const texto = 'Mis datos:\n- Nombre: {nombre}\n- Telefono: {telefono}';
  assert.strictEqual(N.aplicarPlantilla(texto, { nombre: 'Ana' }), 'Mis datos:\n- Nombre: Ana');
});

test('aplicarPlantilla trata el string vacio como sin valor', () => {
  assert.strictEqual(N.aplicarPlantilla('Turno: {turno}', { turno: '' }), '');
});

test('urlWhatsApp arma la URL con el mensaje codificado', () => {
  const url = N.urlWhatsApp('+51 934 894 501', 'Hola ¿sí?');
  assert.ok(url.startsWith('https://wa.me/51934894501?text='));
  assert.strictEqual(decodeURIComponent(url.split('?text=')[1]), 'Hola ¿sí?');
});

test('urlWhatsApp omite text cuando no hay mensaje', () => {
  assert.strictEqual(N.urlWhatsApp('51934894501', ''), 'https://wa.me/51934894501');
  assert.strictEqual(N.urlWhatsApp('51934894501'), 'https://wa.me/51934894501');
});

test('enlaceTelefono arma el enlace tel:', () => {
  assert.strictEqual(N.enlaceTelefono('+51 934 894 501'), 'tel:+51934894501');
});

test('dosDigitos rellena con cero', () => {
  assert.strictEqual(N.dosDigitos(3), '03');
  assert.strictEqual(N.dosDigitos(45), '45');
  assert.strictEqual(N.dosDigitos(120), '120');
});

test('tiempoRestante calcula la diferencia', () => {
  const r = N.tiempoRestante('2026-09-15T23:59:00', new Date('2026-09-14T21:59:00'));
  assert.strictEqual(r.vencido, false);
  assert.strictEqual(r.dias, 1);
  assert.strictEqual(r.horas, 2);
  assert.strictEqual(r.minutos, 0);
  assert.strictEqual(r.segundos, 0);
});

test('tiempoRestante marca vencido cuando la fecha ya paso', () => {
  const r = N.tiempoRestante('2026-01-01T00:00:00', new Date('2026-06-01T00:00:00'));
  assert.strictEqual(r.vencido, true);
  assert.strictEqual(r.dias, 0);
  assert.strictEqual(r.segundos, 0);
});

test('tiempoRestante marca vencido si la fecha es invalida', () => {
  assert.strictEqual(N.tiempoRestante('quince de setiembre', new Date()).vencido, true);
});

test('validarDatos no reporta nada cuando los datos estan completos', () => {
  const datos = {
    contacto: { whatsapp: '51934894501' },
    precio: { normal: 380, promocional: 220 },
  };
  assert.deepStrictEqual(N.validarDatos(datos), []);
});

test('validarDatos reporta el whatsapp faltante', () => {
  const problemas = N.validarDatos({ precio: { normal: 380, promocional: 220 } });
  assert.strictEqual(problemas.length, 1);
  assert.match(problemas[0], /whatsapp/i);
});

test('validarDatos reporta un whatsapp demasiado corto', () => {
  const datos = { contacto: { whatsapp: '9348945' }, precio: { normal: 380, promocional: 220 } };
  assert.match(N.validarDatos(datos)[0], /whatsapp/i);
});

test('validarDatos reporta el precio faltante', () => {
  const problemas = N.validarDatos({ contacto: { whatsapp: '51934894501' } });
  assert.strictEqual(problemas.length, 1);
  assert.match(problemas[0], /precio/i);
});
```

- [ ] **Step 2: Ejecutar las pruebas y confirmar que fallan**

```bash
node --test pruebas/
```

Esperado: FAIL — `Cannot find module '../nucleo.js'`.

- [ ] **Step 3: Escribir `nucleo.js`**

```js
/* ============================================================
   nucleo.js — Funciones internas de PiAcademy.
   NO EDITES ESTE ARCHIVO. Todo lo que quieras cambiar está en datos.js
   ============================================================ */
(function (global) {
  'use strict';

  function leerRuta(objeto, ruta) {
    if (!objeto || typeof ruta !== 'string') return undefined;
    return ruta.split('.').reduce(function (actual, tramo) {
      return actual === null || actual === undefined ? undefined : actual[tramo];
    }, objeto);
  }

  function normalizarNumero(numero) {
    return String(numero || '').replace(/\D/g, '');
  }

  function aplicarPlantilla(texto, valores) {
    var datos = valores || {};
    var lineas = String(texto || '').split('\n');

    var procesadas = lineas.map(function (linea) {
      var resultado = linea.replace(/\{(\w+)\}/g, function (marcador, clave) {
        var valor = datos[clave];
        if (valor === undefined || valor === null || valor === '') return marcador;
        return String(valor);
      });
      // Si quedó algún marcador sin valor, la línea entera se descarta.
      return /\{\w+\}/.test(resultado) ? null : resultado;
    });

    return procesadas.filter(function (linea) { return linea !== null; }).join('\n').trim();
  }

  function urlWhatsApp(numero, mensaje) {
    var base = 'https://wa.me/' + normalizarNumero(numero);
    if (!mensaje) return base;
    return base + '?text=' + encodeURIComponent(mensaje);
  }

  function enlaceTelefono(numero) {
    return 'tel:+' + normalizarNumero(numero);
  }

  function dosDigitos(n) {
    return String(n).padStart(2, '0');
  }

  function tiempoRestante(fechaLimite, ahora) {
    var vacio = { vencido: true, dias: 0, horas: 0, minutos: 0, segundos: 0 };
    var limite = new Date(fechaLimite);
    if (isNaN(limite.getTime())) return vacio;

    var referencia = ahora instanceof Date ? ahora : new Date();
    var restante = Math.floor((limite.getTime() - referencia.getTime()) / 1000);
    if (restante <= 0) return vacio;

    return {
      vencido: false,
      dias: Math.floor(restante / 86400),
      horas: Math.floor((restante % 86400) / 3600),
      minutos: Math.floor((restante % 3600) / 60),
      segundos: restante % 60,
    };
  }

  function validarDatos(datos) {
    var problemas = [];
    var whatsapp = normalizarNumero(leerRuta(datos, 'contacto.whatsapp'));

    if (whatsapp.length < 9) {
      problemas.push('Falta el número de WhatsApp o está incompleto. Revisa "contacto.whatsapp" en datos.js: debe llevar código de país y solo dígitos, por ejemplo "51934894501".');
    }
    if (typeof leerRuta(datos, 'precio.promocional') !== 'number') {
      problemas.push('Falta el precio. Revisa "precio.promocional" en datos.js: debe ser un número sin comillas, por ejemplo 220.');
    }
    return problemas;
  }

  global.PiNucleo = {
    leerRuta: leerRuta,
    normalizarNumero: normalizarNumero,
    aplicarPlantilla: aplicarPlantilla,
    urlWhatsApp: urlWhatsApp,
    enlaceTelefono: enlaceTelefono,
    dosDigitos: dosDigitos,
    tiempoRestante: tiempoRestante,
    validarDatos: validarDatos,
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
```

- [ ] **Step 4: Ejecutar las pruebas y confirmar que pasan**

```bash
node --test pruebas/
```

Esperado: PASS — 19 pruebas, 0 fallos.

- [ ] **Step 5: Commit**

```bash
git add nucleo.js pruebas/nucleo.test.js
git commit -m "Agrega nucleo.js con funciones puras y sus pruebas"
```

---

### Task 2: Archivo de datos editable

**Files:**
- Create: `datos.js`
- Test: `pruebas/datos.test.js`

**Interfaces:**
- Consumes: `PiNucleo.validarDatos`.
- Produces: `window.DATOS` con las claves de primer nivel `marca`, `contacto`, `mensajes`, `promocion`, `precio`, `horarios`, `audiencia`, `beneficios`, `cursos`, `test`, `testimonios`, `faq`, `redes`.

Todo el texto sale de `index.html` tal cual, salvo las correcciones marcadas con `CORRECCIÓN` abajo.

- [ ] **Step 1: Escribir la prueba que falla**

Crear `pruebas/datos.test.js`:

```js
const test = require('node:test');
const assert = require('node:assert');
require('../nucleo.js');
globalThis.window = globalThis;
require('../datos.js');
const N = globalThis.PiNucleo;
const D = globalThis.DATOS;

test('datos.js define window.DATOS', () => {
  assert.ok(D, 'DATOS no está definido');
});

test('datos.js pasa la validacion del nucleo', () => {
  assert.deepStrictEqual(N.validarDatos(D), []);
});

test('el numero de whatsapp es el correcto y completo', () => {
  assert.strictEqual(N.normalizarNumero(D.contacto.whatsapp), '51934894501');
});

test('estan todas las claves de primer nivel', () => {
  const esperadas = ['marca', 'contacto', 'mensajes', 'promocion', 'precio',
    'horarios', 'audiencia', 'beneficios', 'cursos', 'test', 'testimonios', 'faq', 'redes'];
  esperadas.forEach((clave) => assert.ok(clave in D, `falta la clave "${clave}"`));
});

test('cada mensaje de whatsapp existe y no esta vacio', () => {
  const esperados = ['bannerSuperior', 'heroConsulta', 'interesPUCP', 'interesBeca18',
    'planPrecio', 'mediosDePago', 'testCompletado', 'botonFlotante', 'footer', 'inscripcion'];
  esperados.forEach((clave) => {
    assert.ok(D.mensajes[clave], `falta el mensaje "${clave}"`);
    assert.ok(D.mensajes[clave].trim().length > 10, `el mensaje "${clave}" es demasiado corto`);
  });
});

test('el mensaje del test usa los marcadores de puntaje', () => {
  assert.match(D.mensajes.testCompletado, /\{aciertos\}/);
  assert.match(D.mensajes.testCompletado, /\{total\}/);
});

test('el mensaje de inscripcion usa todos sus marcadores', () => {
  ['{nombre}', '{telefono}', '{modalidad}', '{turno}', '{origen}'].forEach((marcador) => {
    assert.ok(D.mensajes.inscripcion.includes(marcador), `falta ${marcador}`);
  });
});

test('ningun texto contiene el numero de whatsapp escrito a mano', () => {
  const serializado = JSON.stringify({ ...D, contacto: {} });
  assert.ok(!serializado.includes('934894501'),
    'el número está escrito dentro de algún texto; debe salir solo de contacto.whatsapp');
});

test('los testimonios de ejemplo estan ocultos', () => {
  assert.strictEqual(D.testimonios.mostrar, false);
});

test('la fecha limite de la promocion es una fecha valida', () => {
  assert.ok(!isNaN(new Date(D.promocion.fechaLimite).getTime()),
    'promocion.fechaLimite no es una fecha válida');
});

test('el test diagnostico tiene preguntas con una alternativa correcta valida', () => {
  assert.ok(D.test.preguntas.length >= 1);
  D.test.preguntas.forEach((p, i) => {
    assert.ok(p.alternativas.length >= 2, `la pregunta ${i + 1} necesita al menos 2 alternativas`);
    assert.ok(p.correcta >= 0 && p.correcta < p.alternativas.length,
      `la pregunta ${i + 1} tiene "correcta" fuera de rango`);
  });
});

test('no quedan textos con los errores de escritura corregidos', () => {
  const serializado = JSON.stringify(D);
  assert.ok(!serializado.includes('Proprobada'), 'quedó el typo "Proprobada"');
  assert.ok(!serializado.includes('postura o postura'), 'quedó el typo "postura o postura"');
  assert.ok(!/PI ACADEMY/.test(serializado), 'la marca debe escribirse "PiAcademy"');
});
```

- [ ] **Step 2: Ejecutar y confirmar que falla**

```bash
node --test pruebas/
```

Esperado: FAIL — `Cannot find module '../datos.js'`.

- [ ] **Step 3: Escribir `datos.js`**

Contenido completo. Cada bloque lleva su comentario en español:

```js
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
    planPrecio: "Hola PiAcademy 👋 Quiero inscribirme al Ciclo Integral. ¿Cuál es el precio vigente y cómo hago el pago?",
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
  audiencia: [
    {
      etiqueta: "Modalidad 01",
      titulo: "Postulantes PUCP",
      icono: "fa-solid fa-university",
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
```

**Correcciones aplicadas al copiar los textos** (verificar que quedaron así):
- `beneficios` → el encabezado "Metodología **Proprobada**" pasa a "Metodología **Comprobada**" (va en `index.html`, Tarea 5, no en `datos.js`).
- `test.preguntas[2].alternativas[1]`: "La postura o **postura** central" → "La postura o **posición** central".
- FAQ de medios de pago: se le quitó el número `+51 934894501` escrito a mano; ahora dice "Escríbenos por WhatsApp".
- `redes`: los cuatro enlaces genéricos (`facebook.com`, `youtube.com`, …) quedan vacíos hasta que el profesor ponga los reales.

- [ ] **Step 4: Ejecutar las pruebas y confirmar que pasan**

```bash
node --test pruebas/
```

Esperado: PASS — las 19 de `nucleo.test.js` más las 12 de `datos.test.js`, 0 fallos.

- [ ] **Step 5: Commit**

```bash
git add datos.js pruebas/datos.test.js
git commit -m "Agrega datos.js con todo el contenido editable de la landing"
```

---

### Task 3: Motor de render y aviso de errores

**Files:**
- Create: `app.js`
- Modify: `index.html` (cargar los scripts; convertir banner superior, cabecera y pie)

**Interfaces:**
- Consumes: `window.DATOS`, `globalThis.PiNucleo`.
- Produces: los atributos que el resto de tareas usará en el HTML:
  - `data-dato="ruta"` → escribe el valor como **texto plano**.
  - `data-html="ruta"` → escribe el valor como **HTML** (para textos con `<strong>`).
  - `data-attr="href:ruta"` → escribe el valor en ese atributo. Admite varios separados por `;`.
  - `data-wa="clave"` → pone en `href` la URL de WhatsApp con `DATOS.mensajes[clave]`.
  - `data-lista="ruta"` → contenedor de lista; debe contener un `<template>`; dentro de la plantilla se usa `data-campo="propiedad"` y `data-campo-html="propiedad"`.
  - `data-si="ruta"` → elimina el elemento del DOM si el valor es falso o es un array vacío.
  - También expone `window.PiApp.mensajeWhatsApp(clave, valores)` → string, y `window.PiApp.abrirWhatsApp(clave, valores)`, que usan las tareas 6 y 8.

- [ ] **Step 1: Crear `app.js` con el motor**

```js
/* ============================================================
   app.js — Motor de la página PiAcademy.
   NO EDITES ESTE ARCHIVO. Todo el contenido está en datos.js
   ============================================================ */
(function () {
  'use strict';

  var N = window.PiNucleo;

  function mostrarAviso(problemas) {
    var aviso = document.createElement('div');
    aviso.setAttribute('role', 'alert');
    aviso.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#B91C1C;color:#fff;padding:16px;font:14px/1.5 system-ui,sans-serif';
    aviso.innerHTML = '<strong>⚠️ Hay un problema en datos.js</strong><ul style="margin:8px 0 0 20px">' +
      problemas.map(function (p) { return '<li>' + p + '</li>'; }).join('') +
      '</ul><p style="margin-top:8px;opacity:.85">Corrige el archivo, guarda y actualiza la página (F5). Con F12 → Consola puedes ver la línea exacta.</p>';
    document.body.prepend(aviso);
  }

  // --- Vinculación de textos y atributos ---------------------------------

  function bindTexto(datos, raiz) {
    raiz.querySelectorAll('[data-dato]').forEach(function (el) {
      var valor = N.leerRuta(datos, el.dataset.dato);
      if (valor !== undefined && valor !== null) el.textContent = String(valor);
    });
    raiz.querySelectorAll('[data-html]').forEach(function (el) {
      var valor = N.leerRuta(datos, el.dataset.html);
      if (valor !== undefined && valor !== null) el.innerHTML = String(valor);
    });
  }

  function bindAtributo(datos, raiz) {
    raiz.querySelectorAll('[data-attr]').forEach(function (el) {
      el.dataset.attr.split(';').forEach(function (par) {
        var partes = par.split(':');
        var atributo = partes[0].trim();
        var valor = N.leerRuta(datos, partes.slice(1).join(':').trim());
        if (valor !== undefined && valor !== null && valor !== '') el.setAttribute(atributo, valor);
      });
    });
  }

  function bindWhatsApp(datos, raiz) {
    raiz.querySelectorAll('[data-wa]').forEach(function (el) {
      var mensaje = datos.mensajes[el.dataset.wa] || '';
      el.setAttribute('href', N.urlWhatsApp(datos.contacto.whatsapp, mensaje));
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
  }

  function bindCondicion(datos, raiz) {
    raiz.querySelectorAll('[data-si]').forEach(function (el) {
      var valor = N.leerRuta(datos, el.dataset.si);
      var vacio = !valor || (Array.isArray(valor) && valor.length === 0);
      if (vacio) el.remove();
    });
  }

  function bindLista(datos, raiz) {
    raiz.querySelectorAll('[data-lista]').forEach(function (contenedor) {
      var items = N.leerRuta(datos, contenedor.dataset.lista);
      var plantilla = contenedor.querySelector('template');
      if (!plantilla) return;
      if (!Array.isArray(items) || items.length === 0) { contenedor.remove(); return; }

      items.forEach(function (item, indice) {
        var copia = plantilla.content.cloneNode(true);

        copia.querySelectorAll('[data-campo]').forEach(function (el) {
          var valor = N.leerRuta(item, el.dataset.campo);
          if (valor !== undefined && valor !== null) el.textContent = String(valor);
        });
        copia.querySelectorAll('[data-campo-html]').forEach(function (el) {
          var valor = N.leerRuta(item, el.dataset.campoHtml);
          if (valor !== undefined && valor !== null) el.innerHTML = String(valor);
        });
        copia.querySelectorAll('[data-campo-attr]').forEach(function (el) {
          el.dataset.campoAttr.split(';').forEach(function (par) {
            var partes = par.split(':');
            var valor = N.leerRuta(item, partes.slice(1).join(':').trim());
            if (valor !== undefined && valor !== null && valor !== '') {
              el.setAttribute(partes[0].trim(), valor);
            }
          });
        });
        copia.querySelectorAll('[data-campo-lista]').forEach(function (sub) {
          var subItems = N.leerRuta(item, sub.dataset.campoLista) || [];
          var subPlantilla = sub.querySelector('template');
          if (!subPlantilla) return;
          subItems.forEach(function (texto) {
            var subCopia = subPlantilla.content.cloneNode(true);
            var destino = subCopia.querySelector('[data-campo-texto]');
            if (destino) destino.innerHTML = String(texto);
            sub.appendChild(subCopia);
          });
          subPlantilla.remove();
        });
        copia.querySelectorAll('[data-campo-wa]').forEach(function (el) {
          var mensaje = datos.mensajes[item[el.dataset.campoWa]] || '';
          el.setAttribute('href', N.urlWhatsApp(datos.contacto.whatsapp, mensaje));
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener');
        });
        copia.querySelectorAll('[data-indice]').forEach(function (el) {
          el.dataset.indice = String(indice);
        });

        contenedor.appendChild(copia);
      });

      plantilla.remove();
    });
  }

  // --- API que usan otras partes de la página ---------------------------

  function mensajeWhatsApp(clave, valores) {
    return N.aplicarPlantilla(window.DATOS.mensajes[clave] || '', valores || {});
  }

  function abrirWhatsApp(clave, valores) {
    var url = N.urlWhatsApp(window.DATOS.contacto.whatsapp, mensajeWhatsApp(clave, valores));
    window.open(url, '_blank', 'noopener');
  }

  window.PiApp = {
    mensajeWhatsApp: mensajeWhatsApp,
    abrirWhatsApp: abrirWhatsApp,
    modulos: [],
  };

  // --- Arranque ----------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    if (!window.DATOS) {
      mostrarAviso(['No se pudo leer el archivo <strong>datos.js</strong>. Suele ser una coma de más, una coma que falta o una comilla sin cerrar.']);
      return;
    }

    var problemas = N.validarDatos(window.DATOS);
    if (problemas.length) mostrarAviso(problemas);

    var datos = window.DATOS;
    bindCondicion(datos, document);
    bindLista(datos, document);
    bindTexto(datos, document);
    bindAtributo(datos, document);
    bindWhatsApp(datos, document);

    document.title = datos.marca.nombre + ' | Ciclo Integral PUCP & Beca 18';

    window.PiApp.modulos.forEach(function (iniciar) { iniciar(datos); });
  });
})();
```

- [ ] **Step 2: Cargar los scripts en `index.html`**

Reemplazar la etiqueta de cierre del `<script>` final por la carga de los tres archivos. Al final del `<body>`, justo antes de `</body>`:

```html
    <script src="nucleo.js"></script>
    <script src="datos.js"></script>
    <script src="app.js"></script>
</body>
```

El bloque `<script>` con el JavaScript actual (líneas 1082–1199) se elimina; su lógica se traslada a `app.js` en las tareas 4 a 8.

- [ ] **Step 3: Convertir el banner superior, la cabecera y el pie**

Banner superior (líneas 81–89): sustituir los textos y el enlace.

```html
<span data-dato="promocion.avisoBanner"></span>
<a data-wa="bannerSuperior" class="underline text-amber-300 font-bold hover:text-white transition-colors"
   data-dato="promocion.enlaceBanner"></a>
```

Cabecera: el nombre y el lema pasan a `data-dato`; el enlace de teléfono a `data-attr`:

```html
<span class="text-xl md:text-2xl font-black text-brand-purple tracking-tight leading-none uppercase"
      data-dato="marca.nombre"></span>
<span class="text-[10px] text-slate-500 tracking-wider font-semibold uppercase"
      data-dato="marca.lema"></span>
...
<a data-attr="href:contacto.enlaceTelefono" class="flex items-center gap-2 text-slate-700 hover:text-brand-purple font-semibold text-sm px-3 py-2">
    <i class="fa-solid fa-phone text-brand-purple" aria-hidden="true"></i>
    <span data-dato="contacto.telefonoVisible"></span>
</a>
```

`contacto.enlaceTelefono` no está en `datos.js`: lo calcula `app.js` al arrancar, para que el profesor no tenga que escribirlo dos veces. Añadir dentro del `DOMContentLoaded`, **antes** de `bindAtributo`:

```js
    datos.contacto.enlaceTelefono = N.enlaceTelefono(datos.contacto.whatsapp);
```

Esto corrige de raíz el `tel:+5193489450` del menú móvil (línea 141), al que le faltaba un dígito. Aplicar el mismo par `data-attr` + `data-dato` a ese enlace del menú móvil.

Pie: nombre, descripción, correo, año y las cuatro redes.

```html
<span class="text-2xl font-black tracking-tight uppercase" data-dato="marca.nombre"></span>
<p class="text-slate-400 text-sm leading-relaxed max-w-sm" data-dato="marca.descripcionPie"></p>
...
<span>Teléfono / WhatsApp: <a data-attr="href:contacto.enlaceTelefono" class="hover:text-amber-300 font-bold" data-dato="contacto.telefonoVisible"></a></span>
...
<span>Contacto: <span data-dato="contacto.correo"></span></span>
...
<a data-si="redes.facebook" data-attr="href:redes.facebook" target="_blank" rel="noopener" title="Facebook de PiAcademy" class="w-11 h-11 bg-slate-800 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center text-lg transition-colors shadow-md">
    <i class="fa-brands fa-facebook-f" aria-hidden="true"></i>
</a>
```

Repetir el patrón `data-si` + `data-attr` para YouTube (`hover:bg-red-600`), TikTok (`hover:bg-slate-950`) e Instagram (`hover:bg-pink-600`), conservando sus clases actuales. El ícono de WhatsApp del pie usa `data-wa="footer"`.

Copyright: `<p>© <span data-dato="marca.anioCopyright"></span> <span data-dato="marca.nombre"></span> Virtual. Todos los derechos reservados.</p>`

Botón flotante de WhatsApp (líneas 1014–1019): quitar el `href` escrito a mano y poner `data-wa="botonFlotante"`.

- [ ] **Step 4: Verificar en el navegador**

Abrir `index.html` con el navegador (`file:///C:/Users/Bander/Desktop/CARPETAS/PY ACADEMI WEB/index.html`) y comprobar:

1. El banner, la cabecera y el pie muestran texto (no quedan vacíos).
2. El teléfono visible dice `+51 934 894 501` en cabecera, menú móvil y pie.
3. Los cuatro íconos de redes **no aparecen** (están vacíos en `datos.js`).
4. El botón flotante de WhatsApp apunta a `https://wa.me/51934894501?text=...`.
5. La consola (F12) no muestra errores.
6. Renombrar temporalmente `datos.js` a `datos.bak` y recargar: debe aparecer el banner rojo. Volver a renombrarlo a `datos.js`.

- [ ] **Step 5: Commit**

```bash
git add app.js index.html
git commit -m "Agrega el motor de render y conecta banner, cabecera y pie a datos.js"
```

---

### Task 4: Hero, tarjeta de inicio y cuenta regresiva real

**Files:**
- Modify: `index.html` (líneas 152–274), `app.js`

**Interfaces:**
- Consumes: `bindTexto`, `bindWhatsApp`, `PiNucleo.tiempoRestante`, `PiNucleo.dosDigitos`, `window.PiApp.modulos`.
- Produces: nada nuevo.

- [ ] **Step 1: Conectar los textos del hero**

En el hero: el botón verde "Consultar por WhatsApp" pasa a `data-wa="heroConsulta"`. La línea de teléfono directo (línea 207, que hoy muestra el número incompleto `+51 93489450`) pasa a:

```html
<span>Asesores disponibles hoy. Llámanos directo al:
  <strong class="text-white" data-dato="contacto.telefonoVisible"></strong>
</span>
```

En la tarjeta blanca: el rótulo del contador usa `data-dato="promocion.textoContador"`, y el bloque completo del contador (líneas 225–247) se envuelve en un contenedor identificable:

```html
<div class="my-6 bg-slate-50 p-4 rounded-2xl border border-slate-200" id="bloqueContador">
```

Añadir después del bloque, oculto por defecto:

```html
<p id="contadorVencido" class="hidden my-6 text-center text-sm font-bold text-brand-purple bg-purple-50 border border-purple-200 p-4 rounded-2xl"></p>
```

Y en `datos.js`, dentro de `promocion`, agregar la clave que muestra ese mensaje:

```js
    mensajeVencido: "¡La promoción cerró! Escríbenos por WhatsApp para consultar el próximo grupo.",
```

- [ ] **Step 2: Implementar la cuenta regresiva en `app.js`**

Añadir antes del `DOMContentLoaded` y registrar el módulo:

```js
  function iniciarContador(datos) {
    var bloque = document.getElementById('bloqueContador');
    var vencido = document.getElementById('contadorVencido');
    if (!bloque) return;

    if (!datos.promocion.mostrarContador) { bloque.remove(); return; }

    var campos = {
      dias: document.getElementById('cd-days'),
      horas: document.getElementById('cd-hours'),
      minutos: document.getElementById('cd-mins'),
      segundos: document.getElementById('cd-secs'),
    };

    function terminar() {
      bloque.remove();
      if (vencido) {
        vencido.textContent = datos.promocion.mensajeVencido;
        vencido.classList.remove('hidden');
      }
    }

    function actualizar() {
      var t = N.tiempoRestante(datos.promocion.fechaLimite, new Date());
      if (t.vencido) { clearInterval(temporizador); terminar(); return; }
      campos.dias.textContent = N.dosDigitos(t.dias);
      campos.horas.textContent = N.dosDigitos(t.horas);
      campos.minutos.textContent = N.dosDigitos(t.minutos);
      campos.segundos.textContent = N.dosDigitos(t.segundos);
    }

    actualizar();
    var temporizador = setInterval(actualizar, 1000);
  }

  window.PiApp.modulos.push(iniciarContador);
```

Esto corrige los dos defectos del contador anterior: ya no reinicia en 3 días en cada recarga, y `clearInterval` detiene el temporizador (el código anterior seguía ejecutándose para siempre con `if (totalSeconds <= 0) return;`).

- [ ] **Step 3: Verificar en el navegador**

1. Abrir la página: el contador muestra el tiempo real que falta hasta `2026-09-15T23:59` y decrementa cada segundo.
2. Recargar (F5): el contador **no** vuelve a empezar en 3 días — continúa donde corresponde.
3. Cambiar temporalmente `fechaLimite` a `"2020-01-01T00:00"`, recargar: el contador desaparece y aparece el mensaje morado de promoción cerrada. Devolver la fecha original.
4. Cambiar `mostrarContador` a `false`, recargar: el bloque no aparece y no hay mensaje de vencido. Devolverlo a `true`.
5. El botón verde del hero abre WhatsApp con el mensaje `heroConsulta`.

- [ ] **Step 4: Commit**

```bash
git add index.html app.js datos.js
git commit -m "Conecta el hero a datos.js y hace que la cuenta regresiva use una fecha real"
```

---

### Task 5: Audiencia, beneficios y cursos como listas

**Files:**
- Modify: `index.html` (líneas 276–681), `app.js`

**Interfaces:**
- Consumes: `bindLista` con `data-campo`, `data-campo-html`, `data-campo-lista`, `data-campo-wa`, `data-campo-attr`.
- Produces: el módulo de pestañas leyendo `DATOS.cursos`.

- [ ] **Step 1: Convertir "Dirigido a" en una lista**

Sustituir las dos tarjetas escritas a mano (líneas 291–371) por un contenedor con plantilla. La clase de la rejilla se mantiene:

```html
<div class="grid md:grid-cols-2 gap-8" data-lista="audiencia">
  <template>
    <div class="bg-slate-50 border-2 border-purple-100 rounded-3xl p-8 hover:border-brand-purple transition-all shadow-sm hover:shadow-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 w-32 h-32 bg-purple-200/40 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
      <div class="flex items-center gap-4 mb-6">
        <div class="w-14 h-14 bg-brand-purple text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md">
          <i data-campo-attr="class:icono" aria-hidden="true"></i>
        </div>
        <div>
          <span class="text-xs font-bold text-brand-purple uppercase tracking-wider" data-campo="etiqueta"></span>
          <h3 class="text-2xl font-black text-slate-900" data-campo="titulo"></h3>
        </div>
      </div>
      <p class="text-slate-600 text-sm mb-6 leading-relaxed" data-campo-html="descripcion"></p>
      <div class="space-y-3 border-t border-slate-200 pt-6">
        <h4 class="font-bold text-sm uppercase text-brand-purple">Énfasis del Aprendizaje:</h4>
        <div data-campo-lista="puntos" class="space-y-3">
          <template>
            <div class="flex items-start gap-3 text-sm text-slate-700">
              <i class="fa-solid fa-check text-amber-500 font-bold mt-1" aria-hidden="true"></i>
              <span data-campo-texto></span>
            </div>
          </template>
        </div>
      </div>
      <a data-campo-wa="mensaje" data-campo="textoBoton"
         class="mt-8 w-full bg-white hover:bg-brand-purple text-brand-purple hover:text-white font-extrabold py-3 rounded-xl border border-purple-300 transition-colors shadow-sm flex items-center justify-center gap-2"></a>
    </div>
  </template>
</div>
```

Nota: el `<i>` usa `data-campo-attr="class:icono"`, que **reemplaza** la clase; por eso el icono no lleva clases propias en la plantilla.

Los dos botones pasan de abrir el modal a abrir WhatsApp directamente con su mensaje (`interesPUCP` / `interesBeca18`), que es lo que pidió el profesor: que cada consulta llegue con contexto.

- [ ] **Step 2: Convertir los 6 beneficios en una lista**

Sustituir las seis tarjetas (líneas 390–456) por:

```html
<div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" data-lista="beneficios">
  <template>
    <div class="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div class="w-12 h-12 bg-purple-100 text-brand-purple rounded-xl flex items-center justify-center text-xl font-bold mb-5">
        <i data-campo-attr="class:icono" aria-hidden="true"></i>
      </div>
      <h3 class="text-xl font-black text-slate-900 mb-2" data-campo="titulo"></h3>
      <p class="text-slate-600 text-sm leading-relaxed" data-campo="texto"></p>
    </div>
  </template>
</div>
```

En el encabezado de esa sección (línea 381), corregir el typo: `Metodología Proprobada` → `Metodología Comprobada`.

- [ ] **Step 3: Convertir el temario en listas y mover las pestañas a `app.js`**

Las pestañas (líneas 551–564) y los cuatro paneles (líneas 567–679) se generan desde `DATOS.cursos`:

```html
<div class="flex flex-wrap items-center justify-center gap-2 mb-8" data-lista="cursos" id="pestanasCursos">
  <template>
    <button type="button" data-indice data-campo-attr="data-clave:clave"
            class="pestana-curso bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-3 rounded-xl transition-all">
      <i data-campo-attr="class:iconoPestana" aria-hidden="true"></i>
      <span data-campo="pestana" class="ml-2"></span>
    </button>
  </template>
</div>

<div class="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10" data-lista="cursos" id="panelesCursos">
  <template>
    <div class="panel-curso hidden" data-campo-attr="data-clave:clave">
      <div class="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <span class="text-xs font-bold text-brand-purple uppercase tracking-wider" data-campo="etiqueta"></span>
          <h3 class="text-2xl font-black text-slate-900 mt-1 mb-4" data-campo="titulo"></h3>
          <p class="text-slate-600 text-sm leading-relaxed mb-6" data-campo="descripcion"></p>
          <ul data-campo-lista="temas" class="space-y-2 text-sm text-slate-700 font-medium">
            <template>
              <li class="flex items-center gap-2">
                <i class="fa-solid fa-check text-brand-purple" aria-hidden="true"></i>
                <span data-campo-texto></span>
              </li>
            </template>
          </ul>
        </div>
        <div class="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm space-y-4">
          <h4 class="font-bold text-slate-900 text-sm uppercase" data-campo="tituloNota"></h4>
          <p class="text-slate-600 text-xs leading-relaxed" data-campo="nota"></p>
          <div class="bg-purple-50 p-4 rounded-xl border border-purple-200 text-xs text-brand-purple font-semibold">
            <i data-campo-attr="class:iconoDestacado" aria-hidden="true"></i>
            <span data-campo="destacado" class="ml-1"></span>
          </div>
        </div>
      </div>
    </div>
  </template>
</div>
```

Módulo de pestañas en `app.js` (reemplaza la función `switchTab`, que dependía de IDs fijos y por eso no admitía cursos nuevos):

```js
  function iniciarPestanasCursos() {
    var pestanas = Array.prototype.slice.call(document.querySelectorAll('.pestana-curso'));
    var paneles = Array.prototype.slice.call(document.querySelectorAll('.panel-curso'));
    if (!pestanas.length) return;

    function activar(clave) {
      pestanas.forEach(function (boton) {
        var activa = boton.dataset.clave === clave;
        boton.classList.toggle('bg-brand-purple', activa);
        boton.classList.toggle('text-white', activa);
        boton.classList.toggle('bg-slate-100', !activa);
        boton.classList.toggle('text-slate-700', !activa);
        boton.setAttribute('aria-selected', activa ? 'true' : 'false');
      });
      paneles.forEach(function (panel) {
        panel.classList.toggle('hidden', panel.dataset.clave !== clave);
      });
    }

    pestanas.forEach(function (boton) {
      boton.addEventListener('click', function () { activar(boton.dataset.clave); });
    });

    activar(pestanas[0].dataset.clave);
  }

  window.PiApp.modulos.push(iniciarPestanasCursos);
```

- [ ] **Step 4: Verificar en el navegador**

1. Las dos tarjetas de audiencia aparecen completas, con sus tres viñetas cada una y sus iconos.
2. Sus botones abren WhatsApp con los mensajes `interesPUCP` y `interesBeca18`.
3. Se ven las 6 tarjetas de beneficios con sus iconos, y el encabezado dice "Metodología Comprobada".
4. Las 4 pestañas del temario cambian de panel al hacer clic; la primera está activa al cargar.
5. Agregar un quinto beneficio en `datos.js` y recargar: aparece sin tocar el HTML. Quitarlo después.
6. Consola sin errores.

- [ ] **Step 5: Commit**

```bash
git add index.html app.js
git commit -m "Genera audiencia, beneficios y cursos desde datos.js"
```

---

### Task 6: Test de nivel editable, con reintento y puntaje en WhatsApp

**Files:**
- Modify: `index.html` (líneas 460–533), `app.js`

**Interfaces:**
- Consumes: `PiApp.mensajeWhatsApp('testCompletado', { aciertos, total })`.
- Produces: nada nuevo.

- [ ] **Step 1: Vaciar el HTML del test**

Sustituir los tres bloques `#q1`, `#q2`, `#q3` (líneas 479–510) por un único contenedor vacío que llena `app.js`:

```html
<div id="preguntaTest"></div>
```

Conservar la barra de progreso (`#quizStepText`) y la caja de resultado, cambiando el botón final y añadiendo el de reintento:

```html
<div id="quizResult" class="hidden text-center py-6 space-y-4">
    <div class="w-16 h-16 bg-brand-amber text-slate-950 rounded-full flex items-center justify-center text-3xl font-black mx-auto">
        <i class="fa-solid fa-trophy" aria-hidden="true"></i>
    </div>
    <h3 class="text-2xl font-black text-white">¡Test Completado!</h3>
    <p class="text-slate-300 text-sm max-w-md mx-auto">
        Obtuviste <span id="correctCount" class="text-amber-400 font-bold">0</span>
        de <span id="totalCount" class="text-amber-400 font-bold">0</span> respuestas correctas.
    </p>
    <p class="text-xs text-slate-400 bg-slate-800/80 p-4 rounded-xl max-w-lg mx-auto">
        ¡El Ciclo Integral de PiAcademy te dará el método de resolución rápida exacto para asegurar tu puntaje máximo!
    </p>
    <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <a id="btnAsesoriaTest" href="#" target="_blank" rel="noopener"
           class="bg-brand-amber hover:bg-brand-amberHover text-slate-950 font-black px-8 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105">
            Recibir asesoría personalizada por WhatsApp
        </a>
        <button type="button" id="btnRepetirTest"
                class="text-slate-300 hover:text-white underline text-sm font-semibold px-4 py-3">
            Repetir el test
        </button>
    </div>
</div>
```

Envolver la `<section id="diagnostico">` completa con `data-si="test.mostrar"` para que el profesor pueda apagarla.

- [ ] **Step 2: Implementar el módulo del test en `app.js`**

Reemplaza `answerQuiz` y sus variables globales `currentStep` / `correctAnswers`:

```js
  function iniciarTest(datos) {
    var contenedor = document.getElementById('preguntaTest');
    if (!contenedor) return;

    var preguntas = datos.test.preguntas;
    var total = preguntas.length;
    var paso = 0;
    var aciertos = 0;

    var progreso = document.getElementById('quizStepText');
    var resultado = document.getElementById('quizResult');
    var botonAsesoria = document.getElementById('btnAsesoriaTest');
    var letras = ['A', 'B', 'C', 'D', 'E', 'F'];

    function pintarPregunta() {
      var pregunta = preguntas[paso];
      progreso.textContent = 'Pregunta ' + (paso + 1) + ' de ' + total;
      contenedor.innerHTML = '';

      var titulo = document.createElement('h3');
      titulo.className = 'text-lg font-bold text-white mb-4';
      titulo.textContent = (paso + 1) + '. ' + pregunta.enunciado;
      contenedor.appendChild(titulo);

      var lista = document.createElement('div');
      lista.className = 'space-y-3';

      pregunta.alternativas.forEach(function (texto, indice) {
        var boton = document.createElement('button');
        boton.type = 'button';
        boton.className = 'w-full text-left bg-slate-800 hover:bg-purple-900/40 p-3.5 rounded-xl border border-slate-700 transition-colors text-sm';
        boton.textContent = letras[indice] + ') ' + texto;
        boton.addEventListener('click', function () { responder(indice === pregunta.correcta); });
        lista.appendChild(boton);
      });

      contenedor.appendChild(lista);
    }

    function responder(esCorrecta) {
      if (esCorrecta) aciertos++;
      paso++;
      if (paso < total) { pintarPregunta(); return; }
      terminar();
    }

    function terminar() {
      contenedor.innerHTML = '';
      progreso.textContent = 'Resultado final';
      document.getElementById('correctCount').textContent = aciertos;
      document.getElementById('totalCount').textContent = total;
      botonAsesoria.setAttribute('href', N.urlWhatsApp(
        datos.contacto.whatsapp,
        window.PiApp.mensajeWhatsApp('testCompletado', { aciertos: aciertos, total: total })
      ));
      resultado.classList.remove('hidden');
    }

    document.getElementById('btnRepetirTest').addEventListener('click', function () {
      paso = 0;
      aciertos = 0;
      resultado.classList.add('hidden');
      pintarPregunta();
    });

    pintarPregunta();
  }

  window.PiApp.modulos.push(iniciarTest);
```

- [ ] **Step 3: Verificar en el navegador**

1. Aparece la pregunta 1 de 3 con sus cuatro alternativas rotuladas A) a D).
2. Responder las tres muestra el resultado con el puntaje correcto (probar respondiendo todo bien: 3 de 3; y todo mal: 0 de 3).
3. El botón ámbar abre WhatsApp con un mensaje que **incluye el puntaje real**, por ejemplo "…obtuve 2 de 3…".
4. "Repetir el test" vuelve a la pregunta 1 con el marcador en cero.
5. Agregar una cuarta pregunta en `datos.js` y recargar: el test pasa a "Pregunta 1 de 4" y funciona. Quitarla después.
6. Poner `test.mostrar: false` y recargar: la sección desaparece. Devolverlo a `true`.

- [ ] **Step 4: Commit**

```bash
git add index.html app.js
git commit -m "Genera el test de nivel desde datos.js, permite repetirlo y envia el puntaje por WhatsApp"
```

---

### Task 7: Precio, horarios, testimonios y preguntas frecuentes

**Files:**
- Modify: `index.html` (líneas 683–923), `app.js`

**Interfaces:**
- Consumes: `bindTexto`, `bindLista`, `bindCondicion`, `bindWhatsApp`.
- Produces: módulo del acordeón FAQ (reemplaza `toggleFaq`).

- [ ] **Step 1: Conectar precio y horarios**

En la tarjeta de precio (líneas 712–724):

```html
<div class="mt-6 flex items-center justify-center gap-3">
    <span class="text-slate-400 line-through text-lg font-bold">S/ <span data-dato="precio.normal"></span></span>
    <div class="flex items-baseline gap-1">
        <span class="text-xs font-bold text-amber-400">S/</span>
        <span class="text-5xl font-black text-amber-400" data-dato="precio.promocional"></span>
        <span class="text-xs text-slate-300 font-medium">/ <span data-dato="precio.nota"></span></span>
    </div>
</div>
<p class="text-xs text-emerald-400 font-bold mt-2">
    <i class="fa-solid fa-tags" aria-hidden="true"></i> ¡Ahorras S/ <span id="ahorro"></span> inscribiéndote hoy!
</p>
```

El ahorro se calcula, para que no quede desincronizado al cambiar los precios. En `app.js`, dentro del `DOMContentLoaded` después de `bindTexto`:

```js
    var ahorro = document.getElementById('ahorro');
    if (ahorro) ahorro.textContent = datos.precio.normal - datos.precio.promocional;
```

Los turnos (líneas 755–764) pasan a lista:

```html
<div class="grid grid-cols-2 gap-3 text-xs text-slate-300" data-lista="horarios">
  <template>
    <div class="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
      <span class="font-bold text-white block" data-campo="nombre"></span>
      <span data-campo="rango"></span>
    </div>
  </template>
</div>
```

El enlace "¿Preguntas sobre Yape, Plin…?" (línea 774) pasa a `data-wa="mediosDePago"`.

- [ ] **Step 2: Convertir los testimonios en lista oculta**

Envolver la `<section>` de testimonios completa (líneas 784–863) con `data-si="testimonios.mostrar"` y sustituir las tres tarjetas por:

```html
<div class="grid md:grid-cols-3 gap-8" data-lista="testimonios.items">
  <template>
    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
      <div>
        <div class="flex text-amber-400 text-sm mb-3" aria-hidden="true">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
        <p class="text-slate-700 text-sm italic mb-6" data-campo="texto"></p>
      </div>
      <div class="flex items-center gap-3 border-t border-slate-200 pt-4">
        <div class="w-10 h-10 bg-brand-purple text-white font-bold rounded-full flex items-center justify-center text-sm" data-campo="iniciales"></div>
        <div>
          <h4 class="font-bold text-slate-900 text-sm" data-campo="nombre"></h4>
          <span class="text-xs text-brand-purple font-semibold" data-campo="detalle"></span>
        </div>
      </div>
    </div>
  </template>
</div>
```

`data-si` se evalúa antes que `data-lista` en el arranque, así que con `mostrar: false` la sección se elimina entera y la plantilla nunca se procesa.

- [ ] **Step 3: Convertir las preguntas frecuentes en lista**

Sustituir los cuatro bloques (líneas 878–921) por:

```html
<div class="space-y-4" data-lista="faq">
  <template>
    <div class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <button type="button" class="faq-boton w-full text-left p-5 font-bold text-slate-900 flex justify-between items-center hover:text-brand-purple transition-colors" aria-expanded="false">
        <span data-campo="pregunta"></span>
        <i class="faq-icono fa-solid fa-plus text-brand-purple" aria-hidden="true"></i>
      </button>
      <div class="faq-respuesta hidden px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-3" data-campo="respuesta"></div>
    </div>
  </template>
</div>
```

Módulo en `app.js` (reemplaza `toggleFaq`, que dependía de IDs numerados y no admitía preguntas nuevas):

```js
  function iniciarFaq() {
    document.querySelectorAll('.faq-boton').forEach(function (boton) {
      boton.addEventListener('click', function () {
        var tarjeta = boton.parentElement;
        var respuesta = tarjeta.querySelector('.faq-respuesta');
        var icono = tarjeta.querySelector('.faq-icono');
        var abierta = !respuesta.classList.contains('hidden');

        respuesta.classList.toggle('hidden', abierta);
        boton.setAttribute('aria-expanded', abierta ? 'false' : 'true');
        icono.classList.toggle('fa-plus', abierta);
        icono.classList.toggle('fa-minus', !abierta);
      });
    });
  }

  window.PiApp.modulos.push(iniciarFaq);
```

- [ ] **Step 4: Verificar en el navegador**

1. El precio muestra S/ 380 tachado, S/ 220 destacado y "¡Ahorras S/ 160!".
2. Cambiar `precio.normal` a `400` y recargar: el ahorro pasa a 180 solo. Devolverlo a 380.
3. Los dos turnos aparecen con su horario.
4. La sección de testimonios **no aparece** (`mostrar: false`).
5. Cambiar `testimonios.mostrar` a `true` y recargar: aparecen las tres tarjetas de ejemplo. Devolverlo a `false`.
6. Las 4 preguntas frecuentes abren y cierran; el icono cambia de `+` a `−`.
7. Agregar una quinta pregunta en `datos.js` y recargar: funciona igual. Quitarla después.

- [ ] **Step 5: Commit**

```bash
git add index.html app.js
git commit -m "Genera precio, horarios, testimonios y preguntas frecuentes desde datos.js"
```

---

### Task 8: Formulario de inscripción y accesibilidad del modal

**Files:**
- Modify: `index.html` (líneas 1021–1079), `app.js`

**Interfaces:**
- Consumes: `PiApp.mensajeWhatsApp('inscripcion', { nombre, telefono, modalidad, turno, origen })`.
- Produces: `window.abrirInscripcion(origen)` — usada por los botones `onclick` que quedan.

- [ ] **Step 1: Ajustar el HTML del modal**

Los turnos del formulario se generan desde `DATOS.horarios` para que no se desincronicen con la tarjeta de precio:

```html
<div>
    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Turno Preferido:</label>
    <div class="grid grid-cols-2 gap-3" data-lista="horarios">
      <template>
        <label class="flex items-center gap-2 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-purple-50">
          <input type="radio" name="turno" data-campo-attr="value:nombre" class="accent-brand-purple">
          <span class="text-xs font-bold text-slate-800"><span data-campo="nombre"></span> <span data-campo="rango"></span></span>
        </label>
      </template>
    </div>
</div>
```

El botón de envío deja de llevar el número escrito a mano:

```html
<button type="submit" class="w-full bg-brand-purple hover:bg-brand-darkPurple text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2 text-sm mt-2">
    <i class="fa-brands fa-whatsapp text-lg" aria-hidden="true"></i>
    <span>Continuar inscripción por WhatsApp</span>
</button>
```

Quitar los atributos `onsubmit` del `<form>` y `onclick` de los botones de cerrar; se conectan desde `app.js`. Los botones que abren el modal cambian `onclick="openEnrollModal('X')"` por `onclick="abrirInscripcion('X')"` — quedan estos tres: cabecera (`'Cabecera'`), menú móvil (`'Menú móvil'`), hero (`'Botón principal'`), tarjeta del hero (`'Tarjeta de inicio'`) y plan de precio (`'Plan Ciclo Integral'`).

Añadir al contenedor del modal los atributos de accesibilidad: `role="dialog" aria-modal="true" aria-labelledby="tituloModal"`, y `id="tituloModal"` al `<h3>`.

- [ ] **Step 2: Implementar el módulo del modal en `app.js`**

```js
  function iniciarModal(datos) {
    var modal = document.getElementById('enrollModal');
    var formulario = document.getElementById('enrollForm');
    if (!modal || !formulario) return;

    var ultimoFoco = null;

    function abrir(origen) {
      document.getElementById('modalOrigin').value = origen || 'General';
      ultimoFoco = document.activeElement;
      modal.classList.remove('hidden');
      document.getElementById('studentName').focus();
    }

    function cerrar() {
      modal.classList.add('hidden');
      if (ultimoFoco) ultimoFoco.focus();
    }

    modal.querySelectorAll('[data-cerrar-modal]').forEach(function (boton) {
      boton.addEventListener('click', cerrar);
    });

    modal.addEventListener('click', function (evento) {
      if (evento.target === modal) cerrar();
    });

    document.addEventListener('keydown', function (evento) {
      if (evento.key === 'Escape' && !modal.classList.contains('hidden')) cerrar();
    });

    formulario.addEventListener('submit', function (evento) {
      evento.preventDefault();
      var turno = formulario.querySelector('input[name="turno"]:checked');

      window.PiApp.abrirWhatsApp('inscripcion', {
        nombre: document.getElementById('studentName').value.trim(),
        telefono: document.getElementById('studentPhone').value.trim(),
        modalidad: document.getElementById('studentTarget').value,
        turno: turno ? turno.value : '',
        origen: document.getElementById('modalOrigin').value,
      });

      cerrar();
      formulario.reset();
    });

    window.abrirInscripcion = abrir;
  }

  window.PiApp.modulos.push(iniciarModal);
```

Añadir `data-cerrar-modal` al botón de la X del modal.

Marcar el primer radio de turno como seleccionado, ya que la plantilla no puede llevar `checked`. En `iniciarModal`, antes de `window.abrirInscripcion = abrir;`:

```js
    var primerTurno = formulario.querySelector('input[name="turno"]');
    if (primerTurno) primerTurno.checked = true;
```

- [ ] **Step 3: Verificar en el navegador**

1. Los cinco botones de inscripción abren el modal; el cursor queda en el campo de nombre.
2. Cerrar funciona de tres formas: la X, la tecla `Esc` y hacer clic en el fondo oscuro.
3. Enviar el formulario con nombre "Ana Pérez", teléfono "912345678", modalidad "Postulante a la PUCP", turno "Turno Mañana" abre WhatsApp con un mensaje que contiene esas cuatro líneas **y** el origen correcto según el botón usado.
4. Enviar dejando el teléfono vacío no es posible (el campo es `required`); comprobar en cambio que si en `datos.js` se borrara un marcador, la línea desaparece — probar con `PiApp.mensajeWhatsApp('inscripcion', {nombre:'Ana'})` en la consola: debe devolver solo la línea del nombre.
5. Los turnos del formulario coinciden con los de la tarjeta de precio.

- [ ] **Step 4: Commit**

```bash
git add index.html app.js
git commit -m "Conecta el formulario de inscripcion a datos.js y mejora la accesibilidad del modal"
```

---

### Task 9: SEO, compartir en redes y detalles de navegación

**Files:**
- Modify: `index.html` (`<head>`, secciones, menú móvil)

**Interfaces:**
- Consumes: nada.
- Produces: nada.

- [ ] **Step 1: Añadir el bloque SEO al `<head>`**

Después de la etiqueta `<title>`, insertar. Este es **el único bloque de `index.html` que el profesor puede editar**, y va marcado como tal:

```html
    <!-- ══════════════════════════════════════════════════════════
         ✏️ ÚNICO BLOQUE EDITABLE DE ESTE ARCHIVO
         Es lo que se ve en Google y al compartir el enlace por
         WhatsApp o Facebook. Tiene que estar aquí (y no en datos.js)
         porque esos servicios no ejecutan JavaScript.
         ══════════════════════════════════════════════════════════ -->
    <meta name="description" content="Ciclo Integral virtual de preparación para el examen de admisión PUCP y el Examen Nacional de Preselección de Beca 18. Clases en vivo, grabaciones 24/7 y simulacros semanales.">
    <meta property="og:type" content="website">
    <meta property="og:title" content="PiAcademy | Ciclo Integral PUCP &amp; Beca 18">
    <meta property="og:description" content="Preparación virtual especializada para PUCP y Beca 18. Clases en vivo, simulacros semanales y acompañamiento personalizado.">
    <meta property="og:image" content="og-imagen.jpg">
    <meta name="twitter:card" content="summary_large_image">
    <!-- ══════════ FIN DEL BLOQUE EDITABLE ══════════ -->

    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%235B21B6'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='21' font-weight='bold' fill='white' text-anchor='middle'%3E%CF%80%3C/text%3E%3C/svg%3E">
```

`og:image` apunta a `og-imagen.jpg`, que el profesor aún debe crear (1200 × 630 px). Mientras no exista, el enlace compartido muestra título y descripción sin imagen — que ya es mejor que hoy.

- [ ] **Step 2: Corregir el desplazamiento de los enlaces del menú**

La cabecera fija mide 80 px (`h-20`), así que al usar los enlaces del menú el título de cada sección queda tapado. Añadir `scroll-mt-24` a cada `<section>` con `id`: `#audiencia`, `#beneficios`, `#diagnostico`, `#temario`, `#inversion`, `#faq`.

- [ ] **Step 3: Cerrar el menú móvil al tocar un enlace**

Trasladar el manejador del menú a `app.js` como módulo y añadir el cierre:

```js
  function iniciarMenuMovil() {
    var boton = document.getElementById('mobileMenuBtn');
    var menu = document.getElementById('mobileMenu');
    if (!boton || !menu) return;

    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'mobileMenu');
    boton.setAttribute('aria-label', 'Abrir menú de navegación');

    boton.addEventListener('click', function () {
      var abierto = !menu.classList.contains('hidden');
      menu.classList.toggle('hidden', abierto);
      boton.setAttribute('aria-expanded', abierto ? 'false' : 'true');
    });

    menu.querySelectorAll('a').forEach(function (enlace) {
      enlace.addEventListener('click', function () {
        menu.classList.add('hidden');
        boton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  window.PiApp.modulos.push(iniciarMenuMovil);
```

- [ ] **Step 4: Verificar en el navegador**

1. La pestaña del navegador muestra el ícono morado con la π.
2. Ver el código fuente (Ctrl+U): las etiquetas `description` y `og:*` están presentes.
3. Hacer clic en cada enlace del menú: el título de la sección queda visible, no tapado por la cabecera.
4. Reducir la ventana a 375 px de ancho, abrir el menú y tocar un enlace: el menú se cierra solo.
5. Recorrer la página con la tecla Tab: los botones de icono anuncian su función y el foco es visible.

- [ ] **Step 5: Commit**

```bash
git add index.html app.js
git commit -m "Agrega SEO, favicon y corrige la navegacion del menu"
```

---

### Task 10: Guía de edición y verificación final

**Files:**
- Create: `LEEME.md`
- Modify: ninguno

- [ ] **Step 1: Escribir `LEEME.md`**

```markdown
# Cómo editar tu página — PiAcademy

## En resumen

Abre **`datos.js`** con el Bloc de notas (o mejor: Visual Studio Code, gratis).
Cambia lo que está entre "comillas". Guarda. Abre `index.html` y pulsa F5.

**Nunca necesitas tocar `index.html`, `app.js` ni `nucleo.js`.**

## Las 4 reglas para no romper nada

1. Cambia solo lo que está entre "comillas".
2. No borres las comas del final de cada línea.
3. Los precios van SIN comillas: `promocional: 220`
4. Si tu texto lleva comillas dentro, escríbelas con barra: `"Dijo \"hola\""`

## Cambiar el número de WhatsApp

Está en un solo sitio. Cambia estas dos líneas y se actualiza toda la página:

    contacto: {
      whatsapp: "51934894501",
      telefonoVisible: "+51 934 894 501",
    },

## Cambiar el precio

    precio: {
      normal: 380,
      promocional: 220,
    },

El "¡Ahorras S/ 160!" se calcula solo.

## Cambiar la fecha del descuento

    promocion: {
      fechaLimite: "2026-09-15T23:59",
    },

Formato: año-mes-díaThora:minuto. Cuando llegue esa fecha, el contador
desaparece solo y sale el mensaje que pusiste en `mensajeVencido`.

## Agregar un testimonio real

1. Pide permiso al alumno.
2. En `testimonios.items`, copia un bloque completo `{ ... },` y pégalo debajo.
3. Cambia `mostrar: false` por `mostrar: true`.

## Agregar una pregunta frecuente

En `faq`, copia y pega este bloque al final de la lista:

    { pregunta: "¿Tu pregunta?", respuesta: "Tu respuesta." },

## Cambiar los mensajes de WhatsApp

En `mensajes`. Es el texto que ya aparece escrito cuando alguien te escribe
desde cada botón, así sabes de qué parte de la página viene la consulta.

En `testCompletado` puedes usar `{aciertos}` y `{total}`: se reemplazan solos
con el puntaje del alumno.

## Si la página se ve rara o en blanco

Aparecerá un aviso rojo arriba diciéndote qué revisar. Casi siempre es:
- una coma que falta al final de una línea
- una coma de más antes de un `}`
- una comilla sin cerrar

Pulsa F12 → pestaña "Console" para ver la línea exacta.

## Si quieres volver atrás

Todo está guardado en Git. En la carpeta, botón derecho → "Git Bash Here":

    git checkout datos.js     (deshace tus cambios en datos.js)
    git log --oneline         (ve el historial)

## Antes de publicar

- [ ] Crear `og-imagen.jpg` de 1200 × 630 px (aparece al compartir el enlace)
- [ ] Poner los enlaces reales de tus redes en `redes`
- [ ] Reemplazar los testimonios de ejemplo por alumnos reales
- [ ] Confirmar la fecha límite real de la promoción
- [ ] La carpeta `pruebas/` y `docs/` no hace falta subirlas al hosting
```

- [ ] **Step 2: Ejecutar todas las pruebas automáticas**

```bash
node --test pruebas/
```

Esperado: PASS, 0 fallos.

- [ ] **Step 3: Verificación final en el navegador**

Abrir `index.html` recién cargada y recorrer la lista completa:

1. La página se ve igual que el commit `10a1bfb` (comparar sección por sección con `git show 10a1bfb:index.html > /tmp/antes.html` y abrir ambas).
2. El número `+51 934 894 501` aparece correcto y completo en cabecera, menú móvil, hero y pie — **ningún** `+5193489450` ni `+51 93489450`.
3. Los 10 enlaces de WhatsApp abren el chat con su mensaje previo correspondiente y distinto.
4. Contador con fecha real; con fecha pasada desaparece.
5. Testimonios ocultos.
6. Test de nivel completo, repetible, y su botón envía el puntaje.
7. Formulario envía nombre, teléfono, modalidad, turno y origen.
8. Buscar en `index.html` la cadena `934894501`: **cero resultados**.
9. Buscar `Proprobada` y `PI ACADEMY` en todo el proyecto: cero resultados.
10. Consola del navegador sin errores ni advertencias (salvo el aviso normal de Tailwind CDN).

- [ ] **Step 4: Commit**

```bash
git add LEEME.md
git commit -m "Agrega la guia de edicion para el profesor"
```

---

## Verificación de este plan (autorrevisión)

**Cobertura de la especificación:**

| Requisito de la spec | Tarea |
|---|---|
| `datos.js` con los 13 bloques | 2 |
| Carga por `<script src>`, sin `fetch` ni módulos | 3 |
| `leerRuta`, `bindTexto`, `bindAtributo`, `bindLista`, `bindWhatsApp` | 1, 3 |
| Banner rojo ante error de edición | 3 |
| Los 10 mensajes de WhatsApp por contexto | 2, 3, 4, 5, 6, 7, 8 |
| Marcadores de `inscripcion` y del test | 1, 6, 8 |
| Teléfono incompleto corregido | 3 |
| Typos "Proprobada" y "postura o postura" | 2, 5 |
| Marca unificada | 2, 3 |
| Contador real y `clearInterval` | 4 |
| Testimonios ocultos y marcados | 2, 7 |
| SEO, Open Graph, favicon | 9 |
| `scroll-mt`, menú móvil, `Esc`, foco, `aria-*` | 8, 9 |
| Test repetible | 6 |
| `LEEME.md` | 10 |

**Nombres usados de forma consistente en todo el plan:** `PiNucleo.leerRuta`, `PiNucleo.aplicarPlantilla`, `PiNucleo.urlWhatsApp`, `PiNucleo.enlaceTelefono`, `PiNucleo.tiempoRestante`, `PiNucleo.dosDigitos`, `PiNucleo.validarDatos`, `PiApp.mensajeWhatsApp`, `PiApp.abrirWhatsApp`, `PiApp.modulos`, `window.abrirInscripcion`.

**Atributos HTML usados de forma consistente:** `data-dato`, `data-html`, `data-attr`, `data-wa`, `data-si`, `data-lista`, `data-campo`, `data-campo-html`, `data-campo-attr`, `data-campo-lista`, `data-campo-texto`, `data-campo-wa`, `data-indice`, `data-cerrar-modal`.
