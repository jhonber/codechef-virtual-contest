import React, { Component } from 'react'
import Utils from './utils'
import {
  Form,
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
      modalContent: '',
      modalVisible: false
    }
  }

  componentDidMount () {
    this.getPastContests()
  }

  getPastContests = () => {
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

  handleForm = () => {
    const data = {
      contestCode: this.state.contestCode
    }
    const self = this
    Utils.postRequest(`${Utils.config.urlBackend}/contests`, data, function (err, res) {
      var msj = 'The contest was successfully created.'
      if (err) {
        msj = 'Problem creating new contest: ' + err
        console.log(msj)
      } else {
        if (self.props.handleUpdateContestList) {
          self.props.handleUpdateContestList()
        }
      }
      self.setState({ modalContent: msj })
      self.toggleModal()
    })
  }

  handleChange = (event) => {
    console.log('value: ', event.target.value)
    this.setState({ contestCode: event.target.value })
  }

  toggleModal = () => {
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

    var form = <div style={{ textAlign: 'center' }}>
      <h3>Create new virtual contest</h3>
      <Form
        style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ marginRight: 5 }}>
          <FormGroup>
            <Input type='select' name='selectContest' id='selectContest' onChange={this.handleChange}>
              {items}
            </Input>
          </FormGroup>
        </div>
        <div>
          <Button color='primary' onClick={this.handleForm}>Create new virtual contest</Button>{' '}
        </div>
      </Form>
    </div>

    var modal = <Modal
      size={'sm'}
      isOpen={this.state.modalVisible}
      toggle={this.toggleModal}>
      <ModalBody style={{ textAlign: 'center' }}>
        {this.state.modalContent}
      </ModalBody>
      <ModalFooter>
        <Button color='primary' onClick={this.toggleModal}>Ok</Button>{' '}
      </ModalFooter>
    </Modal>

    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {this.state.contestsList.length > 0 && form}
        {modal}
      </div>
    )
  }
}

export default ContestForm
