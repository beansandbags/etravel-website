import React, { Component } from 'react';
import axios from 'axios';

import { Container, Row, Col, Form, Card, OverlayTrigger, Popover, Button, ToggleButton, ButtonGroup, Jumbotron } from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


const amadeusApi = axios.create({
	baseURL: 'http://localhost:5000/flights'
})


class Flights extends Component {
	state = {
		sourceLoc: null,
		desLoc: null,
		startDate: null,
		startDateParsed: null,
		returnDate: null,
		returnDateParsed: null,
		TripType: 'single',
		infantTravellerCount: 0,
		childrenTravellerCount: 0,
		adultTravellerCount: 1,
		ticketClass: 'Economy',
		FormFieldsFilled: false,
		sourceCityArray: null,
		desCityArray: null,
		sourceCityCount: 0,
		
	}

	constructor(){
		super()
		amadeusApi.get('/citySearch', { params: { cityName: "lmnopq" } } )
		.then(res => {
			this.setState({ sourceCityArray: res.data.cityData, desCityArray: res.data.cityData })
		 })
		.catch((err) => console.log(err))
		this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onReturnDateChange = this.onReturnDateChange.bind(this);
		this.onTripTypeChange = this.onTripTypeChange.bind(this);	
	}

	async checkFormFields(){
		console.log(this.state.startDateParsed)
		console.log(this.state.returnDateParsed)
		if(this.state.adultTravellerCount < 0){
			this.setState({ adultTravellerCount: 0 })
		}
		if(this.state.childrenTravellerCount < 0){
			this.setState({ childrenTravellerCount: 0 })
		}
		if(this.state.infantTravellerCount < 0){
			this.setState({ infantTravellerCount: 0 })
		}
		if(this.state.TripType === 'single'){
			if(
				this.state.sourceLoc != null &&
				this.state.desLoc != null && 
				this.state.startDate != null &&
				this.state.adultTravellerCount > 0
				)
				{
				this.setState({ FormFieldsFilled: true })
				} else {
					this.setState({ FormFieldsFilled: false })
				}
		} else {
			if(
				this.state.sourceLoc != null && 
				this.state.desLoc != null && 
				this.state.startDate != null && 
				this.state.returnDate != null &&
				this.state.adultTravellerCount > 0
				)
				{
				this.setState({ FormFieldsFilled: true })
				} else {
					this.setState({ FormFieldsFilled: false })
				}
		}
	}

	padTheDates(number, digits){
		if(digits === 2){
			return ("00"+ number).slice(-2)
		} else {
			return ("0000" + number).slice(-4)
		}
	}

	async onStartDateChange(date){
		let [startMonth, startDate, startYear] = new Date(date).toLocaleDateString("en-US").split("/")		
		var startDateParseString = this.padTheDates(startYear, 4) + "-" + this.padTheDates(startMonth, 2) + "-" + this.padTheDates(startDate, 2)
		this.setState({ startDate: date }, this.checkFormFields)
		this.setState({startDateParsed: startDateParseString}, this.checkFormFields)
	}	
	
	async onReturnDateChange(date){
		let [returnMonth, returnDate, returnYear] = new Date(date).toLocaleDateString("en-US").split("/")
		var returnDateParseString = this.padTheDates(returnYear, 4) + "-" + this.padTheDates(returnMonth, 2) + "-" + this.padTheDates(returnDate, 2)
		this.setState({ returnDate: date }, this.checkFormFields)
		this.setState({returnDateParsed: returnDateParseString}, this.checkFormFields)
	}

	async onTripTypeChange(event){
		this.setState({	TripType: event.target.value }, this.checkFormFields)
	}

	async onCountChangeManual(event, type){
		if(type === 0){
			this.setState({ infantTravellerCount: Number(event.target.value)}, this.checkFormFields)		
		} if(type === 1){
			this.setState({ childrenTravellerCount: Number(event.target.value)}, this.checkFormFields)
		} if(type === 2){
				this.setState({ adultTravellerCount: Number(event.target.value)}, this.checkFormFields)
		} else {
			console.log("Invalid input")
		}
	}

	async onCountClick(event, type, delta){
		event.preventDefault()
		if(type === 0 & this.state.infantTravellerCount >= 0 ){
			var iTC = this.state.infantTravellerCount
			iTC += delta
			this.setState({ infantTravellerCount: iTC }, this.checkFormFields)
		} if(type === 1){
			var cTC = this.state.childrenTravellerCount
			cTC += delta
			this.setState({ childrenTravellerCount: cTC }, this.checkFormFields)
		} if(type === 2){
			var aTC = this.state.adultTravellerCount
			aTC += delta
			this.setState({ adultTravellerCount: aTC }, this.checkFormFields)
		} else {
			console.log("Invalid input")
		}
	}

