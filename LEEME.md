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
