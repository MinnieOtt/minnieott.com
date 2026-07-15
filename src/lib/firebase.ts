import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  projectId: "gen-lang-client-0814739469",
  appId: "1:270679454552:web:624fce1387b7816514ab2d",
  apiKey: "AIzaSyCDIPQXWmDq81U8BrjbCy8hTDphG_Y45Xc",
  authDomain: "gen-lang-client-0814739469.firebaseapp.com",
  storageBucket: "gen-lang-client-0814739469.firebasestorage.app",
  messagingSenderId: "270679454552"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account"
});
