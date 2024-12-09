import { useEffect, useState } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './FormMunicipio.css';
import { useAuth } from "../../hooks/useAuth";

const containerStyle = {
    width: '100%',
    height: '400px'
};

const FormMunicipio = () => {
    useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [latitud, setLatitud] = useState(-17.7833);
    const [longitud, setLongitud] = useState(-63.182);
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);
    

    useEffect(() => {
        if (!id) return;
        getMunicipioById();
    }, [id]);

    const getMunicipioById = () => {
        axios.get(`http://localhost:3000/municipios/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            const municipio = res.data;
            setNombre(municipio.nombre);
            setLatitud(municipio.latitud);
            setLongitud(municipio.longitud);
        }).catch(error => {
            console.log(error);
        });
    };

    const guardarMunicipio = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');
        const municipio = { nombre, latitud, longitud };

        if (id) {
            editMunicipio(municipio);
        } else {
            insertMunicipio(municipio);
        }
    };

    const editMunicipio = (municipio) => {
        axios.patch(`http://localhost:3000/municipios/${id}`, municipio, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            console.log(res.data);
            navigate('/municipios');
        }).catch(error => {
            setErrorText('Error al actualizar municipio');
            console.log(error);
        });
    };

    const insertMunicipio = (municipio) => {
        axios.post('http://localhost:3000/municipios', municipio, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            console.log(res.data);
            navigate('/municipios');
        }).catch(error => {
            setErrorText('Error al crear municipio');
            console.log(error);
        });
    };

    return (
        <Container className="municipio-form-container">
            <Row className="mt-3 mb-3">
                <Col md={6}>
                    <Card className="municipio-form-card">
                        <Card.Body className="municipio-form-card-body">
                            <Card.Title>
                                <h2 className="municipio-form-title">{id ? "Editar Municipio" : "Crear Municipio"}</h2>
                            </Card.Title>
                            <Form noValidate validated={validated} onSubmit={guardarMunicipio}>
                                {errorText && <Alert variant="danger" className="municipio-alert">{errorText}</Alert>}
                                <Form.Group className="municipio-form-group">
                                    <Form.Label className="municipio-form-label">Nombre del Municipio:</Form.Label>
                                    <Form.Control
                                        required
                                        value={nombre}
                                        type="text"
                                        onChange={(e) => setNombre(e.target.value)}
                                        className="municipio-form-control"
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingrese el nombre del municipio.
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="municipio-form-group">
                                    <Form.Label className="municipio-form-label">Latitud:</Form.Label>
                                    <Form.Control
                                        required
                                        value={latitud}
                                        type="number"
                                        readOnly
                                        className="municipio-form-control"
                                    />
                                </Form.Group>
                                <Form.Group className="municipio-form-group">
                                    <Form.Label className="municipio-form-label">Longitud:</Form.Label>
                                    <Form.Control
                                        required
                                        value={longitud}
                                        type="number"
                                        readOnly
                                        className="municipio-form-control"
                                    />
                                </Form.Group>
                                <Form.Group className="municipio-form-group-button">
                                    <Button type="submit" className="municipio-form-btn">Guardar Municipio</Button>
                                </Form.Group>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="municipio-form-card">
                        <Card.Body>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={{ lat: latitud, lng: longitud }}
                                zoom={11}
                                onClick={(e) => {
                                    const lat = e.latLng.lat();
                                    const lng = e.latLng.lng();
                                    setLatitud(lat);
                                    setLongitud(lng);
                                }}
                                options={{
                                    gestureHandling: 'greedy',
                                    draggable: true,
                                    zoomControl: true,
                                    scrollwheel: true,
                                }}
                            >
                                <Marker 
                                    key={`${latitud}-${longitud}`} 
                                    position={{ lat: latitud, lng: longitud }} 
                                />
                            </GoogleMap>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
    
export default FormMunicipio;
