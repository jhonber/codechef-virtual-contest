import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import Page from 'page'
import ContestStandings from './components/contestStandings'
import Utils from './components/utils'
import Problems from './components/problems'
import Countdown from './components/countdown'
import Header from './components/header'

import 'bootstrap/dist/css/bootstrap.css'

function startHomeView () {
  ReactDOM.render(<Header />, document.getElementById('header'))
  if (Utils.isLogged()) {
    ReactDOM.render(<App />, document.getElementById('root'))
  }
}

function startContestStandings (context) {
  ReactDOM.render(<Header />, document.getElementById('header'))
  if (Utils.isLogged()) {
    var params = context.params
    ReactDOM.render(
      <ContestStandings contestCode={params.code} />,
      document.getElementById('root')
    )
  }
}

function startProblemsView (context) {
  var code = context.params.code
  ReactDOM.render(
    <Problems contestCode={code} />,
    document.getElementById('root')
  )
}

function startCountdownView () {
  ReactDOM.render(
    <Countdown redirect />,
    document.getElementById('root')
  )
}

function startOAuth2 (context) {
  var code = context.querystring.split('&')[0].split('=')[1]

  Utils.getTokenFirstTime(code, function (err, data) {
    if (!err) {
      window.localStorage.setItem('access_token', data.access_token)
      window.localStorage.setItem('refresh_token', data.refresh_token)
      Utils.moveTo('/')
    } else {
      window.alert(err)
    }
  })
}

function checkLogin (cxt, next) {
  if (Utils.isLogged()) next()
  else Utils.moveTo('/')
}

Page('/', startHomeView)
Page('/auth/codechef/callback', startOAuth2)
Page('/contests/:code', checkLogin, startContestStandings)
Page('/problems/:code', startProblemsView)
Page('/countdown', startCountdownView)
Page.start()

registerServiceWorker()
