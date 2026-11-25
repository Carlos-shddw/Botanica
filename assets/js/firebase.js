import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCSmMhDL9O0B22Es1trD5V1uuRUdDunnf4',
  authDomain: 'botanica-cc0bf.firebaseapp.com',
  projectId: 'botanica-cc0bf',
  storageBucket: 'botanica-cc0bf.firebasestorage.app',
  messagingSenderId: '209984114508',
  appId: '1:209984114508:web:f5218079f4620d0b7349e9'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);
