const DB_NAME = 'FloriculturaDB';
const DB_VERSION = 1;

export function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Tabela para as plantas pessoais do utilizador
      if (!db.objectStoreNames.contains('minhas_plantas')) {
        db.createObjectStore('minhas_plantas', { keyPath: 'id', autoIncrement: true });
      }

      // Tabela para agendamento de lembretes (rega, fertilização, poda)
      if (!db.objectStoreNames.contains('lembretes')) {
        db.createObjectStore('lembretes', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Adicionar planta ao jardim pessoal
export async function savePersonalPlant(plantData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('minhas_plantas', 'readwrite');
    const store = tx.objectStore('minhas_plantas');
    const request = store.add(plantData);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function updatePersonalPlant(plantData) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('minhas_plantas', 'readwrite');
    const store = tx.objectStore('minhas_plantas');
    const request = store.put(plantData);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePersonalPlant(plantId) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('minhas_plantas', 'readwrite');
    const store = tx.objectStore('minhas_plantas');
    const request = store.delete(plantId);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Obter todas as plantas do jardim pessoal
export async function getPersonalPlants() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('minhas_plantas', 'readonly');
    const store = tx.objectStore('minhas_plantas');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}