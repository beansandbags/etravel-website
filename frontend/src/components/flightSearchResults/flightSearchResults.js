import React, { Component } from 'react';
import axios from 'axios';
import queryString from'query-string';

import '../flights/flights.css'
import { Container, Row, Col, Card, Button, Spinner, Breadcrumb, Table, Alert } from 'react-bootstrap';

import currencySymbol from 'currency-symbol-map';

const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/flights'
})

class FlightSearchResults extends Component {
	state = {
		sourceLoc: null,
		desLoc: null,
		startDate: null,
		returnDate: null,
		ticketAdults: 0,
		ticketChildren: 0,
		ticketInfants: 0,
		travelClass: null,
		flightOffersSearchResults: null,
		flightOffersCount: null,
		flightDetailsDictionary: null,
		flightDetailsMetadata: null,
	}
	constructor(props){
		super(props)
		var params = queryString.parse(this.props.location.search)
		amadeusApi.get('/flightOffers', {params: {
			depart: params.sourceLoc,
			arrive: params.desLoc,
			departDate: params.startDate,
			returnDate: params.returnDate,
			adults: params.adults,
			children: params.ticketChildren,
			infants: params.ticketInfants,
			travelClass: params.travelClass
		}})
			.then(res => {
				if(res.data.count!=null){
					this.setState({ flightOffersSearchResults: res.data.offersData, flightOffersCount: res.data.count, flightDetailsDictionary: res.data.dictionary })
				}
			})
	}

	async fetchFlightSearchResults(){

	}

	render() {
		
		  if(this.state.flightOffersSearchResults === null && this.state.flightOffersCount === null){
			  return(
				  <section className="flights-background-img">
					  <Container className="px-5 py-5">
						<Breadcrumb>
							<Breadcrumb.Item href="/">Flights</Breadcrumb.Item>
							<Breadcrumb.Item active>Flight Search Results</Breadcrumb.Item>
						</Breadcrumb>
						<Alert variant="light">
							<Row>
								<Col align="left">Loading Search Results</Col><Col align="right"><Spinner animation="border"></Spinner></Col>
								</Row>
						</Alert>
					  </Container>	
				  </section>
			  )
		  } else if(this.state.flightOffersSearchResults === null && this.state.flightOffersCount === 0){
			return(
				<section className="flights-background-img">
				  <Container className="px-5 py-5">
					<Breadcrumb>
						<Breadcrumb.Item href="/">Flights</Breadcrumb.Item>
						<Breadcrumb.Item active>Flight Search Results</Breadcrumb.Item>
					</Breadcrumb>
					<Alert>
						No Flights Found
					</Alert>
				  </Container>
				</section>
			)
		  } else {

		  return(
			<section className="flights-background-img">
				<Container className="px-5 py-5" >
					<Breadcrumb>
						<Breadcrumb.Item href="/">Flights</Breadcrumb.Item>
						<Breadcrumb.Item active>Flight Search Results</Breadcrumb.Item>
					</Breadcrumb>
					{this.state.flightOffersSearchResults.map(flightOffers => 
						<Card className="bg-dark text-white my-3">
							<Card.Header><Row><Col align="left">Price: {currencySymbol(flightOffers.price.currency)} {flightOffers.price.total}</Col><Col align="right"><Button size="sm" variant="danger">Buy Now</Button></Col></Row></Card.Header>
							<Container className="px-3 py-3">
							{ 
								flightOffers.itineraries[0].segments.map(segment => 
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
						)
						}
						
				</Container>
			</section>
			)
		}
	}
}

export default FlightSearchResults;