import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';

const userApi = axios.create({
	baseURL: 'http://localhost:5000/auth'
})


class RegisterNewUser extends Component {
	state = {
		username: null,
		password: null,
		userEmail: null,
	}

	constructor(){
		super()
		this.onUsernameChange = this.onUsernameChange.bind(this);
		this.onPasswordChange = this.onPasswordChange.bind(this);
		this.onUserEmailChange = this.onUserEmailChange.bind(this);
	}

	async onUsernameChange(e){
		this.setState({ username: e.target.value })
	}

	async onPasswordChange(e){
		this.setState({ password: e.target.value })
	}

	async onUserEmailChange(e){
		this.setState({ userEmail: e.target.value })
	}

	onSubmit(e){
		e.preventDefault()
		var params = {
			email: this.state.userEmail,
			name: this.state.username,
			password: this.state.password,
		}
		console.log(params)
		userApi.post('/createNewUser', {params})
			.then(res => {
				console.log(res.data)
				window.location = '/login'
			})
			.catch(err => console.log(err))
	}

	render(){

		return(
			<section className="flights-background-img" style={{height: '100vh'}}>
				<Container className="py-5" style={{width:'50rem'}}>
					<Card>
						<Card.Header as="h4">Register</Card.Header>
						<Container className="pb-5 pt-3 px-5">
							<Form>
								<Form.Group controlId="user-name">
									<Row>
										<Col>
											<Row>
												<Form.Label>Full Name</Form.Label>
											</Row>
											<Row>
												<Form.Control type="name" placeholder="Full Name" onChange={ this.onUsernameChange } block/>
											</Row>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="user-email">
									<Row>
										<Col>
											<Row>
												<Form.Label>Email ID</Form.Label>
											</Row>
											<Row>
												<Form.Control type="email" placeholder="Email ID" onChange={ this.onUserEmailChange } block/>
											</Row>
										</Col>
									</Row>
								</Form.Group>
								<Form.Group controlId="password">
									<Row>
										<Col>
											<Row>
												<Form.Label>Password</Form.Label>
											</Row>
											<Row>
												<Form.Control type="password" placeholder="Password" onChange={ this.onPasswordChange } block/>
											</Row>
										</Col>
									</Row>
								</Form.Group>
								<Row>
									<Button block variant="success" onClick={ (e) => this.onSubmit(e) }>
										Register
									</Button>
								</Row>
							</Form>
						</Container>
					</Card>
				</Container>
			</section>
		)
	}
}


export default RegisterNewUser;