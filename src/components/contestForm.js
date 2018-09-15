import React, { Component } from 'react';
import Utils from './utils';
import { Alert, Form, FormGroup, Button, Label, Input, FormText, FormFeedback } from 'reactstrap'
var moment = require('moment');

var config = require('../config-dev.json');
var url = config.url_base;

class ContestForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      minutesBeforeStart: 5,
      created: false,
      valid: true
    }

    this.handleForm = this.handleForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleForm() {
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var val = this.state.minutesBeforeStart;

    if (isNumber(val) && val >= 5 && val <= 60) {
      url = config.url_backend + '/contest';
      var start_time = moment(new Date()).add(this.state.minutesBeforeStart, 'm').toDate();
      this.setState({ startTime: start_time });

      var data = {
        name: this.props.contestName,
        code: this.props.contestCode,
        duration: 5,
        startTime: start_time,
        user: window.localStorage.user
      }

      console.log("url: ", url)
      console.log("data: ", data);

      var what = this;
      Utils.postRequest(url, data, function (err, res) {
        if (!err) {
          what.setState({ valid: true, created: true });
          // TODO: show info after successful created
          console.log('res: ', res);

        }
        else {
          alert(res);
        }
      });
    }
    else {
      this.setState({ valid: false });
    }
  }

  handleChange(event) {
    console.log("val: ", event.target.value)
    this.setState({ minutesBeforeStart: event.target.value });
  }

  render() {
    var form = <div>
      <Alert color="success">
        <h1 className="alert-heading">{this.props.contestName} </h1>
        <p>
          ** Registration for virtual participation
        </p>
      </Alert>

      <Form style={{ textAlign: 'center' }}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="minutes" className="mr-sm-2">Minutes before contest start</Label>

          <Input invalid={!this.state.valid} type="number" name="minutes" id="minutes" value={this.state.minutesBeforeStart}
            onChange={(event) => { this.handleChange(event) }}
          />
          <FormFeedback> Invalid value, enter a valid number. Example: 10</FormFeedback>
          <FormText>(Minimum 5 / Maximun 60 Minutes)</FormText>
        </FormGroup>
        <Button color="danger" onClick={this.handleForm}>Register for virtual contest</Button>{''}
      </Form>
    </div>

    if (!this.state.created) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
          {form}
        </div>
      )
    }
    else {
      Utils.moveTo('/countdown');
    }
  }
}

export default ContestForm;
