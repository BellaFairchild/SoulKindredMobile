import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { initializeAuth, Auth, getAuth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyB3-TXQLEAjEdmDX7i5AmQflOuFtzZQ0LA",
    authDomain: "soulkindred.firebaseapp.com",
    databaseURL: "https://soulkindred-default-rtdb.firebaseio.com",
    projectId: "soulkindred",
    storageBucket: "soulkindred.firebasestorage.app",
    messagingSenderId: "740295586971",
    appId: "1:740295586971:web:3e3234ba2bf85ecd28023e",
    measurementId: "G-0QDTDGJZ99"
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;

if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
    // @ts-ignore
    const { getReactNativePersistence } = require('firebase/auth');
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });
} else {
    app = getApp();
    auth = getAuth(app);
}

db = getFirestore(app);
functions = getFunctions(app, "us-central1");

export { app, app as firebaseApp, auth, db, functions };

export const ensureFirebase = () => {
    return app;
};
