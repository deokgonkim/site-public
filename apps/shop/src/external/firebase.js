import { initializeApp } from 'firebase/app';
// import { getMessaging, onMessage, deleteToken } from "firebase/messaging";
import * as fcm from 'firebase/messaging';
import { getToken } from 'firebase/messaging';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FBASE_API_KEY,
  authDomain: process.env.REACT_APP_FBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FBASE_APP_ID,
};

// console.log("fbconfig", firebaseConfig);

const VAPIDKEY = process.env.REACT_APP_FBASE_VAPIDKEY;

export const app = initializeApp(firebaseConfig);
// export const messaging = fcm.getMessaging(app);

// https://github.com/firebase/quickstart-js/blob/master/messaging/main.ts

let swRegistration = undefined;

export const getServiceWorker = async () => {
  return navigator.serviceWorker.getRegistration().then((worker) => {
    if (worker) {
      swRegistration = worker;
      return worker;
    }
  });
};

export const registerServiceWorker = async () => {
  try {
    // webview에서는, 동작하지 않지 않겠냐?
    console.log('registering service worker', process.env.PUBLIC_URL);
    debugger;
    navigator.serviceWorker
      .getRegistration()
      .then((worker) => {
        if (worker) {
          swRegistration = worker;
        } else {
          navigator.serviceWorker
            .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
            .then((result) => {
              console.log('Service worker registered');
              console.log(result);
              swRegistration = result;
            });
        }
      })
      .catch((e) => {
        console.error(e);
      });
  } catch (e) {
    console.error(e);
  }
};

export const getFcmToken = async () => {
  return getServiceWorker().then((worker) => {
    if (!worker) {
      alert('not supported');
      return;
    }
    try {
      const messaging = fcm.getMessaging(app);
      return fcm
        .getToken(messaging, {
          serviceWorkerRegistration: swRegistration,
          vapidKey: VAPIDKEY,
        })
        .then((currentToken) => {
          if (currentToken) {
            // Send the token to your server and update the UI if necessary
            console.log('GotToken');
            console.log(currentToken);
            return currentToken;
          } else {
            // Show permission request UI
            alert('no registration token available');
            console.error(
              'No registration token available. Request permission to generate one.'
            );
          }
        })
        .catch((err) => {
          console.error('An error occurred while retrieving token. ');
          alert(err);
          console.error(err);
        });
    } catch (e) {
      console.log(e);
      alert(e);
    }
  });
};

export const deleteFcmToken = async () => {
  if (!swRegistration) {
    alert('not supported');
    return;
  }
  try {
    const messaging = fcm.getMessaging(app);
    return fcm
      .getToken(messaging, {
        serviceWorkerRegistration: swRegistration,
        vapidKey: VAPIDKEY,
      })
      .then((currentToken) => {
        console.log('currentToken');
        console.log(currentToken);
        if (currentToken) {
          return fcm.deleteToken(messaging);
        }
        return true;
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (e) {
    console.log(e);
    alert(e);
  }
};

function goPageWithtimeout(url, timeout) {
  setTimeout(() => {
    document.location.href = url;
  }, timeout);
}

// onMessage로 받아버리면, notification이 뜨지 않아서,
// ios에서 몇차례까지만 onMessage로 보내주고, 이후 푸시가 완전히 사라진다.
// 그래서, 모든 푸시를 firebase-messaging-sw.js에서 처리하도록 변경하였다.

// 페이지가 열려 있었으면, firebase-messaging-sw.js 에서 여기로 메시지를 보내준다.
// 페이지가 열려 있지 않았으면, desktop notification에서 webpush.fcm_options.link 페이지를 자동으로 연다.
// fcm.onMessage(messaging, (payload) => {
//   console.log('message received while viewing page');
//   console.log(payload);

//   if (payload?.data?.link) {
//     toast(`
//     link
//     ${payload?.data?.link}
//     ${payload?.data?.title ?? payload?.notification?.title}
//     ${payload?.data?.body ?? payload?.notification?.body}
//     `);
//     goPageWithtimeout(payload.data.link, 5000);
//   } else if (payload?.webpush?.fcm_options?.link) {
//     toast(`
//     fcm_options
//     ${payload?.webpush?.fcm_options?.link}
//     ${payload?.data?.title ?? payload?.notification?.title}
//     ${payload?.data?.body ?? payload?.notification?.body}
//     `);
//     goPageWithtimeout(payload.webpush.fcm_options.link, 5000);
//   } else if (payload?.tag) {
//     toast(`
//     tag
//     ${payload?.tag}
//     ${payload?.data?.title ?? payload?.notification?.title}
//     ${payload?.data?.body ?? payload?.notification?.body}
//     `);
//     goPageWithtimeout(payload.tag, 5000);
//   }

//   navigator.serviceWorker.ready.then((registration) => {
//     registration.active.postMessage('this is message from web');
//   })
// });
