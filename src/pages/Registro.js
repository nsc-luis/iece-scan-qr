import React, { Component } from 'react'
import {
    Card, CardTitle, CardBody, Alert, Col, Row, ButtonGroup, Table,
    Form, FormGroup, Label, Input, CardFooter, Button, FormFeedback,
    Modal, ModalBody, ModalFooter
} from 'reactstrap'
import helpers from '../Helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faQrcode, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

class Registro extends Component {
    constructor(props) {
        super(props)
        this.state = {
            info: {},
            distritos: [],
            sectores: [],
            categorias: [],
            nombreInvalido: false,
            apellidoPaternoInvalido: false,
            idDistritoInvalido: false,
            idCategoriaInvalido: false,
            registros: [],
            modalOpen: false,
            currentRegistro: {},
            qrImage: ""
        }
    }
    componentDidMount() {
        this.setState({
            info: {
                ...this.state.info,
                nombre: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                idDistrito: "0",
                idSector: "0",
                idCategoria: "0",
                bautizado: false,
                codigo: "No generado",
                verificador: "No generado"
            }
        })
        this.getDistritos();
        this.getCategorias();
        this.getRegistros();
    }
    handleChange = async (e) => {
        this.setState({
            info: {
                ...this.state.info,
                [e.target.name]: e.target.value
            }
        })
    }
    handleChangeDistrito = async (e) => {
        this.setState({
            info: {
                ...this.state.info,
                [e.target.name]: e.target.value
            }
        })
        if (e.target.value === "0") {
            this.setState({ sectores: [] })
        }
        else {
            await helpers.authAxios.get(`/Sector/sectoresByDistrito/${e.target.value}`)
                .then(res => {
                    if (res.data.error) {
                        alert("Error: " + res.data.mensaje)
                        return false
                    }
                    else {
                        this.setState({
                            sectores: res.data.sectores
                        })
                    }
                })
        }

    }
    getDistritos = async () => {
        await helpers.authAxios.get("/Distrito")
            .then(res => {
                if (res.data.error) {
                    alert(res.data.mensaje)
                    return false
                }
                else {
                    this.setState({
                        distritos: res.data.distritos
                    })
                }
            })
    }
    getCategorias = async () => {
        await helpers.authAxios.get("/Categoria")
            .then(res => {
                if (res.data.error) {
                    alert(res.data.mensaje)
                    return false
                }
                else {
                    this.setState({
                        categorias: res.data.categorias
                    })
                }
            })
    }
    onRadioBtnClick = (bool) => {
        this.setState({
            info: {
                ...this.state.info,
                bautizado: !this.state.info.bautizado
            }
        })
    }
    guardarRegistro = async (e) => {
        e.preventDefault()
        this.setState({
            nombreInvalido: this.state.info.nombre === "" ? true : false,
            apellidoPaternoInvalido: this.state.info.apellidoPaterno === "" ? true : false,
            idCategoriaInvalido: this.state.info.idCategoria === "0" ? true : false,
            idDistritoInvalido: this.state.info.idDistrito === "0" ? true : false
        })
        if (
            this.state.info.nombre === ""
            || this.state.info.apellidoPaterno === ""
            || this.state.info.idCategoria === "0"
            || this.state.info.idDistrito === "0") {
            throw new Error("Los campos marcados con (*) son requeridos.")
        }
        else {
            await helpers.authAxios.post("/registro", this.state.info)
                .then(res => {
                    if (res.data.error) {
                        alert("Error:" + res.data.mensaje)
                        return false
                    }
                    else {
                        this.verQR(res.data.registro)
                    }
                })
        }
    }
    handleCancelar = () => {
        this.setState({
            nombreInvalido: false,
            apellidoPaternoInvalido: false,
            idCategoriaInvalido: false,
            idDistritoInvalido: false,
            info: {
                ...this.state.info,
                nombre: "",
                apellidoPaterno: "",
                apellidoMaterno: "",
                idDistrito: "0",
                idSector: "0",
                idCategoria: "0",
                bautizado: false,
                codigo: "No generado",
                verificador: "No generado"
            }
        })
    }
    getRegistros = async () => {
        await helpers.authAxios.get("/Registro")
            .then(res => {
                if (res.data.error) {
                    alert(res.data.mensaje)
                    return false
                }
                else {
                    this.setState({
                        registros: res.data.registro
                    })
                }
            })
    }
    verQR = (registro) => {
        this.setState({
            modalOpen: !this.state.modalOpen,
            currentRegistro: registro
        })
        this.generateQR(registro.codigo)
    }
    generateQR = async (text) => {
        await QRCode.toDataURL(text)
            .then(res => {
                this.setState({
                    qrImage: res
                })
            })
    }
    cerrarModal = () => {
        this.setState({
            modalOpen: !this.state.modalOpen,
            nombreCompleto: "",
            cadenaParaQR: ""
        })
        this.handleCancelar();
        this.getRegistros();
    }
    printQR = async () => {
        let pdf = jsPDF('l', 'in', [4, 3])
        var width = pdf.internal.pageSize.getWidth()
        pdf.addImage(`${this.state.qrImage}`, 'png', 1.2, 0.5, 1.5, 1.5, { align: 'center' })
        pdf.setFontSize(10)
        pdf.text(`${this.state.currentRegistro.nombre} ${this.state.currentRegistro.apellidoPaterno}`, width/2, 2, { align: 'center' })
        pdf.text(`${this.state.currentRegistro.nombreCategoria} | ${this.state.currentRegistro.bautizado ? "Bautizado" : "Visitante"}`, width/2, 2.2, { align: 'center' })
        pdf.save(`${this.state.currentRegistro.nombre} ${this.state.currentRegistro.apellidoPaterno} ${this.state.currentRegistro.apellidoMaterno}.pdf`);
    }
    render() {
        return (
            <React.Fragment>
                <Card>
                    <Form onSubmit={this.guardarRegistro}>
                        <CardTitle className="text-center">
                            <h1>Registro</h1>
                        </CardTitle>
                        <CardBody>
                            <FormGroup>
                                <Row>
                                    <Col xs="12">
                                        <Alert color="warning">
                                            Los campos marcados con (*) son requeridos.
                                        </Alert>
                                    </Col>
                                </Row>
                            </FormGroup>
                            <Row>
                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="nombre"
                                            onChange={this.handleChange}
                                            value={this.state.info.nombre}
                                            invalid={this.state.nombreInvalido}
                                        />
                                        <Label>Nombre: *</Label>
                                        <FormFeedback>Este campo es requerido.</FormFeedback>
                                    </FormGroup>
                                </Col>

                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="apellidoPaterno"
                                            onChange={this.handleChange}
                                            value={this.state.info.apellidoPaterno}
                                            invalid={this.state.apellidoPaternoInvalido}
                                        />
                                        <Label>Apellido paterno: *</Label>
                                        <FormFeedback>Este campo es requerido.</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="text"
                                            name="apellidoMaterno"
                                            onChange={this.handleChange}
                                            value={this.state.info.apellidoMaterno}
                                        />
                                        <Label>Apellido materno: </Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="idCategoria"
                                            onChange={this.handleChange}
                                            value={this.state.info.idCategoria}
                                            invalid={this.state.idCategoriaInvalido}
                                        >
                                            <option value="0">Selecciona una categoria</option>
                                            {
                                                this.state.categorias.map((categoria) => {
                                                    return (
                                                        <React.Fragment key={categoria.idCategoria}>
                                                            <option value={categoria.idCategoria}>{categoria.nombreCategoria}</option>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </Input>
                                        <Label>Categoria: *</Label>
                                        <FormFeedback>Debe seleccionar una categoria.</FormFeedback>
                                    </FormGroup>
                                </Col>
                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <ButtonGroup>
                                            <Button
                                                color="info"
                                                onClick={() => this.onRadioBtnClick(true)}
                                                active={this.state.info.bautizado === true}>
                                                {this.state.info.bautizado ? <FontAwesomeIcon icon={faCheck} /> : ""} Bautizado
                                            </Button>
                                            <Button
                                                color="info"
                                                onClick={() => this.onRadioBtnClick(false)}
                                                active={this.state.info.bautizado === false}>
                                                {this.state.info.bautizado ? "" : <FontAwesomeIcon icon={faCheck} />} Visitante
                                            </Button>
                                        </ButtonGroup>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="idDistrito"
                                            onChange={this.handleChangeDistrito}
                                            value={this.state.info.idDistrito}
                                            invalid={this.state.idDistritoInvalido}
                                        >
                                            <option value="0">Selecciona un distrito</option>
                                            {
                                                this.state.distritos.map((distrito) => {
                                                    return (
                                                        <React.Fragment key={distrito.idDistrito}>
                                                            <option value={distrito.idDistrito}>{distrito.tipoDistrito} {distrito.numeroDistrito}: {distrito.nombreDistrito}</option>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </Input>
                                        <Label>Distrito: *</Label>
                                        <FormFeedback>Debe seleccionar un distrito.</FormFeedback>
                                    </FormGroup>
                                </Col>

                                <Col xs="4" className="text-right">
                                    <FormGroup>
                                        <Input
                                            type="select"
                                            name="idSector"
                                            onChange={this.handleChange}
                                            value={this.state.info.idSector}
                                        >
                                            <option value="0">Selecciona un sector</option>
                                            {
                                                this.state.sectores.map((sector) => {
                                                    return (
                                                        <React.Fragment key={sector.idSector}>
                                                            <option value={sector.idSector}>{sector.nombreSector}</option>
                                                        </React.Fragment>
                                                    )
                                                })
                                            }
                                        </Input>
                                        <Label>Sector:</Label>
                                    </FormGroup>
                                </Col>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            <Button
                                type="button"
                                onClick={this.handleCancelar}
                                color="secondary"
                            >Cancelar
                            </Button>
                            <Button
                                type="submit"
                                color="primary"
                            >Guardar
                            </Button>
                        </CardFooter>
                    </Form>
                </Card>
                {this.state.registros.length > 0 &&
                    <Table>
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Categoria</th>
                                <th>Status</th>
                                <th>Distrito</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.registros.map((registro) => {
                                    return (
                                        <React.Fragment key={registro.idRegistro}>
                                            <tr>
                                                <td>{registro.nombre} {registro.apellidoPaterno} {registro.apellidoMaterno}</td>
                                                <td>{registro.nombreCategoria}</td>
                                                <td>{registro.bautizado ? "Bautizado" : "Visitante"}</td>
                                                <td>{registro.tipoDistrito} {registro.numeroDistrio}: {registro.nombreDistrito}</td>
                                                <td>
                                                    <Button
                                                        type="button"
                                                        onClick={() => this.verQR(registro)}
                                                        color="success"
                                                    >
                                                        <FontAwesomeIcon icon={faQrcode}></FontAwesomeIcon> QR
                                                    </Button>
                                                </td>
                                            </tr>
                                        </React.Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </Table>
                }
                <Modal isOpen={this.state.modalOpen}>
                    <ModalBody className='text-center'>
                        <img alt="test" src={this.state.qrImage} width="250px" height="250px" id="qrImage" /> <br />
                        {this.state.currentRegistro.nombre} {this.state.currentRegistro.apellidoPaterno} {this.state.currentRegistro.apellidoMaterno} <br />
                        {this.state.currentRegistro.nombreCategoria} | {this.state.currentRegistro.bautizado ? "Miembro bautizado" : "Visitante"}
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            onClick={this.cerrarModal}
                        >
                            Cerrar
                        </Button>
                        <Button
                            type="button"
                            color="danger"
                            onClick={this.printQR}
                        >
                            <FontAwesomeIcon icon={faFilePdf}></FontAwesomeIcon> PDF
                        </Button>
                    </ModalFooter>
                </Modal>
            </React.Fragment>
        )
    }
}
export default Registro