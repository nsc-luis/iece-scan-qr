import React, { Component } from 'react';
import {
    Card, CardTitle, CardBody, Alert, Col, Row,
    Form, FormGroup, Label, Input
} from 'reactstrap'
import helpers from '../Helpers';

class ScanQR extends Component {
    constructor(props) {
        super(props)
        this.state = {
            codigo: "",
            colorAlert: "",
            error: false,
            tituloMensaje: "",
            mensaje: "",
            info: []
        }
    }
    handleCodigo = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    consultarQR = async (e) => {
        e.preventDefault();
        let codigo = this.state.codigo.replaceAll(']', '|') // <---- EN CASO DE LECTOR DE CODIGO CON FALLA
        this.setState({ codigo: "" })
        await helpers.authAxios.post("/asistencia", codigo)
        .then(res => {
            if(res.data.error) {
                this.setState({
                    error: true,
                    colorAlert: "danger",
                    tituloMensaje: "ERROR!!!",
                    mensaje: res.data.mensaje,
                    info: []
                })
            }
            else {
                this.setState({
                    error: false,
                    colorAlert: "success",
                    tituloMensaje: "BIENVENIDO!!!",
                    mensaje: "",
                    info: res.data.registro
                })
            }
        })
    }
    render() {
        return (
            <Card>
                <CardTitle className="text-center">
                    <h1>Escanea tu codigo QR</h1>
                </CardTitle>
                <CardBody>
                    <Form onSubmit={this.consultarQR} enctype="multipart/form-data">
                        <FormGroup>
                            <Row>
                                <Col xs="12">
                                    <Alert color="warning">
                                        Los campos marcados con (*) son requeridos.
                                    </Alert>
                                </Col>
                            </Row>
                        </FormGroup>
                        <FormGroup>
                            <Row>
                                <Col xs="3" className="text-right">
                                    <Label><strong>CODIGO QR: *</strong></Label>
                                </Col>
                                <Col xs="9">
                                    <Input
                                        autoFocus={true} 
                                        type="text"
                                        name="codigo"
                                        onChange={this.handleCodigo}
                                        value={this.state.codigo}
                                    />
                                </Col>
                            </Row>
                        </FormGroup>
                    </Form>
                    <Alert color={this.state.colorAlert} className="text-center">
                        <h3>{this.state.tituloMensaje}</h3>
                    </Alert>
                    {this.state.error &&
                        <p className="text-center">{this.state.mensaje}</p>
                    }
                    {this.state.info.length > 0 &&
                        <p className="text-center">
                            <strong>Nombre: </strong>{this.state.info[0].nombre} {this.state.info[0].apellidoPaterno} {this.state.info[0].apellidoMaterno}<br />
                            <strong>Categoria: </strong>{this.state.info[0].nombreCategoria} <br />
                            <strong>Status: </strong>{this.state.info[0].bautizado ? "Bautizado" : "Visitante"} <br />
                            {this.state.info[0].tipoDistrito} {this.state.info[0].numeroDistrito}: {this.state.info[0].nombreSector}
                        </p>
                    }
                </CardBody>
            </Card>
        )
    }
}
export default ScanQR