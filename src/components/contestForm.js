import React, { Component } from 'react'
import Utils from './utils'
import { Form,
  FormGroup,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap'

class ContestForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestCode: '',
      contestsList: [],
      modalVisible: false
    }

    this.handleForm = this.handleForm.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.getPastContests = this.getPastContests.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  componentDidMount () {
    this.getPastContests()
  }

  getPastContests () {
    const self = this
    var token = window.localStorage.getItem('access_token')
    var url = `${Utils.config.urlBase}/contests?status=past&limit=100`

    Utils.getSecureRequest(url, token, function (err, data) {
      if (!err) {
        data = data.contestList
        var filtered = []
        var keys = new Set()

        for (var i = 0; i < data.length; ++i) {
          keys.add(data[i].code)
        }

        for (var j = 0; j < data.length; ++j) {
          if (!keys.has(data[j].code + 'A') && !keys.has(data[j].code + 'B')) {
            filtered.push(data[j])
          }
        }

        self.setState({
          contestCode: (filtered.length > 0 ? filtered[0].code : ''),
          contestsList: filtered
        })
      } else {
        console.log('Error retrieving data: ', err)
      }
    })
  }

  handleForm () {
    const data = {
      contestCode: this.state.contestCode
    }
    const self = this
    Utils.postRequest(`${Utils.config.urlBackend}/contests`, data, function (err, res) {
      var msj = 'The contest was successful created.'
      if (err) {
        msj = 'Problem creating new contest: ' + err
        console.log(msj)
      }
      self.setState({ modalContent: msj })
      self.toggleModal()
    })
  }

  handleChange (event) {
    console.log('value: ', event.target.value)
    this.setState({ contestCode: event.target.value })
  }

  toggleModal () {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  render () {
    var items = this.state.contestsList.map(function (item) {
      return (
        <option
          key={item.code}
          value={item.code}>
          {item.name}{item.code[item.code.length - 1] === 'B' ? ' (Div 2)' : ''}
        </option>
      )
    })

    var form = <div>
      <h2>Create new virtual contest</h2>
      <Form style={{ textAlign: 'center' }}>
        <FormGroup>
          <Input type='select' name='selectContest' id='selectContest' onChange={this.handleChange}>
            {items}
          </Input>
        </FormGroup>
        <Button color='primary' onClick={this.handleForm}>Create new virtual contest</Button>{''}
      </Form>
    </div>

    var modal = <Modal
      isOpen={this.state.modalVisible}
      toggle={this.toggleModal}>
      <ModalBody>
        {this.state.modalContent}
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={this.toggleModal}>Ok</Button>{' '}
      </ModalFooter>
    </Modal>

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
        {form}
        {modal}
      </div>
    )
  }
}

export default ContestForm
