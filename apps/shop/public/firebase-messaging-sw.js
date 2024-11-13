// https://firebase.google.com/docs/cloud-messaging/js/receive

// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js'
);

// dev
// const firebaseConfig = {
//     apiKey: 'AIzaSyBA-YB0EnAupLkhLRTW_qe1tlF6_x4ak2U',
//     authDomain: 'book-it-now-dev.firebaseapp.com',
//     projectId: 'book-it-now-dev',
//     storageBucket: 'book-it-now-dev.appspot.com',
//     messagingSenderId: 1018858166395,
//     appId: '1:1018858166395:web:1620f8395d6dfc7ae56ade',
//     measurementId: 'G-W0BQDWMFRX'
// };

// Initialize Firebase
// const app = firebase.initializeApp(firebaseConfig);

// const messaging = firebase.messaging();

// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// Keep in mind that FCM will still show notification messages automatically
// and you should use data messages for custom notifications.
// For more info see:
// https://firebase.google.com/docs/cloud-messaging/concept-options
async function backgroundHandler(payload) {
  console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
  );

  // const notificationTitle = `${payload?.data?.title ?? payload.notification?.title}`;
  // const notificationOptions = {
  //     body: `${payload?.data?.body ?? payload.notification.body}`, // experimental
  //     data: payload.data,
  //     icon: payload.data?.imageUrl
  // };

  // TODO iOS에서는, notification.data를 지원하지 않는다.
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  // tag를 우선 활용해 보도록한다.
  // backtick이나 optional chaining도 잘 안되나?...
  let notificationTitle = '';
  if (payload.data && payload.data.title) {
    notificationTitle = `[sw] ${payload.data.title}`;
  } else if (payload.notification && payload.notification.title) {
    notificationTitle = `[sw] ${payload.notification.title}`;
  } else {
    notificationTitle = '지금예약 사장님';
  }
  let notificationOptions = {};
  if (payload.data && payload.data.body) {
    notificationOptions.body = payload.data.body;
  } else if (payload.notification && payload.notification.body) {
    notificationOptions.body = payload.notification.body;
  } else {
    notificationOptions.body = 'no body';
  }
  if (payload.data && payload.data.link) {
    notificationOptions.tag = payload.data.link;
  } else {
    notificationOptions.tag = '/shop/';
  }

  if (payload.data && payload.data.imageUrl) {
    notificationOptions.icon = payload.data.imageUrl;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
}

// mac safari에서는, 이걸 사용하면, 창이 떠있을 때,
// notification이 안 뜨는 것 같다.
// 아래 onpush 이벤트를 사용하도록 한다.
// 추가로, event.waitUntil은 promise를 받으므로, backgroundHandler를 async로 변경한다.
// messaging.onBackgroundMessage(backgroundHandler);

// 위 onbackgroundmessage에서는, background 상태에서만 호출되며,
// 앱이 켜져있을 때, 추가로 받기 위해서 아래 onpush를 추가 정의하였다.
// ==> messaging.onMessage 관련해서 잘못 테스트가 된 것 같다.
self.addEventListener('push', (event) => {
  let fcmPayload;
  try {
    fcmPayload = event.data.json();
  } catch (e) {
    fcmPayload = {
      data: {
        body: event.data.text(),
      },
    };
    console.log(e);
  }
  event.waitUntil(backgroundHandler(fcmPayload));
  // try {
  //     console.log('general push event listener');
  //     clients.matchAll().then((clientArr) => {
  //         if (clientArr.length > 0) {
  //             // 창이 열려 있다.
  //             // firebase.onBackgroundMessage가 실행되지 않으므로,
  //             // 명시적으로 notfication을 띄워 준다.
  //             event.waitUntil(
  //                 backgroundHandler(fcmPayload),
  //             )
  //         }
  //     })
  // } catch(e) {
  //     console.log(e);
  //     throw e;
  // }
  console.log('push event listener');
  console.log(event);
});

// setInterval(() => {
//     console.log(clients.matchAll().then((clientArr) => {
//         console.log(clientArr);
//     }));
// }, 1000);

// if notification is received `onBackgrounMessage`
// when user clicks nothing happen, so you should implement below handler.
// https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
//
// addEventListener("notificationclick", (event) => {});
// or
// onnotificationclick = (event) => {};

