import React, { Component } from 'react';
import utils from './utils';

class Contest extends Component {

  constructor(props) {
    super(props);
    this.state = {
      valid_api_token: false,
      contestList: []
    }

    this.handleContests = this.handleContests.bind(this);
    this.handleApiToken = this.handleApiToken.bind(this);
  }

  handleContests() {
    var what = this;
    var token = window.localStorage.getItem('api_token');
    var url = 'https://api.codechef.com/contests'

    utils.getContestsList(url, token, function (err, data) {
      if (!err) {
        what.setState({valid_api_token: true, contestList: data.contestList });
        console.log(data.contestList)
      }
      else {
        what.setState({valid_api_token: false, contestList: [] });
        alert("Error retrieving data: ", err);
      }
    });
  }

  handleApiToken() {
    utils.getToken(function (err, api_token) {
      if (err) alert("Error retrieving api_token!");
      else {
        window.localStorage.api_token = api_token;
      }
    });
  }

  componentDidMount() {
    var api_token = window.localStorage.getItem('api_token');

    if (!api_token || api_token == '') {
      this.handleApiToken();
    }
    else {
      this.handleContests();
    }
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
