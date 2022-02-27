import firebase from "firebase";
import firebaseKey from './firebaseKey.js'

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseKey)
  : firebase.app();

const db = app.firestore();

export default db ;