	async onClassChange(event){
		this.setState({ ticketClass: event.target.value }, this.checkFormFields)
	}

	submit(e){
		e.preventDefault()
		var flightSearchResultString = "?"
		if(this.state.sourceLoc !== null){
			var sourceLocURL = "&sourceLoc=" + this.state.sourceLoc[0].iata
			flightSearchResultString = flightSearchResultString.concat(sourceLocURL)
		}
		if(this.state.desLoc !== null){
			var desLocURL = "&desLoc=" + this.state.desLoc[0].iata
			flightSearchResultString = flightSearchResultString.concat(desLocURL)
		}
		if(this.state.startDate !== null){
			var startDateURL = "&startDate=" + this.state.startDateParsed
			flightSearchResultString = flightSearchResultString.concat(startDateURL)
		}
		if(this.state.returnDate !== null){
			var returnDateURL = "&returnDate=" + this.state.returnDateParsed
			flightSearchResultString = flightSearchResultString.concat(returnDateURL)
		}
		if(this.state.adultTravellerCount > 0){
			var adultURL = "&adults=" + this.state.adultTravellerCount
			flightSearchResultString = flightSearchResultString.concat(adultURL)
		}
		if(this.state.childrenTravellerCount > 0){
			var childrenURL = "&children=" + this.state.childrenTravellerCount
			flightSearchResultString = flightSearchResultString.concat(childrenURL)
		}
		if(this.state.infantTravellerCount > 0){
			var infantURL = "&infants=" + this.state.infantTravellerCount
			flightSearchResultString = flightSearchResultString.concat(infantURL)
		}
		if(this.state.ticketClass !== null){
			var classUpperCase = this.state.ticketClass.toUpperCase()
			var travelClassURL = "&travelClass=" + classUpperCase
			flightSearchResultString = flightSearchResultString.concat(travelClassURL)
		}
		window.location = '/flightSearchResults' + flightSearchResultString
	}

