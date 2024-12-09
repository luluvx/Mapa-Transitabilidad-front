import axios from "axios";
import { useEffect, useState } from "react";
import NavMenu from "../../components/NavMenuPrivado";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './FormTipoIncidente.css';

const FormTipoIncidente = () => {
    useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!id) return;
        getTipoIncidenteById();
    }, [id]);

    const getTipoIncidenteById = () => {
        axios.get(`http://localhost:3000/tiposIncidentes/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            const tipoIncidente = res.data;
            setNombre(tipoIncidente.nombre);
        }).catch(error => {
            console.log(error);
        });
    };


    const guardarTipoIncidente = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');
        const tipoIncidente = {
            nombre
        };

        if (id) {
            editTipoIncidente(tipoIncidente);
        } else {
            insertTipoIncidente(tipoIncidente);
        }
    };

    const editTipoIncidente = (tipoIncidente) => {
        axios.patch(`http://localhost:3000/tiposIncidentes/${id}`, tipoIncidente, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            console.log(res.data);
            navigate('/tiposIncidentes');
        }).catch(error => {
            const errorMsg = error.response.data.msg;
            setErrorText(errorMsg);
            console.log(error);
        });
    };

    const insertTipoIncidente = (tipoIncidente) => {
        axios.post('http://localhost:3000/tiposIncidentes', tipoIncidente, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            console.log(res.data);
            navigate('/tiposIncidentes');
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <>
            <NavMenu />
            <Container className="form-tipo-incidente-container">
                <Row className="mt-4">
                    <Col md={6}>
                        <Card className="form-tipo-incidente-card">
                            <Card.Body>
                                <Card.Title className="form-tipo-incidente-title">
                                    <h2>Formulario Tipo de Incidente</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={guardarTipoIncidente}>
                                    {errorText && <Alert variant="danger" className="form-tipo-incidente-alert">{errorText}</Alert>}
                                    <Form.Group>
                                        <Form.Label className="form-tipo-incidente-label">Nombre del Tipo de Incidente:</Form.Label>
                                        <Form.Control
                                            required
                                            value={nombre}
                                            onChange={(e) => setNombre(e.target.value)}
                                            className="form-tipo-incidente-control"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un nombre para el tipo de incidente.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mt-3">
                                        <Button type="submit" className="form-tipo-incidente-btn">Guardar datos</Button>
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default FormTipoIncidente;
