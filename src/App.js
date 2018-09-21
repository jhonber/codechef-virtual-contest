import React, { Component } from 'react'
import Contest from './components/contest'
import Utils from './components/utils'
import { Jumbotron, Container, Button } from 'reactstrap'
import LogoutButton from './components/logoutButton'

const url = Utils.config.urlBase

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      logged: false,
      localStorageSupported: true,
      userInfo: null
    }
  }

  componentDidMount () {
    var what = this
    Utils.checkLocalStorage(function (err) {
      if (err) {
        what.setState({ localStorageSupported: false })
      } else {
        const refreshToken = window.localStorage.getItem('refresh_token')
        if (refreshToken && refreshToken !== '') {
          what.setState({ logged: true })
          what.handleInfoUser()
        }
      }
    })
  }

  handleInfoUser () {
    var what = this
    const userURL = url + Utils.config.urlUser
    var token = window.localStorage.getItem('access_token')
    Utils.getSecureRequest(userURL, token, function (err, data) {
      if (!err) {
        what.setState({ userInfo: data })
        window.localStorage.user = data.username
      } else {
        console.log('Error: ', err)
        Utils.logout()
      }
    })
  }

  render () {
    var user = (this.state.userInfo
      ? <p className='text-success'
        style={{ fontWeight: 'bold', margin: 0 }}>
        Welcome: {this.state.userInfo.username}
      </p>
      : <p className='text-warning'> Anonymous </p>)

    let loginButton = null
    if (!this.state.logged) {
      loginButton = <Button
        color='primary'
        onClick={() => {
          const callbackURL = url + Utils.config.urlAuthorize + '?response_type=code&client_id=' +
            Utils.config.clientID + '&state=xyz&redirect_uri=' + Utils.config.urlRedirect

          window.location = callbackURL
          Utils.moveTo(callbackURL)
        }}
      >
        Login
      </Button>
    }

    let home = <div>
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Jumbotron fluid style={{ textAlign: 'center', padding: 15 }}>
          <Container fluid>
            <h1>Codechef Virtual Contest</h1>
            <p>Run past contests of Codechef in virtual mode</p>
            {user}
            {loginButton}
            <LogoutButton />
          </Container>
        </Jumbotron>
      </div>
      <Contest />
    </div >

    var errorPage = <div> <h2> LocalStorage not supported! </h2> </div>

    return (
      (this.state.localStorageSupported ? home : errorPage)
    )
  }
}

export default App
