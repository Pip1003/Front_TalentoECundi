import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

const RolSeleccion: React.FC = () => {
    return (
        <Layout>
            <Container className="text-center mt-2">
                <h2 className={styles.title}>Selecciona Tu Rol</h2>
                <Row>
                    <Col md={6} className="mb-4">
                        <Link to="/registro-egresado" className="text-decoration-none">
                            <Card className={styles.card}>
                                <Card.Img variant="top" src="/assets/EgresadoRol.png" alt="Egresado" />
                                <Card.Body>
                                    <Card.Title className={styles.titleRol}>Egresado</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                    <Col md={6} className="mb-4">
                        <Link to="/registro-empresa" className="text-decoration-none">
                            <Card className={styles.card}>
                                <Card.Img variant="top" src="/assets/EmpresaRol.png" alt="Empresa" />
                                <Card.Body>
                                    <Card.Title className={styles.titleRol}>Empresa</Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default RolSeleccion;
