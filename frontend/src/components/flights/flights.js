import React, { Component } from 'react';
import axios from 'axios';

import './flights.css'
import { Container, Row, Col, Form, Card, OverlayTrigger, Popover, Button, ToggleButton, ButtonGroup } from 'react-bootstrap';

import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead';
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
		returnDate: null,
		TripType: 'single',
		infantTravellerCount: 0,
		childrenTravellerCount: 0,
		adultTravellerCount: 1,
		ticketClass: 'Economy',
		FormFieldsFilled: false,
		cityArray: null,
	}

	constructor(){
		super()
		amadeusApi.get('/cities', { params: { cityName: "Ne", page: 0 } } )
		.then( res => {
			this.setState({ cityArray: res.data.data })
		})
		.catch((err) => console.log(err))
		this.onSourceChange = this.onSourceChange.bind(this);
		this.onDestChange = this.onDestChange.bind(this);
		this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onReturnDateChange = this.onReturnDateChange.bind(this);
		this.onTripTypeChange = this.onTripTypeChange.bind(this);	
		this.locSearch = this.locSearch.bind(this);
	}

	async checkFormFields(){
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

	async onStartDateChange(date){
		this.setState({ startDate: date }, this.checkFormFields)
	}

	
	async onReturnDateChange(date){
		this.setState({ returnDate: date }, this.checkFormFields)
	}


	async onSourceChange(event){
		console.log("SUP")
		this.setState({ sourceLoc: event.target.value }, this.checkFormFields)
			.then(
				amadeusApi.get('/cities', {params: { key: event.target.value } })
				.then(res => {
				this.setState({ cityArray: res.data.data })
				})
			)
			.then(console.log("123 ", this.state.sourceLoc))
	}

	async locSearch(event){
		console.log("Triggered")
		amadeusApi.get('/cities', {params: { key: event.target.value } })
				.then(res => {
				this.setState({ cityArray: res.data.data })
			})
	}

	async onDestChange(event){
		this.setState({ desLoc: event.target.value }, this.checkFormFields)
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
		var submitObject = this.state
		console.log(submitObject)
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

		return(
			<section className="flights-background-img">
				<Container className="pt-5">
					<Card className="bg-dark text-white" style={{ width: '30rem', height: '24.5rem' }}>
						<Form className="px-4 py-4">
							<Row>
								<Col>
									<Form.Group controlId="formGroupSource">
										<Form.Label>Depart From</Form.Label>
										<Typeahead
											className="bg-dark text-white"
											onSearch={ (e) => this.locSearch }
											onChange={ (e) => this.onSourceChange }
											options={this.state.cityArray}
											id="source-loc"
											minLength={2}
											labelKey="name"
											selected={this.state.sourceLoc}
											placeholder="City"
											/>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupDest">
										<Form.Label>Going To</Form.Label>
										<Form.Control className="bg-dark text-white" type="dest-loc" placeholder="City" onChange={ this.onDestChange } />
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
										<Form.Control className="bg-dark text-white" type="travellerQuantityClass" defaultValue={ quantityClassString } readOnly />
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

export default Flights;