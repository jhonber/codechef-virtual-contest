import React, { Component } from 'react'
import { Table } from 'reactstrap'

import Utils from './utils'

const url = Utils.config.urlBase
const urlProblem = Utils.config.urlMain

class Problems extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestCode: this.props.contestCode,
      contestName: '',
      problems: []
    }
  }

  componentDidMount () {
    const contestUrl = url + '/contests/' + this.state.contestCode
    var token = window.localStorage.access_token
    const self = this
    Utils.getSecureRequest(contestUrl, token, function (err, res) {
      if (!err) {
        self.setState({ contestName: res.name, contestCode: res.code, problems: res.problemsList })
      } else {
        window.alert(res)
      }
    })
  }

  render () {
    var items = null
    if (this.state.problems.length > 0) {
      items = this.state.problems.map(function (i) {
        return (
          <tr key={i.problemCode}>
            <td>
              <a
                target='_blank'
                href={urlProblem + '/' + i.contestCode + '/problems/' + i.problemCode}>
                {i.problemCode}
              </a>
            </td>
            <td> {i.problemCode} </td>
            <td> {i.successfulSubmissions} </td>
            <td> {parseFloat(i.accuracy).toFixed(2)} </td>
          </tr>
        )
      })
    }

    var problemsView = <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
      <div>
        <Table bordered>
          <thead>
            <tr>
              <th> Name </th>
              <th> Code </th>
              <th> Successful submissions </th>
              <th> Accuracy </th>
            </tr>
          </thead>
          <tbody>
            {items}
          </tbody>
        </Table>
      </div>
    </div>

    return (
      <div>
        {problemsView}
      </div>
    )
  }
}

export default Problems
