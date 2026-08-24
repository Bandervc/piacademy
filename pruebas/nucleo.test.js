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
