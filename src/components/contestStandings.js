import React, { Component } from 'react'
import { Table } from 'reactstrap'

import Utils from './utils'

class Standings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      contestName: '',
      registrants: [],
      contestCode: props.contestCode
    }
  }

  componentDidMount () {
    Utils.getRequest(`${Utils.config.urlBackend}/contests/${this.state.contestCode}`, (err, contest) => {
      if (err) return window.alert(err)
      console.log(contest)
      this.setState({ contestName: contest.name, registrants: contest.registrants })
    })
  }

  render () {
    const people = this.state.registrants.map((p, idx) => {
      return (
        <tr key={idx}>
          <th> {idx} </th>
          <th> {p} </th>
        </tr>
      )
    })
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <div>
          <Table striped>
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th> # Rank </th>
                <th> User Name </th>
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
