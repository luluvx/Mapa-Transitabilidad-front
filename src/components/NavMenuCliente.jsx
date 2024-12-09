
import { Button, Container, Navbar } from "react-bootstrap";
import {  useNavigate } from "react-router-dom";
import './NavMenuCliente.css';


const NavMenuCliente = () => {

    const navigate = useNavigate();

    return (
        <Navbar expand="lg" className="navbar-custom">
            <Container>
                <Navbar.Brand className="brand-cliente" href="#">
                    Mapitas
                </Navbar.Brand>

                <Button id="btnLogin" onClick={() => navigate('/')}>
                    Login
                </Button>

            </Container>

        </Navbar>
    );
}

export default NavMenuCliente;
