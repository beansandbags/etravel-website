import React, { Component } from 'react';
import axios from 'axios';
import queryString from'query-string';

import { Container, Row, Col, Card, Button, Spinner, Breadcrumb, Table, Alert, Modal, Image, ButtonGroup } from 'react-bootstrap';

import Rating from '@material-ui/lab/Rating';

import currencySymbol from 'currency-symbol-map';

const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/hotels'
})

const userApi = axios.create({
	baseURL: 'http://localhost:5000/profile'
})

const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
};

class HotelSearchResults extends Component {
	state = {
		cityCode: null,
		checkInDate: null,
		checkOutDate: null,
		adults: null,
		roomQuantity: null,
		currentUser: null,
		userExists: false,
		showModal: false,
		hotelOffersSearchResults: null,
		hotelOffersCount: null,
	}

	constructor(props){
		super(props)
		var params = queryString.parse(this.props.location.search)
		amadeusApi.get('/hotelOffers', {params: {
			cityCode: params.cityCode,
			checkInDate: params.checkInDate,
			checkOutDate: params.checkOutDate,
			adults: params.adults,
			roomQuantity: params.roomQuantity,
			radius: 30,
			radiusUnit: 'KM',
		}})
			.then(res => {
				if(res.data.count != null){
					this.setState({ hotelOffersSearchResults: res.data.hotels, hotelOffersCount: res.data.count })
				}
			})
		userApi.get('/', config)
			.then(res => {
				this.setState({ currentUser: res.data._id })
				if(this.state.currentUser != null){
					this.setState({ userExists: true })
				} else {
					this.setState({ userExists: false })
				}
			})
		this.createEmailLink = this.createEmailLink.bind(this);
		this.createPhoneLink = this.createPhoneLink.bind(this);
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

	submit(hotel){
		if(this.state.userExists === false){
			this.setState({ showModal: true })
		} else {
			userApi.put('/' + this.state.currentUser, { hotel: hotel })
				.then(res => {
					window.location = '/confirmOrderHotel'
				})
				.catch(err => {
					console.log(err)
				})
		}
	}

	redirectToLogin(e){
		window.location = '/login'
	}

	render(){
		if(this.state.hotelOffersSearchResults === null && this.state.hotelOffersCount === null){
			return(
				<section className="flights-background-img" style={{height: '100vh'}}>
					<Container className="px-5 py-5">
					  <Breadcrumb>
						  <Breadcrumb.Item href="/hotels">Hotels</Breadcrumb.Item>
						  <Breadcrumb.Item active>Hotel Search Results</Breadcrumb.Item>
					  </Breadcrumb>
					  <Alert variant="light">
						  <Row>
							  <Col align="left">Loading Search Results</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
							  </Row>
					  </Alert>
					</Container>	
				</section>
			)
		} else if(this.state.hotelOffersSearchResults != null && this.state.hotelOffersCount === 0){
			return(
				<section className="flights-background-img" style={{height: '100vh'}}>
				  <Container className="px-5 py-5">
					<Breadcrumb>
						<Breadcrumb.Item href="/hotels">Hotels</Breadcrumb.Item>
						<Breadcrumb.Item active>Hotel Search Results</Breadcrumb.Item>
					</Breadcrumb>
					<Alert>
						No Hotels Found
					</Alert>
				  </Container>
				</section>
			)
		} else {

			return(
				<section className="flights-background-img" style={{height: '100%'}}>
					<Container className="px-5 py-5" >
						<Modal show={this.state.showModal}>
							<Modal.Header>
								<Modal.Title>Error</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								You are not logged in, redirecting you to login
							</Modal.Body>
							<Modal.Footer>
								<Button variant="danger" onClick={this.redirectToLogin}>Login</Button>
							</Modal.Footer>
						</Modal>
						<Breadcrumb>
							<Breadcrumb.Item href="/hotels">Hotels</Breadcrumb.Item>
							<Breadcrumb.Item active>Hotel Search Results</Breadcrumb.Item>
						</Breadcrumb>	
						<Row>
							<Col>
							{this.state.hotelOffersSearchResults.map(hotelOffers => 
							<Card className="bg-dark text-white my-3">
								<Card.Header><Row><Col align="left">Price: {currencySymbol(hotelOffers.offers[0].price.currency)} {hotelOffers.offers[0].price.total}</Col><Col align="right"><Button size="sm" variant="danger" onClick={this.submit.bind(this, hotelOffers)}>Buy Now</Button></Col></Row></Card.Header>
								<Container className="px-3 py-3">
									<Row>
										<Col>
											<Image src={hotelOffers.hotel.media[0].uri} alt="hotel" style={{width: '100%'}} rounded />
										</Col>
										<Col>
											<Card className="bg-dark text-white">
												<Card.Header align="center" as="h6">{hotelOffers.hotel.name}</Card.Header>
												<Container className="px-3 py-3">
													<Row>
														<Col align="center">
															<Rating
																name="hotel-rating"
																value={ hotelOffers.hotel.rating }
																readOnly
															/>
														</Col>
													</Row>
													<Row>
														<Col>
															<Container className="px-3 py-3">{hotelOffers.hotel.description.text}</Container>
														</Col>
													</Row>
													<Row>
														<Container className="px-3 py-3">
															<Table size="sm" borderless variant="dark">
																<tr>
																	<th>Address</th>
																	<td>{hotelOffers.hotel.address.lines.map(line => 
																		<div>{line}</div>
																	)}
																	</td>
																</tr>
																<tr>
																	<th>Room</th>
																	<td>{hotelOffers.offers[0].room.description.text}</td>
																</tr>
															</Table>
														</Container>
													</Row>
													<Row>
														<Col> 
														<ButtonGroup style={{display: 'flex'}}>
															<Button variant="danger" href={this.createEmailLink(hotelOffers.hotel.contact.email)}>Email</Button>
															<Button variant="success" href={this.createPhoneLink(hotelOffers.hotel.contact.phone)}>Phone</Button>
														</ButtonGroup>
														</Col>
													</Row>
												</Container>
											</Card>
										</Col>
									</Row>
								</Container>
							</Card>
							)}	
							</Col>
							<Col style={{position: 'fixed'}}>
								
							</Col>
							</Row>
					</Container>
				</section>
			)
		}


	}

}

export default HotelSearchResults;