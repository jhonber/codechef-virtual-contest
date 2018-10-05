import React, { Component } from 'react'
import Utils from './utils'
import {
  Table,
  Button,
  Modal,
  ModalBody,
  ModalFooter
} from 'reactstrap'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Pagination from 'rc-pagination'
import 'rc-pagination/assets/index.css'

import RegisterForm from './registerForm'

class Contest extends Component {
  constructor (props) {
    super(props)
    this.state = {
      contestList: [],
      numContest: 0,
      currentPage: 1,
      pageSize: 10,
      registeredContests: [],
      toRegisterContestID: null,
      toRegisterContestName: null,
      modalVisible: false
    }
  }

  componentDidMount () {
    this.getUserContests()
  }

  notify = (msg, isError) => {
    if (isError) toast.error(msg)
    else toast.success(msg)
  }

  getUserContests = (page) => {
    page = page || this.state.currentPage
    const self = this
    const offset = this.state.pageSize * (page - 1)
    Utils.getRequest(
      `${Utils.config.urlBackend}/contests/?offset=${offset}&limit=${this.state.pageSize}`,
      function (err, data) {
        if (err) return self.notify(`can not get the users contest ${err}`, true)
        self.setState({
          contestList: data.contests,
          numContests: data.numContests,
          registeredContests: data.registeredContests
        })
      })
  }

  pageChange = (page) => {
    this.setState({ currentPage: page })
    this.getUserContests(page)
  }

  handleSubmitRegisterForm = (contestID, minutesBeforeStart) => {
    const registerURL = `${Utils.config.urlBackend}/contests/${contestID}/register`
    const self = this
    Utils.postRequest(
      registerURL,
      { contestID: contestID, minutesBeforeStart: minutesBeforeStart },
      function (err, res) {
        if (err) return self.notify(`can not register in contest ${err}`, true)
        if (res.error) self.notify(`can not register in contest ${err}`, true)
        self.setState({ modalVisible: false })
        self.state.registeredContests.push(contestID)
        self.getUserContests()
        self.notify('successfully registered on contest')
      }
    )
  }

  registerInContest = (contestID, contestName) => {
    this.setState({
      modalVisible: true,
      toRegisterContestID: contestID,
      toRegisterContestName: contestName
    })
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible })
  }

  render () {
    const self = this
    var contestsTable = null
    if (this.state.contestList && this.state.contestList.length > 0) {
      contestsTable = this.state.contestList.map(function (i) {
        const duration = parseInt(i.duration, 10) / (1000 * 60 * 60)
        return (<tr key={i._id} >
          <td
            style={{ padding: 0, verticalAlign: 'middle' }}>
            <Button color='link' onClick={() => { Utils.moveTo(`/contests/${i._id}`) }}>
              {i.name}{(i.code.substr(i.code.length - 1) === 'B' ? ' (Div 2)' : '')}
            </Button>
          </td>
          <td style={{ padding: 0, verticalAlign: 'middle' }}>{duration.toFixed(1)} hours</td>
          <td style={{ padding: 0, verticalAlign: 'middle' }}>{i.author.username}</td>
          <td style={{ padding: 0, verticalAlign: 'middle' }}>
            {(function (registered) {
              if (registered) {
                return (
                  <Button color='link' disabled>
                    Registered
                  </Button>
                )
              } else {
                return (
                  <Button
                    color='link'
                    onClick={() => { self.registerInContest(i._id, i.name) }} >
                    Register
                  </Button>
                )
              }
            }(self.state.registeredContests.includes(i._id)))}
          </td>
        </tr>
        )
      })
    }

    const paginator = <Pagination
      onChange={this.pageChange}
      current={this.state.currentPage}
      total={this.state.numContests}
      pageSize={this.state.pageSize}
    />

    var modalRegister = this.state.toRegisterContestName && this.state.toRegisterContestID
      ? <Modal
        size={'sm'}
        isOpen={this.state.modalVisible}
        toggle={this.toggleModal}>
        <ModalBody style={{ textAlign: 'center' }}>
          <RegisterForm
            handleSubmitRegisterForm={this.handleSubmitRegisterForm}
            contestName={this.state.toRegisterContestName}
            contestID={this.state.toRegisterContestID}
          />
        </ModalBody>
        <ModalFooter style={{ justifyContent: 'center' }}>
          <Button color='warning' onClick={this.toggleModal}>Cancel</Button>{' '}
        </ModalFooter>
      </Modal>
      : null

    return (
      (this.state.contestList && this.state.contestList.length > 0
        ? <div style={{ textAlign: 'center' }}>
          <h5> List of contests </h5>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Table striped style={{ width: '90%' }}>
              <thead>
                <tr>
                  <th>Contest name</th>
                  <th>Duration</th>
                  <th>Author</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {contestsTable}
              </tbody>
            </Table>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {paginator}
          </div>
          {modalRegister}
          <ToastContainer />
        </div>
        : null)
    )
  }
}

export default Contest
