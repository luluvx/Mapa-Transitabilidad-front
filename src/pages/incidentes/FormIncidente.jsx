import { useEffect, useState } from "react";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { Container, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './FormIncidente.css';
import { useAuth } from "../../hooks/useAuth";

const containerStyle = {
    width: '100%',
    height: '400px'
};

const FormIncidente = () => {

    useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    const [descripcion, setDescripcion] = useState('');
    const [latitud, setLatitud] = useState(-17.7833);
    const [longitud, setLongitud] = useState(-63.182);
    const [carreteras, setCarreteras] = useState([]);
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [carreteraId, setCarreteraId] = useState('');
    const [tipoIncidenteId, setTipoIncidenteId] = useState('');
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);
    const [centerCarretera, setCenterCarretera] = useState({ lat: -17.7833, lng: -63.182 });
    const [carreteraPuntos, setCarreteraPuntos] = useState([]);

    useEffect(() => {
        getCarreteras();
        getTiposIncidente();
    }, []);


    useEffect(() => {
        if (id) {
            getIncidenteById(id);
        }
    }, [id]);

    const getCarreteras = () => {
        axios.get("http://localhost:3000/carreteras", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            setCarreteras(res.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const getTiposIncidente = () => {
        axios.get("http://localhost:3000/tiposIncidentes", {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            setTiposIncidente(res.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const getIncidenteById = (id) => {
        axios.get(`http://localhost:3000/incidentes/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                const incidente = res.data;
                setDescripcion(incidente.descripcion);
                setLatitud(incidente.latitud);
                setLongitud(incidente.longitud);
                setCarreteraId(incidente.carreteraId);
                setTipoIncidenteId(incidente.tipoIncidenteId);
                setCenterCarretera({ lat: incidente.latitud, lng: incidente.longitud });

                getPuntosByCarreteraId(incidente.carreteraId);

            })
            .catch(err => {
                console.log(err);
            });
    };

    const getPuntosByCarreteraId = (carreteraId) => {
        axios.get(`http://localhost:3000/carreteras/${carreteraId}/puntos`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                const puntos = res.data;
                const puntosLatLong = puntos.map(punto => ({ lat: punto.latitud, lng: punto.longitud }));
                setCarreteraPuntos(puntosLatLong);
            })
            .catch(err => {
                console.log(err);
            });
    };



    const guardarIncidente = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');

        const incidente = {
            descripcion,
            latitud,
            longitud,
            carreteraId,
            tipoIncidenteId
        };

        if (id) {
            editIncidente(incidente);
        } else {
            insertIncidente(incidente);
        }
    };

    const insertIncidente = (incidente) => {
        axios.post("http://localhost:3000/incidentes", incidente, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                navigate('/incidentes');
                console.log(response.data)

            })
            .catch(error => {
                setErrorText('Error al crear incidente');
                console.log(error);
            });
    };

    const editIncidente = (incidente) => {
        axios.put(`http://localhost:3000/incidentes/${id}`, incidente, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
            .then(response => {
                navigate('/incidentes');
                console.log(response.data);
            }
            ).catch(error => {
                setErrorText('Error al actualizar incidente');
                console.log(error);
            }
            );
    };

    const manejarCambioCarretera = (e) => {
        const carretera = carreteras.find(carretera => Number(carretera.id) === Number(e.target.value));

        if (carretera) {
            const municipioOrigen = carretera.municipioOrigen;
            const municipioDestino = carretera.municipioDestino;

            if (municipioOrigen && municipioDestino && municipioOrigen.latitud && municipioDestino.latitud && municipioOrigen.longitud && municipioDestino.longitud) {
                const avgLat = (municipioOrigen.latitud + municipioDestino.latitud) / 2;
                const avgLng = (municipioOrigen.longitud + municipioDestino.longitud) / 2;
                setCenterCarretera({ lat: avgLat, lng: avgLng });
            }

            const puntos = carretera.puntos || [];
            const puntosLatLong = puntos.map(punto => ({ lat: punto.latitud, lng: punto.longitud }));
            setCarreteraPuntos(puntosLatLong);
        }
        setCarreteraId(e.target.value);
    };



    return (
        <Container className="form-incidente-container">
            <Col md={8} className="form-incidente-col text-center">
                <Card className="form-incidente-card">
                    <Card.Body>
                        <Card.Title className="form-incidente-title mb-0 fs-2 text-start">Formulario Incidente</Card.Title>
                        {errorText && <Alert variant="danger" className="form-incidente-alert">{errorText}</Alert>}
                        <Form noValidate validated={validated} onSubmit={guardarIncidente} className="form-incidente-form">
                            <Form.Group className="form-incidente-group">
                                <Form.Label className="form-incidente-label">Descripción</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    required
                                    className="form-incidente-input"
                                />
                                <Form.Control.Feedback type="invalid" className="form-incidente-feedback">
                                    Por favor ingrese una descripción.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="form-incidente-group">
                                <Form.Label className="form-incidente-label">Carretera</Form.Label>
                                <Form.Select
                                    required
                                    value={carreteraId}
                                    onChange={manejarCambioCarretera}
                                    className="form-incidente-select"
                                >
                                    <option value="">Seleccione una carretera...</option>
                                    {carreteras.map(carretera => (
                                        <option key={carretera.id} value={carretera.id}>
                                            {carretera.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className="form-incidente-feedback">
                                    Por favor seleccione una carretera.
                                </Form.Control.Feedback>
                            </Form.Group>
    
                            <Form.Group className="form-incidente-group">
                                <Form.Label className="form-incidente-label">Tipo de Incidente</Form.Label>
                                <Form.Select
                                    required
                                    value={tipoIncidenteId}
                                    onChange={(e) => setTipoIncidenteId(e.target.value)}
                                    className="form-incidente-select"
                                >
                                    <option value="">Seleccione el tipo de incidente...</option>
                                    {tiposIncidente.map(tipo => (
                                        <option key={tipo.id} value={tipo.id}>
                                            {tipo.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid" className="form-incidente-feedback">
                                    Por favor seleccione el tipo de incidente.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="form-incidente-group">
                                <Form.Label className="form-incidente-label">Ubicación del incidente</Form.Label>
                                <div className="map-container">
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={centerCarretera}
                                        zoom={12}
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
                                        className="form-incidente-map"
                                    >
                                        {carreteraPuntos.length > 0 && (
                                            <Polyline
                                                path={carreteraPuntos}
                                                options={{
                                                    strokeColor: "#3aab58",
                                                    strokeOpacity: 1,
                                                    strokeWeight: 2,
                                                }}
                                            />
                                        )}
                                        <Marker key={`${latitud}-${longitud}`} position={{ lat: latitud, lng: longitud }} />
                                    </GoogleMap>
                                </div>
                            </Form.Group>
    
                            <Form.Group className="form-incidente-group">
                                <Button type="submit" className="form-incidente-btn">Guardar</Button>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Container>
    );
};
    

export default FormIncidente;
