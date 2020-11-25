import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Card, Spinner, Table, Alert, CardGroup } from 'react-bootstrap';
import Rating from '@material-ui/lab/Rating';

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

class TransactionHistory extends Component{
	state={
		currentUser: null,
		currentUserFlightHistory: [],
		currentUserHotelHistory: [],
		userExists: null,
	}

	constructor(){
		super()
		userApi.get('/', config)
			.then(res => {
				this.setState({ 
					currentUser: res.data._id, 
					currentUserFlightHistory: res.data.transaction_h, 
					currentUserHotelHistory: res.data.transaction_h_hotel })
				if(this.state.currentUser != null){
					this.setState({ userExists: true })
				} else {
					this.setState({ userExists: false })
				}
			})
	}

	render(){
		if(this.state.userExists === false){
			return(
				<section className="flights-background-img" style={{height: '100%'}}>
					<Container className="px-5 py-5">
						<Alert variant="light">
							<Row>
								<Col align="left">Loading Data</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
								</Row>
						</Alert>
					  </Container>	
				</section>
			)
		} 
		else {
			var flightData;
			var hotelData;
			if(this.state.currentUserFlightHistory.length === undefined){
				flightData = <Container className="px-3 py-3">
				There are no flights in your purchase history
				</Container>
			} 
			else {
				flightData = <Container className="px-3 py-3">
				{this.state.currentUserFlightHistory.map(flights => 
					<Card className="bg-dark text-white my-3">
						<Card.Header>{new Date(flights.date).toLocaleString('en-GB')}</Card.Header>
						<Container className="px-3 py-3">
							<Table size="sm" borderless variant="dark">
								<tr>
									<th>Departure</th>
									<td>{flights.flightRawData.itineraries[0].segments[0].departure.iataCode }</td>
								</tr>
								<tr>
									<th>Arrival</th>
									<td>{flights.flightRawData.itineraries[0].segments[flights.flightRawData.itineraries[0].segments.length-1].arrival.iataCode }</td>
								</tr>
								<tr>
									<th>No. of Flights</th>
									<td>{flights.flightRawData.itineraries[0].segments.length }</td>
								</tr>
								<tr>
									<th>Price</th>
									<td>{currencySymbol(flights.flightRawData.price.currency)} {flights.flightRawData.price.total}</td>
								</tr>
								<tr>
									<th>No. of Travelers</th>
									<td>{flights.flightRawData.travelerPricings.length}</td>
								</tr>
							</Table>
						</Container>
					</Card>
					)}
				</Container>
			} 

			if(this.state.currentUserHotelHistory.length === 0){
				hotelData = <Container className="px-3 py-3">
					There are no hotels in your purchase history
				</Container>
			} 
			else {
				hotelData = <Container className="px-3 py-3">
					{this.state.currentUserHotelHistory.map(hotels => 
						<Card className="bg-dark text-white my-3">
							<Card.Header>{new Date(hotels.date).toLocaleString('en-GB')}</Card.Header>
							<Container className="px-3 py-3">
								<Table size="sm" borderless variant="dark">
									<tr>
										<th>Name</th>
										<td>{ hotels.hotelRawData.hotel.name }</td>
									</tr>
									<tr>
										<th>Location</th>
										<td>{ hotels.hotelRawData.hotel.address.cityName }</td>
									</tr>
									<tr>
										<th>Rating</th>
										<td><Rating	name="hotel-rating" value={ hotels.hotelRawData.hotel.rating }	readOnly/></td>
									</tr>
									<tr>
										<th>Price</th>
										<td>{currencySymbol(hotels.hotelRawData.offers[0].price.currency)} {hotels.hotelRawData.offers[0].price.total}</td>
									</tr>
									<tr>
										<th>No. of Guests</th>
										<td>{hotels.hotelRawData.offers[0].guests.adults}</td>
									</tr>
								</Table>
							</Container>
						</Card>
						)}
				</Container>
			}

			return(
				<section className="flights-background-img" style={{height: '100%'}}>
					<Container className="px-5 py-5">
						<CardGroup>
							<Card className="bg-dark text-white">
								<Card.Header><Col align="center">Flights</Col></Card.Header>
								{ flightData }
							</Card>
							<Card className="bg-dark text-white">
								<Card.Header><Col align="center">Hotels</Col></Card.Header>
								{ hotelData }
							</Card>
						</CardGroup>
					</Container>
				</section>
			)
		}
	}
}

export default TransactionHistory;