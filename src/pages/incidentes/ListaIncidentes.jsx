import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './ListaIncidentes.css';
import NavMenuPrivado from "../../components/NavMenuPrivado";
import { useAuth } from "../../hooks/useAuth";

const ListaIncidentes = () => {
    useAuth();
    const navigate = useNavigate();
    const [incidentes, setIncidentes] = useState([]);


    useEffect(() => {
        getIncidentes();
    }, []);

    const getIncidentes = () => {
        axios.get("http://localhost:3000/incidentes", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            setIncidentes(res.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este incidente?")) {
            axios.delete(`http://localhost:3000/incidentes/${id}`, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            })
            .then(res => {
                getIncidentes();
                console.log(res.data);
            }).catch(error => {
                console.log(error);
            });
        }
    };

    return (
        <>
            <NavMenuPrivado />
            <Container className="container-incidentes">
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <Card.Title className="mb-0 fs-2 text-start municipio-title">
                            Lista de Incidentes
                        </Card.Title>
                    </Col>
                    <Col md={3}>
                        <Button
                            onClick={() => navigate("/incidentes/create")}
                            className="btnMunicipioCreate"
                        >
                            <i className="bi bi-plus"></i> Agregar incidente
                        </Button>
                    </Col>
                </Row>
            </Container>
    
            <Container>
                <Row className="d-flex flex-row align-items-start justify-content-start">
                    {incidentes.length === 0 && <Alert variant="info" className="alert-incidentes">No hay incidentes registrados</Alert>}
    
                    {incidentes.map((incidente) => (
                        <Col md={4} key={incidente.id}>
                            <Card className="card-incidente">
                                <Card.Img
                                    className="img-incidente"
                                    variant="top"
                                    src={"http://localhost:3000/incidentes/" + incidente.id + ".jpg"}
                                    alt="Imagen del incidente"
                                />
                                <Card.Body className="card-body-incidente">
                                    <Card.Title className="card-title-incidente">{incidente.descripcion}</Card.Title>
    
                                    <div className="d-flex flex-row justify-content-between align-items-center gap-4">
                                        <Button className="btn-control" onClick={() => navigate(`/incidentes/${incidente.id}/foto`)}>
                                            <i className="bi bi-image"></i>
                                        </Button>
                                        <Button className="btn-control" onClick={() => handleDelete(incidente.id)}>
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                        <Link to={`/incidentes/${incidente.id}`}>
                                            <Button className="btn-control">
                                                <i className="bi bi-pencil"></i>
                                            </Button>
                                        </Link>
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
    
export default ListaIncidentes;
