import React, { Component } from 'react'

import Contest from './components/contest'
import Utils from './components/utils'
import ContestForm from './components/contestForm'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      localStorageSupported: true
    }

    this.contestRef = React.createRef()
  }

  componentDidMount () {
    const self = this
    Utils.checkLocalStorage(function (err) {
      if (err) {
        self.setState({ localStorageSupported: false })
      }
    })
  }

  handleUpdateContestList = (data) => {
    this.contestRef.current.getUserContests()
  }

  render () {
    let contestSection = <Contest ref={this.contestRef} />
    let createContest = <ContestForm handleUpdateContestList={this.handleUpdateContestList} />

    let home = <div>
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
