import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Navbar, Nav, NavItem, NavLink, Container,
    NavbarBrand, NavbarToggler, Collapse
} from 'reactstrap'
import helpers from '../Helpers';

class Layout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        }
    }
    toggle = () => { this.setState({ isOpen: !this.state.isOpen }) }

    render() {
        return (
            <Container>
                <Navbar color="light" light expand="md">
                    <NavbarBrand>
                        <Link className="linkSinDecoracion" to={helpers.prefixUrl+"/"}>ScanQR</Link>
                    </NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink>
                                    <Link className="linkSinDecoracion" to={helpers.prefixUrl+"/Registro"}>Registro</Link>
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink>
                                    <Link className="linkSinDecoracion" to={helpers.prefixUrl+"/Asistencia"}>Asistencia</Link>
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
            </Container>
        )
    }
}
export default Layout