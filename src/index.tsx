import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css';
import { TimersProvider } from './context/timerContex';

import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <TimersProvider>
      <App />
    </TimersProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
