import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Pagination } from 'react-bootstrap';
import { Typography } from '@mui/material';
import Layout from '../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';
import { obtenerResultadosTest } from '../../../Services/TestService';

interface RespuestaDetalle {
    id_pregunta: number;
    contenido_pregunta: string;
    id_opcion_seleccionada: number;
    es_correcta: boolean;
    contenido_opcion_seleccionada: string;
    contenido_opcion_correcta: string;
    habilidades: string[];
    imagen?: string;
}

interface Habilidad {
    habilidad_id: string;
    nombre: string;
    porcentaje: number;
}

interface ResultadoTest {
    id: number;
    TotalCorrectas: number;
    precision_test: string;
    puntaje: string;
    fecha_fin: string;
}

const ResultadosTest: React.FC = () => {
    const [selectedPage, setSelectedPage] = useState<number>(1);
    const [resultadoTest, setResultadoTest] = useState<ResultadoTest | null>(null);
    const [respuestasDetalle, setRespuestasDetalle] = useState<RespuestaDetalle[]>([]);
    const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Obtener los datos del usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');
    let idEgresado: any = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        idEgresado = usuario.id_relacionado;
        console.log('ID del egresado:', idEgresado);
    }

    const preguntasPorPagina = 3;

    useEffect(() => {
        const fetchResultados = async () => {
            try {
                const data = await obtenerResultadosTest(idEgresado);
                const { resultadoTest, respuestasDetalle, habilidades } = data;
                setResultadoTest(resultadoTest);
                setRespuestasDetalle(respuestasDetalle);
                setHabilidades(habilidades);
            } catch (error) {
                console.error('Error al obtener los resultados:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResultados();
    }, [idEgresado]);

    const handlePageChange = (pageNumber: number) => {
        setSelectedPage(pageNumber);
    };

    const handleQuestionClick = (questionIndex: number) => {
        const pageNumber = Math.ceil((questionIndex + 1) / preguntasPorPagina); // Calcular la página correspondiente
        setSelectedPage(pageNumber);
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!resultadoTest) {
        return <div>No se encontraron resultados.</div>;
    }

    // Calcular el índice de inicio y fin para mostrar preguntas
    const indiceInicio = (selectedPage - 1) * preguntasPorPagina;
    const indiceFin = indiceInicio + preguntasPorPagina;

    return (
        <Layout>
            <Container fluid>
                <Row>
                    {/* Columna del tiempo restante y las estadísticas */}
                    <Col xs={3} className={styles.sidebar}>
                        <Card className={`p-2 mb-4 ${styles.card}`}>
                            <Typography variant="h6" className={styles.resultHeader}>Total De Preguntas Correctas</Typography>
                            <Typography variant="h4" className={styles.resultValue}>
                                {resultadoTest.TotalCorrectas} / {respuestasDetalle.length}
                            </Typography>
                            <Typography variant="h6" className={styles.resultHeader}>Precisión</Typography>
                            <Typography variant="h4" className={styles.resultValue}>{resultadoTest.precision_test}%</Typography>
                            <Typography variant="h6" className={styles.resultHeader}>Calificación</Typography>
                            <Typography variant="h4" className={styles.resultValue}>{resultadoTest.puntaje}</Typography>
                        </Card>

                        <Card className={`p-3 mb-4 ${styles.card}`}>
                            <Typography variant="h6" className={styles.resultHeader}>Resultado por Habilidad</Typography>
                            <div className="p-3">
                                {habilidades.map((habilidad, index) => (
                                    <div key={index} className={styles.habilidad}>
                                        <span className={styles.habilidadTexto}>{habilidad.nombre}</span>
                                        <span className={styles.habilidadPorcentaje}>{habilidad.porcentaje}%</span>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className={`p-3 mb-4 ${styles.card}`}>
                            <Typography variant="h6" className={styles.resultHeader}>Preguntas</Typography>
                            <div className="d-flex flex-wrap justify-content-center">
                                {respuestasDetalle.map((respuesta, i) => (
                                    <Button
                                        key={i}
                                        variant={i + 1 === selectedPage ? 'primary' : 'light'}
                                        className={`${styles.questionButton} m-1 ${respuesta.es_correcta ? styles.correctButton : styles.incorrectButton}`}
                                        onClick={() => handleQuestionClick(i)} // Usar la nueva función
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                            </div>

                            <Pagination className="mt-4 justify-content-center">
                                <Pagination.Prev onClick={() => handlePageChange(selectedPage - 1)} disabled={selectedPage === 1} />
                                <Pagination.Item active>{selectedPage}</Pagination.Item>
                                <Pagination.Next onClick={() => handlePageChange(selectedPage + 1)} disabled={selectedPage * preguntasPorPagina >= respuestasDetalle.length} />
                            </Pagination>

                            <Button className={`mt-4 ${styles.finalizarButton}`}>
                                Finalizar Revisión
                            </Button>
                        </Card>
                    </Col>

                    {/* Columna de preguntas */}
                    <Col xs={9} className={styles.mainContent}>
                        {respuestasDetalle.slice(indiceInicio, indiceFin).map((respuesta, index) => (
                            <Card key={index} className={styles.questionCard}>
                                <Typography variant="h5" className="mb-3">Pregunta {indiceInicio + index + 1}</Typography>
                                <div className="mb-3">
                                    {respuesta.habilidades.map((habilidad, i) => (
                                        <span key={i} className={styles.subjectLabel}>{habilidad}</span>
                                    ))}
                                </div>

                                {/* Renderizar la imagen si existe */}
                                {respuesta.imagen && (
                                    <div className="text-center mb-3">
                                        <img
                                            src={`data:image/jpeg;base64,${respuesta.imagen}`}
                                            alt={`Pregunta ${indiceInicio + index + 1}`}
                                            className={styles.imagenPregunta}
                                        />
                                    </div>
                                )}

                                <Typography variant="body2" className="mb-4">{respuesta.contenido_pregunta}</Typography>

                                {/* Contenedor para la respuesta seleccionada */}
                                <div className={styles.respuestaContenedor}>
                                    <div className={respuesta.es_correcta ? styles.correctAnswer : styles.incorrectAnswer}>
                                        {respuesta.es_correcta ? 'Respuesta Correcta' : 'Respuesta Incorrecta'}
                                    </div>
                                    <Typography variant="body2">
                                        <strong>Tu respuesta: </strong>{respuesta.contenido_opcion_seleccionada}
                                    </Typography>
                                    {!respuesta.es_correcta && (
                                        <Typography variant="body2" className='mt-3'>
                                            <strong>Respuesta correcta: </strong>{respuesta.contenido_opcion_correcta}
                                        </Typography>
                                    )}
                                </div>
                            </Card>
                        ))}
                    </Col>
                </Row>
            </Container>
        </Layout>
    );
};

export default ResultadosTest;
