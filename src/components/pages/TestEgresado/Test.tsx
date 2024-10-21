import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Pagination, Modal } from 'react-bootstrap';
import { Box, Typography, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showFinishedModal, setShowFinishedModal] = useState<boolean>(false);
    const navigate = useNavigate();

    const preguntasPorPagina = 2;
    const testId = 3;
    const localStorageTimeKey = `timeRemainingTest_${testId}`;
    const localStorageAnswersKey = `selectedAnswersTest_${testId}`;

    // Obtener los datos del usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');
    let idEgresado: any = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        idEgresado = usuario.id_relacionado;
    }

    useEffect(() => {
        const fetchTest = async () => {
            try {
                // Verificar si ya se ha finalizado el test
                const finishedTest = localStorage.getItem(`testFinished_${testId}`);
                if (finishedTest) {
                    navigate('/resultadosTest');
                    return;
                }

                const testObtenido = await obtenerTestConDetalles(testId);
                setTest(testObtenido);

                // Verificar si hay un tiempo restante guardado en localStorage
                const savedTimeRemaining = localStorage.getItem(localStorageTimeKey);
                if (savedTimeRemaining) {
                    setTimeRemaining(parseInt(savedTimeRemaining, 10));
                } else {
                    setTimeRemaining(testObtenido.tiempo_minutos * 60);
                }

                // Verificar si hay respuestas seleccionadas guardadas en localStorage
                const savedAnswers = localStorage.getItem(localStorageAnswersKey);
                if (savedAnswers) {
                    setSelectedAnswers(JSON.parse(savedAnswers));
                }
            } catch (error) {
                console.error('Error al cargar el test:', error);
            }
        };

        fetchTest();
    }, []);

    // Temporizador
    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining((prev) => {
                    const newTimeRemaining = prev - 1;

                    // Guardar el tiempo restante en localStorage
                    localStorage.setItem(localStorageTimeKey, newTimeRemaining.toString());

                    if (newTimeRemaining <= 0) {
                        handleFinalizarPrueba();
                        setShowModal(true);
                        clearInterval(timer);
                        return 0;
                    }

                    return newTimeRemaining;
                });
            }, 1000);

            return () => clearInterval(timer); // Limpieza del temporizador
        }
    }, [timeRemaining]);

    const handlePageChange = (pageNumber: number) => {
        setSelectedPage(pageNumber);
    };

    const handleAnswerChange = (preguntaId: number, answer: string) => {
        setSelectedAnswers((prevState) => {
            const newAnswers = {
                ...prevState,
                [preguntaId]: answer,
            };

            // Guardar las respuestas seleccionadas en localStorage
            localStorage.setItem(localStorageAnswersKey, JSON.stringify(newAnswers));

            return newAnswers;
        });
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
            const resultado = await enviarRespuestasTest(testId, idEgresado, respuestas);
            console.log('Resultados:', resultado);
            setIsFinished(true);

            // Limpiar el tiempo restante y respuestas de localStorage una vez que se finaliza el test
            localStorage.removeItem(localStorageTimeKey);
            localStorage.removeItem(localStorageAnswersKey);
            localStorage.setItem(`testFinished_${testId}`, 'true');

            setShowFinishedModal(true); // Mostrar el modal de finalización
        } catch (error) {
            console.error('Error al finalizar prueba:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        navigate('/resultadosTest');
    };

    const handleFinishedModalClose = () => {
        setShowFinishedModal(false);
        navigate('/resultadosTest');
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

                                {pregunta.imagen && (
                                    <img src={`data:image/jpeg;base64,${pregunta.imagen}`} alt="Pregunta" className={`${styles.preguntaImagen} mb-3`} />
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

                {/* Modal que se muestra cuando el tiempo se agota */}
                <Modal show={showModal} onHide={handleModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Tiempo Agotado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>El tiempo para completar la prueba se ha agotado.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleModalClose}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal que se muestra cuando se finaliza la prueba desde el botón */}
                <Modal show={showFinishedModal} onHide={handleFinishedModalClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Prueba Finalizada</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Sus respuestas han sido enviadas al sistema con éxito.</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handleFinishedModalClose}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </Layout>
    );
};

export default TestEgresado;
