import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';


const authApi = axios.create({
	baseURL: 'http://localhost:5000/auth'
})
  
const config = {
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json',
		'Access-Control-Allow-Origin': 'http://localhost:3000'
	},
};

class Login extends Component{
	state={
		username: null,
		password: null
	  }
	
	constructor(){
		super()
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
	var params = {
		username: this.state.username,
		password: this.state.password,
	}
	console.log(params)
	authApi.post('/localAuth', {username: params.username, password: params.password})
		.then(res => {
			console.log("1", res.data)
			alert("hi")
			authApi.post('/localRedirect', {username: params.username, password: params.password})
				.then(res => {
					console.log("second authAPI ", res.data)
					alert("hi2")
					authApi.post('/localRedirect', {username: params.username, password: params.password})
						.then(res => {
							console.log("third authAPI")
							alert("hi3")
						})
						.catch(err => {
							console.log(err)
							alert("err2")
						})
				})
				.catch(err => {
					console.log(err)
					alert("err")
				})
		})
		.catch(err => console.log(err))
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
											<Button variant="danger" size="sm" href="/registerNewUser" block>
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