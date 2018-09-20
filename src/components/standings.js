import React, { Component } from 'react'
import { Table } from 'reactstrap'
import Utils from './utils'

var config = require('../config-dev.json')
const url = config.url_base

class Standings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      rank: '1',
      problems: [],
      verdict: {}
    }
  }

  componentWillReceiveProps (nextProps) {
    const submissionsURL = url + '/submissions/?username=' + window.localStorage.user +
      '&contestCode=PRACTICE&fields=id%2Cdate%2CproblemCode%2Cresult'

    this.setState({ problems: this.props.problems })

    var token = window.localStorage.access_token
    var what = this
    var verdict = {}

    Utils.getSecureRequest(submissionsURL, token, function (err, res) {
      if (!err) {
        process(0)

        function process (i) {
          if (i === res.length) {
            what.setState({ verdict: verdict })
          } else {
            var code = res[i].problemCode

            if (code in verdict) {
              var cur = verdict[code]
              cur.tries++

              if (res[i].result === 'AC') {
                cur.solved = true
                cur.date = res[i].date
              }
            } else {
              verdict[code] = {
                date: res[i].date,
                solved: (res[i].result === 'AC'),
                tries: 1
              }
            }
            process(i + 1)
          }
        }
      } else {
        console.log(res)
      }
    })
  }

  render () {
    var problemCodes = null
    if (this.state.problems.length > 0) {
      problemCodes = this.state.problems.map(function (i) {
        return (
          <th key={i.problemCode}> {i.problemCode} </th>
        )
      })
    }

    var result = null
    var verdict = this.state.verdict
    if (this.state.problems.length > 0) {
      result = this.state.problems.map(function (i) {
        var solved = ''
        var tries = 0
        var time = ''
        if (i.problemCode in verdict) {
          tries = verdict[i.problemCode].tries
          solved = verdict[i.problemCode].solved ? '+' : (tries ? '-' : '')
          if (solved === '+') {
            tries--
            time = ''// TODO: set time after contest start
          }
        }

        return (
          <td key={i.problemCode}>
            <div>
              {solved}{tries || ''}
            </div>
            <div>
              {(solved === '+' ? time : '')}
            </div>
          </td >
        )
      })
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <div>
          <Table striped>
            <thead style={{ textAlign: 'center' }}>
              <tr>
                <th> # Rank </th>
                <th> User Name </th>
                {problemCodes}
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              <tr>
                <td> {this.state.rank} </td>
                <td> {window.localStorage.user} </td>
                {result}
              </tr>
            </tbody>
          </Table>
        </div>
      </div >
    )
  }
}

export default Standings
