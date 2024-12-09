import axios from "axios";
import { useState } from "react";
import { Button, Form, Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FormContraseña = () => {
    const { id } = useParams();
    const [nuevaContraseña, setNuevaContraseña] = useState("");
    const navigate = useNavigate();
    const handleChangePassword = () => {
        axios.put(`http://localhost:3000/usuarios/${id}/password`, {
            password: nuevaContraseña
        }, {
            headers: {
                Authorization: `Bearer ` + localStorage.getItem('token')
            }
        }).then((res) => {
            console.log(res.data);
            navigate("/usuarios");
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <Container className="mt-3">
            <h2 className="text-white">Cambiar Contraseña</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Nueva Contraseña</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Ingresa la nueva contraseña"
                        value={nuevaContraseña}
                        onChange={(e) => setNuevaContraseña(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleChangePassword}>
                    Guardar Contraseña
                </Button>
            </Form>
        </Container>
    );
};

export default FormContraseña;
