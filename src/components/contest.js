import React, { Component } from 'react';
import utils from './utils';

var config = require('../config.json');
var url = config.url_base;

class Contest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid_api_token: false,
      contestList: []
    }

    this.handleContests = this.handleContests.bind(this);
    this.handleRefreshToken = this.handleRefreshToken.bind(this);
  }

  componentDidMount() {
    this.handleContests();
  }

  handleContests() {
    var what = this;
    var token = window.localStorage.getItem('access_token');
    url += '/contests?status=past&limit=10';

    utils.getRequest(url, token, function (err, data) {
      if (!err) {
        what.setState({ valid_api_token: true, contestList: data.contestList });
        console.log(data.contestList)
      }
      else {
        what.setState({ valid_api_token: false, contestList: [] });
        if (window.localStorage.refresh_token && window.localStorage.refresh_token != '') {
          what.handleRefreshToken();
        }
        console.log("Error retrieving data: ", err);
      }
    });
  }

  handleRefreshToken() {
    utils.refreshToken(function (err, data) {
      if (err) {
        window.localStorage.clear();
        window.location = '/';
      }
      else {
        window.localStorage.setItem('access_token', data.access_token);
        window.localStorage.setItem('refresh_token', data.refresh_token);
      }
    });
  }

  render() {
    if (this.state.valid_api_token && this.state.contestList) {
      var items = this.state.contestList.map(function (i) {
        return (<div> {i.name} </div>)
      });

      return (
        <div>
          <h2> List of contests </h2>
          {items}
        </div>
      );
    }
    else {
      return (
        <div>
          <h2> Problem getting data! </h2>
          <a href='/'> Reload page </a>
        </div>
      )
    }
  }
}

export default Contest;
