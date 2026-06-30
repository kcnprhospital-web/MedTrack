/* ============================================================
   MedTrack Service Worker — firebase-messaging-sw.js
   ------------------------------------------------------------
   This file MUST be hosted at the root of your site
   (e.g. https://kcnprhospital-web.github.io/medtrack/firebase-messaging-sw.js)
   and MUST be named exactly "firebase-messaging-sw.js" — Firebase's
   SDK looks for it at that exact path by default.

   What it does: while the MedTrack tab/app is closed, this script
   keeps running in the background (managed by the browser/OS) and
   is the only thing capable of showing a system notification for
   a push message that arrives while nobody has the app open.

   IMPORTANT: replace the firebaseConfig values below with your own
   Firebase project's config (Firebase Console > Project settings >
   General > Your apps > SDK setup and configuration).
   ============================================================ */

importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCwgJdS3w2pp1J338HZdCY73plR7sLpnTg",
  authDomain: "medtrack-15e60.firebaseapp.com",
  projectId: "medtrack-15e60",
  storageBucket: "medtrack-15e60.firebasestorage.app",
  messagingSenderId: "94318596769",
  appId: "1:94318596769:web:8e617a6c43201d08f6d6e0"
});

const messaging = firebase.messaging();

/* Capsule icon, same one used elsewhere in MedTrack, rendered as a data URI
   so the notification icon works without needing a separate hosted image file. */
const CAPSULE_ICON = "data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%2064%2064%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%20%20%3Crect%20width%3D%2264%22%20height%3D%2264%22%20rx%3D%2214%22%20fill%3D%22%23FDFBF6%22/%3E%0A%20%20%3Cg%20transform%3D%22translate%2832%2C32%29%20rotate%28-45%29%20translate%28-19%2C-9.5%29%22%3E%0A%20%20%20%20%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2238%22%20height%3D%2219%22%20rx%3D%229.5%22%20fill%3D%22%231B3A34%22/%3E%0A%20%20%20%20%3Crect%20x%3D%220%22%20y%3D%220%22%20width%3D%2219%22%20height%3D%2219%22%20rx%3D%229.5%22%20fill%3D%22%232D6A5F%22/%3E%0A%20%20%3C/g%3E%0A%3C/svg%3E";

/* Handle messages arriving while the app is fully closed / in the background. */
messaging.onBackgroundMessage((payload) => {
  const data = payload.data || {};
  const title = data.title || 'MedTrack';
  const options = {
    body: data.body || '',
    icon: CAPSULE_ICON,
    badge: CAPSULE_ICON,
    tag: data.tag || 'medtrack-dose',
    requireInteraction: true,
    data: { url: data.url || '/' }
  };
  self.registration.showNotification(title, options);
});

/* Tapping the notification should open (or focus) the MedTrack app. */
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
