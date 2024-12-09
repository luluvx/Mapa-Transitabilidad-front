
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const App = () => {

  const navigate = useNavigate();
  return (
    <Container>
      <Row>
        <h1>Hello World</h1>
        <Col>
        <button onClick={() => navigate('/reportes')}></button>

        </Col>
      </Row>

    </Container>
  )
}

export default App
