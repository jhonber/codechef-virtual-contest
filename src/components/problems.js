import React, { Component } from 'react';
import Utils from './utils';
import { Table } from 'reactstrap';
import Countdown from './countdown';

var config = require('../config-dev.json');
var url = config.url_base;
var url_problem = config.url_main;

class Problems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contestCode: this.props.contestCode,
      contestName: '',
      problems: []
    }
  }

  componentDidMount() {
    url += '/contests/' + this.state.contestCode;
    var token = window.localStorage.access_token;
    var what = this;
    Utils.getSecureRequest(url, token, function (err, res) {

      if (!err) {
        var problems = res.problemsList;
        process(0);

        function process(i) {
          if (i == problems.length) {
            what.setState({ contestName: res.name, contestCode: res.code, problems: problems });
            return;
          }
          var cur_code = problems[i].problemCode;
          var cur_url = config.url_base + '/contests/' +
            what.state.contestCode + '/problems/' + cur_code;

          if (!window.localStorage.getItem(cur_code) || window.localStorage.getItem(cur_code) == '') {
            Utils.getSecureRequest(cur_url, token, function (err, res) {
              if (!err) {
                problems[i].problemName = res.problemName;
                window.localStorage.setItem(cur_code, res.problemName);
              }

              process(i + 1);
            });
          }
          else {
            problems[i].problemName = window.localStorage.getItem(cur_code);
            process(i + 1);
          }
        }
      }
      else {
        alert(res);
      }
    });
  }

  render() {
    var items = null;
    if (this.state.problems.length > 0) {
      items = this.state.problems.map(function (i) {
        return (
          <tr key={i.problemCode}>
            <td>
              <a target="_blank" href={url_problem + '/' + i.contestCode + '/problems/' + i.problemCode}> {i.problemName} </a>
            </td>
            <td> {i.problemCode} </td>
            <td> {i.successfulSubmissions} </td>
            <td> {parseFloat(i.accuracy).toFixed(2)} </td>
          </tr>
        )
      });
    }

    return (
      <div style={{display: 'flex'}}>
        <div>
          <Table style={{ width: '60%' }}>
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
        <div>
          <Countdown />
        </div>
      </div>
    )
  }
}

export default Problems;