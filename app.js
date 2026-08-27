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

  // --- Test de nivel (preguntas generadas desde datos.js) -----------------

  function iniciarTest(datos) {
    var contenedor = document.getElementById('preguntaTest');
    var quizStart   = document.getElementById('quizStart');
    var quizArea    = document.getElementById('quizArea');
    var quizResult  = document.getElementById('quizResult');
    var feedback    = document.getElementById('quizFeedback');
    var btnSiguiente = document.getElementById('btnSiguiente');
    var btnIniciar  = document.getElementById('btnIniciarTest');
    if (!contenedor) return;

    var letras = ['A', 'B', 'C', 'D', 'E', 'F'];
    var preguntas = datos.test && datos.test.preguntas ? datos.test.preguntas : [];
    var total = preguntas.length;
    var paso = 0;
    var aciertos = 0;
    var yaRespondida = false;

    var progreso = document.getElementById('quizStepText');
    var quizTimerBadge = document.getElementById('quizTimerBadge');
    var quizTimerSeconds = document.getElementById('quizTimerSeconds');
    var quizTimerBar = document.getElementById('quizTimerBar');
    var quizTimerProgress = document.getElementById('quizTimerProgress');
    var quizRewardCard = document.getElementById('quizRewardCard');
    var quizRewardMsg = document.getElementById('quizRewardMsg');
    var quizRewardCode = document.getElementById('quizRewardCode');
    var btnCanjearPremio = document.getElementById('btnCanjearPremio');
    var botonAsesoria = document.getElementById('btnAsesoriaTest');
    var resultado = quizResult;

    var tiempoLimite = datos.test && datos.test.tiempoSegundos ? datos.test.tiempoSegundos : 0;
    var tiempoRestante = tiempoLimite;
    var timerInterval = null;

    function iniciarTemporizador() {
      if (!tiempoLimite || tiempoLimite <= 0) {
        if (quizTimerBadge) quizTimerBadge.classList.add('hidden');
        if (quizTimerBar) quizTimerBar.classList.add('hidden');
        return;
      }
      tiempoRestante = tiempoLimite;
      if (quizTimerBadge) { quizTimerBadge.classList.remove('hidden'); quizTimerSeconds.textContent = tiempoRestante; }
      if (quizTimerBar) quizTimerBar.classList.remove('hidden');
      if (quizTimerProgress) quizTimerProgress.style.width = '100%';
      if (timerInterval) clearInterval(timerInterval);
      timerInterval = setInterval(function () {
        tiempoRestante--;
        if (quizTimerSeconds) quizTimerSeconds.textContent = tiempoRestante;
        if (quizTimerProgress) quizTimerProgress.style.width = Math.max(0, (tiempoRestante / tiempoLimite) * 100) + '%';
        if (tiempoRestante <= 0) { clearInterval(timerInterval); terminar(true); }
      }, 1000);
    }

    function renderLatex(elemento) {
      if (!elemento) return;
      function ejecutar() {
        if (window.renderMathInElement) {
          window.renderMathInElement(elemento, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '\\[', right: '\\]', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
            ],
            throwOnError: false,
          });
        }
      }
      if (window.renderMathInElement) { ejecutar(); } else { setTimeout(ejecutar, 300); setTimeout(ejecutar, 800); }
    }

    function pintarPregunta() {
      yaRespondida = false;
      var pregunta = preguntas[paso];
      if (progreso) progreso.textContent = 'Pregunta ' + (paso + 1) + ' de ' + total;
      contenedor.innerHTML = '';
      if (feedback) { feedback.classList.add('hidden'); feedback.innerHTML = ''; }
      if (btnSiguiente) btnSiguiente.classList.add('hidden');

      var titulo = document.createElement('h3');
      titulo.className = 'text-base sm:text-lg font-bold text-white mb-4 leading-relaxed';
      titulo.innerHTML = (paso + 1) + '. ' + pregunta.enunciado;
      contenedor.appendChild(titulo);

      var lista = document.createElement('div');
      lista.className = 'space-y-3';

      pregunta.alternativas.forEach(function (texto, indice) {
        var boton = document.createElement('button');
        boton.type = 'button';
        boton.id = 'alt-btn-' + indice;
        boton.className = 'w-full text-left bg-slate-800 hover:bg-purple-900/40 p-3.5 rounded-xl border border-slate-700 transition-colors text-sm font-medium';
        boton.innerHTML = '<strong class="text-amber-400 mr-1">' + letras[indice] + ')</strong> ' + texto;
        boton.addEventListener('click', function () { responder(indice, pregunta.correcta); });
        lista.appendChild(boton);
      });

      contenedor.appendChild(lista);
      renderLatex(contenedor);
    }

    function responder(indiceElegido, indiceCorrecta) {
      if (yaRespondida) return;
      yaRespondida = true;
      var esCorrecta = indiceElegido === indiceCorrecta;
      if (esCorrecta) aciertos++;

      preguntas[paso].alternativas.forEach(function (_, i) {
        var btn = document.getElementById('alt-btn-' + i);
        if (!btn) return;
        btn.disabled = true;
        if (i === indiceCorrecta) {
          btn.className = 'w-full text-left bg-emerald-900/60 border border-emerald-500 p-3.5 rounded-xl text-sm font-bold text-emerald-300';
        } else if (i === indiceElegido) {
          btn.className = 'w-full text-left bg-red-900/60 border border-red-500 p-3.5 rounded-xl text-sm font-bold text-red-300';
        } else {
          btn.className = 'w-full text-left bg-slate-800/60 border border-slate-700 p-3.5 rounded-xl text-sm font-medium text-slate-500';
        }
      });

      if (feedback) {
        feedback.classList.remove('hidden', 'bg-emerald-900/40', 'border-emerald-500', 'text-emerald-300', 'bg-red-900/40', 'border-red-500', 'text-red-300');
        if (esCorrecta) {
          feedback.classList.add('bg-emerald-900/40', 'border-emerald-500', 'text-emerald-300');
          feedback.innerHTML = '<i class="fa-solid fa-circle-check mr-2"></i> ¡Correcto!';
        } else {
          var txtCorrecta = preguntas[paso].alternativas[indiceCorrecta];
          feedback.classList.add('bg-red-900/40', 'border-red-500', 'text-red-300');
          feedback.innerHTML = '<i class="fa-solid fa-circle-xmark mr-2"></i> Incorrecto. La respuesta correcta es: <span class="font-black">' + letras[indiceCorrecta] + ') ' + txtCorrecta + '</span>';
          renderLatex(feedback);
        }
      }

      paso++;
      if (paso < total) {
        if (btnSiguiente) {
          var esUltima = paso === total - 1;
          btnSiguiente.innerHTML = esUltima
            ? '<span>Ver Resultado Final</span><i class="fa-solid fa-flag-checkered ml-2"></i>'
            : '<span>Siguiente Pregunta</span><i class="fa-solid fa-arrow-right ml-2"></i>';
          btnSiguiente.classList.remove('hidden');
        }
      } else {
        if (btnSiguiente) {
          btnSiguiente.innerHTML = '<span>Ver Resultado Final</span><i class="fa-solid fa-flag-checkered ml-2"></i>';
          btnSiguiente.classList.remove('hidden');
        }
      }
    }

    function terminar(porTiempo) {
      if (timerInterval) clearInterval(timerInterval);
      if (quizArea) quizArea.classList.add('hidden');
      if (progreso) progreso.textContent = porTiempo ? '¡Tiempo agotado!' : 'Resultado final';
      document.getElementById('correctCount').textContent = aciertos;
      document.getElementById('totalCount').textContent = total;

      var premios = (datos.test && datos.test.premios) ? datos.test.premios : [];
      var premioGanado = null;
      for (var i = 0; i < premios.length; i++) {
        var p = premios[i];
        if (aciertos >= p.minAciertos && aciertos <= p.maxAciertos) { premioGanado = p; break; }
      }

      if (premioGanado && quizRewardCard) {
        quizRewardCard.classList.remove('hidden');
        if (quizRewardMsg) quizRewardMsg.textContent = premioGanado.mensaje;
        if (quizRewardCode) quizRewardCode.textContent = premioGanado.codigo;
        if (btnCanjearPremio) {
          btnCanjearPremio.onclick = function () {
            if (window.abrirInscripcion) window.abrirInscripcion('Test de Nivel');
            var inputCod = document.getElementById('discountCode');
            var btnApply = document.getElementById('btnApplyCode');
            if (inputCod && btnApply) { inputCod.value = premioGanado.codigo; btnApply.click(); }
          };
        }
      } else if (quizRewardCard) {
        quizRewardCard.classList.add('hidden');
      }

      if (botonAsesoria) {
        botonAsesoria.setAttribute('href', N.urlWhatsApp(
          datos.contacto.whatsapp,
          window.PiApp.mensajeWhatsApp('testCompletado', { aciertos: aciertos, total: total })
        ));
      }
      if (resultado) resultado.classList.remove('hidden');
    }

    function reiniciar() {
      paso = 0;
      aciertos = 0;
      yaRespondida = false;
      if (resultado) resultado.classList.add('hidden');
      if (quizRewardCard) quizRewardCard.classList.add('hidden');
      if (quizArea) quizArea.classList.remove('hidden');
      iniciarTemporizador();
      pintarPregunta();
    }

    if (btnIniciar) {
      btnIniciar.addEventListener('click', function () {
        if (quizStart) quizStart.classList.add('hidden');
        if (quizArea) quizArea.classList.remove('hidden');
        iniciarTemporizador();
        pintarPregunta();
      });
    }

    if (btnSiguiente) {
      btnSiguiente.addEventListener('click', function () {
        if (paso < total) {
          pintarPregunta();
        } else {
          terminar(false);
        }
      });
    }

    var btnRepetir = document.getElementById('btnRepetirTest');
    if (btnRepetir) {
      btnRepetir.addEventListener('click', function () { reiniciar(); });
    }
  }

  window.PiApp.modulos.push(iniciarTest);

  // --- Encabezados y títulos personalizados desde datos.textos ---

  function aplicarTextos(datos) {
    var tx = datos.textos || {};
    function reemplazarTexto(selector, valor) {
      if (!valor) return;
      var el = document.querySelector(selector);
      if (el) el.textContent = valor;
    }
    // La píldora del hero (el badge de arriba del h1)
    if (tx.heroPildora) {
      document.querySelectorAll('.animate-ping').forEach(function (ping) {
        var padre = ping.parentElement;
        if (padre) {
          var nodoTexto = padre.childNodes[padre.childNodes.length - 1];
          if (nodoTexto && nodoTexto.nodeType === 3) nodoTexto.textContent = ' ' + tx.heroPildora;
        }
      });
    }
    // Título del hero (h1)
    if (tx.heroTitulo) {
      var h1 = document.querySelector('section h1');
      if (h1) h1.innerHTML = tx.heroTitulo;
    }
    // Subtítulo del hero
    if (tx.heroSubtitulo) {
      var heroP = document.querySelector('section h1 + p');
      if (heroP) heroP.textContent = tx.heroSubtitulo;
    }
    // Título de Beneficios
    if (tx.beneficiosTitulo) reemplazarTexto('#beneficios h2', tx.beneficiosTitulo);
    // Título de Audiencia
    if (tx.audienciaTitulo) reemplazarTexto('#audiencia h2', tx.audienciaTitulo);
    // Título de Cursos
    if (tx.cursosTitulo) reemplazarTexto('#temario h2', tx.cursosTitulo);
    // Título de Inversión
    if (tx.inversionTitulo) reemplazarTexto('#inversion h2', tx.inversionTitulo);
  }

  window.PiApp.modulos.push(aplicarTextos);


  // --- Acordeón de preguntas frecuentes (FAQ generadas desde datos.js) ----

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

  // --- Códigos de descuento --------------------------------------------------

  var estadoPago = {
    nombre: '',
    telefono: '',
    modalidad: '',
    turno: '',
    origen: '',
    codigoAplicado: '',
    descuento: 0,
    montoFinal: 0,
    metodoSeleccionado: 'yape',
  };

  function iniciarCodigosDescuento(datos) {
    var btnAplicar = document.getElementById('btnApplyCode');
    var inputCodigo = document.getElementById('discountCode');
    var feedback = document.getElementById('discountFeedback');
    var precioFinal = document.getElementById('enrollFinalPrice');
    var badge = document.getElementById('enrollDiscountBadge');
    var badgeTexto = document.getElementById('enrollDiscountText');
    if (!btnAplicar || !inputCodigo) return;

    var precioBase = datos.precio.promocional;
    precioFinal.textContent = precioBase;
    estadoPago.montoFinal = precioBase;

    function mostrarFeedback(mensaje, esExito) {
      feedback.classList.remove('hidden', 'bg-emerald-100', 'text-emerald-700', 'bg-red-100', 'text-red-700');
      if (esExito) {
        feedback.classList.add('bg-emerald-100', 'text-emerald-700');
        feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> ' + mensaje;
      } else {
        feedback.classList.add('bg-red-100', 'text-red-700');
        feedback.innerHTML = '<i class="fa-solid fa-circle-xmark"></i> ' + mensaje;
      }
    }

    btnAplicar.addEventListener('click', function () {
      var texto = inputCodigo.value.trim().toUpperCase();
      if (!texto) {
        mostrarFeedback('Escribe un código primero.', false);
        return;
      }

      var codigos = datos.codigos || [];
      var encontrado = null;
      for (var i = 0; i < codigos.length; i++) {
        if (codigos[i].codigo.toUpperCase() === texto) { encontrado = codigos[i]; break; }
      }

      if (!encontrado) {
        mostrarFeedback('Código "' + texto + '" no válido. Verifica e intenta de nuevo.', false);
        estadoPago.codigoAplicado = '';
        estadoPago.descuento = 0;
        estadoPago.montoFinal = precioBase;
        precioFinal.textContent = precioBase;
        badge.classList.add('hidden');
        document.getElementById('appliedCode').value = '';
        document.getElementById('appliedDiscount').value = '0';
        return;
      }

      if (encontrado.vence) {
        var hoy = new Date();
        var vence = new Date(encontrado.vence + 'T23:59:59');
        if (hoy > vence) {
          mostrarFeedback('El código "' + texto + '" ya expiró. Solicita uno nuevo en nuestros lives.', false);
          estadoPago.codigoAplicado = '';
          estadoPago.descuento = 0;
          estadoPago.montoFinal = precioBase;
          precioFinal.textContent = precioBase;
          badge.classList.add('hidden');
          document.getElementById('appliedCode').value = '';
          document.getElementById('appliedDiscount').value = '0';
          return;
        }
      }

      var nuevoMonto = Math.max(0, precioBase - encontrado.descuento);
      estadoPago.codigoAplicado = texto;
      estadoPago.descuento = encontrado.descuento;
      estadoPago.montoFinal = nuevoMonto;
      precioFinal.textContent = nuevoMonto;
      document.getElementById('appliedCode').value = texto;
      document.getElementById('appliedDiscount').value = String(encontrado.descuento);

      mostrarFeedback('¡Código aplicado! ' + encontrado.descripcion + ' — Ahorras S/' + encontrado.descuento, true);
      badge.classList.remove('hidden');
      badgeTexto.textContent = encontrado.descripcion + ' (código ' + texto + ')';
    });

    // Permitir Enter en el campo de código
    inputCodigo.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); btnAplicar.click(); }
    });
  }

  window.PiApp.modulos.push(iniciarCodigosDescuento);

  // --- Modal de inscripción (modificado: ahora va al paso de pago) ----------

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

      // Guardar datos del alumno para el paso de pago
      estadoPago.nombre = document.getElementById('studentName').value.trim();
      estadoPago.telefono = document.getElementById('studentPhone').value.trim();
      estadoPago.modalidad = document.getElementById('studentTarget').value;
      estadoPago.turno = turno ? turno.value : '';
      estadoPago.origen = document.getElementById('modalOrigin').value;

      // Si no se aplicó precio explícitamente, usar el precio promocional
      if (!estadoPago.montoFinal) {
        estadoPago.montoFinal = datos.precio.promocional;
      }

      // Cerrar modal de inscripción y abrir modal de pago
      cerrar();
      abrirModalPago(datos);
    });

    // Configurar turnos disponibles / cupos llenos
    var turnos = datos.horarios || [];
    var primerHabilitado = null;
    formulario.querySelectorAll('input[name="turno"]').forEach(function (radio, idx) {
      var item = turnos[idx];
      if (item && item.disponible === false) {
        radio.disabled = true;
        var parentLabel = radio.closest('label');
        if (parentLabel) {
          parentLabel.classList.add('opacity-50', 'bg-slate-100', 'cursor-not-allowed');
          parentLabel.classList.remove('hover:bg-purple-50', 'cursor-pointer');
          if (!parentLabel.querySelector('.js-cupo-lleno')) {
            var badge = document.createElement('span');
            badge.className = 'js-cupo-lleno ml-auto text-[10px] font-black uppercase text-rose-600 bg-rose-100 px-1.5 py-0.5 rounded shrink-0';
            badge.textContent = 'Cupos Llenos';
            parentLabel.appendChild(badge);
          }
        }
      } else if (!primerHabilitado && radio && !radio.disabled) {
        primerHabilitado = radio;
      }
    });

    if (primerHabilitado) primerHabilitado.checked = true;

    window.abrirInscripcion = abrir;
  }

  window.PiApp.modulos.push(iniciarModal);

  // --- Modal de pago (Yape / Plin) ------------------------------------------

  function abrirModalPago(datos) {
    var modal = document.getElementById('paymentModal');
    if (!modal) return;

    // Actualizar monto
    document.getElementById('paymentAmount').textContent = estadoPago.montoFinal;
    document.getElementById('stepAmount').textContent = estadoPago.montoFinal;

    // Mostrar badge de descuento si aplica
    var badgePago = document.getElementById('paymentDiscountBadge');
    var badgePagoTexto = document.getElementById('paymentDiscountText');
    if (estadoPago.codigoAplicado) {
      badgePago.classList.remove('hidden');
      badgePagoTexto.textContent = 'Código ' + estadoPago.codigoAplicado + ' aplicado (-S/' + estadoPago.descuento + ')';
    } else {
      badgePago.classList.add('hidden');
    }

    // Activar tab Yape por defecto
    activarTab('yape', datos);

    // Construir link de WhatsApp para el voucher
    actualizarLinkVoucher(datos);

    modal.classList.remove('hidden');
  }

  function activarTab(tab, datos) {
    estadoPago.metodoSeleccionado = tab;
    var pago = datos.pago[tab];

    // Actualizar tabs
    document.querySelectorAll('.pay-tab').forEach(function (btn) {
      btn.dataset.active = btn.dataset.tab === tab ? 'true' : 'false';
    });

    // Actualizar contenido
    var nombreMetodo = tab === 'yape' ? 'Yape' : 'Plin';
    document.getElementById('payMethodLabel').textContent = 'Número ' + nombreMetodo + ':';
    document.getElementById('payPhoneNumber').textContent = pago.numeroVisible;
    document.getElementById('payTitular').textContent = pago.titular;
    document.getElementById('stepAppName').textContent = nombreMetodo;

    // QR
    var qrContainer = document.getElementById('payQrContainer');
    var qrImage = document.getElementById('payQrImage');
    if (pago.qrImagen) {
      qrImage.src = pago.qrImagen;
      qrImage.alt = 'QR ' + nombreMetodo;
      qrContainer.classList.remove('hidden');
    } else {
      qrContainer.classList.add('hidden');
    }

    // Ocultar feedback de copiado
    document.getElementById('copyFeedback').classList.add('hidden');

    // Actualizar link de voucher
    actualizarLinkVoucher(datos);
  }

  function actualizarLinkVoucher(datos) {
    var metodoNombre = estadoPago.metodoSeleccionado === 'yape' ? 'Yape' : 'Plin';
    var btnVoucher = document.getElementById('btnSendVoucher');
    var mensaje = window.PiApp.mensajeWhatsApp('confirmacionPago', {
      metodo: metodoNombre,
      nombre: estadoPago.nombre,
      telefono: estadoPago.telefono,
      modalidad: estadoPago.modalidad,
      turno: estadoPago.turno,
      monto: String(estadoPago.montoFinal),
      codigo: estadoPago.codigoAplicado || 'Ninguno',
    });
    btnVoucher.setAttribute('href', N.urlWhatsApp(datos.contacto.whatsapp, mensaje));
  }

  function iniciarModalPago(datos) {
    var modal = document.getElementById('paymentModal');
    if (!modal) return;

    // Cerrar modal
    document.getElementById('paymentModalClose').addEventListener('click', function () {
      modal.classList.add('hidden');
    });

    modal.addEventListener('click', function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) modal.classList.add('hidden');
    });

    // Botón volver
    document.getElementById('paymentModalBack').addEventListener('click', function () {
      modal.classList.add('hidden');
      // Reabrir modal de inscripción
      var enrollModal = document.getElementById('enrollModal');
      if (enrollModal) enrollModal.classList.remove('hidden');
    });

    // Tabs Yape / Plin
    document.querySelectorAll('.pay-tab').forEach(function (btn) {
      btn.addEventListener('click', function () {
        activarTab(btn.dataset.tab, datos);
      });
    });

    // Copiar número
    var btnCopy = document.getElementById('btnCopyNumber');
    var copyFeedback = document.getElementById('copyFeedback');
    var copyIcon = document.getElementById('copyIcon');
    var copyTextEl = document.getElementById('copyText');
    var feedbackTimer = null;

    btnCopy.addEventListener('click', function () {
      var pago = datos.pago[estadoPago.metodoSeleccionado];
      var numero = pago.numero;

      function mostrarCopiado() {
        copyFeedback.classList.remove('hidden');
        copyIcon.className = 'fa-solid fa-circle-check text-lg';
        if (copyTextEl) copyTextEl.textContent = '¡Copiado!';

        if (feedbackTimer) clearTimeout(feedbackTimer);
        feedbackTimer = setTimeout(function () {
          copyFeedback.classList.add('hidden');
          copyIcon.className = 'fa-regular fa-copy text-lg';
          if (copyTextEl) copyTextEl.textContent = 'Copiar';
        }, 3000);
      }

      // Intentar usar clipboard API moderna
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(numero).then(mostrarCopiado).catch(function () {
          // Fallback para navegadores sin soporte
          copiarFallback(numero);
          mostrarCopiado();
        });
      } else {
        copiarFallback(numero);
        mostrarCopiado();
      }
    });
  }

  // Fallback para copiar al portapapeles en navegadores antiguos
  function copiarFallback(texto) {
    var ta = document.createElement('textarea');
    ta.value = texto;
    ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* silenciar */ }
    document.body.removeChild(ta);
  }

  window.PiApp.modulos.push(iniciarModalPago);

  // --- Menú móvil (abre/cierra y se cierra al tocar un enlace) -----------

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
    var ahorro = document.getElementById('ahorro');
    if (ahorro) ahorro.textContent = datos.precio.normal - datos.precio.promocional;
    bindAtributo(datos, document);
    bindWhatsApp(datos, document);

    document.title = datos.marca.nombre + ' | Ciclo Integral PUCP & Beca 18';

    window.PiApp.modulos.forEach(function (iniciar) { iniciar(datos); });
  });
})();
