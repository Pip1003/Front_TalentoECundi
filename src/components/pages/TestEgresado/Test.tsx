import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Layout from '../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';

const Test: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [selectedAnswer1, setSelectedAnswer1] = useState<string>('A');
    const [selectedAnswer2, setSelectedAnswer2] = useState<string>('A');

    const handlePageChange = (pageNumber: number) => {
        setSelectedPage(pageNumber);
    };

    return (
        <Layout>
            <Container fluid>
                <Row>
                    {/* Columna del tiempo restante y la paginación */}
                    <Col xs={3}>
                        {/* Tiempo Restante */}
                        <Card className={`p-3 mb-4 ${styles.card}`}>
                            <Typography variant="h6" className="text-center">Tiempo Restante</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                                <Typography variant="h4">24:60:00</Typography>
                            </Box>
                        </Card>

                        {/* Paginación de Preguntas */}
                        <Card className={`p-3 ${styles.card}`} style={{ backgroundColor: "#C89104" }}>
                            <Typography variant="h6" className='text-center' sx={{ color: '#003A22', fontWeight: '550' }}>Preguntas</Typography>
                            <div className="d-flex flex-wrap justify-content-center">
                                {Array.from({ length: 30 }, (_, i) => (
                                    <Button
                                        key={i}
                                        variant={i + 1 === selectedPage ? 'primary' : 'light'}
                                        className="m-1"
                                        onClick={() => handlePageChange(i + 1)}
                                        style={{
                                            backgroundColor: i + 1 === selectedPage ? '#007bff' : 'white',
                                            color: i + 1 === selectedPage ? 'white' : 'black',
                                            borderColor: '#ccc',
                                        }}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            {/* Paginación */}
                            <Pagination className="mt-4 justify-content-center">
                                <Pagination.Prev onClick={() => handlePageChange(selectedPage - 1)} disabled={selectedPage === 1} />
                                <Pagination.Item active>{selectedPage}</Pagination.Item>
                                <Pagination.Next onClick={() => handlePageChange(selectedPage + 1)} disabled={selectedPage === 30} />
                            </Pagination>

                            <Button className={`mt-4 ${styles.buttonFinalize}`}>
                                Finalizar Prueba
                            </Button>
                        </Card>
                    </Col>

                    {/* Columna de preguntas */}
                    <Col xs={9}>
                        <Card className={`p-4 mb-4 ${styles.card}`}>
                            {/* Pregunta 1 */}
                            <Typography variant="h5" className="mb-3">Pregunta 1</Typography>

                            {/* Etiquetas de habilidades */}
                            <div className="mb-3">
                                <span className={styles.subjectLabel}>Programación</span>
                                <span className={styles.subjectLabel}>Matemáticas</span>
                            </div>

                            <Typography variant="body2" className="mb-4">
                                Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc., li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilitá? de un nov lingua franca: on refusa continuar payar custosi traductores. It solmen va esser necessari far uniform grammatica, pronunciation e plu commun paroles.
                            </Typography>

                            {/* Opciones */}
                            <RadioGroup
                                name="question1"
                                value={selectedAnswer1}
                                onChange={(_, val) => setSelectedAnswer1(val)}
                            >
                                <FormControlLabel value="A" control={<Radio />} label="Opción A" />
                                <FormControlLabel value="B" control={<Radio />} label="Opción B" />
                                <FormControlLabel value="C" control={<Radio />} label="Opción C" />
                            </RadioGroup>
                        </Card>

                        <Card className={`p-4 mb-4 ${styles.card}`}>
                            {/* Pregunta 2 */}
                            <Typography variant="h5" className="mb-3">Pregunta 2</Typography>

                            {/* Etiquetas de habilidades */}
                            <div className="mb-3">
                                <span className={styles.subjectLabel}>Programación</span>
                                <span className={styles.subjectLabel}>Matemáticas</span>
                            </div>

                            {/* Imagen */}
                            <Box display="flex" justifyContent="center" alignItems="center" mb={4}>
                                <img
                                    src="/mnt/data/image.png" // Ruta de la imagen cargada
                                    alt="Gráfico de Pistas de Esquí"
                                    style={{ width: '100%', height: 'auto' }}
                                />
                            </Box>

                            <Typography variant="body2" className="mb-4">
                                Li Europan lingues es membres del sam familie. Lor separat existentie es un myth. Por scientie, musica, sport etc., li tot Europa usa li sam vocabularium. Li lingues differe solmen in li grammatica, li pronunciation e li plu commun vocabules. Omnicos directe al desirabilitá? de un nov lingua franca: on refusa continuar payar custosi traductores. It solmen va esser necessari far uniform grammatica, pronunciation e plu commun paroles.
                            </Typography>

                            {/* Opciones */}
                            <RadioGroup
                                name="question2"
                                value={selectedAnswer2}
                                onChange={(_, val) => setSelectedAnswer2(val)}
                            >
                                <FormControlLabel value="A" control={<Radio />} label="Opción A" />
                                <FormControlLabel value="B" control={<Radio />} label="Opción B" />
                                <FormControlLabel value="C" control={<Radio />} label="Opción C" />
                            </RadioGroup>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default Test;
