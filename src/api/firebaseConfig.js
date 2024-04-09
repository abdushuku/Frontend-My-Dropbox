/** @format */

import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

//  Update the config
const firebaseConfig = {
  apiKey: "AIzaSyCKe0YE0ev71bY_K1UOqIS97VpAXbyD3Uw",
  authDomain: "dropbox-60a71.firebaseapp.com",
  databaseURL: "https://dropbox-60a71-default-rtdb.firebaseio.com",
  projectId: "dropbox-60a71",
  storageBucket: "dropbox-60a71.appspot.com",
  messagingSenderId: "195475734554",
  appId: "1:195475734554:web:ccee6529fe9409ff1d51a3"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { app, firestore, auth, storage };
