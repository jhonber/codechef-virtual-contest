import React, { Component } from 'react';
import './App.css';
import Contest from './components/contest';
import Utils from './components/utils'

var config = require('./config.json');
var url = config.url_base;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localStorage_is_available: true,
      userInfo: null
    }
  }

  componentDidMount() {
    var what = this;
    Utils.checkLocalStorage(function (res) {
      console.log("LOCAL: ", res);
      if (!res) {
        what.setState({ localStorage_is_available: false });
      }
      else {
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
          else {
            what.handleInfoUser();
          }
        }
      }
    });
  }

  handleInfoUser() {
    var what = this;
    url += config.url_user;
    var token = window.localStorage.getItem('access_token');
    Utils.getRequest(url, token, function (err, data) {
      if (!err) {
        what.setState({ userInfo: data });
      }
      else {
        console.log('Error: ', err);
      }
    });
  }

  render() {
    var user = (this.state.userInfo ? <p> Welcome: {this.state.userInfo.username} </p> : <p> Anonymous </p>);

    var home = <div className="App">
      {user}
      <h1 className="App-title">Codechef Virtual Contest</h1>
      <p className="App-intro">
        Run past contests of Codechef in virtual mode
      </p>
      <Contest />
    </div>

    var error_page = <div> <h2> LocalStorage not supported! </h2> </div>


    return (
      (this.state.localStorage_is_available ? home : error_page)
    );
  }
}

export default App;
