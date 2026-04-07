import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAZRdsdU-6bMG-DHnrI8bRGuWtQSBteeD8",
  authDomain: "social-auth-implementation.firebaseapp.com",
  projectId: "social-auth-implementation",
  storageBucket: "social-auth-implementation.firebasestorage.app",
  messagingSenderId: "657554681819",
  appId: "1:657554681819:web:488d95c3f92880ad0441fe",
  measurementId: "G-DH56NFTH01",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
