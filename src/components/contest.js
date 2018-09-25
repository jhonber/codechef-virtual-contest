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
      pageSize: 10
    }
  }

  componentDidMount () {
    this.getUserContests()
  }

  getUserContests = (page) => {
    page = page || this.state.currentPage
    const self = this
    const offset = this.state.pageSize * (page - 1)
    Utils.getRequest(`${Utils.config.urlBackend}/contests/?offset=${offset}&limit=${this.state.pageSize}`, function (err, data) {
      if (err) return console.log('can not get the users\'s contest', err)
      self.setState({ contestList: data.contests, numContests: data.numContests })
    })
  }

  pageChange = (page) => {
    this.setState({ currentPage: page })
    this.getUserContests(page)
  }

  render () {
    const items = this.state.contestList.map(function (i) {
      const duration = parseInt(i.duration, 10) / (1000 * 60 * 60)
      return (<tr key={i._id}>
        <td>{i.name}{(i.code.substr(i.code.length - 1) === 'B' ? ' (Div 2)' : '')}</td>
        <td>{duration.toFixed(1)} hours</td>
        <td>{i.author.username}</td>
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
                {items}
              </tbody>
            </Table>
          </div>
          {paginator}
        </div>
        : null)
    )
  }
}

export default Contest
