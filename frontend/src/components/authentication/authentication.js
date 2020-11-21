import React, { Component } from 'react';
import axios from 'axios';

import '../flights/flights.css'
import { Container, Row, Col, Form, Card, Button } from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';


const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/flights'
})

const userApi = axios.create({
	baseURL: 'http://localhost:5000/auth'
})

const config = {
	withCredentials: true,
	headers: {
	  'Content-Type': 'application/json',
	},
  };

class RegisterNewUser extends Component {
	state = {
		username: null,
		password: null,
		userEmail: null,
		userLocation: null,
		CityArray: null,
		userLocationCode: null,
	}

	constructor(){
		super()
		amadeusApi.get('/citySearch', { params: { cityName: "lmnopq" } } )
		.then(res => {
			console.log("Loading Done")
			this.setState({ CityArray: res.data.cityData })
		 })
		.catch((err) => console.log(err))

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
		var params = JSON.stringify({
			email: this.state.userEmail,
			name: this.state.username,
			password: this.state.password,
			loc: this.state.userLocationCode,
		})
		console.log(params)
		userApi.get('/localAuth', params)
			.then(res => {
				console.log(res.data)
			})
			.catch(err => console.log(err))
	}

	render(){

		var isLoading = false;

		const handleLocationSearch = (query) => {
			isLoading = true
			amadeusApi.get('/citySearch', { params: { cityName: query } } )
			.then(res => {	
			console.log("Loading Done")
			this.setState({ CityArray: res.data.cityData })
			isLoading = false
		})
		}

		const onUserLocationChange = (query) => {
			this.setState({ userLocationCode: query[0].codeCity, userLocation: query })
		}

		return(
			<section className="flights-background-img">
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
								<Form.Group controlId="user-location">
									<Row>
										<Col>
											<Row>
												<Form.Label>Location</Form.Label>
											</Row>
											<Row>
												<AsyncTypeahead
													isLoading={ isLoading }
													onSearch={ handleLocationSearch }
													onChange={ onUserLocationChange }
													options={ this.state.CityArray }
													id="user-location"
													minLength={2}
													labelKey="nameCity"
													selected={ this.state.userLocation }
													placeholder="City"
													style={{width:"100%"}}
												/>
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