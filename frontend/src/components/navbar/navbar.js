import React, { Component } from 'react';
import { Navbar, Nav, Button, Popover, OverlayTrigger, Container, Card, Row, Col, Form, Image } from 'react-bootstrap';
import logo from '../../static/logo_small.png'
import Axios from 'axios';

const userApi = Axios.create({
  baseURL: 'http://localhost:5000/profile'
})

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};


class navbar extends Component {
  state={
    profileData: {},
    userExists: {
      type: Boolean
    },
    username: null,
    password: null
  }

  constructor(){
    super()
    userApi.get('/', config)
      .then(res => {
        if(res.data){
          console.log(res.data)
          this.setState({userExists: true})
        } else {
          this.setState({userExists: false})
        }
        this.setState({profileData: res.data})
      })
      .catch((err) => console.log(err))

      this.onUsernameChange = this.onUsernameChange.bind(this);
      this.onPasswordChange = this.onPasswordChange.bind(this);
  }

  async onUsernameChange(e){
    this.setState({ username: e.target.value })
  }

  async onPasswordChange(e){
    this.setState({ password: e.target.value })
  }

  submitLogin(e){
    e.preventDefault()
    var submitObject= this.state
    console.log(submitObject)
  }

	render() {
    const image = this.state.profileData.photo;
    var authenticationButton = <OverlayTrigger 
            trigger="click"
            placement="bottom-start"
            rootClose={ true }
            overlay={
              <Popover id="profile-data">
                <Card>
                <Card.Header as="h5" align="center">{this.state.profileData.name}</Card.Header>
                  <Container className="px-4 py-2" align="center">
                    <Row className="py-3">
                      <Col>
                        <Image src={ image } rounded />
                      </Col>
                    </Row>
                    <Row className="py-1">
                      <Button block size="sm">
                        Change Account Details
                      </Button>
                    </Row>
                    <Row className="py-1">
                      <Button block size="sm" href="http://localhost:3000/transactionHistory">
                        Transaction History
                      </Button>
                    </Row>
                    <Row className="py-1">
                      <Button block size="sm" variant="danger" href="http://localhost:5000/auth/logout">
                        Logout
                      </Button>
                    </Row>
                  </Container>
                </Card>
              </Popover>
            }>
              <Button variant="dark"><Image src={ image } rounded width="35" height="35" /></Button>
            </OverlayTrigger>
        
    if(this.state.userExists === false){
      authenticationButton = <OverlayTrigger
    trigger="click"
    placement="bottom-start"
    rootClose={ true }
    overlay={
      <Popover id="authentication-panel">
        <Card style={{width: '15rem'}}>
          <Container className="px-4 py-2">
            <Row>
              <Col>
                <Form.Group controlId="username">
                  <Row className="py-1">
                    <Form.Label>Existing User?</Form.Label>
                  </Row>
                  <Row className="py-1">
                    <Form.Control type="email" block size="sm" placeholder="Email ID" onChange={ (e) => this.onUsernameChange(e) }/>
                  </Row>
                  <Row className="py-1">
                    <Form.Control type="password" block size="sm" placeholder="Password" onChange={ (e) => this.onPasswordChange(e) }/>
                  </Row>
                  <Row className="pt-1">
                    <Button block size="sm" onClick={(e) => this.submitLogin(e)}>
                      Sign in
                    </Button>
                  </Row>
                </Form.Group>
              </Col>
            </Row>
            <Row className="py-2">
              <Col>
                <Row className="pt-1">
                  <Form.Label>New User?</Form.Label>
                </Row>
                <Row className="py-1">
                  <Button variant="danger" size="sm" block>
                    Register
                  </Button>
                </Row>
                <Row>
                  <Button className="font-weight-bold" variant="danger" size="sm" block href="http://localhost:5000/auth/google">
                    Google
                  </Button>
                </Row>
              </Col>
            </Row>
          </Container>
        </Card>
      </Popover>
    }
    >
  <Button variant="outline-light">Sign In</Button>
  </OverlayTrigger>
    }
  
		return(
		<Navbar bg="dark" expand="lg" variant="dark">
          <Navbar.Brand href="/">
            <img 
              src={ logo }
              width="20"
              height="30"
              className="d-inline-block align-top"
              alt="Adsoni Travels"
              />    
          </Navbar.Brand>
          <Navbar.Brand href="/">Adsoni Travels</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/">Flights</Nav.Link>
              <Nav.Link href="hotels">Hotels</Nav.Link>
            </Nav>
            { authenticationButton }
          </Navbar.Collapse>
        </Navbar>
		) 
	}
}

export default navbar;