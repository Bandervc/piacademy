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
