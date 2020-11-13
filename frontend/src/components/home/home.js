import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';


const flightApi = axios.create({
	baseURL: 'http://localhost:5000/flights'
})

class Home extends Component {
	state = {
		airportList: [],
		airportSearchString: '',
	}
	
	constructor() {
		super();
	}


	
	render() {
		return (
				<div className="grid-container">
					<div className="grid-container">
						<form onSubmit={this.handleSubmit}>
							<label>
								Depart From:
								<Autocomplete 
									id="depart-from-box"
									options={this.state.airportList}
									getOptionLabel={(option) => option.title}
									style = { { width: 300 } }
									renderInput = {(params) => <TextField label="Depart From" variant="outlined" />}
								/>	
							</label>
							<label>
								Arrive At:
								<input type="text" value={this.state.value} onChange={this.handleChange} />
							</label>
							<label>
								Start Date
							</label>
						</form>
					</div>
				</div>
		)
	}

}

export default Home