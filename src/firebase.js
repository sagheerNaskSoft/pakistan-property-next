import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyDYb2xdyZiFXGJm6WvRQd0uu7ui8PInl3U",
  authDomain: "pakistanproperty-998b5.firebaseapp.com",
  projectId: "pakistanproperty-998b5",
  storageBucket: "pakistanproperty-998b5.firebasestorage.app",
  messagingSenderId: "1023408903350",
  appId: "1:1023408903350:web:daa2cd9bb0f2194181c217",
  measurementId: "G-V2J9B8DLEH"
};

const app = initializeApp(firebaseConfig);

let messaging;
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  messaging = getMessaging(app);
} else {
  messaging = null;
}
export { messaging, getToken };
