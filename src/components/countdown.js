import React, { Component } from 'react';
var moment = require('moment');

class Countdown extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startTime: window.localStorage.startTime,
      hours: '00',
      minutes: '00',
      seconds: '00'
    }

    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    this.refresh();
    setInterval(() => {
      this.refresh();
    }, 1000);
  }

  refresh() {
    var start_time = new Date(this.state.startTime);
    var cur_time = new Date();
    if (start_time == 'Invalid Date' || start_time <= cur_time) {
      return this.setState({ hours: '00', minutes: '00', seconds: '00' });
    }

    var rest = moment(start_time).subtract(cur_time.getHours(), 'hours').toDate();
    rest = moment(rest).subtract(cur_time.getMinutes(), 'minutes').toDate();
    rest = moment(rest).subtract(cur_time.getSeconds(), 'seconds').toDate();

    function normalize(n) {
      return (n < 10 ? '0' + n : n);
    }

    var hours = normalize(rest.getHours());
    var minutes = normalize(rest.getMinutes());
    var seconds = normalize(rest.getSeconds());

    this.setState({ hours: hours, minutes: minutes, seconds: seconds });
  }

  render() {
    var counter = <p
      style={{ fontSize: 25, margin: 0, padding: 0 }}>
      {this.state.hours}:{this.state.minutes}:{this.state.seconds}
    </p>


    return (
      <div style={{ textAlign: 'center', justifyContent: 'center' }}>
        <h1> {window.localStorage.contestName} </h1>
        <p style={{ fontSize: 25, paddingBottom: 0, marginTop: 50, marginBottom: 0 }}> Before contest start </p>
        {counter}
      </div>
    )
  }
}

export default Countdown;