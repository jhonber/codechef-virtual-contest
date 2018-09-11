import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Page from 'page';
import ContestForm from './components/contestForm';

import 'bootstrap/dist/css/bootstrap.css';

function startHomeView() {
  ReactDOM.render(<App />, document.getElementById('root'));
}

function startVirtualContestForm(context) {
  var params = context.params;
  ReactDOM.render(
    <ContestForm contestName={params.name} contestCode={params.code} />,
    document.getElementById('root')
  )
}

Page('/', startHomeView);
Page('/contest/:code/:name', startVirtualContestForm);
Page.start();

registerServiceWorker();
