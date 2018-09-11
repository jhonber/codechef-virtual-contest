import React, { Component } from 'react';
import utils from './utils';
import { Alert, Form, FormGroup, Button, Label, Input, FormText } from 'reactstrap'

var config = require('../config-dev.json');
var url = config.url_base;

class ContestForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      minutesBeforeStart: 5,
      created: false,
      running: false,
      invalid: false
    }

    this.handleForm = this.handleForm.bind(this);
  }

  handleForm() {
    function isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var val = this.state.minutesBeforeStart;

    if (isNumber(val) && val >= 5 && val <= 60) {

    }
    else {

    }
  }


  render() {
    var form = <div>
      <Alert color="success">
        <h1 className="alert-heading">{this.props.contestName} </h1>
        <p>
          ** Registration for virtual participation
        </p>
      </Alert>

      <Form  style={{ textAlign: 'center' }}>
        <FormGroup className="mb-2 mr-sm-2 mb-sm-0">
          <Label for="minutes" className="mr-sm-2">Minutes before contest start</Label>

          <Input type="number" name="minutes" id="minutes" value="5"
            onChange={(val) => { this.setState({ minutesBeforeStart: val }) }}
          />
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
      if (this.running) {

      }
      else {

      }
    }
  }
}

export default ContestForm;
