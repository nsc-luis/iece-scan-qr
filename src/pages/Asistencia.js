import React, { Component } from 'react';
import {
    Col, Row, CardHeader, CardBody, Input,
    Card, Label, FormGroup, Table, CardFooter
}
    from 'reactstrap'
import helpers from '../Helpers';

class Asistencia extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fechaSelecionada: "",
            asistencia: [],
            AdultoHombre: 0,
            AdultoMujer: 0,
            bautizado: 0,
            JovenHombre: 0,
            JovenMujer: 0,
            AdultoHombreVisitante: 0,
            AdultoMujerVisitante: 0,
            JovenHombreVisitante: 0,
            JovenMujerVisitante: 0,
            obispo: 0,
            pastor: 0,
            diacono: 0,
            auxiliar: 0,
            bautizados: 0,
            total: 0
        }
    }
    getAsistencia = async (e) => {
        this.setState({ [e.target.name]: e.target.value })
        await helpers.authAxios.get("/Asistencia/asistenciaPorFecha/" + e.target.value)
            .then(res => {
                if (res.data.error) {
                    alert("Error: " + res.data.mensaje)
                    throw new Error(res.data.error)
                }
                else {
                    let AdultoHombre = 0
                    let AdultoMujer = 0
                    let JovenHombre = 0
                    let JovenMujer = 0
                    let AdultoHombreVisitante = 0
                    let AdultoMujerVisitante = 0
                    let JovenHombreVisitante = 0
                    let JovenMujerVisitante = 0
                    let obispo = 0
                    let pastor = 0
                    let diacono = 0
                    let auxiliar = 0
                    let bautizados = 0
                    let total = 0
                    res.data.asistencia.forEach(element => {
                        switch (element.idCategoria) {
                            case 1:
                                element.bautizado ? AdultoMujer = AdultoMujer + 1 : AdultoMujerVisitante = AdultoMujerVisitante + 1
                                break
                            case 2:
                                element.bautizado ? AdultoHombre = AdultoHombre + 1 : AdultoHombreVisitante = AdultoHombreVisitante + 1
                                break
                            case 3:
                                element.bautizado ? JovenMujer = JovenMujer + 1 : JovenMujerVisitante = JovenMujer + 1
                                break
                            case 4:
                                element.bautizado ? JovenHombre = JovenHombre + 1 : JovenHombreVisitante = JovenHombreVisitante + 1
                                break
                            case 5:
                                auxiliar = auxiliar + 1
                                break
                            case 6:
                                diacono = diacono + 1
                                break
                            case 7:
                                pastor = pastor + 1
                                break
                            case 8:
                                obispo = obispo + 1
                                break
                        }
                        bautizados = element.bautizado ? bautizados + 1 : bautizados + 0
                        total = total + 1
                    });
                    this.setState({
                        asistencia: res.data.asistencia,
                        AdultoHombre: AdultoHombre,
                        AdultoMujer: AdultoMujer,
                        JovenHombre: JovenHombre,
                        JovenMujer: JovenMujer,
                        AdultoHombreVisitante: AdultoHombreVisitante,
                        AdultoMujerVisitante: AdultoMujerVisitante,
                        JovenHombreVisitante: JovenHombreVisitante,
                        JovenMujerVisitante: JovenMujerVisitante,
                        obispo: obispo,
                        pastor: pastor,
                        diacono: diacono,
                        auxiliar: auxiliar,
                        bautizados: bautizados,
                        total: total
                    })
                }
            })
    }
    render() {
        return (
            <React.Fragment>
                <Card>
                    <CardHeader>
                        <h4>Asistencia segun fecha</h4>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <FormGroup>
                                <Col xs="2">
                                    <Input
                                        type="date"
                                        name="fechaSeleccionada"
                                        value={this.state.fecha}
                                        onChange={this.getAsistencia}
                                    />
                                    <Label><strong>Selecciona una fecha: </strong></Label>
                                </Col>
                            </FormGroup>
                        </Row>
                        <hr />
                        {this.state.asistencia.length === 0 &&
                            <React.Fragment>
                                <p>Sin registros para mostrar.</p>
                            </React.Fragment>
                        }
                        {this.state.asistencia.length > 0 &&
                            <React.Fragment>
                                <Row>
                                    <Col xs="12">
                                        <Table>
                                            <tbody>
                                                <tr>
                                                    <th></th>
                                                    <th>Visitantes</th>
                                                    <th>Miembro bautizado</th>
                                                    <th>Total parcial</th>
                                                </tr>
                                                <tr>
                                                    <th>AdultoHombre:</th>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoHombreVisitante}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoHombre}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoHombreVisitante + this.state.AdultoHombre}</td>
                                                </tr>
                                                <tr>
                                                    <th>AdultoMujer:</th>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoMujerVisitante}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoMujer}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.AdultoMujerVisitante + this.state.AdultoMujer}</td>
                                                </tr>
                                                <tr>
                                                    <th>JovenHombre:</th>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenHombreVisitante}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenHombre}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenHombreVisitante + this.state.JovenHombre}</td>
                                                </tr>
                                                <tr>
                                                    <th>JovenMujer:</th>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenMujerVisitante}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenMujer}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.JovenMujerVisitante + this.state.JovenMujer}</td>
                                                </tr>
                                                <tr>
                                                    <th>Axiliar:</th>
                                                    <td style={{ textAlign: 'center' }}>N/A</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.auxiliar}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.auxiliar}</td>
                                                </tr>
                                                <tr>
                                                    <th>Diacono:</th>
                                                    <td style={{ textAlign: 'center' }}>N/A</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.diacono}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.diacono}</td>
                                                </tr>
                                                <tr>
                                                    <th>Pastor:</th>
                                                    <td style={{ textAlign: 'center' }}>N/A</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.pastor}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.pastor}</td>
                                                </tr>
                                                <tr>
                                                    <th>Obispo:</th>
                                                    <td style={{ textAlign: 'center' }}>N/A</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.obispo}</td>
                                                    <td style={{ textAlign: 'center' }}>{this.state.obispo}</td>
                                                </tr>
                                                {/* <tr>
                                                    <th>Bautizados:</th>
                                                    <td>{this.state.bautizados}</td>
                                                </tr>
                                                <tr>
                                                    <th>Visitantes:</th>
                                                    <td>{this.state.total - this.state.bautizados}</td>
                                                </tr>
                                                <tr>
                                                    <th>Total:</th>
                                                    <td>{this.state.total}</td>
                                                </tr> */}
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                            </React.Fragment>
                        }
                    </CardBody>
                    <CardFooter>
                        {this.state.asistencia.length > 0 &&
                            <>
                                <h3><strong>Visitantes: </strong>{this.state.total - this.state.bautizados}</h3>
                                <h3><strong>Bautizados: </strong>{this.state.bautizados}</h3>
                                <h3><strong>Total: </strong>{this.state.total}</h3>
                            </>
                        }

                    </CardFooter>
                </Card>
            </React.Fragment>
        )
    }
}
export default Asistencia