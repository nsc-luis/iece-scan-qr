import React, { Component } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import ScanQR from "./pages/ScanQR"
import Registro from "./pages/Registro"
import Asistencia from "./pages/Asistencia"
import PaginaNoEncontrada from "./pages/PaginaNoEncontrada"
import Navigator from "./pages/Navigator"
import "./global-styles.css"
import 'bootstrap/dist/css/bootstrap.css'
import { Container } from 'reactstrap'
import helpers from "./Helpers"

class Router extends Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <Navigator />
                    <Container>
                        <Routes>
                            <Route path={helpers.prefixUrl+"/"} element={<ScanQR />} />
                            <Route path={helpers.prefixUrl+"/Registro"} element={<Registro />} />
                            <Route path={helpers.prefixUrl+"/Asistencia"} element={<Asistencia />} />
                            <Route path="*" element={<PaginaNoEncontrada />} />
                        </Routes>
                    </Container>
                </BrowserRouter>
            </React.Fragment>
        )
    }
}
export default Router