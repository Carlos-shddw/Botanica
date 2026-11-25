import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc
} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { auth, firestore } from './firebase.js';

function getUserPlantsCollection() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Inicia sessão para aceder ao teu jardim.');
  }

  return collection(firestore, 'users', user.uid, 'plants');
}

export async function savePersonalPlant(plantData) {
  const plant = await addDoc(getUserPlantsCollection(), plantData);
  return plant.id;
}

export async function updatePersonalPlant(plantData) {
  const { id, ...data } = plantData;
  if (typeof id !== 'string' || !id) {
    throw new Error('A planta selecionada não tem um identificador válido.');
  }

  const user = auth.currentUser;
  if (!user) {
    throw new Error('Inicia sessão para aceder ao teu jardim.');
  }

  await setDoc(doc(firestore, 'users', user.uid, 'plants', id), data);
}

export async function deletePersonalPlant(plantId) {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('Inicia sessão para aceder ao teu jardim.');
  }
  if (typeof plantId !== 'string' || !plantId) {
    throw new Error('A planta selecionada não tem um identificador válido.');
  }

  await deleteDoc(doc(firestore, 'users', user.uid, 'plants', plantId));
}

export async function getPersonalPlants() {
  const plants = await getDocs(getUserPlantsCollection());
  return plants.docs.map((plant) => ({
    ...plant.data(),
    id: plant.id
  }));
}
