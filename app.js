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

  // --- Cuenta regresiva real ----------------------------------------------

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

  // --- Acento de color en las tarjetas de audiencia (morado / ámbar) ------

  function iniciarAcentosAudiencia() {
    document.querySelectorAll('#audiencia [data-acento="ambar"]').forEach(function (tarjeta) {
      var blur = tarjeta.querySelector('.js-acento-blur');
      var icono = tarjeta.querySelector('.js-acento-icono');
      var etiqueta = tarjeta.querySelector('.js-acento-etiqueta');
      if (blur) { blur.classList.remove('bg-purple-200/40'); blur.classList.add('bg-amber-200/40'); }
      if (icono) { icono.classList.remove('bg-brand-purple', 'text-white'); icono.classList.add('bg-brand-amber', 'text-slate-950'); }
      if (etiqueta) { etiqueta.classList.remove('text-brand-purple'); etiqueta.classList.add('text-brand-amber'); }
    });
  }

  window.PiApp.modulos.push(iniciarAcentosAudiencia);

  // --- Pestañas del temario (cursos) --------------------------------------

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
    datos.contacto.enlaceTelefono = N.enlaceTelefono(datos.contacto.whatsapp);
    bindTexto(datos, document);
    bindAtributo(datos, document);
    bindWhatsApp(datos, document);

    document.title = datos.marca.nombre + ' | Ciclo Integral PUCP & Beca 18';

    window.PiApp.modulos.forEach(function (iniciar) { iniciar(datos); });
  });
})();
