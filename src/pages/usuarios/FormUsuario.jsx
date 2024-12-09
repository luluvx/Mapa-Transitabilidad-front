import axios from "axios";
import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import './FormUsuario.css';

const FormUsuario = () => {
    useAuth();
    const navigate = useNavigate();
    const { id } = useParams();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [tipo, setTipo] = useState('')
    const [errorText, setErrorText] = useState('')
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!id) return;
        getUsuarioById();
    }, [id])

    const getUsuarioById = () => {
        axios.get(`http://localhost:3000/usuarios/${id}`, {
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            }
        })
        .then(res => {
            const usuario = res.data;
            setEmail(usuario.email);
            setTipo(usuario.tipo);
        }).catch(error => {
            console.log(error);
        });
    }

    const guardarUsuario = (e) => {
        const form = e.currentTarget;
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        setErrorText('');
        const usuario = {
            email,
            tipo
        };
        if (!id) {
            usuario.password = password;
        }
        console.log(usuario);
        if (id) {
            editUsuario(usuario);
        } else {
            insertUsuario(usuario);
        }
    }

    const editUsuario = (usuario) => {
        axios.patch(`http://localhost:3000/usuarios/${id}`, usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/usuarios');
            }).catch(error => {
                const errorMsg = error.response.data.msg;
                setErrorText(errorMsg);
                console.log(error);
            });
    }

    const insertUsuario = (usuario) => {
        axios.post('http://localhost:3000/usuarios', usuario, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(res => {
                console.log(res.data);
                navigate('/usuarios');
            }).catch(error => {
                console.log(error);
            });
    }
    return (
        <>
            <Container fluid className="form-container d-flex justify-content-center align-items-center">
                <Row className="mt-3 mb-3">
                    <Col md={12}>
                        <Card className="form-card">
                            <Card.Body>
                                <Card.Title>
                                    <h2 className="form-title">Formulario Usuario</h2>
                                </Card.Title>
                                <Form noValidate validated={validated} onSubmit={guardarUsuario}>
                                    {errorText && <Alert variant="danger" className="alert-error">{errorText}</Alert>}
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Email:</Form.Label>
                                        <Form.Control
                                            required
                                            value={email}
                                            type="email"
                                            onChange={(e) => { setEmail(e.target.value); }}
                                            className="form-control-custom"
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            Por favor ingrese un correo.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    {!id &&
                                        <Form.Group className="form-group">
                                            <Form.Label className="form-label">Password:</Form.Label>
                                            <Form.Control
                                                required
                                                value={password}
                                                type="password"
                                                onChange={(e) => { setPassword(e.target.value); }}
                                                className="form-control-custom"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Por favor ingrese una contraseña.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    }
                                    <Form.Group className="form-group">
                                        <Form.Label className="form-label">Tipo de Usuario:</Form.Label>
                                        <Form.Select
                                            value={tipo}
                                            onChange={(e) => { setTipo(e.target.value); }}
                                            required
                                            className="form-select-custom"
                                        >
                                            <option value="">Seleccione el tipo de usuario</option>
                                            <option value="administrador">Administrador</option>
                                            <option value="verificador">Verificador</option>
                                        </Form.Select>
                                        <Form.Control.Feedback type="invalid">
                                            Por favor seleccione un tipo de usuario.
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="form-group mt-3">
                                        <Button type="submit" className="btn-submit">
                                            Guardar datos
                                        </Button>
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

export default FormUsuario;
