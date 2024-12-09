import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";

import axios from "axios";
import NavMenu from "../../components/NavMenuPrivado";
import "./ListaReporteIncidente.css";

const ListaReporteIncidente = () => {

    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        getReportes();
    }, []);

    const getReportes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/reporteIncidente", {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            setReportes(response.data);
        } catch (error) {
            console.error("Error al obtener los reportes:", error);
        }
    };

    const onDeleteReporte = async (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar este reporte?");
        if (!confirm) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/reporteIncidente/${id}`, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            getReportes();
        } catch (error) {
            console.error("Error al eliminar el reporte:", error);
        }
    };

    const cambiarReporte = async (id, nuevoEstado) => {
        try {
            await axios.patch(`http://localhost:3000/reporteIncidente/${id}`, {
                estado: nuevoEstado,
            }, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            getReportes()
        } catch (error) {
            console.error("Error al actualizar el estado del reporte:", error);
        }
    };


    return (
        <>
            <NavMenu />
            <Container className="container-reportes">
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <Card.Title className="reporte-title">
                            Lista de Reportes de Incidentes
                        </Card.Title>
                    </Col>
                </Row>
            </Container>

            <Container className="mt-3">
                <Row className="d-flex flex-row align-items-center justify-content-start">
                    {reportes.length === 0 && (
                        <Alert className="alert-no-reportes">
                            No se encontraron reportes.
                        </Alert>
                    )}

                    {reportes.map((reporte) => (
                        <Col key={reporte.id} xl={3} className="mb-4">
                            <Card className="card-reporte">
                                <Card.Img
                                    className="img-reporte"
                                    variant="top"
                                    src={`http://localhost:3000/reportes/${reporte.id}.jpg`}
                                />
                                <Card.Body className="card-body-reporte">
                                    <Card.Title className="card-title-reporte">{`Reporte #${reporte.id}`}</Card.Title>
                                    <Card.Text className="card-text-reporte">
                                        {new Date(reporte.fechaSolicitud).toLocaleDateString()}
                                    </Card.Text>

                                    <div className="d-flex justify-content-center align-items-center gap-4">
                                        <select
                                            value={reporte.estado}
                                            onChange={(e) => cambiarReporte(reporte.id, e.target.value)}
                                            className="form-select form-select-reporte"
                                        >
                                            <option value="pendiente">Pendiente</option>
                                            <option value="aprobado">Aprobado</option>
                                            <option value="rechazado">Rechazado</option>
                                        </select>
                                    </div>

                                    <div className="d-flex justify-content-center align-items-center gap-4">
                                        <Button onClick={() => onDeleteReporte(reporte.id)} className="btnReporteDelete">
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default ListaReporteIncidente;
