import React, { Component } from 'react';
import Utils from './utils';
var moment = require('moment');
var config = require('../config-dev.json');

class Countdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contestCode: '',
      startTime: null,
      endTime: null,
      hours: '00',
      minutes: '00',
      seconds: '00'
    }

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    var user = window.localStorage.user;
    var url = config.url_backend + '/contest/last/' + user
    var what = this;

    Utils.getRequest(url, function (err, res) {
      if (!err) {
        console.log('res: ', res);

        var startTime = new Date(res.startTime);
        var endTime = moment(startTime).add(parseInt(res.duration), 'm').toDate();

        what.setState({ contestCode: res.code, startTime: startTime, endTime: endTime });

        what.refresh();
        setInterval(() => what.refresh(), 1000);
      }
      else {
        alert(res);
      }
    });
  }

  refresh() {
    var curTime = new Date();
    var timeA = curTime;
    var timeB = curTime;

    if (curTime > this.state.startTime && curTime < this.state.endTime) {
      timeA = this.state.endTime;
    }
    else if (curTime < this.state.startTime) {
      timeA = this.state.startTime;
    }

    function subtract(a, b) {
      var ans = moment(a).subtract(b.getHours(), 'hours').toDate();
      ans = moment(ans).subtract(b.getMinutes(), 'minutes').toDate();
      ans = moment(ans).subtract(b.getSeconds(), 'seconds').toDate();
      return ans;
    }

    function normalize(n) {
      return (n < 10 ? '0' + n : n);
    }

    var rest = subtract(timeA, timeB);
    var hours = normalize(rest.getHours());
    var minutes = normalize(rest.getMinutes());
    var seconds = normalize(rest.getSeconds());

    this.setState({ hours: hours, minutes: minutes, seconds: seconds });
  }

  render() {
    if (this.state.startTime) {
      var counter = <p
        style={{ fontSize: 25, margin: 0, padding: 0 }}>
        {this.state.hours}:{this.state.minutes}:{this.state.seconds}
      </p>

      var msj = 'Contest has ended'
      var curTime = new Date();
      if (curTime > this.state.startTime && curTime < this.state.endTime) {
        if (this.props.redirect) {
          Utils.moveTo('/problems/' + this.state.contestCode);
        }

        msj = 'Running'
      }
      else if (curTime < this.state.startTime) {
        msj = 'Before start'
      }

      return (
        <div style={{ textAlign: 'center', justifyContent: 'center' }}>
          <h1> {window.localStorage.contestName} </h1>
          <p style={{ fontSize: 25, paddingBottom: 0, marginTop: 50, marginBottom: 0 }}> {msj} </p>
          {counter}
        </div>
      )
    }
    else {
      return (
        <div> </div>
      )
    }
  }
}

export default Countdown;