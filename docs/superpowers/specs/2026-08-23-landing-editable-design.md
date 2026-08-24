# Landing PiAcademy — Contenido editable y WhatsApp orientado a venta

**Fecha:** 2026-08-23
**Estado:** Aprobado por el usuario

## Objetivo

Convertir `index.html` (1201 líneas, todo el contenido escrito a mano dentro del
HTML) en una landing donde el profesor edite **un solo archivo de datos** para
cambiar precios, fechas, teléfono, cursos, testimonios y preguntas frecuentes,
sin tocar HTML ni CSS.

Objetivo secundario: que cada enlace a WhatsApp llegue con un mensaje previo
escrito, para que la consulta empiece con contexto y sea más fácil de convertir
en venta.

## Restricciones

- **Debe funcionar con doble clic** (protocolo `file://`), sin servidor ni
  instalación. Esto descarta `fetch()` de un JSON: los datos se cargan con
  `<script src="datos.js">`, que sí funciona localmente.
- **Sin build step, sin dependencias nuevas.** Se mantiene Tailwind por CDN.
- **El diseño visual no cambia.** Mismos colores (morado `#5B21B6` / ámbar
  `#F59E0B`), misma tipografía (Poppins), mismas secciones y mismo orden.
- El usuario no es programador: los errores de edición deben ser visibles y
  explicados, nunca una página en blanco.

## Arquitectura

Cuatro archivos con una responsabilidad clara cada uno:

| Archivo | Responsabilidad | Lo edita el profesor |
|---|---|---|
| `datos.js` | Todo el contenido. Define `window.DATOS`. | **Sí — solo este** |
| `index.html` | Estructura y diseño. Sin textos de negocio. | No (salvo bloque SEO marcado) |
| `app.js` | Motor de render + comportamientos interactivos. | Nunca |
| `LEEME.md` | Guía de edición en español. | Solo lectura |

Orden de carga en `index.html`: `datos.js` antes que `app.js`; ambos al final
del `<body>`.

### Flujo de datos

```
datos.js  ──define──>  window.DATOS
                            │
                            v
index.html (plantillas)  app.js (motor)  ──escribe──>  DOM visible
   [data-dato]              bindTexto()
   [data-lista]             bindLista()
   [data-wa]                bindWhatsApp()
```

### Motor de render (`app.js`)

Cinco funciones pequeñas e independientes, cada una con una responsabilidad:

1. **`leerRuta(objeto, "contacto.whatsapp")`** — resuelve una ruta con puntos y
   devuelve el valor, o `undefined` si no existe.
2. **`bindTexto()`** — recorre `[data-dato="ruta"]` y escribe el valor.
   Variante `[data-html="ruta"]` para textos que llevan `<strong>`.
3. **`bindAtributo()`** — `[data-attr="href:contacto.telefonoLink"]` para
   enlaces, `src`, `alt`, etc.
4. **`bindLista()`** — `[data-lista="testimonios"]` que contiene un `<template>`.
   Clona la plantilla por cada elemento del array y rellena sus `[data-campo]`.
   Si el array está vacío o la sección está apagada, elimina el bloque completo.
5. **`bindWhatsApp()`** — `[data-wa="mensajes.interesPUCP"]` construye
   `https://wa.me/{contacto.whatsapp}?text={mensaje codificado}`. Es la **única**
   parte del código que arma URLs de WhatsApp.

Los comportamientos existentes (pestañas de cursos, acordeón FAQ, test
diagnóstico, modal, menú móvil, contador) se mueven a `app.js` y leen su
contenido de `DATOS`.

### Manejo de errores de edición

Si el profesor rompe la sintaxis de `datos.js` (coma de más, comilla sin
cerrar), el `<script>` falla y `window.DATOS` queda indefinido. `app.js`
detecta ese caso y muestra un banner rojo fijo en la parte superior:

> ⚠️ Hay un error en `datos.js`. Revisa que no falte una coma o una comilla.
> Abre la consola del navegador (F12) para ver la línea exacta.

Además valida los campos obligatorios (`contacto.whatsapp`, `precio.promocional`)
y avisa en el mismo banner si falta alguno. La página nunca queda en blanco.

## Contenido de `datos.js`

Bloques, en este orden, todos con comentarios en español:

1. **`marca`** — nombre y lema que se muestran en cabecera, pie y textos de la
   página. No controla las etiquetas SEO del `<head>`: esas son estáticas
   porque los rastreadores de WhatsApp y Facebook no ejecutan JavaScript, y
   viven en un bloque comentado de `index.html` marcado como el único punto
   editable de ese archivo.
2. **`contacto`** — `whatsapp` (con código de país, sin `+` ni espacios),
   `telefonoVisible`, `correo`.
3. **`mensajes`** — un mensaje de WhatsApp por contexto (ver sección siguiente).
4. **`promocion`** — `mostrarContador`, `fechaLimite` (ISO, ej.
   `"2026-09-15T23:59"`), `mensajeVencido`.
5. **`precio`** — `normal`, `promocional`, `nota`.
6. **`horarios`** — turnos disponibles (nombre + rango).
7. **`audiencia`** — las dos tarjetas PUCP / Beca 18 con sus viñetas.
8. **`beneficios`** — array de 6 tarjetas (icono, título, texto).
9. **`cursos`** — array de las 4 pestañas del temario, con temas y nota destacada.
10. **`test`** — preguntas del diagnóstico: enunciado, alternativas, índice de la
    correcta. Editable y ampliable a más de 3 preguntas.
