import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { initStore } from './store/initStore'

const store = initStore()

ReactDOM.render(
  <React.StrictMode>
    <App store={store} />
  </React.StrictMode>,
  document.getElementById('root')
)
