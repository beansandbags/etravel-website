import React, { Component } from 'react';
import axios from 'axios';
import queryString from'query-string';

import '../flights/flights.css'
import { Container, Row, Col, Form, Card, OverlayTrigger, Popover, Button, ToggleButton, ButtonGroup, Jumbotron } from 'react-bootstrap';

import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';


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
					this.setState({ flightOffersSearchResults: res.data.offersData, flightOffersCount: res.data.count })
					console.log(res.data)
				}
			})
	}
	render() {
		return(
			<section className="flights-background-img">
				
			</section>
		)

	}
}

export default FlightSearchResults;