import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import './ListaMunicipio.css';
import NavMenu from "../../components/NavMenuPrivado";
import { useAuth } from "../../hooks/useAuth";


const ListaMunicipios = () => {
    useAuth();

    const navigate = useNavigate();
    const [municipios, setMunicipios] = useState([]);

    useEffect(() => {
        getMunicipios();
    }, []);

    const getMunicipios = async () => {
        try {
            const response = await axios.get("http://localhost:3000/municipios", {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            setMunicipios(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const onDeleteMunicipio = async (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el municipio?");
        if (!confirm) {
            return;
        }
        try {
            await axios.delete(`http://localhost:3000/municipios/${id}`, {
                headers: {
                    Authorization: `Bearer ` + localStorage.getItem("token"),
                },
            });
            getMunicipios();
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <>
            <NavMenu />
            <Container className="container-municipios">
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <Card.Title className="mb-0 fs-2 text-start municipio-title">
                            Lista de Municipios
                        </Card.Title>
                    </Col>
                    <Col md={3}>
                        <Button
                            onClick={() => navigate("/municipios/create")}
                            className="btnMunicipioCreate"
                        >
                            <i className="bi bi-plus"></i> Agregar Municipio
                        </Button>
                    </Col>
                </Row>
            </Container>
    
            <Container className="mt-3">
                <Row className="d-flex flex-row align-items-center justify-content-start">
                    {municipios.length === 0 && (
                        <Alert variant="danger" className="mt-4 alert-no-municipios">
                            No se encontraron municipios.
                        </Alert>
                    )}
    
                    {municipios.map((municipio) => (
                        <Col key={municipio.id} xl={3} className="mb-4">
                            <Card className="card-municipio">
                                <Card.Body className="card-body-municipio">
                                    <Card.Title className="card-title-municipio">{municipio.nombre}</Card.Title>
                                    <div className="d-flex justify-content-center align-items-center gap-4">
                                        <Link to={"/municipios/" + municipio.id} className="btnMunicipioEdit">
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        <Button onClick={() => {onDeleteMunicipio(municipio.id)}} className="btnMunicipioDelete">
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

export default ListaMunicipios;
