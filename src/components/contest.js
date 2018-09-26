import React, { Component } from 'react'
import Utils from './utils'
import {
  Table,
  Button
} from 'reactstrap'

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

class Contest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestList: [],
      numContest: 0,
      currentPage: 1,
      pageSize: 10,
      registeredContests: []
    }
  }

  componentDidMount () {
    this.getUserContests()
  }

  getUserContests = (page) => {
    page = page || this.state.currentPage
    const self = this
    const offset = this.state.pageSize * (page - 1)
    Utils.getRequest(
      `${Utils.config.urlBackend}/contests/?offset=${offset}&limit=${this.state.pageSize}`,
      function (err, data) {
        if (err) return console.log('can not get the users\'s contest', err)
        self.setState({
          contestList: data.contests,
          numContests: data.numContests,
          registeredContests: data.registeredContests
        })
      })
  }

  pageChange = (page) => {
    this.setState({ currentPage: page })
    this.getUserContests(page)
  }

  registerInContest = (contestID) => {
    const registerURL = `${Utils.config.urlBackend}/contests/${contestID}/register`
    const self = this
    Utils.postRequest(
      registerURL,
      { contestID: contestID, minutesBeforeStart: 5 },
      function (err, res) {
        // TODO: show this results on the UI and the Register button
        if (err) return console.log('can not register in contest', err)
        if (res.error) return console.log('can not register in contest:', res.error)
        console.log('successfully registered on contest', res)
        self.state.registeredContests.push(contestID)
        window.location.reload()
      }
    )
  }

  render () {
    const self = this
    const contestsTable = this.state.contestList.map(function (i) {
      const duration = parseInt(i.duration, 10) / (1000 * 60 * 60)
      return (<tr key={i._id} >
        <td
          style={{ padding: 0, verticalAlign: 'middle' }}>
          {i.name}{(i.code.substr(i.code.length - 1) === 'B' ? ' (Div 2)' : '')}
        </td>
        <td style={{ padding: 0, verticalAlign: 'middle' }}>{duration.toFixed(1)} hours</td>
        <td style={{ padding: 0, verticalAlign: 'middle' }}>{i.author.username}</td>
        <td style={{ padding: 0, verticalAlign: 'middle' }}>
          {(function (registered) {
            if (registered) {
              return (
                <Button color='link' disabled>
                  Registered
                </Button>
              )
            } else {
              return (
                <Button
                  color='link'
                  onClick={() => { self.registerInContest(i._id) }} >
                  Register
                </Button>
              )
            }
          }(self.state.registeredContests.includes(i._id)))}
        </td>
      </tr>
      )
    })

    const paginator = <Pagination
      onChange={this.pageChange}
      current={this.state.currentPage}
      total={this.state.numContests}
      pageSize={this.state.pageSize}
    />

    return (
      (this.state.contestList.length > 0
        ? <div style={{ textAlign: 'center' }}>
          <h5> List of contests </h5>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Table striped style={{ width: '90%' }}>
              <thead>
                <tr>
                  <th>Contest name</th>
                  <th>Duration</th>
                  <th>Author</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contestsTable}
              </tbody>
            </Table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {paginator}
          </div>
        </div>
        : null)
    )
  }
}

export default Contest
