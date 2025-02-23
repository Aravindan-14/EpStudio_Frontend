// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getMessaging, getToken } from "firebase/messaging";
import axios from "axios";
import { baseURL } from "./Utils/ServerUrl";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD07hppmwmXffWAivjdCTRJWQHLCPnf2_U",
  authDomain: "epstudio-1de6e.firebaseapp.com",
  projectId: "epstudio-1de6e",
  storageBucket: "epstudio-1de6e.firebasestorage.app",
  messagingSenderId: "689875208105",
  appId: "1:689875208105:web:0d36c81edbc492245226b8",
  measurementId: "G-F09T42RD7B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const messaging = getMessaging(app);


export const generateToken = async (id) => {

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted.');
    const token = await getToken(messaging, {
      vapidKey: 'BPGZ7PRwlqnVibeCsD2TJ5dhahK_sx9OSVjxyuAbFSN6H189o5BRFGWdnX8HTGEs95dTzXBfmbMvh5bDvUwm-20'
    });
    console.log('fcw token', token);
    if (token) {
      const res = await axios.put(`${baseURL}/register/updatewebToken`, { token: token, id: id })
    }
  } else {
    console.log('Unable to get permission to notify.');
  }
};