11. **`testimonios`** — `{ mostrar: false, items: [...] }`. Arrancan apagados y
    marcados `// EJEMPLO – REEMPLAZAR`.
12. **`faq`** — array de pregunta/respuesta. Añadir una es agregar un objeto.
13. **`redes`** — enlaces de Facebook, YouTube, TikTok, Instagram. Los que se
    dejen vacíos (`""`) no se muestran.

### Mensajes de WhatsApp

Cada botón de WhatsApp lleva su propio mensaje previo, escrito en primera
persona (es el visitante quien lo envía) y terminado en una pregunta concreta:

| Clave | Dónde aparece |
|---|---|
| `bannerSuperior` | Banner de vacantes, arriba de todo |
| `heroConsulta` | Botón verde "Consultar por WhatsApp" del hero |
| `interesPUCP` | Tarjeta "Postulantes PUCP" |
| `interesBeca18` | Tarjeta "Beca 18 (PRONABEC)" |
| `planPrecio` | Tarjeta de precio |
| `mediosDePago` | Enlace "¿Preguntas sobre Yape, Plin...?" |
| `testCompletado` | Resultado del test — incluye `{aciertos}` y `{total}` |
| `botonFlotante` | Botón verde flotante |
| `footer` | Ícono de WhatsApp del pie |
| `inscripcion` | Plantilla del formulario del modal |

`inscripcion` es una plantilla con marcadores que `app.js` reemplaza:
`{nombre}`, `{telefono}`, `{modalidad}`, `{turno}`, `{origen}`. Así el profesor
recibe la consulta ya calificada: quién es, qué examen rinde, qué turno quiere y
desde qué botón de la página escribió.

Los marcadores que no se reemplacen se eliminan del mensaje, para que nunca
llegue un `{nombre}` literal al chat.

## Correcciones incluidas

**Datos incorrectos**
- El menú móvil enlaza a `tel:+5193489450` — le falta un dígito. El hero muestra
  `+51 93489450`, también incorrecto. Al centralizar el número en `datos.js` el
  error desaparece por construcción.
- Typo: "Metodología Prop**ro**bada" → "Metodología Comprobada".
- Typo: "la postura o postura central" → "la postura o posición central".
- Marca alternando entre "PiAcademy" y "PI ACADEMY" → siempre "PiAcademy".

**Contador regresivo**
- Hoy arranca en 3 días 14 h en cada recarga: quien vuelva mañana ve lo mismo.
- Pasa a contar hacia `promocion.fechaLimite`. Al llegar a cero se oculta el
  bloque, se muestra `mensajeVencido` y se detiene el `setInterval` (hoy sigue
  corriendo indefinidamente).

**Testimonios**
- Los tres actuales son inventados. Se mueven a `datos.js` marcados como
  ejemplo, con `mostrar: false`. La sección no se renderiza hasta que el
  profesor ponga alumnos reales y active la bandera.

**Compartir y SEO**
- Faltan `<meta name="description">`, Open Graph y Twitter Card: al compartir el
  enlace por WhatsApp o Facebook aparece sin imagen ni descripción. Se agregan
  como etiquetas estáticas en el `<head>` (los rastreadores no ejecutan JS), en
  un bloque comentado y claramente marcado.
- Se agrega favicon: la letra π en SVG embebido como `data:` URI, sin archivo
  adicional.

**Accesibilidad y detalles de uso**
- El menú móvil no se cierra al tocar un enlace.
- Los enlaces de ancla dejan el título tapado por la cabecera fija de 80 px
  (`scroll-mt` en cada `<section>`).
- El modal no cierra con `Esc` ni al hacer clic fuera; no devuelve el foco al
  botón que lo abrió.
- Botones de solo ícono sin `aria-label`; acordeón FAQ sin `aria-expanded`.
- El test no se puede repetir una vez terminado.

## Fuera de alcance

- Rediseño visual, reordenamiento de secciones o reescritura de textos de venta
  (el usuario eligió "mismo diseño + arreglos").
- Panel de administración visual.
- Formulario que envíe a un servidor o base de datos: la conversión sigue
  ocurriendo por WhatsApp.
- Analítica, píxel de Facebook o seguimiento de campañas.

## Verificación

Al terminar, se comprueba abriendo `index.html` con doble clic:

1. La página se ve igual que antes (comparación visual sección por sección).
2. Cambiar `contacto.whatsapp` en `datos.js` actualiza los 10 enlaces y los dos
   enlaces `tel:`.
3. Cada botón de WhatsApp abre el chat con su mensaje previo correspondiente.
4. El formulario del modal genera el mensaje con nombre, teléfono, modalidad,
   turno y origen.
5. El contador cuenta hacia la fecha configurada; con una fecha pasada, el
   bloque desaparece y no quedan temporizadores corriendo.
6. `testimonios.mostrar: false` oculta la sección completa.
7. Introducir un error de sintaxis en `datos.js` muestra el banner rojo en lugar
   de una página en blanco.
8. Sin errores en la consola del navegador.

## Pendientes del profesor

No bloquean la implementación, pero la página queda incompleta sin ellos:

1. Imagen de 1200 × 630 px para la vista previa al compartir el enlace.
2. Enlaces reales de Facebook, YouTube, TikTok e Instagram (hoy apuntan a los
   dominios genéricos).
3. Testimonios de alumnos reales, con su autorización.
4. Confirmar la fecha límite real de la promoción.
