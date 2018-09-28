import React, { Component } from 'react'
var moment = require('moment')

class Countdown extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestName: this.props.contestName,
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      hours: '00',
      minutes: '00',
      seconds: '00',
      timingId: null
    }
  }

  componentDidMount () {
    this.refresh()
    var timingId = setInterval(() => this.refresh(), 1000)
    this.setState({ timingId: timingId })
  }

  componentWillUnmount () {
    clearInterval(this.state.timingId)
  }

  refresh = () => {
    var curDate = new Date()
    var timeA = curDate
    var timeB = curDate

    if (curDate > this.state.startDate && curDate < this.state.endDate) {
      timeA = this.state.endDate
    } else if (curDate < this.state.startDate) {
      timeA = this.state.startDate
    }

    function subtract (a, b) {
      var ans = moment(a).subtract(b.getHours(), 'hours').toDate()
      ans = moment(ans).subtract(b.getMinutes(), 'minutes').toDate()
      ans = moment(ans).subtract(b.getSeconds(), 'seconds').toDate()
      return ans
    }

    function normalize (n) {
      return (n < 10 ? '0' + n : n)
    }

    var rest = subtract(timeA, timeB)
    var hours = normalize(rest.getHours())
    var minutes = normalize(rest.getMinutes())
    var seconds = normalize(rest.getSeconds())

    this.setState({ hours: hours, minutes: minutes, seconds: seconds })
  }

  render () {
    var counter = <p
      style={{ fontSize: 25, margin: 0, padding: 0 }}>
      {this.state.hours}:{this.state.minutes}:{this.state.seconds}
    </p>

    var msj = 'Contest has ended'
    var curDate = new Date()
    if (curDate > this.state.startDate && curDate < this.state.endDate) {
      msj = 'Running'
    } else if (curDate < this.state.startDate) {
      msj = 'Before start'
    }

    var defaultStyle = {
      textAlign: 'center',
      justifyContent: 'center',
      fontSize: 25,
      paddingBottom: 0,
      marginTop: 50,
      marginBottom: 0
    }

    var style = (this.props.style ? this.props.style : defaultStyle)

    var counterView = <div style={style}>
      <p> {msj} </p>
      {counter}
    </div>

    return (
      this.state.startDate ? counterView : null
    )
  }
}

export default Countdown
