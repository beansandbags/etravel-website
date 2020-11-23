import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Card, OverlayTrigger, Popover, Button } from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/hotels'
})

class Hotels extends Component {
	state = {
		city: null,
		checkInDate: null,
		checkOutDate: null,
		adults: 1,
		children: 0,
		formFieldsFilled: false,
		checkInDateParsed: null,
		checkOutDateParsed: null,
		cityArray: null,
		roomQuantity: 1,
	}
	constructor(){
		super()
		amadeusApi.get('/citySearch', { params: { cityName: "lmnopq" } } )
		.then(res => {
			this.setState({ cityArray: res.data.cityData })
		 })
		.catch((err) => console.log(err))
	}

	async checkFormFields(){
		if(this.state.adults < 0){
			this.setState({adults: 0})
		}
		if(this.state.children < 0){
			this.setState({children: 0})
		}
		if(this.state.roomQuantity < 0){
			this.setState({roomQuantity: 0})
		}
		if(
			this.state.adults > 0 &&
			this.state.city != null &&
			this.state.checkInDate != null &&
			this.state.checkOutDate != null &&
			this.state.roomQuantity > 0
			)
			{
				this.setState({formFieldsFilled: true})
			} else {
				this.setState({formFieldsFilled: false})
			}
	}

	padTheDates(number, digits){
		if(digits === 2){
			return ("00"+ number).slice(-2)
		} else {
			return ("0000" + number).slice(-4)
		}
	}

	async onCheckInDateChange(date){
		let [startMonth, startDate, startYear] = new Date(date).toLocaleDateString("en-US").split("/")
		var startDateParseString = this.padTheDates(startYear, 4) + "-" + this.padTheDates(startMonth, 2) + "-" + this.padTheDates(startDate, 2)
		this.setState({ checkInDate: date }, this.checkFormFields)
		this.setState({checkInDateParsed: startDateParseString}, this.checkFormFields)
	}
	
	async onCheckOutDateChange(date){
		let [returnMonth, returnDate, returnYear] = new Date(date).toLocaleDateString("en-US").split("/")
		var returnDateParseString = this.padTheDates(returnYear, 4) + "-" + this.padTheDates(returnMonth, 2) + "-" + this.padTheDates(returnDate, 2)
		this.setState({ checkOutDate: date }, this.checkFormFields)
		this.setState({ checkOutDateParsed: returnDateParseString}, this.checkFormFields)
	}

	async onCountChangeManual(event, type){
		if(type === 0){
			this.setState({ children: Number(event.target.value)}, this.checkFormFields)
		} if(type === 1){
				this.setState({ adults: Number(event.target.value)}, this.checkFormFields)
		} if(type === 2){
				this.setState({ roomQuantity: Number(event.target.value)}, this.checkFormFields)
		}else {
			console.log("Invalid input")
		}
	}

	async onCountClick(event, type, delta){
		event.preventDefault()
		if(type === 0){
			var cTC = this.state.children
			cTC += delta
			this.setState({ children: cTC }, this.checkFormFields)
		} if(type === 1){
			var aTC = this.state.adults
			aTC += delta
			this.setState({ adults: aTC }, this.checkFormFields)
		} if(type === 2){
			var rQ = this.state.roomQuantity
			rQ += delta
			this.setState({ roomQuantity: rQ }, this.checkFormFields)
		} else {
			console.log("Invalid input")
		}
	}

	submit(e){
		e.preventDefault()
		var hotelSearchResultString = "?"
		if(this.state.city !== null){
			var cityCodeURL = "&cityCode=" + this.state.city[0].iata
			hotelSearchResultString = hotelSearchResultString.concat(cityCodeURL)
		}
		if(this.state.checkInDate !== null){
			var checkInDateURL = "&checkInDate=" + this.state.checkInDateParsed
			hotelSearchResultString = hotelSearchResultString.concat(checkInDateURL)
		}
		if(this.state.returnDate !== null){
			var checkOutDateURL = "&checkOutDate=" + this.state.checkOutDateParsed
			hotelSearchResultString = hotelSearchResultString.concat(checkOutDateURL)
		}
		if(this.state.adults > 0){
			var adultURL
			if(this.state.adults > 2){
				adultURL = "&adults=" + this.state.adults
			} else {
				adultURL = "&adults=" + 2
			}
			hotelSearchResultString = hotelSearchResultString.concat(adultURL)
		}
		if(this.state.roomQuantity > 0){
			var roomQuantityURL = "&roomQuantity=" + this.state.roomQuantity
			hotelSearchResultString = hotelSearchResultString.concat(roomQuantityURL)
		}
		window.location = '/hotelSearchResults' + hotelSearchResultString
	}

