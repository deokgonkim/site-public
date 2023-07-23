// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js");

const firebaseConfig = {
    apiKey: "AIzaSyAE2VdG2Cy9FazviYV2cAK3jXBVuC-wl54",
    authDomain: "public-dgkim-net.firebaseapp.com",
    projectId: "public-dgkim-net",
    storageBucket: "public-dgkim-net.appspot.com",
    messagingSenderId: "146213314861",
    appId: "1:146213314861:web:d27b37bf3b4a22d9c133a4",
    measurementId: "G-27P1NDX90N"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically 
// and you should use data messages for custom notifications.
// For more info see: 
// https://firebase.google.com/docs/cloud-messaging/concept-options
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.notification?.title;
    const notificationOptions = {
        body: payload.notification?.body,
        icon: payload.notification?.image
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
