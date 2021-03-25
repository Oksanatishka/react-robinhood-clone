import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyA6U90y4f3sFxCDO-op2oHeyB53kx8fN30",
    authDomain: "robinhood-clone-cc0d4.firebaseapp.com",
    projectId: "robinhood-clone-cc0d4",
    storageBucket: "robinhood-clone-cc0d4.appspot.com",
    messagingSenderId: "822202569175",
    appId: "1:822202569175:web:7e36fd662c84a98286fb92"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

export { db };