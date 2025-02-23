// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyD07hppmwmXffWAivjdCTRJWQHLCPnf2_U",
    authDomain: "epstudio-1de6e.firebaseapp.com",
    projectId: "epstudio-1de6e",
    storageBucket: "epstudio-1de6e.firebasestorage.app",
    messagingSenderId: "689875208105",
    appId: "1:689875208105:web:0d36c81edbc492245226b8",
    measurementId: "G-F09T42RD7B"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
      
  // Send message to clients to play audio
  
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    
  

    // Assuming you have set up service worker and handling notifications
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const action = event.action;
  const notificationData = event.notification.data;

  if (action === 'accept') {
    // Handle opening a new website in Chrome or another browser
    const urlToOpen = `https://ktest.kodukku.com/videocall/${notificationData.receivercallid.replace(/'/g, '')}/${notificationData.chatdata}`; // Replace with your URL
    event.waitUntil(
      clients.openWindow(urlToOpen)
    );
  } else if (action === 'decline') {
    // Handle decline action
    event.notification.close();
  } else {
    // Handle other actions or default click behavior
    console.log('Notification clicked with no action');
  }
});

  
   
  });

  
  