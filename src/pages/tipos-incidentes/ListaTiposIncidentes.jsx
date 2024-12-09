import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Row } from "react-bootstrap";
import NavMenu from "../../components/NavMenuPrivado";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './ListaTiposIncidentes.css';

const ListaTiposIncidentes = () => {
    useAuth();
    const navigate = useNavigate();
    const [listaTiposIncidentes, setListaTiposIncidentes] = useState([]);

    useEffect(() => {
        getListaTiposIncidentes();
        document.title = "Lista de Tipos de Incidentes";
    }, []);

    const getListaTiposIncidentes = () => {
        axios.get('http://localhost:3000/tiposIncidentes', {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        })
        .then(res => {
            setListaTiposIncidentes(res.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el tipo de incidente?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/tiposIncidentes/${id}`, {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log(res.data);
            getListaTiposIncidentes();
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <>
            <NavMenu />
            <Container className="container-tipos-incidentes mt-4 mb-4">
                <Row className="mb-4">
                    <Col md={9}>
                        <h2 className="titulo-tipos-incidentes">Lista de Tipos de Incidentes</h2>
                    </Col>
                    <Col md={3} className="text-end">
                        <Button 
                            onClick={() => navigate("/tiposIncidentes/create")} 
                            className="btn-crear-tipo-incidente"
                        >
                            <i className="bi bi-plus-lg"></i> Crear Tipo de Incidente
                        </Button>
                    </Col>
                </Row>

                <Row className="g-4">
                    {listaTiposIncidentes.length === 0 && <Alert variant="info">No hay tipos de incidentes registrados</Alert>}

                    {listaTiposIncidentes.map(tipo => (
                        <Col key={tipo.id} md={6} lg={12}>
                            <Card className="card-tipo-incidente">
                                <Card.Body className="d-flex flex-row justify-content-between align-items-center">
                                    <Card.Title className="card-tipo-incidente-titulo">{tipo.nombre}</Card.Title>

                                    <div className="d-flex flex-column justify-content-around m-0">
                                        <Link
                                            className="btn-editar-tipo-incidente"
                                            to={`/tiposIncidentes/${tipo.id}`}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>
                                        <Button
                                            variant="danger"
                                            onClick={() => { eliminar(tipo.id) }}
                                            className="btn-eliminar-tipo-incidente"
                                        >
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
}

export default ListaTiposIncidentes;
