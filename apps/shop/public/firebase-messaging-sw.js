/* eslint-env serviceworker */
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

const defaultUrlToOpen = '/shop/';

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
    notificationOptions.tag = defaultUrlToOpen;
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

  event.notification.close();

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
  if (event.notification?.tag?.includes('user_visible_auto_notification')) {
    url = defaultUrlToOpen + '#' + event.notification.tag;
  } else if (event.notification?.tag) {
    url = event.notification.tag;
  } else {
    url = defaultUrlToOpen;
  }

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: 'window',
      });
      let matchingClient = null;
      for (const client of allClients) {
        console.log('client', client);
        if (new URL(client.url).pathname === url && 'focus' in client) {
          matchingClient = client;
          break;
        }
      }
      if (matchingClient) {
        // if there is already open window, focus it.
        return matchingClient.focus();
      } else if (allClients.length > 0) {
        // when there is open window, but not matching url. navigate to the url.
        return allClients[0].navigate(url);
      } else {
        // if there is no window, open new window.
        // https://bugs.webkit.org/show_bug.cgi?id=263687
        return self.clients.openWindow(url + '#open');
      }
    })().catch((err) => {
      console.log('got error in notificationclick');
      console.log(err);
      console.log(err.stack); // err.stack is only string 'TypeError: This service worker is not the client's active service worker.'
      // const stackFirst = err?.stack?.split('\n')?.[1];
      self.registration.showNotification(`Error ${err}`, {
        body: err.stack,
      });
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
