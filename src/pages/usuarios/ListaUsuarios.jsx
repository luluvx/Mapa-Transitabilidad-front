import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Alert } from "react-bootstrap";
import NavMenu from "../../components/NavMenuPrivado";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './ListaUsuarios.css';

const ListaUsuarios = () => {
    useAuth();

    const [listaUsuarios, setListaUsuarios] = useState([]);

    useEffect(() => {
        getListaUsuarios();
        document.title = "Lista de Usuarios";
    }, []);

    const getListaUsuarios = () => {
        axios.get('http://localhost:3000/usuarios', {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        })
        .then(res => {
            setListaUsuarios(res.data);
        }).catch(error => {
            console.log(error);
        });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el registro?");
        if (!confirm) {
            return;
        }
        axios.delete(`http://localhost:3000/usuarios/${id}`, {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        })
        .then(res => {
            console.log(res.data);
            getListaUsuarios();
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <>
            <NavMenu />
            <Container className="container-usuarios mt-3 mb-3">
                <Row className="mt-4">
                    <Col md={9} className="text-center">
                        <Card.Title className="card-title-usuarios mb-0 fs-2 text-start">
                            Lista de Usuarios
                        </Card.Title>
                    </Col>
                    <Col md={3}>
                        <Button
                            onClick={() => window.location.href = "/usuarios/create"}
                            className="btn-crear-usuario"
                        >
                            <i className="bi bi-plus"></i> Agregar Usuario
                        </Button>
                    </Col>
                </Row>

                <Row className="d-flex flex-row align-items-center justify-content-start mt-4">
                    {listaUsuarios.length === 0 && (
                        <Alert variant="danger" className="alert-no-usuarios mt-4">
                            No se encontraron usuarios.
                        </Alert>
                    )}

                    {listaUsuarios.map((usuario) => (
                        <Col key={usuario.id} xl={3} md={6} sm={12} className="mb-4">
                            <Card className="card-usuario-dashboard">
                                <Card.Body className="card-body-usuario m-0 d-flex flex-column align-items-center justify-content-between">
                                    <Card.Img variant="top" src="/src/assets/usuario.png" className="img-usuario-dashboard" />
                                    <Card.Title className="m-0 fs-6 text-white">{usuario.email}</Card.Title>
                                    <div className="d-flex justify-content-center align-items-center gap-4 mt-3">
                                        <Link to={`/usuarios/${usuario.id}/contraseña`} className="btn-usuario-contraseña btn btn-warning btn-sm">
                                            <i className="bi bi-credit-card-2-front"></i>
                                        </Link>

                                        <Link to={`/usuarios/${usuario.id}`} className="btn-usuario-editar btn btn-primary btn-sm">
                                            <i className="bi bi-pencil-square"></i>
                                        </Link>

                                        <Button 
                                            onClick={() => { eliminar(usuario.id) }} 
                                            className="btn-usuario-eliminar btn btn-danger btn-sm"
                                        >
                                            <i className="bi bi-trash-fill"></i>
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
}

export default ListaUsuarios;
