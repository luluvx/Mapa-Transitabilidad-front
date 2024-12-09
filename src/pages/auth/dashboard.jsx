import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import NavMenuPrivado from "../../components/NavMenuPrivado";
import'./dashboard.css';

const Dashboard = () => {
    const [userType, setUserType] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (token) {
            getUserInfo();
        }
    }, [token]);

    const getUserInfo = () => {
        axios
            .get("http://localhost:3000/auth/me", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            })
            .then((res) => {
                const user = res.data;
                setUser(user);
                setUserType(user.tipo);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            <NavMenuPrivado />
            <Container className="container-dashboard mt-4">
                <Row>
                    <Col md={4}>
                        <Card className="card-dashboard mb-4">
                            <Card.Body>
                                <Card.Title className="card-title-dashboard">Mi Perfil</Card.Title>
                                <Card.Text className="card-text-dashboard">{user?.email}</Card.Text>
                                <Button variant="primary" onClick={() => navigate("/perfil")} className="btn-dashboard">
                                    Ver Perfil
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>

                    {userType === "administrador" && (
                        <>
                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Administración</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona los usuarios y la plataforma.</Card.Text>
                                        <Button
                                            variant="success"
                                            onClick={() => navigate("/usuarios")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Usuarios
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="mt-2 btn-dashboard"
                                            onClick={() => navigate("/usuarios/create")}
                                        >
                                            Crear Usuario
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </>
                    )}

                    {(userType === "administrador" || userType === "verificador") && (
                        <>
                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Tipos incidentes</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona los tipos de incidentes.</Card.Text>
                                        <Button
                                            variant="warning"
                                            onClick={() => navigate("/tiposIncidentes")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Tipos de Incidentes
                                        </Button>
                                        <Button
                                            variant="info"
                                            className="mt-2 btn-dashboard"
                                            onClick={() => navigate("/tiposIncidentes/create")}
                                        >
                                            Crear Tipo de Incidente
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Municipios</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona los municipios.</Card.Text>
                                        <Button
                                            variant="warning"
                                            onClick={() => navigate("/municipios")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Municipios
                                        </Button>
                                        <Button
                                            variant="info"
                                            className="mt-2 btn-dashboard"
                                            onClick={() => navigate("/municipios/create")}
                                        >
                                            Crear Municipio
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Carreteras</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona las carreteras.</Card.Text>
                                        <Button
                                            variant="warning"
                                            onClick={() => navigate("/carreteras")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Carreteras
                                        </Button>
                                        <Button
                                            variant="info"
                                            className="mt-2 btn-dashboard"
                                            onClick={() => navigate("/carreteras/create")}
                                        >
                                            Crear Carretera
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Incidentes</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona los incidentes.</Card.Text>
                                        <Button
                                            variant="warning"
                                            onClick={() => navigate("/incidentes")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Incidentes
                                        </Button>
                                        <Button
                                            variant="info"
                                            className="mt-2 btn-dashboard"
                                            onClick={() => navigate("/incidentes/create")}
                                        >
                                            Crear Incidente
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col md={4}>
                                <Card className="card-dashboard mb-4">
                                    <Card.Body>
                                        <Card.Title className="card-title-dashboard">Reportes</Card.Title>
                                        <Card.Text className="card-text-dashboard">Gestiona los reportes de incidentes.</Card.Text>
                                        <Button
                                            variant="warning"
                                            onClick={() => navigate("/reportesIncidentes")}
                                            className="btn-dashboard"
                                        >
                                            Lista de Reportes
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
};
export default Dashboard;
