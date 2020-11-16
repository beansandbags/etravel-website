import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';

class navbar extends Component {
	render() {
		return(
		<Navbar bg="dark" expand="lg" variant="dark">
          <Navbar.Brand href="#home">E-Travel Website</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="flights">Flights</Nav.Link>
              <Nav.Link href="hotels">Hotels</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
		) 
	}
}

export default navbar;