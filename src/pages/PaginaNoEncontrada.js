import React, { Component } from 'react';
import { Container, Alert, Col, Row } from 'reactstrap'
import { Link } from 'react-router-dom'
import helpers from '../Helpers';

class PaginaNoEncontrada extends Component {
    render() {
        return (
            <Container className="text-center">
                <Row>
                    <Col xs="12">
                        <Alert color="danger">
                            <h1>Error 404</h1>
                            <h3>La pagina a la que intentas acceder no existe.</h3>
                        </Alert>
                    </Col>
                </Row>
                <Row>
                    <Col xs="12">
                        <Link to={helpers.prefixUrl+"/"}>
                            Regresar
                        </Link>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default PaginaNoEncontrada;