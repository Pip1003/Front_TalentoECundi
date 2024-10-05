// src/pages/Ofertas.tsx
import React from 'react';
import { Col, Row, Card, Button, Pagination } from 'react-bootstrap';
import Layout from '../../layouts/LayoutAuth/Layout';

const Ofertas: React.FC = () => {
  return (
    <Layout>
      <div className='content my-4'>
      
        {/* Fila principal que contiene las ofertas */}
        <Row>
        
          {/* Columna izquierda (Ofertas) */}
          <Col md={8}>
          <h1 className="text-center">Ofertas</h1>
            {/* Oferta 1 */}
            <Card className="mb-4">
              <Card.Header className="bg-light text-center">
                <h5>Título de la oferta</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Fecha de publicación:</strong> DD/MM/YYYY</p>
                  </Col>
                  <Col md={6} className="text-end">
                    <p><strong>Fecha de cierre de oferta:</strong> DD/MM/YYYY</p>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col>
                    <p><strong>Empresa:</strong> <a href="#">Link Perfil Empresarial</a></p>
                  </Col>
                </Row>
                <p>
                  Descripción: Li Europan lingues es membres del sam familie. Lor separat existeinte es un myth.
                  Omnicos direct al desirabilite de un nov lingua franca...
                </p>
                <hr />
                <p><strong>Habilidades:</strong> 10 Días Semestrales</p>
                <p><strong>Idiomas:</strong> Español, Inglés B2 y Francés opcional</p>
                <p><strong>Experiencia requerida:</strong> 250 Años de experiencia</p>
                <p><strong>Cargo:</strong> Ingeniero de sistemas</p>
                <p><strong>Ubicación:</strong> Facatativá, Cundinamarca</p>
                <p><strong>Modalidad:</strong> Presencial</p>
                <p><strong>Tipo de trabajo:</strong> Tiempo completo</p>
                <p><strong>Vacaciones:</strong> 10 Días Semestrales</p>
                <p><strong>Salario:</strong> 2500 USD Mensuales</p>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button variant="success">Inscribirse</Button>
              </Card.Footer>
            </Card>

            

            
            <Pagination className="justify-content-center">
              <Pagination.First />
              <Pagination.Prev />
              <Pagination.Item active>{1}</Pagination.Item>
              <Pagination.Item>{2}</Pagination.Item>
              <Pagination.Item>{3}</Pagination.Item>
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>
          </Col>

          {/* Columna derecha (Filtros y Mis Inscripciones) */}
          <Col md={4}>
            <Card className="mb-4">
              <Card.Header>Filtros</Card.Header>
              <Card.Body>
                {/* Aquí irían los componentes de los filtros */}
                <p>Contenido de filtros...</p>
              </Card.Body>
            </Card>

            <Card>
              <Card.Header>Mis Inscripciones</Card.Header>
              <Card.Body>
                {/* Lista de inscripciones */}
                <p>Inscripción 1</p>
                <p>Inscripción 2</p>
              </Card.Body>
              {/* Paginador dentro de "Mis Inscripciones" */}
              <Card.Footer>
                <Pagination size="sm" className="justify-content-center">
                  <Pagination.First />
                  <Pagination.Prev />
                  <Pagination.Item active>{1}</Pagination.Item>
                  <Pagination.Item>{2}</Pagination.Item>
                  <Pagination.Next />
                  <Pagination.Last />
                </Pagination>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
};

export default Ofertas;
