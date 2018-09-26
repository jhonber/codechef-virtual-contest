import React, { Component } from 'react'
import { Table } from 'reactstrap'

import Utils from './utils'

class Standings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      contestName: '',
      registrants: [],
      problems: [],
      contestCode: props.contestCode
    }
  }

  componentDidMount () {
    Utils.getRequest(`${Utils.config.urlBackend}/contests/${this.state.contestCode}`, (err, contest) => {
      if (err) return window.alert(err)
      this.setState({ contestName: contest.name, registrants: contest.registrants, problems: contest.problemsList })
    })
  }

  render () {
    const people = this.state.registrants.map((p, idx) => {
      return (
        <tr key={p.userID._id}>
          <th> {idx} </th>
          <th> {p.userID.username} </th>
        </tr>
      )
    })

    const problemHeader = this.state.problems.map((p, idx) => {
      return (<th key={idx}> {p} </th>)
    })

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <div>
          <Table striped>
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th> # Rank </th>
                <th> User Name </th>
                {problemHeader}
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {people}
            </tbody>
          </Table>
        </div>
      </div >
    )
  }
}

export default Standings
