import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC9mcn5Gm8WiCQ86MIWomKBHHlBRFXQgWc",
  authDomain: "damnnn-cce2d.firebaseapp.com",
  projectId: "damnnn-cce2d",
  storageBucket: "damnnn-cce2d.firebasestorage.app",
  messagingSenderId: "596552513519",
  appId: "1:596552513519:web:784ad522ffab7a7c62681a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);