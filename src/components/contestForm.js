import React, { Component } from 'react'
import Utils from './utils'
import { Form, FormGroup, Button, Input } from 'reactstrap'

class ContestForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestCode: 'COOK98' // TODO: fill this with the proper value
    }

    this.handleForm = this.handleForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleForm () {
    const data = {
      contestCode: this.state.contestCode
    }
    const self = this
    Utils.postRequest(`${Utils.config.urlBackend}/contests`, data, function (err, res) {
      if (err) return console.log('problem creating new contest', err)
      self.setState({ valid: true, created: true })
      // TODO: show info after success
      console.log('Contest created:', res)
    })
  }

  handleChange (event) {
    this.setState({ contestCode: event.target.value })
  }

  render () {
    var form = <div>
      <h2>Create new virtual contest</h2>
      <Form style={{ textAlign: 'center' }}>
        <FormGroup> {/* TODO: fill this select with real contests using the API */}
          <Input type='select' name='contestCode' id='contestCode' onChange={this.handleChange}>
            <option value='COOK98'>September Mega Cook-Off 2018</option>
            <option value='CGSC2018'>Code Garage September Challenge</option>
            <option value='INCC2018'>Code Incognito</option>
          </Input>
        </FormGroup>
        <Button color='primary' onClick={this.handleForm}>Create new virtual contest</Button>{''}
      </Form>
    </div>

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
        {form}
      </div>
    )
  }
}

export default ContestForm
