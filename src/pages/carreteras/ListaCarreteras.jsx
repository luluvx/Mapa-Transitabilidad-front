import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListaCarretera.css";

import NavMenu from "../../components/NavMenuPrivado";

const ListaCarreteras = () => {
    const navigate = useNavigate();
    const [carreteras, setCarreteras] = useState([]);

    useEffect(() => {
        getCarreteras();
    }, []);

    const getCarreteras = async () => {
        try {
            const response = await axios.get("http://localhost:3000/carreteras", {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            setCarreteras(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteCarretera = async (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar la carretera?");
        if (!confirm) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/carreteras/${id}`, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            getCarreteras();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            <NavMenu />
            <Container className="container-carreteras">
                <Row className="mt-4">
                    <Col md={9} className="text-start">
                        <Card.Title className="carretera-title">
                            Lista de Carreteras
                        </Card.Title>
                    </Col>
                    <Col md={3}>
                        <Button
                            onClick={() => navigate("/carreteras/create")}
                            className="btnCarreteraCreate"
                        >
                            <i className="bi bi-plus"></i> Agregar Carretera
                        </Button>
                    </Col>
                </Row>
            </Container>
    
            <Container>
                <Row className="d-flex flex-row align-items-center justify-content-start">
                    {carreteras.length === 0 && (
                        <Alert className="alert-no-carreteras">
                            No se encontraron carreteras.
                        </Alert>
                    )}
    
                    {carreteras.map((carretera) => (
                        <Col key={carretera.id} xl={3} className="mb-4">
                            <Card className="card-carretera">
                                <Card.Body className="card-body-carretera">
                                    <Card.Title className="card-title-carretera">
                                        {carretera.nombre}
                                    </Card.Title>
                                    <div className="d-flex justify-content-center align-items-center gap-4">
                                        <Link to={`/carreteras/${carretera.id}`} className="btnCarreteraEdit">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <Button
                                            onClick={() => { onDeleteCarretera(carretera.id); }}
                                            className="btnCarreteraDelete"
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
};
    
export default ListaCarreteras;
