import React, { Component } from 'react'
import Utils from './utils'

class Contest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestList: []
    }

    this.getUserContests = this.getUserContests.bind(this)
  }

  componentDidMount () {
    this.getUserContests()
  }

  getUserContests () {
    const self = this
    Utils.getRequest(`${Utils.config.urlBackend}/users/contests`, function (err, data) {
      if (err) return console.log('can not get the users\'s contest')
      console.log(data)
      self.setState({ contestList: data.contests })
    })
  }

  render () {
    return (
      <div>
        {JSON.stringify(this.state.contestList)}
      </div>
    )
  }
}

export default Contest
