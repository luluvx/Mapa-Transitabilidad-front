import axios from "axios";
import { useEffect, useState } from "react";
import { Container, Navbar, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "./NavMenuCliente.css";

const NavMenuPrivado = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (token) {
            getUserInfo();
        }
    }, []);

    const getUserInfo = () => {
        axios.get('http://localhost:3000/auth/me', {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(res => {
            const user = res.data;
            setUser(user);
        }).catch(error => {
            console.error(error);
        });
    };

    const onCerrarSesionClick = () => {
        axios.post('http://localhost:3000/auth/logout', {}, {
            headers: {
                Authorization: "Bearer " + token
            }
        }).then(() => {
            localStorage.removeItem('token');
            navigate('/');
        }).catch((error) => {
            console.error(error);
        });
    };

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand className="navbar-brand" href="/dashboard">
                    Mapitas
                </Navbar.Brand>

                        {token && (
                            <>
                                {user && (
                                    <NavDropdown 
                                        title={<><i className="bi bi-person-circle"></i> {user.email}</>} 
                                        id="login-dropdown" 
                                        className="nav-dropdown-custom"
                                    >
                                        <button 
                                            className="btnLogout"
                                            onClick={onCerrarSesionClick}>
                                            <i className="bi bi-box-arrow-right"></i> Cerrar sesión
                                        </button>
                                    </NavDropdown>
                                )}
                            </>
                        )}
                        {!token && (
                            <>
                                <Link className="nav-link-custom" to="/"><i className="bi bi-box-arrow-in-right"></i> Iniciar sesión</Link>
                                <Link className="nav-link-custom" to="/register"><i className="bi bi-person-plus-fill"></i> Registro</Link>
                            </>
                        )}

            </Container>
        </Navbar>
    );
}

export default NavMenuPrivado;
