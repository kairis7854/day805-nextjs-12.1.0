import firebase from "firebase";

const FIREBASE_KEY = {
  apiKey: process.env.apiKey ,
  authDomain: "day805-nextjs.firebaseapp.com",
  projectId: "day805-nextjs",
  storageBucket: "day805-nextjs.appspot.com",
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
};

const app = !firebase.apps.length
  ? firebase.initializeApp(FIREBASE_KEY)
  : firebase.app();

const db = app.firestore();

export default db ;