self.addEventListener('notificationclick', (event) => {
  // ios 앱 종료상태에서는 여기로 들어온다.
  // ios 앱을 따로 띄운 경우는 여기로 안 들어온다?
  // https://github.com/firebase/firebase-js-sdk/issues/7309#issuecomment-1913171616

  console.log('onnotificationclick');
  console.log(event);

  try {
    event.notification.close();
  } catch (e) {
    console.log('error while closing notification');
    console.log(e);
  }

  // ios에서는 아래 `.focus`  사용에 제한이 있다.
  // ios에서는, openWindow가 잘 동작하지만, chrome safari 등에서는, 기존 창을 재활용하지 않는다.
  // event.waitUntil(
  //     clients.openWindow(event.notification.tag)
  // )
  // return;

  // ios에서 안된다. 된 것 같았는데, 뭐가 안 맞는지 모르겠네.......
  // clients.openWindow(event.notification.data.link)

  // ios에서는, notification.data를 지원하지 않는다.
  // 그래서, tag를 우선 활용한다.
  // const url = event.notification?.data?.link ?? '/cake/shop/';
  // const url = event.notification?.tag ?? '/cake/shop';
  let url;
  if (event.notification && event.notification.tag) {
    url = event.notification.tag;
  } else {
    url = '/shop/?';
  }
  let allClients;

  // 그리고, ios에 client.focus에도 문제가 있는 것 같다.
  // event.waitUntil(
  //     // clients.matchAll({ type: "window" }).then((clientsArr) => {
  //     clients.matchAll({ }).then((clientsArr) => {
  //         // If a Window tab matching the targeted URL already exists, focus that;
  //         const hadWindowToFocus = clientsArr.some((windowClient) =>
  //           windowClient.url === url
  //             ? (windowClient.focus && windowClient.focus(), true)
  //             : false,
  //         );
  //         // Otherwise, open a new tab to the applicable URL and focus it.
  //         if (!hadWindowToFocus)
  //           clients
  //             .openWindow(url)
  //             .then((windowClient) => (windowClient && windowClient.focus ? windowClient.focus() : null));
  //     }),
  // );
  // TODO event.waitUntil 필요한지 안 필요한지 잘 모르겠다.
  // 일단, chrome에서, notification을 클릭했을 때, 페이지가 이동하지 않고, loading 도는 상태가 있어서 바꿔본다.
  event.waitUntil(
    (async () => {
      allClients = await clients.matchAll({
        type: 'window',
        includeUncontrolled: true, // 이게 없으면, ios에서 따로 띄운 Cake 창에서는, navigate가 동작하지 않는다.
      });
      console.log('allClients.length', allClients.length);
      console.log(allClients);
      // 창이 없는 경우 새창을 띄운다.
      if (allClients.length == 0) {
        // https://bugs.webkit.org/show_bug.cgi?id=263687
        // 아직 잘 안된다..
        return clients.openWindow(url + '#open0').then((result) => {
          console.log('opened');
          console.log(result);
          if (!result) {
            throw new Error('openedWindow null');
          }
          return result;
        }); // chrome에서 앱이 안열려 있을 때,는 event.waitUntil 안 하면 안 열린다.
      } else {
        const windowClient = allClients[0];
        // 위 [0]나 아래 .at(-1)나 별 차이 없지 싶다?
        // const windowClient = allClients.at(-1);
        console.log('type', windowClient.type);
        console.log('url', windowClient.url);
        console.log('focused', windowClient.focused);
        console.log('visibilityState', windowClient.visibilityState);
        return windowClient
          .navigate(url + '#nav')
          .then((openedWindow) => {
            // console.log('navigated');
            // if (openedWindow) {
            //     return openedWindow.focus();
            // }
            // safari에서 focus 안 된다.
            return openedWindow;
          })
          .then((result) => {
            console.log('focused');
            return result;
          });
        // // ios에 앱이 내려진 경우, 여기로 온다.
        // return allClients[0].navigate(url + '#nav'); // navigate and focus 하면 좋지 싶긴 한다.
      }

      // url 비교시, full url 비교를 할지, path 비교만할지가 문제라.
      // 위조건(allClients.length)에서 창이 있는 경우, 무조건 navigate만 하도록 한다.
      // // 창이 있고, 해당 URL인 경우, focus만 한다.
      // const hadWindowToFocus = allClients.find((windowClient) =>
      //   windowClient.url === url
      // );
      // if (hadWindowToFocus) {
      //     // 해당 URL이 열려있으면, 창을 띄우기만 하고,
      //     return hadWindowToFocus.focus();
      // } else {
      //     // 창은 열려 있으나, 다른 URL이면, 페이지 이동을 하고,
      //     return allClients[0].navigate(url);
      // }
    })().catch((err) => {
      console.log('got error in notificationclick');
      console.log(err);
      // const stackFirst = err?.stack?.split('\n')?.[1];
      return clients.openWindow(
        `${url}#openWithError|${err}|allClients.length=${allClients.length}`
      );
    })
  );
});

//https://web.dev/articles/service-worker-lifecycle
// self.addEventListener('install', (event) => {
//     console.log('install event listener');
//     // chrome에서 windowClient.navigate하고 난 후, serviceWorker가 추가로 install되면서, race condition이 되는 것인가 해서,
//     // skipWaiting을 넣어본다.
//     self.skipWaiting();

//     event.waitUntil({});

//     console.log('end of install event listener');
// })
// ios에서 self.skipWaiting 하면 잘 안되는 듯하다.
// firebase.js에서 service worker 설치시, getRegistration() 확인후 설치하는 것을 넣어,
// 두번 install되지 않도록 막아본다.
