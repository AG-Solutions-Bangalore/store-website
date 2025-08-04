import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PersistGate } from 'redux-persist/lib/integration/react.js';
import { Provider } from "react-redux";
import Store, { persistor } from './redux/store.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
       <Provider store={Store}>
       <PersistGate loading={null} persistor={persistor}>
    <App />
    </PersistGate>
    </Provider>
  </StrictMode>,
)



if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/sw.js').then((registration) => {
//         console.log('ServiceWorker registration successful');
  
//         registration.onupdatefound = () => {
//           const newWorker = registration.installing;
//           newWorker.onstatechange = () => {
//             if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {

//               console.log('New content is available; please refresh.');
          
//               window.location.reload();
//             }
//           };
//         };
//       }).catch(err => {
//         console.log('ServiceWorker registration failed: ', err);
//       });
//     });
//   }
  