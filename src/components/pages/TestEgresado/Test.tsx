import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import Layout from '../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';
import { obtenerTestConDetalles, enviarRespuestasTest } from '../../../Services/TestService';

interface Habilidad {
    id: number;
    nombre: string;
}

interface Opcion {
    id: number;
    contenido: string;
}

interface Pregunta {
    id: number;
    contenido: string;
    habilidades: Habilidad[];
    opciones: Opcion[];
    imagen?: string; 
}

interface Test {
    id: number;
    tiempo_minutos: number;
    preguntas: Pregunta[];
}

const TestEgresado: React.FC = () => {
    const [test, setTest] = useState<Test | null>(null);
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
    const [timeRemaining, setTimeRemaining] = useState<number>(0); 
    const [isFinished, setIsFinished] = useState<boolean>(false); 

    const preguntasPorPagina = 2;

    // Obtener los datos del usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');
    let idEgresado: any = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        idEgresado = usuario.id_relacionado;
        //console.log('ID del egresado:', idEgresado);
    }

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const testObtenido = await obtenerTestConDetalles(2);
                setTest(testObtenido);
                setTimeRemaining(testObtenido.tiempo_minutos * 60); 
            } catch (error) {
                console.error('Error al cargar el test:', error);
            }
        };

        fetchTest();
    }, []);

    // Temporizador
    useEffect(() => {
        if (timeRemaining === 0 && !isFinished) {
            handleFinalizarPrueba(); 
            return;
        }

        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer); // Limpieza del temporizador
        }
    }, [timeRemaining, isFinished]);

    const handlePageChange = (pageNumber: number) => {
        setSelectedPage(pageNumber);
    };

    const handleAnswerChange = (preguntaId: number, answer: string) => {
        setSelectedAnswers((prevState) => ({
            ...prevState,
            [preguntaId]: answer,
        }));
    };

    const handleFinalizarPrueba = async () => {
        if (isFinished) return; 

        const respuestas = Object.entries(selectedAnswers)
            .filter(([preguntaId, opcionId]) => opcionId !== '')
            .map(([preguntaId, opcionId]) => ({
                id_pregunta: Number(preguntaId),
                id_opcion_respuesta: opcionId,
            }));

        if (respuestas.length === 0) {
            console.warn('No se puede enviar, no hay respuestas seleccionadas.');
            return;
        }

        try {
            const resultado = await enviarRespuestasTest(2, idEgresado, respuestas); 
            console.log('Resultados:', resultado);
            setIsFinished(true); 
        } catch (error) {
            console.error('Error al finalizar prueba:', error);
        }
    };

    if (!test) {
        return <div>Cargando...</div>;
    }

    const totalPaginas = Math.ceil(test.preguntas.length / preguntasPorPagina);
    const preguntasPagina = test.preguntas.slice(
        (selectedPage - 1) * preguntasPorPagina,
        selectedPage * preguntasPorPagina
    );

    return (
        <Layout>
            <Container fluid>
                <Row>
                    <Col xs={3}>
                        <Card className={`p-3 mb-4 ${styles.cardLeft}`}>
                            <Typography variant="h6" className="text-center">Tiempo Restante</Typography>
                            <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                                <Typography variant="h4">{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</Typography>
                            </Box>
                        </Card>

                        <Card className={`p-3 mb-4 ${styles.cardLeft}`}>
                            <Typography variant="h6" className={`text-center ${styles.resultHeader}`}>Preguntas</Typography>
                            <div className="d-flex flex-wrap justify-content-center">
                                {test.preguntas.map((pregunta, i) => {
                                    const pageForQuestion = Math.floor(i / preguntasPorPagina) + 1;
                                    const isAnswered = !!selectedAnswers[pregunta.id];
                                    const isActive = isAnswered ? 'active' : ''; 
                                    return (
                                        <Button
                                            key={i}
                                            variant={isAnswered ? 'primary' : 'light'}
                                            className={`${styles.questionButton} ${styles[isActive]} m-1`}
                                            onClick={() => handlePageChange(pageForQuestion)}
                                        >
                                            {i + 1}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Pagination className="mt-4 justify-content-center">
                                <Pagination.Prev onClick={() => handlePageChange(selectedPage - 1)} disabled={selectedPage === 1} />
                                <Pagination.Item active>{selectedPage}</Pagination.Item>
                                <Pagination.Next onClick={() => handlePageChange(selectedPage + 1)} disabled={selectedPage === totalPaginas} />
                            </Pagination>

                            <Button className={`mt-4 ${styles.finalizarButton}`} onClick={handleFinalizarPrueba} disabled={isFinished}>
                                {isFinished ? 'Prueba Finalizada' : 'Finalizar Prueba'}
                            </Button>
                        </Card>
                    </Col>
                    
                    {/* Columna de contenido de preguntas y opciones */}
                    <Col xs={9}>
                        {preguntasPagina.map((pregunta: Pregunta, index: number) => (
                            <Card key={pregunta.id} className={`p-4 mb-4 ${styles.card}`}>
                                <Typography variant="h5" className="mb-3">Pregunta {(selectedPage - 1) * preguntasPorPagina + index + 1}</Typography>

                                <div className="mb-3">
                                    {pregunta.habilidades.map((habilidad: Habilidad) => (
                                        <span key={habilidad.id} className={styles.subjectLabel}>{habilidad.nombre}</span>
                                    ))}
                                </div>

                                {pregunta.imagen && ( // Mostrar la imagen si existe
                                    <img src={pregunta.imagen} alt="Pregunta" className="img-fluid mb-3" />
                                )}

                                <Typography variant="body2" className="mb-4">{pregunta.contenido}</Typography>

                                <RadioGroup
                                    name={`pregunta-${pregunta.id}`}
                                    value={selectedAnswers[pregunta.id] || ''}
                                    onChange={(_, val) => handleAnswerChange(pregunta.id, val)}
                                >
                                    {pregunta.opciones.map((opcion: Opcion) => (
                                        <FormControlLabel key={opcion.id} value={opcion.id} control={<Radio />} label={opcion.contenido} />
                                    ))}
                                </RadioGroup>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default TestEgresado;
