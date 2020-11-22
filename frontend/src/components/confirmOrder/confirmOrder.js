import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Card, Button, Spinner, Table, Alert, Modal } from 'react-bootstrap';

import currencySymbol from 'currency-symbol-map';

const userApi = axios.create({
	baseURL: 'http://localhost:5000/profile'
})

const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
};

class ConfirmOrder extends Component {
	state={
		currentUser: null,
		userFlight: null,
		currentUserTransactions: null,
		showModal: false,
	}

	constructor(props){
		super(props)
		userApi.get('/', config)
			.then(res => {
				this.setState({ currentUser: res.data._id, userFlight: res.data.ticket, currentUserTransactions: res.data.transaction_h }, console.log(this.state))
			})
		this.previousPage = this.previousPage.bind(this);
		this.checkOut = this.checkOut.bind(this);
	}

	previousPage(){
		this.props.history.goBack();
	}

	async localCheckOut(){
		var tempTransaction = {
			flightRawData: this.state.userFlight,
			date: Date.now(),
			value: this.state.userFlight.price.total
		}
		this.setState(prevState => ({
			currentUserTransactions: [...prevState.currentUserTransactions, tempTransaction]
		}))
		this.setState({ userFlight: null })
	}

	checkOut(e) {
		e.preventDefault();
		this.localCheckOut()
			.then(res => {
				userApi.put('/' + this.state.currentUser, {
					transaction_h: this.state.currentUserTransactions,
					ticket: this.state.userFlight
				})
				.then(res => {
					this.setState({ showModal: true })
					window.location = '/'
				})
			})
			.catch(err => console.log(err))
	}

	render(){
		if(this.state.currentUser === null){
			return(
				<section className="flights-background-img">
					<Container className="px-5 py-5">
						<Alert variant="light">
							<Row>
								<Col align="left">Loading Search Results</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
								</Row>
						</Alert>
					  </Container>	
				</section>
			)
		} else if(this.state.userFlight === null){
			return(
			<section className="flights-background-img" style={{height: '100vh'}}>
					<Container className="px-5 py-5">
						<Alert className="bg-dark text-white">
							<Row>
								<Col align="left">Please select a flight first</Col><Col align="right"><Button href="/">Go Home</Button></Col>
							</Row>
						</Alert>
					  </Container>	
				</section>
				)
		} else {

		return(
			<section className="flights-background-img">
				<Container className="px-5 py-5" style={{height: '100vh'}}>
					<Modal show={this.state.showModal}>
						<Modal.Header>
							<Modal.Title>Purchase Successful</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							Have a nice trip!
						</Modal.Body>
						<Modal.Footer>
							<Button variant="primary" onClick={ this.redirectToHome }>Close</Button>
						</Modal.Footer>
					</Modal>
					<Card className="bg-dark text-white my-3">
						<Card.Header><Col align="left">Price: {currencySymbol(this.state.userFlight.price.currency)} {this.state.userFlight.price.total}</Col></Card.Header>
							<Container className="px-3 py-3">
							{ 
								this.state.userFlight.itineraries[0].segments.map(segment => 
									<Card className="bg-dark text-white">
										<Card.Header><Row><Col align="left">Segment ID: {segment.id}</Col><Col align="right">Duration: {segment.duration.replace(/PT(\d+)H(\d+)M/, "$1 hours $2 minutes")}</Col></Row></Card.Header>
										<Container className="px-3 py-3">
											<Row>
												<Col>
													<Card className="bg-dark text-white">
														<Card.Header align="center" as="h6">Departure</Card.Header>
														<Container>
															<Table size="sm" borderless variant="dark">
																	<tr>
																		<th>Departing From</th>
																		<td>{ segment.departure.iataCode }</td>
																	</tr>
																	<tr>
																		<th>Terminal</th>
																		<tr>{ segment.departure.terminal }</tr>
																	</tr>
																	<tr>
																		<th>At</th>
																		<tr>{ segment.departure.at }</tr>
																	</tr>
																	<tr>
																		<th>Time</th>
																		<tr>{ new Date(segment.departure.at).toLocaleTimeString('en-GB')}</tr>
																	</tr>
															</Table>
														</Container>
													</Card>
												</Col>
												<Col>
													<Card className="bg-dark text-white">
														<Card.Header align="center" as="h6">Arrival</Card.Header>
														<Container>
															<Table size="sm" borderless variant="dark">
																	<tr>
																		<th>Arriving At</th>
																		<td>{ segment.arrival.iataCode }</td>
																	</tr>
																	<tr>
																		<th>Terminal</th>
																		<tr>{ segment.arrival.terminal }</tr>
																	</tr>
																	<tr>
																		<th>At</th>
																		<tr>{ new Date(segment.arrival.at).toLocaleDateString('en-GB') }</tr>
																	</tr>
																	<tr>
																		<th>Time</th>
																		<tr>{ new Date(segment.arrival.at).toLocaleTimeString('en-GB')}</tr>
																	</tr>
															</Table>
														</Container>
													</Card>
												</Col>
											</Row>
										</Container>
									</Card>
								) 
							}
						</Container>
					</Card>	
					<Card className="bg-dark text-white">
						<Container className="px-3 py-3">
							<Row>
								<Col align="left">
									<Button variant="danger" onClick={this.previousPage}>Go Back</Button>
								</Col>
								<Col align="right">
									<Button variant="primary" onClick={this.checkOut}>Confirm Purchase</Button>
								</Col>
							</Row>
						</Container>
					</Card>
				</Container>
			</section>
		)}
	}
}

export default ConfirmOrder;