	render() {
		let [month, date, year] = new Date(Date.now()).toLocaleDateString("en-US").split("/")
		const future = new Date(String(Number(year)+1), String(Number(month)-1), date)

		var startDatePlaceholder
		var returnDatePlaceholder
		var returnDateFormControl
		var returnCalStartDate
		var submitButtonControl

		if(this.state.startDate !== null){
			let [startMonth, startDate, startYear] = new Date(this.state.startDate).toLocaleDateString("en-US").split("/")
			startDatePlaceholder = startDate + "/" + startMonth + "/" + startYear
			returnCalStartDate = new Date(this.state.startDate)
		} else {
			startDatePlaceholder = null
			returnCalStartDate = new Date(Date.now())
		}

		if(this.state.returnDate !== null){
			let [returnMonth, returnDate, returnYear] = new Date(this.state.returnDate).toLocaleDateString("en-US").split("/")
			returnDatePlaceholder = returnDate + "/" + returnMonth + "/" + returnYear
		} else {
			returnDatePlaceholder = null
		}

		if(this.state.TripType !== "round"){
			returnDateFormControl = <Form.Control className="bg-dark text-white" type="return-date" value={ returnDatePlaceholder } placeholder="Return Date" disabled />
		} else {
			returnDateFormControl = <Form.Control className="bg-dark text-white" type="return-date" value={ returnDatePlaceholder } placeholder="Return Date" />
		}

		if(this.state.FormFieldsFilled){
			submitButtonControl = <Button variant="light" type="submit" block onClick={ (e) => this.submit(e) }>Search</Button>
		} else {
			submitButtonControl = <Button variant="light" type="submit" block disabled>Search</Button>
		}

		var totalTicketCount = this.state.infantTravellerCount + this.state.childrenTravellerCount + this.state.adultTravellerCount
		var quantityClassString = totalTicketCount + ", " + this.state.ticketClass

		var isLoading = false

		const handleSourceSearch = (query) => {
			isLoading = true
			amadeusApi.get('/citySearch', { params: { cityName: query } } )
			.then(res => {
			console.log("Loading Done")
			this.setState({ sourceCityArray: res.data.cityData, sourceCityCount: res.data.count })
			isLoading = false
		})
		}
		
		const handleDesSearch = (query) => {
			isLoading = true
			amadeusApi.get('/citySearch', { params: { cityName: query } } )
			.then(res => {
			console.log("Loading Done")
			this.setState({ desCityArray: res.data.cityData, sourceCityCount: res.data.count })
			isLoading = false
		})
		}

		const handleSourceChange = (query) => {
			this.setState({sourceLoc: query}, console.log(query))
		}

		const handleDestChange = (query) => {
			this.setState({desLoc: query})
		}

		return(
			<section className="flights-background-img" style={{height: '100vh'}}>
				<Container className="px-5 py-5 space-between" >
					<Row>
					<Card className="bg-dark text-white mx-4 my-4" style={{ width: '30rem', height: '24.5rem' }}>
						<Form className="px-4 py-4">
							<Row>
								<Col>
									<Form.Group controlId="formGroupSource">
										<Form.Label>Depart From</Form.Label>
										<AsyncTypeahead
											className="bg-dark text-white"
											isLoading={ isLoading }
											onSearch={ handleSourceSearch }
											onChange={ handleSourceChange }
											options={this.state.sourceCityArray}
											id="source-loc"
											minLength={2}
											labelKey="cityCountryString"
											selected={this.state.sourceLoc}
											placeholder="City"
											/>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupDest">
										<Form.Label>Going To</Form.Label>
										<AsyncTypeahead
											className="bg-dark text-white"
											isLoading={ isLoading }
											onSearch={ handleDesSearch }
											onChange={ handleDestChange }
											options={this.state.desCityArray}
											id="source-loc"
											minLength={2}
											labelKey="cityCountryString"
											selected={this.state.desLoc}
											placeholder="City"
											/>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<ButtonGroup toggle className="my-1" style={{ display: 'flex' }}>
										<ToggleButton
											type="radio"
											variant="secondary"
											name="tripType"
											value="single"
											checked={this.state.TripType === "single"}
											onChange={this.onTripTypeChange}
											>
												One Way
											</ToggleButton>
											<ToggleButton
											type="radio"
											variant="secondary"
											name="tripType"
											value="round"
											checked={this.state.TripType === "round"}
											onChange={this.onTripTypeChange}
											>
												Round Trip
											</ToggleButton>
									</ButtonGroup>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="formGroupDate">
										<Form.Label>Departure Date</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose= { true }
											overlay={ 
												<Popover>
													<Calendar 
													minDate={ new Date(Date.now()) } 
													maxDate={ new Date(future) } 
													onChange={ (value, event) => this.onStartDateChange(value) } />
												</Popover> 
										}>
											<Form.Control className="bg-dark text-white" type="go-date" value={ startDatePlaceholder } placeholder="Departure Date" />
										</OverlayTrigger>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupReturnDate">
										<Form.Label>Return Date</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose={ true } 
											overlay={ 
												<Popover>
													<Calendar 
													minDate={ returnCalStartDate } 
													maxDate={ new Date(future) } 
													onChange={ (value, event) => this.onReturnDateChange(value) } />
												</Popover> 
										}>
											{ returnDateFormControl }
										</OverlayTrigger>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="travellerQuantityClass">
										<Form.Label>Traveller(s), Class</Form.Label>
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
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 2, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.adultTravellerCount } onChange={ (e) => this.onCountChangeManual(e, 2) } />
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 2, 1) }>+</Button>
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
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 1, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.childrenTravellerCount } onChange={ (e) => this.onCountChangeManual(e, 1) } />
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 1, 1) }>+</Button>
																			</Col>
																		</Row>
																	</Form.Group>
																</Col>
																<Col className="px-4">
																	<Form.Group controlId="infantTraveller">
																		<Row>
																			<Form.Label>Infant(s)</Form.Label>
																		</Row>
																		<Row>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 0, -1) }>-</Button>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0" xs={6}>
																				<Form.Control block size="sm" value={ this.state.infantTravellerCount } onChange={ (e) => this.onCountChangeManual(e, 0) }/>
																			</Col>
																			<Col className="py-0 px-0 my-0 mx-0">
																				<Button size="sm" block variant="light" onClick={ (e) => this.onCountClick(e, 0, 1) }>+</Button>
																			</Col>
																		</Row>
																	</Form.Group>
																</Col>
															</Row>
															<Row>
																<Col>
																	<Form.Group controlId="travelClassSelect">
																		<Form.Label>Ticket Class</Form.Label>
																		<Form.Control as="select" custom onChange={ (e) => this.onClassChange(e) }>
																			<option>Economy</option>
																			<option>Premium Economy</option>
																			<option>Business</option>
																		</Form.Control>
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
					<Jumbotron style={{ height: '15rem', width: '30rem', background:'rgba(60,60,60,0.1)' }} className="text-white mx-4 my-4">
						<div>
							<h1 className="inspireText" style={{ opacity: '1', color: '#ffffffff' }} align="right">Where do you want to go?</h1>
						</div>
					</Jumbotron>
					</Row>
				</Container>
			</section>
		)
	}
}

export default Flights;