import React, { Component } from 'react';

import './flights.css'
import { Container, Row, Col, Form, Card, OverlayTrigger, Popover, Button } from 'react-bootstrap';
//import { Typeahead } from 'react-bootstrap-typeahead';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';



class Flights extends Component {
	state = {
		sourceLoc: null,
		desLoc: null,
		startDate: null,
		returnDate: null,
		TripType: 'single',
		FormFieldsFilled: false,
	}

	constructor(){
		super()
		this.onSourceChange = this.onSourceChange.bind(this);
		this.onDestChange = this.onDestChange.bind(this);
		this.onStartDateChange = this.onStartDateChange.bind(this);
		this.onReturnDateChange = this.onReturnDateChange.bind(this);
		this.onTripTypeChange = this.onTripTypeChange.bind(this);	
	}

	async checkFormFields(){
		if(this.state.TripType === 'single'){
			if(
				this.state.sourceLoc != null &&
				this.state.desLoc != null && 
				this.state.startDate != null
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
				this.state.returnDate != null
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
		this.setState({ sourceLoc: event.target.value }, this.checkFormFields)

	}

	async onDestChange(event){
		this.setState({ desLoc: event.target.value }, this.checkFormFields)
	}

	async onTripTypeChange(event){
		this.setState({	TripType: event.target.value }, this.checkFormFields)
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
			startDatePlaceholder = "Date"
			returnCalStartDate = new Date(Date.now())
		}

		if(this.state.returnDate !== null){
			let [returnMonth, returnDate, returnYear] = new Date(this.state.returnDate).toLocaleDateString("en-US").split("/")
			returnDatePlaceholder = returnDate + "/" + returnMonth + "/" + returnYear
		} else {
			returnDatePlaceholder = "Date"
		}

		if(this.state.TripType !== "round"){
			returnDateFormControl = <Form.Control className="bg-dark text-white" type="return-date" placeholder={ returnDatePlaceholder } disabled />
		} else {
			returnDateFormControl = <Form.Control className="bg-dark text-white" type="return-date" placeholder={ returnDatePlaceholder } />
		}

		if(this.state.FormFieldsFilled){
			submitButtonControl = <Button variant="light" type="submit" onClick={ (e) => this.submit(e) }>Search</Button>
		} else {
			submitButtonControl = <Button variant="light" type="submit" disabled>Search</Button>
		}

		return(
			<section className="flights-background-img">
				<Container className="pt-5">
					<Card className="bg-dark text-white" style={{ width: '30rem' }}>
						<Form className="px-4 py-4">
							<Row>
								<Col>
									<Form.Group controlId="formGroupSource">
										<Form.Label>Depart From</Form.Label>
										<Form.Control className="bg-dark text-white" type="source-loc" placeholder="City" onChange={ this.onSourceChange } />
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
									<Form.Check
										type='radio'
										name='triptype'
										id='trip1'
										value='single'
										label="One Way"
										checked={this.state.TripType === "single"}
										onChange={this.onTripTypeChange}
										/>
								</Col>
								<Col>
									<Form.Check
										type='radio'
										name='triptype'
										id='trip2'
										value='round'
										label="Round Trip"
										checked={this.state.TripType === "round"}
										onChange={this.onTripTypeChange}										
										/>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="formGroupDate">
										<Form.Label>Departure Date</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose="true" 
											overlay={ 
												<Popover>
													<Calendar 
													minDate={ new Date(Date.now()) } 
													maxDate={ new Date(future) } 
													onChange={ (value, event) => this.onStartDateChange(value) } />
												</Popover> 
										}>
											<Form.Control className="bg-dark text-white" type="go-date" placeholder={startDatePlaceholder} />
										</OverlayTrigger>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupReturnDate">
										<Form.Label>Return Date</Form.Label>
										<OverlayTrigger 
											trigger="click" 
											placement="bottom" 
											rootClose="true" 
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