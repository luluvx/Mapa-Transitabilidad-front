import { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import iconImage from '../../assets/puntito.png'
import './FormCarretera.css';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const initialCenter = {
    lat: -17.7833,
    lng: -63.182
};

const FormCarretera = () => {

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });
    const navigate = useNavigate();
    const { id } = useParams();

    const [nombre, setNombre] = useState('');
    const [municipioOrigenId, setMunicipioOrigenId] = useState('');
    const [municipioDestinoId, setMunicipioDestinoid] = useState('');
    const [estado, setEstado] = useState('');
    const [puntos, setPuntos] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);
    const [centroMunicipios, setCentroMunicipios] = useState(initialCenter);
    const [razonBloqueo, setRazonBloqueo] = useState('');


    useEffect(() => {
        getMunicipios();
        if (id){
            getCarreteraById();
            getPuntosByCarreteraId();
        }
    }, [id]);


      
    const getPuntosByCarreteraId = () => {
        axios.get(`http://localhost:3000/carreteras/${id}/puntos`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(res => {
            const puntosObtenidos = res.data.map(punto => ({
                id: punto.id,
                lat: parseFloat(punto.latitud),
                lng: parseFloat(punto.longitud)
            }));
            console.log('Puntos obtenidos de la carretera:', puntosObtenidos);
            setPuntos(puntosObtenidos);
        })
        .catch(error => console.log('Error al obtener los puntos:', error));
    };

    
    const getMunicipios = () => {
        axios.get(`http://localhost:3000/municipios`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(res => {
            setMunicipios(res.data);
        })
        .catch(error => console.log(error));
    };

    const getCarreteraById = () => {
        axios.get(`http://localhost:3000/carreteras/${id}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(res => {
            const carretera = res.data;
            setNombre(carretera.nombre);
            setMunicipioOrigenId(carretera.municipioOrigenId);
            setMunicipioDestinoid(carretera.municipioDestinoId);
            setEstado(carretera.estado);
            setRazonBloqueo(carretera.razonBloqueo);
            setPuntos(carretera.puntos || []);
            getMunicipiosLatLng(carretera.municipioOrigenId, carretera.municipioDestinoId);
        })
        .catch(error => console.log(error));
    };

    const getMunicipiosLatLng = (municipioOrigenId, municipioDestinoId) => {
        axios.get(`http://localhost:3000/municipios/${municipioOrigenId}`, {
            headers: { Authorization: "Bearer " + localStorage.getItem("token") }
        })
        .then(res => {
            const municipioOrigen = res.data;
            axios.get(`http://localhost:3000/municipios/${municipioDestinoId}`, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            })
            .then(res => {
                const municipioDestino = res.data;
                const lat = (municipioOrigen.latitud + municipioDestino.latitud) / 2;
                const lng = (municipioOrigen.longitud + municipioDestino.longitud) / 2;
                setCentroMunicipios({ lat, lng });
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    };


    const mapaClickPuntitos = useCallback((event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        setPuntos(prevPuntos => [...prevPuntos, { lat: Number(lat), lng: Number(lng) }]);
    }, []);

    const onGuardarClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (municipioOrigenId === municipioDestinoId) {
            setErrorText("El municipio de origen no puede ser igual al de destino.");
            return;
        }

        if (e.currentTarget.checkValidity() === false) return;

        const carretera = {
            nombre,
            municipioOrigenId,
            municipioDestinoId,
            estado,
            razonBloqueo
        };

        if (id) {
            await editCarretera(carretera);
        } else {
            await insertCarretera(carretera);
        }
    };

    const editCarretera = async (carretera) => {
        try {
            await axios.patch(`http://localhost:3000/carreteras/${id}`, carretera, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            await editarPuntos(id, puntos);
            navigate('/carreteras');
        } catch (error) {
            console.log(error);
            setErrorText('Error al actualizar carretera');
        }
    };

    const insertCarretera = async (carretera) => {
        try {
            const res = await axios.post('http://localhost:3000/carreteras', carretera, {
                headers: { Authorization: "Bearer " + localStorage.getItem("token") }
            });
            const carreteraId = res.data.id;
            await insertPuntos(carreteraId, puntos);
            navigate('/carreteras');
        } catch (error) {
            console.log(error);
            setErrorText('Error al crear carretera');
        }
    };

    const insertPuntos = async (carreteraId, puntos) => {
        try {
            console.log("carreteraId donde estamos insertando puntos", carreteraId);
            for (let i = 0; i < puntos.length; i++) {
                const punto = puntos[i];
                const puntoSolito = {
                    carreteraId,
                    latitud: punto.lat,
                    longitud: punto.lng,
                    orden: i + 1
                };

                console.log(`Insertando punto ${i + 1}:`, puntoSolito);

                await axios.post(`http://localhost:3000/puntos`, puntoSolito, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                });
    
                console.log(`Punto ${i + 1} insertado correctamente`);
            }
            console.log('Todos los puntos se insertaron correctamente');
        } catch (error) {
            console.error('Error al insertar puntos', error);
        }
    };

    const editarPuntos = async (carreteraId, puntos) => {
        try {
            for (let i = 0; i < puntos.length; i++) {

                const punto = puntos[i];
                const puntoSolito = {
                    carreteraId,
                    latitud: punto.lat,
                    longitud: punto.lng,
                    orden: i + 1
                };

                if (punto.id) {
                    console.log(`Editando punto ${i + 1}:`, puntoSolito);
                    await axios.patch(`http://localhost:3000/puntos/${punto.id}`, puntoSolito, {
                        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                    });
                    console.log(`Punto ${i + 1} editado correctamente`);
                } else {
                    console.log(`Insertando punto ${i + 1}:`, puntoSolito);
                    await axios.post(`http://localhost:3000/puntos`, puntoSolito, {
                        headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                    });
                    console.log(`Punto ${i + 1} insertado correctamente`);
                }
            }
            console.log('Todos los puntos se editaron correctamente');
        } catch (error) {
            console.error('Error al editar puntos', error);
        }
    };



    const eliminarUltimoPunto = async () => {
        if (puntos.length === 0) return;
    
        const ultimoPunto = puntos[puntos.length - 1];

        if (ultimoPunto.id) {
            try {
                await axios.delete(`http://localhost:3000/puntos/${ultimoPunto.id}`, {
                    headers: { Authorization: "Bearer " + localStorage.getItem("token") }
                });
                setPuntos(prevPuntos => prevPuntos.slice(0, prevPuntos.length - 1));
            } catch (error) {
                console.error('Error al eliminar el último punto:', error);
            }
        }else{
            setPuntos(prevPuntos => prevPuntos.slice(0, prevPuntos.length - 1));
        }
    };

    if (!isLoaded) {
        return <div>Cargando Mapa...</div>;
    }

    return (
        <Container className="carretera-form-container">
            <Row className="carretera-form-row">
                <Col md={6} className="carretera-form-col">
                    <Card className="carretera-form-card">
                        <Card.Body className="carretera-form-card-body">
                            <Form noValidate validated={validated} onSubmit={onGuardarClick} className="carretera-form">
                                {errorText && <Alert variant="danger" className="carretera-form-alert">{errorText}</Alert>}
                                <Form.Group className="carretera-form-group">
                                    <Form.Label className="carretera-form-label">Nombre</Form.Label>
                                    <Form.Control 
                                        value={nombre} 
                                        onChange={(e) => setNombre(e.target.value)} 
                                        required 
                                        className="carretera-form-input"
                                    />
                                </Form.Group>
    
                                <Form.Group className="carretera-form-group">
                                    <Form.Label className="carretera-form-label">Municipio Origen</Form.Label>
                                    <Form.Select 
                                        value={municipioOrigenId} 
                                        onChange={(e) => setMunicipioOrigenId(e.target.value)} 
                                        required 
                                        className="carretera-form-select"
                                    >
                                        <option value="">Seleccione un municipio</option>
                                        {municipios.map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group className="carretera-form-group">
                                    <Form.Label className="carretera-form-label">Municipio Destino</Form.Label>
                                    <Form.Select 
                                        value={municipioDestinoId} 
                                        onChange={(e) => setMunicipioDestinoid(e.target.value)} 
                                        required 
                                        className="carretera-form-select"
                                    >
                                        <option value="">Seleccione un municipio</option>
                                        {municipios.map(m => (
                                            <option key={m.id} value={m.id}>{m.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
    
                                <Form.Group className="carretera-form-group">
                                    <Form.Label className="carretera-form-label">Estado</Form.Label>
                                    <Form.Select 
                                        value={estado} 
                                        onChange={(e) => setEstado(e.target.value)} 
                                        className="carretera-form-select"
                                    >
                                        <option value="">Seleccione un estado</option>
                                        <option value="transitable">Transitable</option>
                                        <option value="bloqueado">Bloqueado</option>
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group className="carretera-form-group">
                                    <Form.Label className="carretera-form-label">Razon bloqueo</Form.Label>
                                    <Form.Control 
                                        value={razonBloqueo} 
                                        onChange={(e) => setRazonBloqueo(e.target.value)} 
                                        required 
                                        className="carretera-form-input"
                                    />
                                </Form.Group>
                                
    
                                <Button type="submit" className="carretera-form-btn mt-3">Guardar Carretera</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
    
                <Col md={6} className="carretera-map-col">
                    <Card className="carretera-map-card">
                        <Card.Body className="carretera-map-card-body">
                            <div className="carretera-map-btn-container">
                                <Button onClick={eliminarUltimoPunto} disabled={puntos.length === 0} className="carretera-map-btn">
                                    Eliminar último punto
                                </Button>
                            </div>
                            <GoogleMap
                                mapContainerStyle={containerStyle}
                                center={centroMunicipios}
                                zoom={10}
                                onClick={mapaClickPuntitos}
                                className="carretera-map"
                            >
                                {puntos.map((punto, index) => (
                                    <Marker
                                        key={index}
                                        position={punto}
                                        icon={{
                                            url: iconImage,
                                            scaledSize: new window.google.maps.Size(15, 15),
                                            anchor: new window.google.maps.Point(6, 6)
                                        }}
                                        className="carretera-map-marker"
                                    />
                                ))}
                                {puntos.length > 1 && (
                                    <Polyline 
                                        path={puntos} 
                                        options={{ strokeColor: "#3aab58", strokeWeight: 2 }} 
                                        className="carretera-map-polyline"
                                    />
                                )}
                            </GoogleMap>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};    

export default FormCarretera;
