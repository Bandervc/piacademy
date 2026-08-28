# Contexto General de la Aplicación Web: PiAcademy / ProfeManu

Este documento resume la arquitectura, el historial de cambios, los problemas resueltos, el estado actual de la plataforma y las tareas pendientes para el desarrollo continuo.

---

## 1. Información General y Enlaces de Producción

* **Repositorio GitHub:** [`Bandervc/piacademy`](https://github.com/Bandervc/piacademy) (Rama principal: `main`)
* **Sitio Web Oficial en Vercel:** [https://profemanu.vercel.app/](https://profemanu.vercel.app/)
* **Panel de Administración (CMS):** [https://profemanu.vercel.app/admin.html](https://profemanu.vercel.app/admin.html)
* **Módulo de Evaluación / Test:** [https://profemanu.vercel.app/test.html](https://profemanu.vercel.app/test.html)

---

## 2. Arquitectura Técnica del Sistema

La web está diseñada bajo una arquitectura **Serverless Jamstack ligera** sin frameworks pesados ni bases de datos tradicionales:

```
[ admin.html ] (Panel de control con PIN y GitHub Token)
       │
       ▼ (GitHub API REST: PUT /contents/datos.js)
[ GitHub Repository ] (Bandervc/piacademy)
       │
       ▼ (Webhook automático / Continuous Deployment)
[ Vercel Edge Server ] (profemanu.vercel.app)
       │
       ▼ (Descarga datos.js + nucleo.js + app.js)
[ index.html / test.html ] (Renderizado e interactividad para el alumno)
```

### Archivos Principales del Proyecto:
1. **`index.html`**: Landing page principal con Tailwind CSS (CDN), FontAwesome y estructura semántica.
2. **`admin.html`**: Panel de administración visual protegido con PIN (`2026` por defecto) y sincronización directa con GitHub.
3. **`test.html`**: Página dedicada para el test de nivel con cronómetro, renderizado KaTeX y entrega de códigos promocionales.
4. **`datos.js`**: Única fuente de verdad de la información (cursos, precios, testimonios, preguntas frecuentes, pasarelas Yape/Plin, preguntas del test, textos).
5. **`nucleo.js`**: Funciones auxiliares puras (validación de datos, formateo de números, plantillas, enlaces dinámicos a WhatsApp).
6. **`app.js`**: Motor de hidratación del DOM, bindings reactivos (`data-dato`, `data-lista`, `data-si`, `data-attr`), modales de inscripción y pago, acordeones e interacción.

---

## 3. Trabajo Realizado y Funcionalidades Implementadas

### A. Panel de Administración (`admin.html`)
- **Gestión de Preguntas Frecuentes (FAQ):** Creación, edición y eliminación de preguntas/respuestas con soporte para etiquetas HTML.
- **Gestión de Pie de Página (Footer):** Edición de nombre de marca, año de copyright, descripción y 5 enlaces de navegación personalizables.
- **Gestión de Preguntas del Test con Fórmulas LaTeX:**
  - Vista previa en tiempo real con motor **KaTeX**.
  - Editor de enunciados, 4 alternativas y selección de respuesta correcta.
- **Gestión de Turnos y Precios:** Configuración de montos normales y promocionales, horarios de clases.
- **Gestión de Pasarelas de Pago:** Configuración de números y titulares para Yape y Plin con subida de comprobantes.
- **Persistencia Directa en GitHub:** El botón "Guardar y Publicar en Vercel" serializa el archivo `datos.js` y realiza un commit/push a través de la API oficial de GitHub usando un Personal Access Token (PAT).
- **Botón de Acceso Directo:** Redirección directa hacia `https://profemanu.vercel.app/`.

### B. Módulo de Preguntas Frecuentes (`index.html` + `app.js`)
- Sección dinámica conectada a `datos.js`.
- Interacción tipo acordeón (abrir/cerrar respuesta al hacer clic, con animación de íconos `+` y `-`).

### C. Módulo de Evaluación y Test (`test.html`)
- Separación del test a una página dedicada independiente para mejorar la experiencia de usuario.
- Soporte completo para renderizado de expresiones matemáticas en **LaTeX** (fórmulas inline y de bloque) mediante **KaTeX** y `auto-render.js`.
- Temporizador con formato cronometrado.
- Asignación automática de códigos de descuento según el puntaje obtenido por el postulante.

---

## 4. Errores y Problemas Solucionados

| # | Problema Detectado | Causa Raíz | Solución Aplicada |
|---|--------------------|------------|-------------------|
| 1 | **Fórmulas LaTeX no se renderizaban en las alternativas del test** | KaTeX requiere delimitadores como `\(` o `\[` para procesar fórmulas matemáticas; el texto ingresado no los tenía. | Se creó una función de detección y auto-envoltura de sintaxis LaTeX en `admin.html` y `app.js` para asegurar el formateo automático con KaTeX. |
| 2 | **Las FAQ no abrían las respuestas al hacer clic** | Faltaba la función de interacción y binding de eventos para los botones dinámicos generados por `<template>`. | Se implementó `iniciarFaq()` en `app.js`, vinculado al ciclo de vida de los módulos de PiApp. |
| 3 | **Desincronización y múltiples proyectos en Vercel** | Existían 4 proyectos en Vercel (`profemanu`, `pi-academy`, `piacademy314`, `piacademy`) y el código apuntaba al proyecto inactivo `pi-academy-kappa`. | Se unificó todo bajo el proyecto oficial activo **`profemanu`**, se eliminaron los proyectos sobrantes y se corrigieron todos los enlaces de redirección. |
| 4 | **Error 404 al acceder a `/admin` sin extensión** | Vercel requiere `.html` por defecto en archivos estáticos. | Se configuró el acceso oficial a `https://profemanu.vercel.app/admin.html` y se limpiaron rutas. |
| 5 | **La sección principal (Hero) desapareció / Despliegues bloqueados en Vercel** | Se intentó un script de cache-busting con `document.write` y un archivo `vercel.json` que causaron un fallo de compilación en Vercel y rompieron el árbol DOM. | Se removió `vercel.json`, se restauró la carga limpia y estándar de scripts en `index.html` y `test.html`, logrando un despliegue exitoso. |
| 6 | **Conflictos de concurrencia en Git al hacer push** | Guardar desde el panel web mientras se realizaban commits locales provocaba rechazos de `git push`. | Se implementó sincronización con `git pull --rebase` previo a cada despliegue local. |

---

## 5. Estado Actual del Proyecto

* **Producción:** 100% operativo y en línea en **`https://profemanu.vercel.app/`**.
* **Panel de Control:** 100% funcional en **`https://profemanu.vercel.app/admin.html`**.
* **Formularios y Modales:** Modal de inscripción (Paso 1) y Modal de pago Yape/Plin (Paso 2) operativos con vinculación a WhatsApp.
* **Preguntas Frecuentes:** Funcionando con apertura y cierre interactivo.
* **Footer:** Todos los textos y enlaces personalizables sincronizados con `datos.js`.
* **Seguridad:** PIN de acceso y almacenamiento local seguro del GitHub Token.

---

## 6. Tareas Pendientes y Mejoras Futuras Recomendadas

### ✅ Completadas (verificadas en vivo, posteriores a la primera versión de este documento):
1. **Control de Inicio del Test (`test.html`):** ✅ HECHO
   - Existe la pantalla de inicio con el botón **"INICIAR TEST"** (`#btnIniciarTest`). El cronómetro permanece en `00:00:00` y **solo arranca al hacer clic**; no se inicia automáticamente al cargar la página (`test.html`, listener de `btnIniciarTest`).
2. **Formato del Temporizador del Test:** ✅ HECHO
   - La función `formatHHMMSS()` (`test.html`) muestra el tiempo estrictamente como `hh:mm:ss` (verificado: `00:20:00` → `00:19:58`), tanto en la pantalla de inicio como en el badge del cronómetro.
3. **Conversión de Tiempo en el Administrador:** ✅ HECHO
   - En `admin.html` el campo "Tiempo Límite del Test (en minutos)" carga dividiendo entre 60 (`tiempoSegundos / 60`, línea ~889) y guarda multiplicando por 60 (`× 60`, línea ~1333). Verificado: 1200 s ⇄ 20 min, 30 min → 1800 s.

> Nota: estas tres correcciones están en los archivos de código (`test.html`, `admin.html`). El panel de administración solo publica `datos.js`, así que para que aparezcan en `profemanu.vercel.app` el código debe haberse subido a GitHub por separado (verificar en producción).

### Prioridad Media / Mejoras de UX (pendientes):
4. **Optimización de Caché en Navegadores Móviles:**
   - Añadir meta tags de control de caché HTTP para que los dispositivos móviles no retengan `datos.js` antiguo tras guardar en el panel.
5. **Validación de Subida de Imágenes QR:**
   - Permitir subir y previsualizar imágenes QR directamente desde el panel de administración a GitHub de forma visual.
6. **Manejo de Errores en la API de GitHub:**
   - Añadir mensajes de alerta detallados si el token ingresado expira o no tiene permisos de escritura en el repositorio.

---

*Documento generado el 27 de Agosto de 2026 para el equipo de desarrollo de PiAcademy.*
*Actualización: las 3 tareas de Prioridad Alta del test se marcaron como completadas tras verificarlas en vivo.*
