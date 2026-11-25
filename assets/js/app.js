import { initUI } from './modules/ui.js';
import { initCatalog } from './modules/catalog.js';
import { initGarden } from './modules/garden.js';
import { initAgenda } from './modules/agenda.js';

document.addEventListener('DOMContentLoaded', () => {
  // Inicializar interface e escutas de eventos
  initUI();
  initCatalog();
  initGarden();
  initAgenda();

  // Registo do Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => console.log('Service Worker registado com sucesso no escopo:', reg.scope))
      .catch((err) => console.error('Erro ao registar Service Worker:', err));
  }
});