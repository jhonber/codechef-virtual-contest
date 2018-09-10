import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Page from 'page';
import Utils from './components/utils';

function startHomeView() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

Page('/', startHomeView);
Page.start();

registerServiceWorker();
