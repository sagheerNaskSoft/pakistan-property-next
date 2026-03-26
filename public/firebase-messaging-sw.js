importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.8/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDYb2xdyZiFXGJm6WvRQd0uu7ui8PInl3U",
  authDomain: "pakistanproperty-998b5.firebaseapp.com",
  projectId: "pakistanproperty-998b5",
  messagingSenderId: "1023408903350",
  appId: "1:1023408903350:web:daa2cd9bb0f2194181c217"
});

const messaging = firebase.messaging();

// self.addEventListener('push', function(event) {
//   let payload = {};
//   try { payload = event.data.json(); } catch(e) {}

//   const title = payload?.notification?.title || "Pakistan Property";
//   const body = payload?.notification?.body || "New update available";

<<<<<<< HEAD
  const options = {
    body: body,
    icon: payload?.notification?.icon || "/images/pp-logo.png",
    badge: payload?.notification?.icon || "/images/pp-logo.png",
    tag: 'property-alert-' + (payload?.data?.property_id || payload?.data?.slug || Date.now()),
    data: {
      url: payload?.data?.url || null,
      property_id: payload?.data?.property_id || null,
      slug: payload?.data?.slug || null,
      type: payload?.data?.type || null,
      id: payload?.data?.id || null
    }
  };
  console.log(options,payload);
  if(payload?.notification?.image) {
    options.image = payload.notification.image;
  }
=======
//   const options = {
//     body: body,
//     icon: payload?.notification?.icon || "/images/pp-logo.png",
//     badge: payload?.notification?.icon || "/images/pp-logo.png",
//     tag: 'property-alert-' + (payload?.data?.property_id || Date.now()),
//     data: {
//       url: payload?.data?.url || "https://pakistanproperty.com/",
//       property_id: payload?.data?.property_id || null
//     }
//   };

//   if(payload?.notification?.image) {
//     options.image = payload.notification.image;
//   }
>>>>>>> a0ef19d4e6839e4916e9f819c1197bf2a83495fe

//   event.waitUntil(
//     self.registration.showNotification(title, options)
//   );
// });

<<<<<<< HEAD
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const data = event.notification.data || {};
  
  // Build target URL for routing
  let targetUrl = data.url;
  
  if (!targetUrl && data.slug) {
    const origin = self.location.origin || "https://pakistanproperty.com";
    const type = (data.type || "property").toLowerCase();
    console.log(data);
    switch (type) {
      case "property":
        targetUrl = origin + "/property-detail/" + data.slug;
        break;
      case "project":
        targetUrl = data.id 
          ? origin + "/project-detail/" + data.id + "/" + data.slug
          : origin + "/new-projects";
        break;
      case "blog":
        targetUrl = origin + "/blog-detail/" + data.slug;
        break;
      case "news":
        targetUrl = origin + "/news-detail/" + data.slug;
        break;
      default:
        targetUrl = origin ;
    }
  }
  
  if (!targetUrl) {
    targetUrl = self.location.origin || "https://pakistanproperty.com";
  }
  
  // Try to focus existing tab with same origin, else open new tab
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then(function(clientList) {
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.startsWith(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
=======
// self.addEventListener('notificationclick', function(event) {
//   event.notification.close();
//   const url = event.notification.data?.url || "https://pakistanproperty.com/";
//   event.waitUntil(clients.openWindow(url));
// });
>>>>>>> a0ef19d4e6839e4916e9f819c1197bf2a83495fe
