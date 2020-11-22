import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';


const userApi = axios.create({
	baseURL: 'http://localhost:5000/profile'
})
  
const config = {
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
	},
};

class Login extends Component{
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
	
	render(){
		return(
			<section className="flights-background-img" style={{height: '100vh'}}>
				<Container className="px-5 py-5">
					<Col align="center">
							<Card align="center" style={{width: '25rem'}}>
								<Container className="px-5 py-4">
									<Row>
										<Col>
											<Form.Group controlId="username">
												<Row className="py-1">
													<Form.Label>Existing User?</Form.Label>
												</Row>
												<Row className="py-1">
													<Form.Control type="email" block placeholder="Email ID" onChange={ (e) => this.onUsernameChange(e) }/>
												</Row>
												<Row className="py-1">
													<Form.Control type="password" block placeholder="Password" onChange={ (e) => this.onPasswordChange(e) }/>
												</Row>
												<Row className="pt-1">
													<Button block onClick={(e) => this.submitLogin(e)}>
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
						</Col>
				</Container>
			</section>
		)
	}
}

export default Login;