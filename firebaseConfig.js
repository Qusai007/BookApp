// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJPV57kTMgLem_AEH_qDjyTNARA6PvgGM",
  authDomain: "bookapp-5115d.firebaseapp.com",
  projectId: "bookapp-5115d",
  storageBucket: "bookapp-5115d.appspot.com",
  messagingSenderId: "579029727060",
  appId: "1:579029727060:web:b72209072d1c197c6bbac1",
  measurementId: "G-KBGB12ZN14",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