	render() {
		let [month, date, year] = new Date(Date.now()).toLocaleDateString("en-US").split("/")
		const future = new Date(String(Number(year)+1), String(Number(month)-1), date)

		var startDatePlaceholder
		var returnDatePlaceholder

		var returnCalStartDate
		var submitButtonControl

		if(this.state.checkInDate !== null){
			let [startMonth, startDate, startYear] = new Date(this.state.checkInDate).toLocaleDateString("en-US").split("/")
			startDatePlaceholder = startDate + "/" + startMonth + "/" + startYear
			returnCalStartDate = new Date(this.state.checkInDate)
		} else {
			startDatePlaceholder = null
			returnCalStartDate = new Date(Date.now())
		}

		if(this.state.checkOutDate !== null){
			let [returnMonth, returnDate, returnYear] = new Date(this.state.checkOutDate).toLocaleDateString("en-US").split("/")
			returnDatePlaceholder = returnDate + "/" + returnMonth + "/" + returnYear			
		} else {
			returnDatePlaceholder = null
		}

		if(this.state.formFieldsFilled){
			submitButtonControl = <Button variant="light" type="submit" block onClick={ (e) => this.submit(e) }>Search</Button>
		} else {
			submitButtonControl = <Button variant="light" type="submit" block disabled>Search</Button>
		}

		var totalTicketCount = this.state.children + this.state.adults

		var quantityClassString = totalTicketCount + " Traveler(s), " + this.state.roomQuantity + " Room(s)"

		var isLoading = false

		const handleSourceSearch = (query) => {
			isLoading = true
			amadeusApi.get('/citySearch', { params: { cityName: query } } )
			.then(res => {
			console.log("Loading Done")
			this.setState({ cityArray: res.data.cityData })
			isLoading = false
		})
		}
		
		
		const handleSourceChange = (query) => {
			this.setState({city: query}, console.log(query))
		}

		return(
			<section className="flights-background-img" style={{height: '100vh'}}>
				<Container className="px-5 py-5 space-between" >
					<Card className="bg-dark text-white mx-4 my-4" style={{ width: '30rem', height: '24.5rem' }}>
						<Form className="px-4 py-4">
							<Row>
								<Col>
									<Form.Group controlId="formGroupSource">
										<Form.Label>Select City/Location</Form.Label>
										<AsyncTypeahead
											className="bg-dark text-white"
											isLoading={ isLoading }
											onSearch={ handleSourceSearch }
											onChange={ handleSourceChange }
											options={this.state.cityArray}
											id="source-loc"
											minLength={2}
											labelKey="cityCountryString"
											selected={this.state.city}
											placeholder="City"
											/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="formGroupDate">
										<Form.Label>Check In</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose= { true }
											overlay={ 
												<Popover>
													<Calendar 
													minDate={ new Date(Date.now()) } 
													maxDate={ new Date(future) } 
													onChange={ (value, event) => this.onCheckInDateChange(value) } />
												</Popover> 
												}>
												<Form.Control className="bg-dark text-white" type="go-date" value={ startDatePlaceholder } placeholder="Departure Date" />
										</OverlayTrigger>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupReturnDate">
										<Form.Label>Check Out</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose={ true } 
											overlay={ 
												<Popover>
													<Calendar 
													minDate={ returnCalStartDate } 
													maxDate={ new Date(future) } 
													onChange={ (value, event) => this.onCheckOutDateChange(value) } />
												</Popover> 
										}>
											<Form.Control className="bg-dark text-white" type="return-date" value={ returnDatePlaceholder } placeholder="Return Date" />
										</OverlayTrigger>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="travellerQuantityClass">
										<Form.Label>Traveller(s), Rooms</Form.Label>
										<OverlayTrigger
											trigger="click"
											placement="right"
											rootClose={ true }
											overlay={
												<Popover>
													<Card className="bg-secondary text-white" style={{ width: '30rem', height: '15rem' }}>
														<Card.Header as="h6">
															Select Travellers
														</Card.Header>
														<Container className="py-4 px-4">
															<Row className="px-2">
																<Col className="px-4">
																	<Form.Group controlId="adultTraveller">
																		<Row>
																			<Form.Label>Adult</Form.Label>
																		</Row>
																		<Row>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 1, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.adults } onChange={ (e) => this.onCountChangeManual(e, 1) } />
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 1, 1) }>+</Button>
																			</Col>
																		</Row>
																	</Form.Group>
																</Col>
																<Col className="px-4">
																	<Form.Group controlId="childTraveller">
																		<Row>
																			<Form.Label>Children</Form.Label>
																		</Row>
																		<Row>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 0, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.children } onChange={ (e) => this.onCountChangeManual(e, 0) } />
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 0, 1) }>+</Button>
																			</Col>
																		</Row>
																	</Form.Group>
																</Col>
															</Row>
															<Row>
																<Col className="px-4">
																	<Form.Group controlId="roomQuantity">
																		<Row>
																			<Form.Label>No. of Rooms</Form.Label>
																		</Row>
																		<Row>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 2, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.roomQuantity } onChange={ (e) => this.onCountChangeManual(e, 2) } />
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 2, 1) }>+</Button>
																			</Col>
																		</Row>
																	</Form.Group>
																</Col>
															</Row>
														</Container>
													</Card>
												</Popover>
											}
											>
										<Form.Control className="bg-dark text-white" type="travellerQuantityClass" defaultValue={ quantityClassString } value={quantityClassString} readOnly />
										</OverlayTrigger>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									{ submitButtonControl }
								</Col>
							</Row>
						</Form>
					</Card>
					
				</Container>
			</section>
		)
	}



}

export default Hotels;