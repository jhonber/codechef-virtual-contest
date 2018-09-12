import React, { Component } from 'react';
import Contest from './components/contest';
import Utils from './components/utils'
import { Jumbotron, Container, Button } from 'reactstrap';

var config = require('./config-dev.json');
var url = config.url_base;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: false,
      localStorageSupported: true,
      userInfo: null
    }
  }

  componentDidMount() {
    var what = this;
    Utils.checkLocalStorage(function (res) {
      if (!res) {
        what.setState({ localStorageSupported: false });
      }
      else {
        var refresh_token = window.localStorage.getItem('refresh_token');
        if (refresh_token && refresh_token != '') {
          what.setState({ logged: true });
          what.handleInfoUser();
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

    var loginButton = (!this.state.logged ? <Button
      color="primary"
      onClick={() => {
        url += config.url_authorize + '?response_type=code&client_id=' +
          config.client_id + '&state=xyz&redirect_uri=' + config.url_redirect

        window.location = url;
        Utils.moveTo(url);
      }}
    >
      Login
    </Button>
      :
      null)

    var home = <div>
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Jumbotron fluid style={{ textAlign: 'center', padding: 15 }}>
          <Container fluid>
            <h1>Codechef Virtual Contest</h1>
            <p>Run past contests of Codechef in virtual mode</p>
            {user}
            {loginButton}
          </Container>
        </Jumbotron>
      </div>
      <Contest />
    </div >

    var error_page = <div> <h2> LocalStorage not supported! </h2> </div>

    return (
      (this.state.localStorageSupported ? home : error_page)
    );
  }
}

export default App;
