import React, { Component } from 'react'
import { Jumbotron, Container } from 'reactstrap'

class About extends Component {
  render () {
    return (
      <Container>
        <Jumbotron>
          <h1 className='display-3'>Virtual Contest Creator</h1>
          <p className='lead'>
            This app is designed to simulate Codechef contests in virtual mode,
            is a hybrid between a2oj where you can create virtual contests and
            codeforces Gym when you can start the contest at any time, but
            especially for Codechef.
          </p>
          <p>
            The virtual contest creator was developed in order to participate
            in the <a href='https://www.codechef.com/CAH1801'>CodeChef API Hackathon powered by Alibaba Cloud</a>
          </p>

          <p>
            You can find all the necesary information about this project in the
            <a href='https://github.com/jhonber/codechef-virtual-contest'> Github Repo</a>
          </p>
          <hr className='my-2' />

          <p>Made by <a href='https://github.com/jhonber/'>Jhon Jimenez</a>
          and <a href='https://github.com/pin3da/'>Manuel Pineda</a></p>

        </Jumbotron>
      </Container>
    )
  }
}

export default About
