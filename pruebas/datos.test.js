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
