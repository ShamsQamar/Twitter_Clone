import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyATWk7AbDXVreGLZ958UjyWxZ5jrVx1UKU",
    authDomain: "twitter-clone-b58e9.firebaseapp.com",
    projectId: "twitter-clone-b58e9",
    storageBucket: "twitter-clone-b58e9.appspot.com",
    messagingSenderId: "253472742662",
    appId: "1:253472742662:web:8473928e3e39f266da5287"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const messaging = getMessaging(app);

export default auth;