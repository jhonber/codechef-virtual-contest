import React, { Component } from 'react'
import Utils from './utils'
import { Table, Button } from 'reactstrap'

const config = require('../config-dev.json')
const url = config.urlBase

class Contest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      valid_api_token: false,
      contestList: []
    }

    this.handleContests = this.handleContests.bind(this)
  }

  componentDidMount () {
    this.handleContests()
  }

  handleContests () {
    var what = this
    var token = window.localStorage.getItem('access_token')
    const contestURL = url + '/contests?status=past&limit=10'

    Utils.getSecureRequest(contestURL, token, function (err, data) {
      if (!err) {
        what.setState({ valid_api_token: true, contestList: data.contestList })
        console.log(data.contestList)
      } else {
        what.setState({ valid_api_token: false, contestList: [] })
        if (window.localStorage.refresh_token && window.localStorage.refresh_token !== '') {
          Utils.refreshToken()
        }
        console.log('Error retrieving data: ', err)
      }
    })
  }

  render () {
    var items = null
    var mainView = null

    if (this.state.valid_api_token && this.state.contestList) {
      const urlContest = config.urlMain + '/'
      items = this.state.contestList.map(function (i) {
        return (<tr key={i.code}>
          <td>
            <a target='_blank' href={urlContest + i.code}> {i.name} </a>
          </td>
          <td>
            <Button
              color='success'
              size='sm'
              onClick={() => { window.location = '/contest/' + i.code + '/' + i.name }} >
              Practice
            </Button>{' '}
          </td>
        </tr>
        )
      })

      mainView = <div style={{ textAlign: 'center' }}>
        <h4> List of contests </h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Table striped style={{ width: '90%' }}>
            <tbody>
              {items}
            </tbody>
          </Table>
        </div>
      </div>
    }

    return (
      <div>
        {mainView}
      </div>
    )
  }
}

export default Contest
