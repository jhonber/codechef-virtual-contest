import React, { Component } from 'react'
import Utils from './utils'
import { Button } from 'reactstrap'

const config = require('../config-dev.json')

class LogoutButton extends Component {
  onClick () {
    console.log('asdfsd')
  }

  handleClick () {
    const token = window.localStorage.getItem('access_token')
    if (token) {
      Utils.getRequest(`${config.urlBackend}/auth/logout`, function (err) {
        if (err) return console.log('failed to log out', err)
        Utils.logout()
      })
    }
  }

  render () {
    return (
      <Button size='sm' onClick={this.handleClick}>
        Log Out
      </Button>
    )
  }
}

export default LogoutButton
