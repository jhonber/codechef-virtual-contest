import React, { Component } from 'react'
import {
  Alert, Form, FormGroup, Button, Label, Input, FormText, FormFeedback
} from 'reactstrap'

class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      minutesBeforeStart: 5,
      created: false,
      valid: true
    }
  }

  handleForm = () => {
    function isNumber (n) {
      return !isNaN(parseFloat(n)) && isFinite(n)
    }

    var val = this.state.minutesBeforeStart

    if (isNumber(val) && val >= 5 && val <= 60) {
      this.props.handleSubmitRegisterForm(this.props.contestID, val)
    } else {
      this.setState({ valid: false })
    }
  }

  handleChange = (event) => {
    console.log('val: ', event.target.value)
    this.setState({ minutesBeforeStart: event.target.value })
  }

  render () {
    var form = <div>
      <Alert color='success'>
        <p>{this.props.contestName}</p>
      </Alert>

      <Form style={{ textAlign: 'center' }}>
        <FormGroup className='mb-2 mr-sm-2 mb-sm-0'>
          <Label for='minutes' className='mr-sm-2'>Minutes before contest start</Label>

          <Input
            invalid={!this.state.valid}
            type='number'
            name='minutes'
            id='minutes'
            value={this.state.minutesBeforeStart}
            onChange={(event) => { this.handleChange(event) }}
          />
          <FormFeedback> Invalid value, enter a valid number. Example: 10</FormFeedback>
          <FormText>(Minimum 5 / Maximun 60 Minutes)</FormText>
        </FormGroup>
        <Button color='success' onClick={this.handleForm}>Register for virtual contest</Button>{''}
      </Form>
    </div>

    if (!this.state.created) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {form}
        </div>
      )
    } else {
      return (null)
    }
  }
}

export default RegisterForm
