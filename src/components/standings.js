import React, { Component } from 'react';
import { Table, TabContent, TabPane, Nav, NavItem, NavLink, Row, Col } from 'reactstrap';
import classnames from 'classnames';

import Utils from './utils';
import Countdown from './countdown';

var config = require('../config-dev.json');
var url = config.url_base;
var url_problem = config.url_main;

class Standings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: 'jh000n',
      rank: '1',
      score: 100,
      problems: []
    }
  }

  componentDidMount() {
    url += '/contests/' + this.state.contestCode;
    // request current submissions
    var problems = [{
      "problemCode": "ARGTS",
      "solved": true,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 3,
      "score": 200,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    },
    {
      "problemCode": "CHFDT",
      "solved": false,
      "tries": 0,
      "score": 100,
    }];

    this.setState({ problems: problems });
  }

  render() {
    var problems = null;
    if (this.state.problems.length > 0) {
      problems = this.state.problems.map(function (i) {
        return (
          <th> {i.problemCode} </th>
        )
      });
    }

    var verdict = null;
    if (this.state.problems.length > 0) {
      verdict = this.state.problems.map(function (i) {
        return (
          <td> {i.solved ? i.score : ''} - ({i.tries}) </td>
        )
      });
    }

    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
        <div>
          <Table striped>
            <thead>
              <tr>
                <th> # Rank </th>
                <th> User Name </th>
                <th> Score </th>
                {problems}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td> {this.state.rank} </td>
                <td> {this.state.username} </td>
                <td> {this.state.score} </td>
                {verdict}
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default Standings;