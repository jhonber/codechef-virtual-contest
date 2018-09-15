import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Page from 'page';
import ContestForm from './components/contestForm';
import Utils from './components/utils';
import Problems from './components/problems';
import Countdown from './components/countdown';

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

function startProblemsView(context) {
  var code = context.params.code;
  ReactDOM.render(
    <Problems contestCode={code} />,
    document.getElementById('root')
  )
}

function startCountdownView() {
  ReactDOM.render(
    <Countdown redirect={true} />,
    document.getElementById('root')
  )
}

function startOAuth2(context) {
  var code = context.querystring.split('&')[0].split('=')[1];

  Utils.getTokenFirstTime(code, function (err, data) {
    if (!err) {
      window.localStorage.setItem('access_token', data.access_token);
      window.localStorage.setItem('refresh_token', data.refresh_token);
      Utils.moveTo('/');
    }
    else {
      alert(data);
    }
  });
}

Page('/', startHomeView);
Page('/OAuth2', startOAuth2);
Page('/contest/:code/:name', startVirtualContestForm);
Page('/problems/:code', startProblemsView);
Page('/countdown', startCountdownView);
Page.start();

registerServiceWorker();
