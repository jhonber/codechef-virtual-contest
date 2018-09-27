import React, { Component } from 'react'
import Utils from './utils'
import {
  Nav,
  NavLink
} from 'reactstrap'
import LogoutButton from './logoutButton'

const url = Utils.config.urlBase

class Header extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userInfo: null
    }
  }

  componentDidMount () {
    this.handleInfoUser()
  }

  handleInfoUser = () => {
    const self = this
    const userURL = url + Utils.config.urlUser
    var token = window.localStorage.getItem('access_token')
    Utils.getSecureRequest(userURL, token, function (err, data) {
      if (!err) {
        self.setState({ userInfo: data })
        window.localStorage.username = data.username
      } else {
        console.log('Error: ', err)
      }
    })
  }

  render () {
    let loginView = !this.state.userInfo
      ? <NavLink
        href='#'
        onClick={() => {
          Utils.clearSession()
          const callbackURL = url + Utils.config.urlAuthorize + '?response_type=code&client_id=' +
            Utils.config.clientID + '&state=xyz&redirect_uri=' + Utils.config.urlRedirect
          Utils.moveTo(callbackURL)
        }}
      > Login
      </NavLink>
      : <LogoutButton />

    let user = this.state.userInfo
      ? <p className='text-success'
        style={{ fontWeight: 'bold', margin: 0 }}>
        {this.state.userInfo.username}
      </p>
      : <p className='text-warning'> Anonymous </p>

    var header = <Nav>
      <NavLink href='/'>Home</NavLink>
      <NavLink href='#'>About</NavLink>
      <NavLink href='#'>{user}</NavLink>
      {loginView}
    </Nav>

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {header}
      </div>
    )
  }
}

export default Header
