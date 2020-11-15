import React, { Component, Link, useState } from 'react';

import './flights.css'
import { Container, Row, Col, Image, Alert, Form, Card, OverlayTrigger, Popover, Button } from 'react-bootstrap';
//import { Typeahead } from 'react-bootstrap-typeahead';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';



class Flights extends Component {
	state={
		sourceLoc: null,
		desLoc: null,
		startDate: null,
		returnDate: null,
	}

	constructor(){
		super()
		console.log("Here")
		this.onStartDateChange = this.onStartDateChange.bind(this);
	}

	async onStartDateChange(date){
		console.log("1xx1")
		console.log(date)
		this.setState({ startDate: date })
		console.log(this.state.startDate)
	}

	async onSourceChange(loc){
		this.setState({ sourceLoc: loc })
	}

	async onDestChange(loc){
		this.setState({ desLoc: loc })
	}

	submit(e){

	}

	render() {
		let [month, date, year] = new Date(Date.now()).toLocaleDateString("en-US").split("/")
		const future = new Date(String(Number(year)+1), String(Number(month)-1), date)

		if(this.state.startDate != null){
			let [startMonth, startDate, startYear] = new Date(this.state.startDate).toLocaleDateString("en-US").split("/")
			var startDatePlaceholder = startDate + "/" + startMonth + "/" + startYear
		} else {
			var startDatePlaceholder = "Date"
		}

		return(
			<section className="flights-background-img">
				<Container className="pt-5">
					<Card style={{ width: '30rem' }}>
						<Form className="px-4 py-4">
							<Row>
								<Col>
									<Form.Group controlId="formGroupSource">
										<Form.Label>Depart From</Form.Label>
										<Form.Control type="source-loc" placeholder="City" onChange={(value) => this.onSourceChange(value)} />
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupDest">
										<Form.Label>Going To</Form.Label>
										<Form.Control type="dest-loc" placeholder="City" onChange={(value) => this.onDestChange(value)} />
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Form.Group controlId="formGroupDate">
										<Form.Label>Departure Date</Form.Label>
										<OverlayTrigger trigger="click" placement="bottom" rootClose="true" overlay={ <Popover><Calendar minDate={ new Date(Date.now()) } maxDate={ new Date(future) } onChange={ (value, event) => this.onStartDateChange(value) } /></Popover> }><Form.Control type="go-date" placeholder={startDatePlaceholder} /></OverlayTrigger>
									</Form.Group>
								</Col>
								<Col>
									<Form.Group controlId="formGroupReturnDate">
										<Form.Label>Return Date</Form.Label>
										<OverlayTrigger trigger="click" placement="bottom" rootClose="true" overlay={ <Popover><Calendar /></Popover> }><Form.Control type="return-date" placeholder="Date"/ ></OverlayTrigger>
									</Form.Group>
								</Col>
							</Row>
							<Row>
								<Col>
									<Button variant="light" type="submit">
										Search
									</Button>
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