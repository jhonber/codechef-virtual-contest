import React, { Component } from 'react'
import { Table } from 'reactstrap'
import async from 'async'

import Utils from './utils'

class Standings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      contestName: '',
      registrants: [],
      problems: [],
      board: [[]],
      contestCode: props.contestCode,
      contestDuration: 0
    }
  }

  createBoard = (registrants, submissions) => {
    let result = []
    const codeToID = {}
    for (let i = 0; i < this.state.problems.length; i++) {
      codeToID[this.state.problems[i]] = i
    }

    for (let i = 0; i < registrants.length; i++) {
      const username = registrants[i].userID.username
      result.push({
        username: username,
        solved: 0,
        penalty: 0,
        problems: new Array(this.state.problems.length)
      })

      for (let j = 0; j < this.state.problems.length; j++) result[i].problems[j] = [null, null]

      const start = new Date(registrants[i].startDate).getTime()
      const end = start + this.state.contestDuration
      for (let j = 0; j < submissions[i].length; j++) {
        const s = submissions[i][j]
        // TODO: this is hack to solve a bug from codechef, they return the date without TZ (-10h 3min).
        const sDate = new Date(s.date).getTime() - 10 * 60 * 60 * 1000 + 30 * 60 * 1000
        if (start <= sDate && sDate <= end && this.state.problems.includes(s.problemCode)) {
          const ID = codeToID[s.problemCode]
          if (result[i].problems[ID][0]) continue // already solved

          if (result[i].problems[ID][1]) result[i].problems[ID][1]++
          else result[i].problems[ID][1] = 1

          if (s.result === 'AC') {
            result[i].solved++
            result[i].problems[ID][0] = Math.round((sDate - start) / 1000 / 60) // minutes
            result[i].penalty += result[i].problems[ID][0] + (result[i].problems[ID][1] - 1) * 20
          }
        }
      }
    }

    result.sort(function (a, b) {
      if (a.solved === b.solved) return a.penalty - b.penalty
      return b.solved - a.solved
    })
    return result
  }

  componentDidMount () {
    Utils.getRequest(`${Utils.config.urlBackend}/contests/${this.state.contestCode}`, (err, contest) => {
      if (err) return window.alert(err)
      this.setState({
        contestName: contest.name,
        registrants: contest.registrants,
        problems: contest.problemsList,
        contestDuration: contest.duration
      })
      const token = window.localStorage.getItem('access_token')
      let usersSub = []
      for (let i = 0; i < contest.registrants.length; i++) {
        const username = contest.registrants[i].userID.username
        usersSub.push((cb) => {
          Utils.getSecureRequest(`${Utils.config.urlBase}/submissions?username=${username}&contestCode=Practice`, token, (err, submissions) => {
            if (err) return cb(err)
            cb(null, submissions)
          })
        })
      }
      async.parallel(usersSub, (err, subs) => {
        if (err) return window.alert(err)
        this.setState({ board: this.createBoard(contest.registrants, subs) })
      })
    })
  }

  render () {
    const board = []
    for (let i = 0; i < this.state.board.length; i++) {
      let row = []
      const p = this.state.board[i]
      row.push((<th key='pos'>{i + 1}</th>))
      row.push((<th key='username'>{p.username}</th>))
      row.push((<th key='solved'>{p.solved}</th>))
      row.push((<th key='penalty'>{p.penalty}</th>))
      if (!p.problems) continue
      for (let j = 0; j < p.problems.length; j++) {
        row.push((<th key={j}>{p.problems[j][0]} / {p.problems[j][1]}</th>))
      }
      board.push((
        <tr key={p.username}>
          {row}
        </tr>
      ))
    }

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
                <th> Solved </th>
                <th> Penalty </th>
                {problemHeader}
              </tr>
            </thead>
            <tbody style={{ textAlign: 'center' }}>
              {board}
            </tbody>
          </Table>
        </div>
        <br />
      </div >
    )
  }
}

export default Standings
