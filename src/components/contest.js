import React, { Component } from 'react'
import Utils from './utils'
import {
  Table,
  Button
} from 'reactstrap'

class Contest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestList: []
    }
  }

  componentDidMount () {
    this.getUserContests()
  }

  getUserContests = () => {
    const self = this
    Utils.getRequest(`${Utils.config.urlBackend}/users/contests`, function (err, data) {
      if (err) return console.log('can not get the users\'s contest')
      console.log(data)
      self.setState({ contestList: data.contests })
    })
  }

  render () {
    var items = this.state.contestList.map(function (i) {
      var duration = parseInt(i.duration) / (1000 * 60 * 60)
      return (<tr key={i._id}>
        <td>{i.name}{(i.code.substr(i.code.length - 1) === 'B' ? ' (Div 2)' : '')}</td>
        <td>{duration.toFixed(1)} hours</td>
        <td>{i.author}</td>
        <td>
          <Button
            color='success'
            size='sm'
            onClick={() => { /* TODO: Set url to contest registration */ }} >
            Register
          </Button>{' '}
        </td>
      </tr>
      )
    })

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
                {items}
              </tbody>
            </Table>
          </div>
        </div>
        : null)
    )
  }
}

export default Contest
