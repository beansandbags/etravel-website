import React, { Component } from 'react';
import axios from 'axios';

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

	render() {
		return(
			<section className="flights-background-img">
				
			</section>
		)

	}
}

export default FlightSearchResults;