import React, { Component } from 'react';
import axios from 'axios';
import queryString from 'query-string';

import { Container, Row, Col, Card, Button, Spinner, Breadcrumb, Table, Alert, Modal, Image, ButtonGroup } from 'react-bootstrap';

import ReactMapboxGl, { GeoJSONLayer } from 'react-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import Rating from '@material-ui/lab/Rating';

import currencySymbol from 'currency-symbol-map';

const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/hotels'
})

const userApi = axios.create({
	baseURL: 'http://localhost:5000/profile'
})

const Map = ReactMapboxGl({
	accessToken: 'pk.eyJ1Ijoic29oYW1iYWdjaGkxMDgwIiwiYSI6ImNraHdsZXdhZTF4emgyc2t6amJ5Y3BvcWUifQ.dnHFhLq8_IQWUV9IMf1F8w'
})

const config = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
};

const symbolLayout = {
	'text-field': '{place}',
	'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
	'text-offset': [0, 0.6],
	'text-anchor': 'top',
	'text-size': 20
  };
const symbolPaint = {
	'text-color': 'white'
  };
  
  const circleLayout = { visibility: 'visible' };
  const circlePaint = {
	'circle-color': 'white'
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
		geoJSON_features: null,
		cityCentre: null,
	}

	constructor(props){
		super(props)
		var params = queryString.parse(this.props.location.search)
		this.state.cityCentre = {lat: params.cityLat, lng: params.cityLong}
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
					this.setState({ hotelOffersSearchResults: res.data.hotels, hotelOffersCount: res.data.count, cityCentre: [params.cityLong, params.cityLat]}, this.updateGeoJSON_features)
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

	async updateGeoJSON_features() {
		var geoJSON_feats = []
		var i = 0;
		var cityLatitude = 0;
		var cityLongitude = 0;
			for(i = 0; i < this.state.hotelOffersCount; i++) {
				cityLatitude += this.state.hotelOffersSearchResults[i].hotel.latitude
				cityLongitude += this.state.hotelOffersSearchResults[i].hotel.longitude
				var temp_feature = {
					type: 'Feature',
					geometry: {
						type: 'Point',
						coordinates: [this.state.hotelOffersSearchResults[i].hotel.longitude, this.state.hotelOffersSearchResults[i].hotel.latitude]
					},
					properties: {
						place: this.state.hotelOffersSearchResults[i].hotel.name,
						//price: {
						//	currency: this.state.hotelOffersSearchResults[i].offers[0].price.currency,
						//	total: this.state.hotelOffersSearchResults[i].offers[0].price.total
						//},
						//img_link: this.state.hotelOffersSearchResults[i].hotel.media[0].uri,
						//rating: this.state.hotelOffersSearchResults[i].hotel.rating,
						//description: this.state.hotelOffersSearchResults[i].hotel.description,
						//address: this.state.hotelOffersSearchResults[i].hotel.address.lines,
						//room_description: this.state.hotelOffersSearchResults[i].offers[0].room.description.text,
						//contact: this.state.hotelOffersSearchResults[i].hotel.contact
					}
				}
				geoJSON_feats.push(temp_feature)
			}
			cityLatitude = cityLatitude/(i)
			cityLongitude = cityLongitude/(i)
		this.setState({geoJSON_features: { type: 'FeatureCollection', features: geoJSON_feats }, cityCentre: [cityLongitude, cityLatitude]}, this.showGeoJSON)
	}

	async showGeoJSON() {
		console.log(this.state)
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
		console.log("render ", this.state)
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
							<Card className="bg-dark text-white my-3">
								<div style={{height: '50vh', width: '100%'}}>
									<Map
										style="mapbox://styles/mapbox/dark-v10"
										containerStyle={{
											height: '50vh',
											width: '100%'
										}}
										center={ this.state.cityCentre }
										zoom={[12]}
										>
										<GeoJSONLayer
											data={this.state.geoJSON_features}
											circleLayout={circleLayout}
											circlePaint={circlePaint}
											circleOnClick={(e) => console.log(e)}
											symbolLayout={symbolLayout}
											symbolPaint={symbolPaint}
										/>
										</Map>
								</div>
							</Card>	
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
							</Row>
					</Container>
				</section>
			)
		}


	}

}

export default HotelSearchResults;