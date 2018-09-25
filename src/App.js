import React, { Component } from 'react'
import Contest from './components/contest'
import Utils from './components/utils'
import { Jumbotron, Container, Button } from 'reactstrap'
import LogoutButton from './components/logoutButton'
import ContestForm from './components/contestForm'

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
    const self = this
    Utils.checkLocalStorage(function (err) {
      if (err) {
        self.setState({ localStorageSupported: false })
      } else {
        const refreshToken = window.localStorage.getItem('refresh_token')
        if (refreshToken && refreshToken !== '') {
          self.setState({ logged: true })
          self.handleInfoUser()
        }
      }
    })
  }

  handleInfoUser () {
    const self = this
    const userURL = url + Utils.config.urlUser
    var token = window.localStorage.getItem('access_token')
    Utils.getSecureRequest(userURL, token, function (err, data) {
      if (!err) {
        self.setState({ userInfo: data })
        window.localStorage.user = data.username
      } else {
        console.log('Error: ', err)
        Utils.logout()
      }
    })
  }

  render () {
    var user = this.state.userInfo
      ? <p className='text-success'
        style={{ fontWeight: 'bold', margin: 0 }}>
        Welcome: {this.state.userInfo.username}
      </p>
      : <p className='text-warning'> Anonymous </p>

    let loginButton = !this.state.logged
      ? <Button
        size='sm'
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
      : null

    let logoutButton = this.state.logged ? <LogoutButton /> : null
    let contestSection = this.state.logged ? <Contest /> : null
    let createContest = this.state.logged ? <ContestForm /> : null

    let home = <div>
      <div style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Jumbotron fluid style={{ textAlign: 'center', padding: 15, marginBottom: 10 }}>
          <Container fluid>
            <h3>Run past contests of Codechef in virtual mode</h3>
            {this.state.userInfo && user}
            {loginButton}
            {this.state.userInfo && logoutButton}
          </Container>
        </Jumbotron>
      </div>
      {createContest}
      {contestSection}
    </div >

    var errorPage = <div> <h2> LocalStorage not supported! </h2> </div>

    return (
      (this.state.localStorageSupported ? home : errorPage)
    )
  }
}

export default App
