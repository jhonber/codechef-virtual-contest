import React, { Component } from 'react';
import Utils from './utils';
import { Table } from 'reactstrap';

var config = require('../config-dev.json');
var url = config.url_base;
var url_problem = config.url_main;

class Problems extends Component {

  constructor(props) {
    super(props);
    this.state = {
      contestName: '',
      contestCode: '',
      problems: []
    }
  }

  componentDidMount() {
    url += '/contests/' + this.props.contestCode;
    var token = window.localStorage.access_token;
    var what = this;
    Utils.getRequest(url, token, function (err, res) {
      console.log('err: ', err)
      console.log('res: ', res)
      if (!err) {
        var problems = res.problemsList;
        what.setState({ contestName: res.name, contestCode: res.code, problems: problems });
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
          <tr key={i}>
            <td>
              <a target="_blank" href={url_problem + '/' + i.contestCode + '/problems/' + i.problemCode}> {i.problemCode} </a>
            </td>
            <td> {i.successfulSubmissions} </td>
            <td> {parseFloat(i.accuracy).toFixed(2)} </td>
          </tr>
        )
      });
    }

    return (
      <div>
        <Table style={{ width: '60%' }}>
          <thead>
            <tr>
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
    )
  }
}

export default Problems;