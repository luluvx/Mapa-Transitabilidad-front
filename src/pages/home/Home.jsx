import { useEffect, useState } from "react";
import {  Col, Container, Row, Form, Button, Card, Alert, Modal } from "react-bootstrap";
import { GoogleMap, useJsApiLoader, Polyline, Marker, MarkerF } from "@react-google-maps/api";
import NavMenuCliente from "../../components/NavMenuCliente";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";


const containerStyle = {
    width: "100%",
    height: "500px",
    };

    const center = {
    lat: -17.3278,
    lng: -63.2606,
    };


    const tipoIncidenteColores = {
    1: "#08ad4d",
    2: "#A594F9",
    3: "#f7bc1c",
    4: "#1c74e1",
    };

const Home = () => {
    const navigate = useNavigate();

    const [tiposIncidentes, setTiposIncidentes] = useState([]);
    const [filtroIncidente, setFiltroIncidente] = useState("");

    const [filtroIncidenteCard, setFiltroIncidenteCard] = useState("")

    const [abrirCerrarModal, setAbrirCerrarModal] = useState(false);
    const [carreteraSeleccionada, setCarreteraSeleccionada] = useState(null);

    const [carreteras, setCarreteras] = useState([]);
    const [carreterasConColores, setCarreterasConColores] = useState([]);


    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

    




    useEffect(() => {
        const getCarreteras = async () => {
            try {
                const response = await axios.get("http://localhost:3000/carreteras", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setCarreteras(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        getCarreteras();
        getTiposIncidentes();
    }, []);



    const getTiposIncidentes = async () => {
        try {
        const response = await axios.get("http://localhost:3000/tiposIncidentes", {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setTiposIncidentes(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    useEffect(() => {
        const carreterasConColoresCalculadas = carreteras.map((carretera) => {
            const colorEstado = carretera.estado === "transitable" ? "#08ad4d" : "#ea443f";

            if (filtroIncidente) {
                const incidente = carretera.incidentes.find(
                    (incidente) => incidente.tipoIncidenteId === parseInt(filtroIncidente, 10)
                );

                if (incidente) {
                    return {
                        ...carretera,
                        color: tipoIncidenteColores[incidente.tipoIncidenteId] || colorEstado,
                    };
                }

                return {
                    ...carretera,
                    color: colorEstado,
                };
            }

            return {
                ...carretera,
                color: colorEstado,
            };
        });

        setCarreterasConColores(carreterasConColoresCalculadas);
    }, [carreteras, filtroIncidente]);

    const cambiarFiltroIncidente = (event) => {
        setFiltroIncidente(event.target.value);
        setFiltroIncidenteCard(event.target.value);
    };


    const tarjetasFiltradas = filtroIncidenteCard ?
        carreteras.filter((carretera) =>
            carretera.incidentes.some((incidente) => incidente.tipoIncidenteId === parseInt(filtroIncidenteCard, 10))
        )
        : carreteras;

    const seleccionarCarretera = async (carreteraId) => {
        try {
        const response = await axios.get(`http://localhost:3000/carreteras/${carreteraId}`, {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        setCarreteraSeleccionada(response.data);
        setAbrirCerrarModal(true);
        } catch (error) {
        console.error("Error al obtener la carretera:", error);
        }
    };

    const cerrarModalcito = () => {
        setAbrirCerrarModal(false);
        setCarreteraSeleccionada(null);
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return ( 
        <>
        <NavMenuCliente />
        <Container className="home-container">
            <Row className="mb-4">
                <Col md={9}>
                    <Form className="form-filter">
                        <Form.Group controlId="filtroIncidente">
                            
                            <Form.Control
                                as="select"
                                value={filtroIncidente}
                                onChange={cambiarFiltroIncidente}
                                className="form-control"
                            >
                                <option value="">Todas las carreteras</option>
                                {tiposIncidentes.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
                <Col md={3}>

                    <Button variant="primary" className="btn-reportar" onClick={() => navigate('/reportes')}>
                        Reportar incidente
                    </Button>

                </Col>

            </Row>
            <Row className="mb-4 mapita-container">
                <Col md={12}>
    
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={8}
                className="google-map"
            >
                {carreterasConColores.length > 0 && carreterasConColores.map((carretera) => {
                    const puntosValidos = carretera.puntos && carretera.puntos.length > 0 && carretera.puntos.every(punto => punto.latitud && punto.longitud);
                    return puntosValidos ? (
                        <Polyline
                            key={carretera.id}
                            path={carretera.puntos.map((punto) => ({
                                lat: punto.latitud,
                                lng: punto.longitud,
                            }))}
                            options={{
                                strokeColor: carretera.color || '#000000',
                                strokeOpacity: 1,
                                strokeWeight: 5,
                            }}
                            className="carretera-polyline"
                        />
                    ) : null;
                })}
    
                {carreterasConColores.length > 0 && carreterasConColores.map((carretera) => {
                    const tieneMunicipioOrigen = carretera.municipioOrigen && carretera.municipioDestino;
                    return tieneMunicipioOrigen && (
                        <>
                            <Marker
                                key={`origen-${carretera.id}`}
                                position={{
                                    lat: carretera.municipioOrigen.latitud,
                                    lng: carretera.municipioOrigen.longitud,
                                }}
                                label={carretera.municipioOrigen.nombre}
                                onClick={() => seleccionarCarretera(carretera.id)}
                                className="carretera-marker"
                            />
    
                            <Marker
                                key={`destino-${carretera.id}`}
                                position={{
                                    lat: carretera.municipioDestino.latitud,
                                    lng: carretera.municipioDestino.longitud,
                                }}
                                label={carretera.municipioDestino.nombre}
                                onClick={() => seleccionarCarretera(carretera.id)}
                                className="carretera-marker"
                            />
                        </>
                    );
                })}
            </GoogleMap>
            </Col>
            </Row>
    
            <Row className="mt-4 tarjetas-container">
                {tarjetasFiltradas.length === 0 ? (
                    <Col md={12}>
                        <Alert variant="warning" className="no-incidentes-alert">
                            No hay carreteras con el tipo de incidente seleccionado.
                        </Alert>
                    </Col>
                ) : (
                    tarjetasFiltradas.map((carretera) => (
                        <Col key={carretera.id} md={4} className="carretera-card-col">
                            <Card className={`carretera-card mb-4 `}>
                                <Card.Body>
                                    <div className={`estado-badge ${carretera.estado === "bloqueado" ? 'estado-bloqueado' : 'estado-transitable'}`}>
                                        {carretera.estado === "bloqueado" ? "Bloqueado" : "Transitable"}
                                    </div>
                                    <Card.Title className="carretera-card-title">{carretera.nombre}</Card.Title>
                                    <Card.Text className="carretera-card-text">
                                        {carretera.municipioOrigen.nombre}  -  {carretera.municipioDestino.nombre}
                                    </Card.Text>

                                    {carretera.estado === "bloqueado" && (
                                        <Button
                                            
                                            onClick={() => seleccionarCarretera(carretera.id)}
                                            className="carretera-card-btn"
                                        >
                                            Ver motivo
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                )}
            </Row>


            <Modal show={abrirCerrarModal} onHide={cerrarModalcito} className="carretera-modal">
                <Modal.Body>
                    {carreteraSeleccionada ? (
                        <div className="modal-details">
                            <h2 className="modal-status">{carreteraSeleccionada.estado}</h2>
                            <h5 className="modal-title">{carreteraSeleccionada.nombre}</h5>
                            <p>{carreteraSeleccionada.razonBloqueo}</p>
                            <p>{carreteraSeleccionada.municipioOrigen.nombre} <strong> - </strong>{carreteraSeleccionada.municipioDestino.nombre}</p>



                            {carreteraSeleccionada.incidentes.length > 0 ? (
                                <div className="incidentes-list">
                                    {carreteraSeleccionada.incidentes.map((incidente) => (
                                        <div key={incidente.id} className="incidente-card">
                                            <img
                                                className="img-fluid incidente-img"
                                                src={`http://localhost:3000/incidentes/${incidente.id}.jpg`}
                                                alt={`Imagen del incidente ${incidente.id}`}
                                            />
                                            <div className="incidente-info">
                                                <p className="incidente-description">{incidente.descripcion}</p>
                                                <div className="incidente-map">
                                                    <GoogleMap
                                                        mapContainerStyle={{ width: "100%", height: "150px", borderRadius: "8px" }}
                                                        center={{
                                                            lat: parseFloat(incidente.latitud),
                                                            lng: parseFloat(incidente.longitud),
                                                        }}
                                                        zoom={14}
                                                    >
                                                        <MarkerF
                                                            position={{
                                                                lat: parseFloat(incidente.latitud),
                                                                lng: parseFloat(incidente.longitud),
                                                            }}
                                                        />
                                                    </GoogleMap>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-incidentes">No hay incidentes reportados.</p>
                            )}
                        </div>
                    ) : (
                        <p>Cargando detalles...</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModalcito} className="btn-close-modal">
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>



        </Container>
        </>
    );
}

export default Home;
