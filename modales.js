/* ============================================================
   modales.js — Modales de inscripción y pago (Paso 1 y Paso 2).

   Este markup vive AQUÍ y en ningún otro lado. Antes estaba copiado
   dentro de index.html y de test.html, y las dos copias terminaron
   desincronizadas: se corregía el formulario en una página y en la
   otra seguía el diseño viejo.

   Cómo se usa: la página lleva <div id="modales"></div> y este script
   ANTES de app.js. Se inserta de forma síncrona, así app.js ya
   encuentra #enrollModal y #paymentModal cuando arranca.

   Para cambiar el formulario o el modal de pago, edita SOLO este
   archivo: el cambio aparece en la web y en el test a la vez.
   ============================================================ */
(function () {
  'use strict';

  var contenedor = document.getElementById('modales');
  if (!contenedor) {
    console.error('modales.js: falta <div id="modales"></div> en la pagina.');
    return;
  }

  contenedor.innerHTML = `
    <!-- Enrollment / Inscription Modal Popup (Paso 1) -->
    <div id="enrollModal" class="fixed inset-0 z-50 hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[95vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="tituloModal">
            <!-- Close Button -->
            <button data-cerrar-modal class="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-2xl font-bold p-1 z-10">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <div class="text-center mb-6">
                <div class="w-12 h-12 bg-purple-100 text-brand-purple rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 font-bold">
                    <i class="fa-solid fa-graduation-cap"></i>
                </div>
                <h3 id="tituloModal" class="text-2xl font-black text-slate-900">Inscripción al Ciclo Integral</h3>
                <p class="text-xs text-slate-500 mt-1">Completa tus datos y continúa al pago para asegurar tu vacante.</p>
            </div>

            <form id="enrollForm" class="space-y-4">
                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Nombre Completo del Estudiante:</label>
                    <input type="text" id="studentName" required autocomplete="name" placeholder="Ej. Carlos Mendoza" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-brand-purple">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Teléfono WhatsApp de Contacto:</label>
                    <input type="tel" id="studentPhone" required inputmode="numeric" autocomplete="tel" placeholder="Ej. 912345678" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-brand-purple">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Modalidad de Interés Principal:</label>
                    <select id="studentTarget" class="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base sm:text-sm focus:outline-none focus:border-brand-purple font-medium">
                        <option value="Ingreso PUCP">Postulante a la PUCP</option>
                        <option value="Beca 18 PRONABEC">Postulante a Beca 18 (ENP)</option>
                        <option value="Ambos (PUCP y Beca 18)">Ambos exámenes (PUCP &amp; Beca 18)</option>
                    </select>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">Turno Preferido:</label>
                    <div class="grid grid-cols-2 gap-3" data-lista="horarios">
                      <template>
                        <label class="flex flex-wrap items-center gap-x-2 gap-y-1 border border-slate-200 p-3 rounded-xl cursor-pointer hover:bg-purple-50">
                          <input type="radio" name="turno" data-campo-attr="value:nombre" class="accent-brand-purple shrink-0">
                          <span class="text-xs font-bold text-slate-800"><span data-campo="nombre"></span> <span data-campo="rango"></span></span>
                        </label>
                      </template>
                    </div>
                </div>

                <!-- Discount Code Field -->
                <div class="border-t border-slate-100 pt-4">
                    <label class="block text-xs font-bold uppercase text-slate-700 mb-1">
                        <i class="fa-solid fa-tag text-brand-amber mr-1"></i>¿Tienes un código de descuento?
                    </label>
                    <div class="flex gap-2">
                        <input type="text" id="discountCode" placeholder="Ej. LIVE20" autocapitalize="characters" autocomplete="off" class="flex-1 min-w-0 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base sm:text-sm font-bold uppercase focus:outline-none focus:border-brand-purple tracking-wider">
                        <button type="button" id="btnApplyCode" class="bg-brand-purple hover:bg-brand-darkPurple text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                            <i class="fa-solid fa-check"></i> Aplicar
                        </button>
                    </div>
                    <!-- Discount feedback -->
                    <div id="discountFeedback" class="hidden mt-2 text-sm font-bold px-3 py-2 rounded-xl flex items-center gap-2"></div>
                </div>

                <!-- Price Display -->
                <div id="enrollPriceBox" class="bg-gradient-to-r from-purple-50 to-amber-50 border border-purple-200 rounded-2xl p-4 text-center">
                    <p class="text-xs text-slate-500 font-semibold uppercase mb-1">Inversión del Ciclo Integral</p>
                    <div class="flex items-center justify-center gap-3">
                        <span id="enrollOriginalPrice" class="text-slate-400 line-through text-lg font-bold">S/ <span data-dato="precio.normal"></span></span>
                        <span class="text-3xl font-black text-brand-purple">S/ <span id="enrollFinalPrice"></span></span>
                    </div>
                    <p id="enrollDiscountBadge" class="hidden mt-1 text-xs text-emerald-600 font-bold">
                        <i class="fa-solid fa-tag"></i> <span id="enrollDiscountText"></span>
                    </p>
                </div>

                <input type="hidden" id="modalOrigin" value="General">
                <input type="hidden" id="appliedCode" value="">
                <input type="hidden" id="appliedDiscount" value="0">

                <button type="submit" class="w-full bg-brand-amber hover:bg-brand-amberHover text-slate-950 font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-2 transform hover:-translate-y-0.5">
                    <i class="fa-solid fa-arrow-right text-lg" aria-hidden="true"></i>
                    <span>Continuar al Pago</span>
                </button>
            </form>
        </div>
    </div>

    <!-- Payment Modal (Paso 2: Yape / Plin) -->
    <div id="paymentModal" class="fixed inset-0 z-50 hidden bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100 max-h-[95vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="tituloModalPago">
            <!-- Close Button -->
            <button id="paymentModalClose" class="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-2xl font-bold p-1 z-10">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <!-- Back Button -->
            <button id="paymentModalBack" class="absolute top-4 left-4 text-slate-400 hover:text-slate-800 text-sm font-bold p-1 z-10 flex items-center gap-1">
                <i class="fa-solid fa-arrow-left"></i> Volver
            </button>

            <!-- Header -->
            <div class="text-center mb-6 pt-4">
                <div class="w-14 h-14 bg-gradient-to-br from-brand-purple to-brand-darkPurple text-white rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg shadow-purple-600/20">
                    <i class="fa-solid fa-mobile-screen-button"></i>
                </div>
                <h3 id="tituloModalPago" class="text-2xl font-black text-slate-900">Completa tu Pago</h3>
                <div class="mt-2 inline-flex items-center gap-2 bg-purple-50 border border-purple-200 px-4 py-2 rounded-full">
                    <span class="text-sm text-slate-600 font-medium">Monto a pagar:</span>
                    <span class="text-xl font-black text-brand-purple">S/ <span id="paymentAmount">0</span></span>
                </div>
                <p id="paymentDiscountBadge" class="hidden mt-2 text-xs text-emerald-600 font-bold">
                    <i class="fa-solid fa-tag"></i> <span id="paymentDiscountText"></span>
                </p>
            </div>

            <!-- Yape / Plin Tabs -->
            <div class="flex rounded-xl overflow-hidden border border-slate-200 mb-6">
                <button type="button" id="tabYape" class="pay-tab flex-1 py-3 text-sm font-extrabold flex items-center justify-center gap-2 transition-all" data-tab="yape" data-active="true">
                    <span class="w-6 h-6 bg-white rounded-full flex items-center justify-center text-[10px] font-black text-purple-700">Y</span>
                    YAPE
                </button>
                <button type="button" id="tabPlin" class="pay-tab flex-1 py-3 text-sm font-extrabold flex items-center justify-center gap-2 transition-all" data-tab="plin" data-active="false">
                    <span class="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-[10px] font-black text-white">P</span>
                    PLIN
                </button>
            </div>

            <!-- Payment Panel -->
            <div class="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                <!-- QR Image (visible primarily on desktop) -->
                <div id="payQrContainer" class="hidden mb-4 text-center">
                    <div class="bg-white border-2 border-slate-200 rounded-2xl p-2.5 max-w-[180px] sm:max-w-[200px] mx-auto shadow-sm inline-block">
                        <img id="payQrImage" src="" alt="Código QR para pago" class="w-full aspect-square object-contain rounded-lg">
                    </div>
                    <p class="text-[10px] text-slate-400 text-center mt-2 hidden sm:block">Escanea este QR desde tu app</p>
                </div>

                <!-- Phone Number + Copy Button -->
                <div class="bg-white border-2 border-purple-200 rounded-2xl p-4">
                    <p class="text-xs text-slate-500 font-semibold uppercase mb-2 text-center" id="payMethodLabel">Número Yape:</p>
                    <div class="flex items-center justify-center gap-3">
                        <span id="payPhoneNumber" class="text-2xl sm:text-3xl font-black text-slate-900 tracking-wider">934 894 501</span>
                        <button type="button" id="btnCopyNumber" class="bg-brand-purple hover:bg-brand-darkPurple text-white p-3 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-1.5" title="Copiar número">
                            <i id="copyIcon" class="fa-regular fa-copy text-lg"></i>
                            <span id="copyText" class="text-xs font-bold hidden sm:inline">Copiar</span>
                        </button>
                    </div>
                    <!-- Copy Feedback -->
                    <div id="copyFeedback" class="hidden mt-2 text-center">
                        <span class="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
                            <i class="fa-solid fa-circle-check"></i> ¡Número copiado al portapapeles!
                        </span>
                    </div>
                    <p class="text-xs text-slate-500 text-center mt-2">
                        Titular: <strong id="payTitular" class="text-slate-800">Nombre del Titular</strong>
                    </p>
                </div>
            </div>

            <!-- Steps -->
            <div class="space-y-3 mb-6">
                <h4 class="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <i class="fa-solid fa-list-ol text-brand-purple mr-1"></i> Pasos para completar tu pago:
                </h4>
                <div class="grid gap-2">
                    <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span class="w-7 h-7 bg-brand-purple text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">1</span>
                        <p class="text-sm text-slate-700"><strong>Copia el número</strong> de arriba tocando el botón <span class="text-brand-purple font-bold">Copiar</span></p>
                    </div>
                    <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span class="w-7 h-7 bg-brand-purple text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">2</span>
                        <p class="text-sm text-slate-700"><strong>Abre tu app</strong> <span id="stepAppName" class="font-bold text-purple-700">Yape</span> y pega el número</p>
                    </div>
                    <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span class="w-7 h-7 bg-brand-purple text-white rounded-lg flex items-center justify-center text-xs font-black shrink-0">3</span>
                        <p class="text-sm text-slate-700"><strong>Envía S/ <span id="stepAmount">0</span></strong> al titular indicado</p>
                    </div>
                    <div class="flex items-start gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span class="w-7 h-7 bg-brand-amber text-slate-950 rounded-lg flex items-center justify-center text-xs font-black shrink-0">4</span>
                        <p class="text-sm text-slate-700"><strong>Vuelve aquí</strong> y envía tu comprobante por WhatsApp</p>
                    </div>
                </div>
            </div>

            <!-- Send Voucher Button -->
            <a id="btnSendVoucher" href="#" target="_blank" rel="noopener" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 text-sm transform hover:-translate-y-0.5">
                <i class="fa-brands fa-whatsapp text-xl" aria-hidden="true"></i>
                <span>Enviar Comprobante por WhatsApp</span>
            </a>

            <!-- Alternative -->
            <div class="mt-4 text-center">
                <a data-wa="mediosDePago" class="text-xs text-slate-400 hover:text-brand-purple underline font-medium">
                    ¿Prefieres transferencia bancaria? Escríbenos aquí
                </a>
            </div>
        </div>
    </div>

    <style>
        /* Copy feedback animation */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
        }
        #copyFeedback:not(.hidden) {
            animation: fadeInUp 0.3s ease-out;
        }
        /* Discount feedback animation */
        #discountFeedback:not(.hidden) {
            animation: fadeInUp 0.3s ease-out;
        }
        /* Tab active states */
        .pay-tab[data-active="true"][data-tab="yape"] {
            background: #7C3AED; color: white;
        }
        .pay-tab[data-active="true"][data-tab="plin"] {
            background: #0D9488; color: white;
        }
        .pay-tab[data-active="false"] {
            background: #F1F5F9; color: #64748B;
        }
        .pay-tab[data-active="false"]:hover {
            background: #E2E8F0;
        }
    </style>
`;
})();
