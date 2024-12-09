import { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './ReporteIncidente.css';

const ReporteIncidente = () => {
    const navigate = useNavigate();
    
    const [comentarios, setComentarios] = useState('');
    const [fechaSolicitud, setFechaSolicitud] = useState(new Date().toISOString().split('T')[0]);
    const [photoReporte, setPhotoReporte] = useState(null);
    const [errorText, setErrorText] = useState('');
    const [validated, setValidated] = useState(false);



    const guardarReporte = async (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();
        setValidated(true);

        if (form.checkValidity() === false) return;

        const reporte = {
            estado: 'Pendiente',
            comentarios,
            fechaSolicitud,
        };

        try {
            const res = await axios.post('http://localhost:3000/reporteIncidente', reporte)

            if (photoReporte) {
                const formData = new FormData();
                formData.append('photoReporte', photoReporte);

                await axios.post(`http://localhost:3000/reporteIncidente/${res.data.id}/foto`, formData)
            }

            navigate('/home');
        } catch (error) {
            setErrorText('Error al crear el reporte de incidente');
            console.error(error);
        }
    };

    return (
        <Container className="reporte-container">
            <Row className="mt-4">
                <Col md={12} className="text-center">
                    <Card.Title className="reporte-title">Reporte de Incidente</Card.Title>
                </Col>
            </Row>
            
            <Card className="reporte-card">
                <Card.Body className="reporte-card-body">
                    <Form noValidate validated={validated} onSubmit={guardarReporte}>
                        <Form.Group controlId="comentarios" className="reporte-form-group">
                            <Form.Label className="reporte-form-label">Comentarios</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={comentarios}
                                onChange={(e) => setComentarios(e.target.value)}
                                required
                                className="reporte-form-control"
                            />
                        </Form.Group>

                        <Form.Group controlId="fechaSolicitud" className="mt-3 reporte-form-group">
                            <Form.Label className="reporte-form-label">Fecha de Solicitud</Form.Label>
                            <Form.Control
                                type="date"
                                value={fechaSolicitud}
                                onChange={(e) => setFechaSolicitud(e.target.value)}
                                required
                                className="reporte-form-control"
                            />
                        </Form.Group>

                        <Form.Group className="reporte-form-group-file">
                            <Form.Label className="reporte-form-label">Seleccione una foto por favor</Form.Label>
                            <Form.Control 
                                type="file" 
                                onChange={(e) => setPhotoReporte(e.target.files[0])} 
                                className="reporte-file-input" 
                            />
                            <Form.Control.Feedback type="invalid" className="reporte-file-feedback">
                                Por favor seleccione un archivo.
                            </Form.Control.Feedback>  
                        </Form.Group>

                        {errorText && (
                            <Alert variant="danger" className="reporte-alert">
                                {errorText}
                            </Alert>
                        )}

                        <Button type="submit" variant="primary" className="reporte-btn mt-4">
                            Crear Reporte
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}
 
export default ReporteIncidente;
