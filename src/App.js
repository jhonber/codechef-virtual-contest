import React, { Component } from 'react';
import Contest from './components/contest';
import Utils from './components/utils'
import { Jumbotron, Container } from 'reactstrap';

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
    var user = (this.state.userInfo ?
      <p className="text-success"
        style={{ fontWeight: 'bold', margin: 0 }}>
        Welcome: {this.state.userInfo.username}
      </p> :
      <p className="text-warning"> Anonymous </p>);

    var home = <div>
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Jumbotron fluid style={{ textAlign: 'center', padding: 15 }}>
          <Container fluid>
            <h1>Codechef Virtual Contest</h1>
            <p>Run past contests of Codechef in virtual mode</p>
            {user}
          </Container>
        </Jumbotron>
      </div>
      <Contest />
    </div >

    var error_page = <div> <h2> LocalStorage not supported! </h2> </div>


    return (
      (this.state.localStorage_is_available ? home : error_page)
    );
  }
}

export default App;
