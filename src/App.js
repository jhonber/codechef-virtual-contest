import React, { Component } from 'react';
import './App.css';
import Contest from './components/contest';
import Utils from './components/utils'

var config = require('./config.json');
var url = config.url_base;

class App extends Component {

  componentDidMount() {
    var url_params = window.location.search;
    if (url_params.indexOf('code') != -1) {
      var code = url_params.split('?')[1].split('&')[0].split('=')[1];
      console.log("CODE: ", code)
      Utils.getTokenFirstTime(code, function (err, data) {
        window.localStorage.setItem('access_token', data.access_token);
        window.localStorage.setItem('refresh_token', data.refresh_token);
        window.location = '/';
      });
    }
    else {
      var refresh_token = window.localStorage.getItem('refresh_token');
      if (!refresh_token || refresh_token == '') {
        url += config.url_authorize
        url += '?response_type=code&client_id=' + config.client_id +
        '&state=xyz&redirect_uri=' + config.url_redirect_dev
        window.location = url;
      }
    }
  }

  render() {

    return (
      <div className="App">

        <h1 className="App-title">Codechef Virtual Contest</h1>
        <p className="App-intro">
          Run past contests of Codechef in virtual mode
        </p>

        <Contest />
      </div>
    );
  }
}

export default App;
