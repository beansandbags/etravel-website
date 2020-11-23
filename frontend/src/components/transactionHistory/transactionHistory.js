import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Card, Spinner, Table, Alert, CardGroup } from 'react-bootstrap';

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
		userExists: false,
	}

	constructor(){
		super()
		userApi.get('/', config)
			.then(res => {
				this.setState({ 
					currentUser: res.data._id, 
					currentUserFlightHistory: res.data.transaction_h, 
					currentUserHotelHistory: res.data.transaction_h_hotels })
				if(this.setState.currentUser != null){
					this.setState({ userExists: true })
				} else {
					this.setState({ userExists: false })
				}
			})
	}

	render(){
		
		if(this.state.userExists === true){
			return(
				<section className="flights-background-img" style={{height: '100vh'}}>
					<Container className="px-5 py-5">
						<Alert variant="light">
							<Row>
								<Col align="left">Loading Search Results</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
								</Row>
						</Alert>
					  </Container>	
				</section>
			)
		} else {
			var flightData;
			var hotelData;
			if(this.state.currentUserFlightHistory.length === undefined){
				flightData = <Container className="px-3 py-3">
				There are no flights in your purchase history
				</Container>
			} else {
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
		} else {
			hotelData = <Container className="px-3 py-3">
			{this.state.currentUserHotelHistory.map(flights => 
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