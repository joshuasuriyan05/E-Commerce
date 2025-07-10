import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDuebh7Q8g0461v_Bmk9oubUh8Z9dnhunU",
  authDomain: "e-commerce-8546f.firebaseapp.com",
  projectId: "e-commerce-8546f",
  storageBucket: "e-commerce-8546f.firebasestorage.app",
  messagingSenderId: "330897376186",
  appId: "1:330897376186:web:370701884838a10937d383"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
