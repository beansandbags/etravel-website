import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Card, Button, Spinner, Table, Alert, Modal, Image, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';

import currencySymbol from 'currency-symbol-map';
import Rating from '@material-ui/lab/Rating';

const userApi = axios.create({
	baseURL: 'http://localhost:5000/profile'
})

const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
};

class ConfirmOrderHotel extends Component {
	state={
		currentUser: null,
		userHotel: null,
		currentUserTransactions: null,
		showModal: false,
	}
	constructor(props){
		super(props)
		userApi.get('/', config)
			.then(res => {
				this.setState({currentUser: res.data._id, userHotel: res.data.hotel, currentUserTransactions: res.data.transaction_h_hotel })
			})
		this.previousPage = this.previousPage.bind(this);
		this.checkOut = this.checkOut.bind(this);
		this.createEmailLink = this.createEmailLink.bind(this);
		this.createPhoneLink = this.createPhoneLink.bind(this);
	}

	previousPage(){
		this.props.history.goBack();
	}

	createEmailLink(email){
		var emailLink = "mailto:" + email
		return emailLink
	}

	createPhoneLink(phone){
		var phoneLink = phone.split(" ").join("")
		var phoneURIPrefix = "tel:"
		var phoneURI = phoneURIPrefix.concat(phoneLink)
		return phoneURI
	}


	async localCheckOut(){
		var tempTransaction = {
			hotelRawData: this.state.userHotel,
			date: Date.now(),
			value: this.state.userHotel.offers[0].price.total
		}
		this.setState(prevState => ({
			currentUserTransactions: [...prevState.currentUserTransactions, tempTransaction]
		}))
		this.setState({ userHotel: null })
	}

	checkOut(e){
		e.preventDefault()
		this.localCheckOut()
			.then(res => {
				userApi.put('/' + this.state.currentUser, {
					transaction_h_hotel: this.state.currentUserTransactions,
					hotel: this.state.userHotel
				})
				.then(res => {
					this.setState({ showModal: true })
					window.location = '/'
				})
			})
			.catch( err => console.log(err) )
	}

	render(){
		if(this.state.currentUser === null){
			return(
				<Container className="px-5 py-5">
				<Alert variant="light">
					<Row>
						<Col align="left">Loading Details</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
						</Row>
				</Alert>
			  </Container>	
			)
		} else if(this.state.userHotel === null){
			return(
				<section className="flights-background-img" style={{height: '100vh'}}>
					<Container className="px-5 py-5">
						<Alert className="bg-dark text-white">
							<Row>
								<Col align="left">Please select a hotel first</Col><Col align="right"><Button href="/hotels">Go Home</Button></Col>
							</Row>
						</Alert>
					</Container>	
				</section>
			)
		} else {
			return(
				<section className="flights-background-img">
					<Container className="px-5 py-5">
						<Modal show={this.state.showModal}>
							<Modal.Header>
								<Modal.Title>Purchase Successful</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								Have a nice stay!
							</Modal.Body>
							<Modal.Footer>
								<Button variant="primary" onClick={ this.redirectToHome }>Close</Button>
							</Modal.Footer>
						</Modal>
						<Card className="bg-dark text-white my-3">
							<Card.Header><Row><Col align="left">Price: {currencySymbol(this.state.userHotel.offers[0].price.currency)} {this.state.userHotel.offers[0].price.total}</Col></Row></Card.Header>
							<Container className="px-3 py-3">
								<Row>
									<Col>
										<Card className="bg-dark text-white">
											<Card.Header align="center" as="h6">{this.state.userHotel.hotel.name}</Card.Header>
											<Container className="px-3 py-3">
												<Row>
													<Col align="center">
														<Rating
															name="hotel-rating"
															value={ this.state.userHotel.hotel.rating }
															readOnly
														/>
													</Col>
												</Row>
												<Row>
													<Col>
														<Container className="px-3 py-3">{this.state.userHotel.hotel.description.text}</Container>
													</Col>
												</Row>
												<Row>
													<Container className="px-3 py-3">
														<Table size="sm" borderless variant="dark">
															<tr>
																<th>Address</th>
																<td>{this.state.userHotel.hotel.address.lines.map(line => 
																	<div>{line}</div>
																)}
																</td>
															</tr>
															<tr>
																<th>Room</th>
																<td>{this.state.userHotel.offers[0].room.description.text}</td>
															</tr>
														</Table>
													</Container>
												</Row>
												<Row>
													<Col> 
													<ButtonGroup style={{display: 'flex'}}>
														<OverlayTrigger
															placement="bottom"
															delay={{show: 100, hide: 400}}
															overlay={<Tooltip>
																		{this.state.userHotel.hotel.contact.email}
																	</Tooltip>}>
															<Button variant="danger" href={this.createEmailLink(this.state.userHotel.hotel.contact.email)}>Email</Button>
														</OverlayTrigger>
														<OverlayTrigger
															placement="bottom"
															delay={{show: 100, hide: 400}}
															overlay={<Tooltip>
																		{this.state.userHotel.hotel.contact.phone}
																	</Tooltip>}>
															<Button variant="success" href={this.createPhoneLink(this.state.userHotel.hotel.contact.phone)}>Phone</Button>
														</OverlayTrigger>
													</ButtonGroup>
													</Col>
												</Row>
											</Container>
										</Card>
									</Col>
									<Col>
										<Image src={this.state.userHotel.hotel.media[0].uri} alt="hotel" style={{width: '100%'}} rounded />
									</Col>
								</Row>
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
			)
		}
	}
}

export default ConfirmOrderHotel;