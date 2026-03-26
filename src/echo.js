import Echo from "laravel-echo";
import Pusher from "pusher-js";
window.Pusher = Pusher;
const echo = new Echo({
  broadcaster: "pusher",
  key: "local",
  cluster: "mt1",
  wsHost: "admin.pakistanproperty.com",
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: "https://admin.pakistanproperty.com/broadcasting/auth",
  auth: {
    headers: {
      Accept: 'application/json',
    },
  },
});

// Suppress Pusher internal logs in browser console.
Pusher.logToConsole = false;
Pusher.log = () => {};

export default echo;
