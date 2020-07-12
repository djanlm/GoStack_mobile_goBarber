import axios from 'axios';

const api = axios.create({
  // os 4 ultimos digitos dependem da api
  baseURL: "http://10.0.2.2:3333", // android studio
  // baseURL: 'http://10.0.3.2:3333', // genymotion
  // baseURL: 'http://localhost:3333', // ios
  // baseURL: 'http://ip_da_rede:3333', // via usb
});

export default api;


/**
 *
ios com Emulador: localhost
ios com físico: IP da máquina
Android com emulador: localhost (adb reverse tcp:3333 tcp:3333)
Android com emulador: 10.0.2.2 (Android Studio)
Android com emulador: 10.0.3.2 (Genymotion)
Android com físico: IP da máquina
*/
