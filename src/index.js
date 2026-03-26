import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Authprovider } from './Context/ContextProvider';

// Ensure right-click context menu works on all links
// React Router Links should have href attributes, but we ensure context menu works
if (typeof document !== 'undefined') {
  document.addEventListener('contextmenu', (e) => {
    // Find closest link
    const link = e.target.closest('a[href]');
    if (link && link.href && !link.href.includes('#')) {
      // Allow default context menu for valid links
      return true;
    }
  }, true); // Use capture phase to ensure we catch it early
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Authprovider>
    <App />
  </Authprovider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
