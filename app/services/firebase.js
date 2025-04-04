// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEV31SHaX7G3ODUFeTutIE9BmQrepoiBQ",
  authDomain: "farmedge-4b422.firebaseapp.com",
  databaseURL: "https://farmedge-4b422-default-rtdb.firebaseio.com",
  projectId: "farmedge-4b422",
  storageBucket: "farmedge-4b422.appspot.com",
  messagingSenderId: "866830600136",
  appId: "1:866830600136:web:551c523f109cb992d962fd",
  measurementId: "G-KP2MHNWXNV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
