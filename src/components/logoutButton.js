import React, { Component } from 'react'
import Utils from './utils'
import { Button } from 'reactstrap'

const superagent = require('superagent')
const config = require('../config-dev.json')

class LogoutButton extends Component {
  onClick () {
    console.log('asdfsd')
  }

  handleClick () {
    const token = window.localStorage.getItem('access_token')
    if (token) {
      superagent
        .get(`${config.urlBackend}/auth/logout`)
        .end(function (err) {
          if (err) return console.log('failed to log out', err)
          Utils.logout()
        })
    }
  }

  render () {
    return (
      <Button onClick={this.handleClick}>
        Log Out
      </Button>
    )
  }
}

export default LogoutButton
