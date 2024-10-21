import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Card,
  Button,
  Pagination,
  Row,
  Col,
  Form,
  ListGroup,
  Modal
} from 'react-bootstrap';
import { Delete } from "@mui/icons-material";
import Layout from '../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';
import './global.css';
import { obtenerPublicacionesGenerales, filtrarOfertas } from '../../../Services/OfertaService';
import { obtenerInscripcionesEgresado, inscribirOferta, eliminarInscripcion } from '../../../Services/InscripcionService';
import OfertaModal from './OfertaModal/OfertaModal';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Empresa {
  nombre: string;
  logo: string | null;
}

interface Oferta {
  id: number;
  id_empresa: number;
  cargo: string;
  descripcion: string;
  id_modalidad: number;
  fecha_publicacion: string;
  fecha_cierre: string;
  salario: string;
  tipo_contrato: string;
  experiencia_requerida: string;
  hora_trabajo: string;
  habilidades: string;
  idiomas: string;
  empresa: Empresa;
}

interface Inscripcion {
  id: number;
  cargo: string;
  fecha_publicacion: string;
  fecha_cierre: string;
  empresa: Empresa;
  estado: string;
}

const Ofertas: React.FC = () => {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentInsPage, setCurrentInsPage] = useState<number>(1);
  const itemsPerPage = 3;
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [inscripcionToDelete, setInscripcionToDelete] = useState<number | null>(null);

  // Estados para los filtros
  const [salarioMinimo, setSalarioMinimo] = useState<string>('');
  const [salarioMaximo, setSalarioMaximo] = useState<string>('');
  const [modalidad, setModalidad] = useState<string>('');
  const [tipoContrato, setTipoContrato] = useState<string>('');
  const [horaTrabajo, setHoraTrabajo] = useState<string>('');
  const [habilidades, setHabilidades] = useState<string[]>([]);

  // Obtener los datos del usuario desde el localStorage
  const usuarioString = localStorage.getItem('usuario');
  let idEgresado: any = null;

  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    idEgresado = usuario.id_relacionado;
  }

  useEffect(() => {
    const fetchOfertas = async () => {
      try {
        const data = await obtenerPublicacionesGenerales();
        setOfertas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInscripciones = async () => {
      if (idEgresado) {
        try {
          const data = await obtenerInscripcionesEgresado(idEgresado);
          setInscripciones(data);
        } catch (err: any) {
          setError(err.message);
        }
      }
    };

    fetchOfertas();
    fetchInscripciones();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Container fluid className={styles.ofertasContainer}>
          <div className="text-center mt-5">
            <p>Cargando ofertas...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container fluid className={styles.ofertasContainer}>
          <div className="text-center mt-5">
            <p>Error: {error}</p>
          </div>
        </Container>
      </Layout>
    );
  }

  const modalidadDescripcion = (id_modalidad: number) => {
    switch (id_modalidad) {
      case 1:
        return 'Presencial';
      case 2:
        return 'Remoto';
      case 3:
        return 'Híbrido';
      default:
        return 'Desconocido';
    }
  };

  // Calcular las ofertas para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfertas = ofertas.slice(indexOfFirstItem, indexOfLastItem);

  // Calcular las inscripciones para la página actual
  const indexOfLastInsItem = currentInsPage * itemsPerPage;
  const indexOfFirstInsItem = indexOfLastInsItem - itemsPerPage;
  const currentInscripciones = inscripciones.slice(indexOfFirstInsItem, indexOfLastInsItem);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(ofertas.length / itemsPerPage);
  const totalInsPages = Math.ceil(inscripciones.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleInsPageChange = (pageNumber: number) => {
    setCurrentInsPage(pageNumber);
  };

  const handleShowModal = (oferta: Oferta) => {
    setSelectedOferta(oferta);
    setShowModal(true);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleInscribirse = async (oferta: Oferta) => {
    if (idEgresado) {
      try {
        
        await inscribirOferta(idEgresado, oferta.id);
        setMensaje('Inscripción realizada exitosamente.');
        setSnackbarOpen(true);

        // Actualizar la lista de inscripciones
        const data = await obtenerInscripcionesEgresado(idEgresado);
        setInscripciones(data);
      } catch (error: any) {
        if (axios.isAxiosError(error) && error.response && error.response.status === 400) {
          setMensaje(error.response.data.message || 'Ya estás inscrito en esta oferta.');
        } else {
          setMensaje('Error al realizar la inscripción.');
        }
        setSnackbarOpen(true);
      }
    }
  };

  const handleEliminarInscripcion = async (idInscripcion: number) => {
    if (idEgresado && idInscripcion !== null) {
      try {
        await eliminarInscripcion(idEgresado, idInscripcion);
        setMensaje('Inscripción eliminada exitosamente.');
        setSnackbarOpen(true);

        // Actualizar la lista de inscripciones
        const data = await obtenerInscripcionesEgresado(idEgresado);
        setInscripciones(data);
      } catch (error) {
        setMensaje('Error al eliminar la inscripción.');
        setSnackbarOpen(true);
      } finally {
        setShowConfirmModal(false);
      }
    }
  };

  const handleShowConfirmModal = (idInscripcion: number) => {
    setInscripcionToDelete(idInscripcion);
    setShowConfirmModal(true);
  };

  // Manejar el filtro
  const handleFiltrarOfertas = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const params = {
        salario_minimo: salarioMinimo || undefined,
        salario_maximo: salarioMaximo || undefined,
        id_modalidad: modalidad || undefined,
        tipo_contrato: tipoContrato || undefined,
        hora_trabajo: horaTrabajo || undefined,
        habilidades: habilidades.length > 0 ? habilidades.join(',') : undefined,
      };
      
      const response = await filtrarOfertas(params);
      setOfertas(response);
      setCurrentPage(1);
    } catch (err: any) {
      setError('Error al filtrar las ofertas.');
      setSnackbarOpen(true);
    }
  };

  return (
    <Layout>
      <Container fluid className={styles.ofertasContainer}>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>
            {mensaje}
          </Alert>
        </Snackbar>
        <Row className="mt-4">
          {/* Columna izquierda (Ofertas) */}
          <Col md={8}>
            <h1 className={`${styles.sectionTitle} text-center`}>Ofertas</h1>
            {currentOfertas.length === 0 ? (
              <p className="text-center">No hay ofertas disponibles.</p>
            ) : (
              currentOfertas.map((oferta) => (
                <Card className={`mb-4 ${styles.ofertaCard}`} key={oferta.id}>
                  <Card.Body>
                    {/* Título y Fechas */}
                    <div className={styles.cardHeader}>
                      <h4 className={styles.ofertaTitulo}>{oferta.cargo}</h4>
                      <Row className={styles.fechas}>
                        <Col md={6}>
                          <p className={styles.fecha}><strong>Fecha de publicación:</strong> {new Date(oferta.fecha_publicacion).toLocaleDateString()}</p>
                        </Col>
                        <Col md={6} className="text-end">
                          <p className={styles.fecha}><strong>Fecha de cierre de oferta:</strong> {new Date(oferta.fecha_cierre).toLocaleDateString()}</p>
                        </Col>
                      </Row>
                    </div>

                    {/* Empresa */}
                    <div className={styles.empresaSection}>
                      <img
                        src={oferta.empresa.logo || "/assets/photoDefault.png"}
                        alt="Logo Empresa"
                        className={styles.logoEmpresa}
                      />
                      <p className={styles.empresaLink}><strong>Empresa:</strong> {oferta.empresa.nombre}</p>
                    </div>

                    {/* Descripción */}
                    <div className={styles.descripcion}>
                      <h5>Descripción</h5>
                      <p>{oferta.descripcion}</p>
                    </div>

                    {/* Información de la Oferta */}
                    <div className={styles.informacionOferta}>
                      <p><strong>Habilidades:</strong> {oferta.habilidades}</p>
                      <p><strong>Idiomas:</strong> {oferta.idiomas}</p>
                      <p><strong>Experiencia requerida:</strong> {oferta.experiencia_requerida}</p>
                      <p><strong>Tipo de contrato:</strong> {oferta.tipo_contrato}</p>
                      <p><strong>Horario de trabajo:</strong> {oferta.hora_trabajo}</p>
                      <p><strong>Modalidad:</strong> {modalidadDescripcion(oferta.id_modalidad)}</p>
                      <p className={styles.salario}><strong>Salario:</strong> {oferta.salario} COP</p>
                    </div>

                    {/* Botones */}
                    <div className="text-center mt-3">
                      <Button variant="primary" className={styles.botonesOferta} onClick={() => handleShowModal(oferta)}>
                        Ver Detalles
                      </Button>
                      <Button variant="success" className={styles.botonesOferta} onClick={() => handleInscribirse(oferta)}>
                        INSCRIBIRSE
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            )}
            {currentOfertas.length > 0 && (
              <Pagination className="justify-content-center mt-4">
                <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index + 1}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            )}
          </Col>

          {/* Columna derecha (Filtros y Mis Inscripciones) */}
          <Col md={4}>
            <Card className={`mb-4 ${styles.filtrosCard}`}>
              <Card.Body>
                <Form onSubmit={handleFiltrarOfertas}>
                  <Form.Group controlId="formSalarioMin" className="mb-3 mt-3">
                    <Form.Label className={styles.formLabel}>Rango de Salario</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        type="number"
                        placeholder="Valor mínimo"
                        className={`me-2 ${styles.salaryInput}`}
                        value={salarioMinimo}
                        onChange={(e) => setSalarioMinimo(e.target.value)}
                      />
                      <Form.Control
                        type="number"
                        placeholder="Valor máximo"
                        className={styles.salaryInput}
                        value={salarioMaximo}
                        onChange={(e) => setSalarioMaximo(e.target.value)}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group controlId="formModalidad" className="mb-3">
                    <Form.Label className={styles.formLabel}>Modalidad</Form.Label>
                    <Form.Control
                      as="select"
                      className={styles.selectInput}
                      value={modalidad}
                      onChange={(e) => setModalidad(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="1">Presencial</option>
                      <option value="2">Remoto</option>
                      <option value="3">Híbrido</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formTipoContrato" className="mb-3">
                    <Form.Label className={styles.formLabel}>Tipo de contrato</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Ingrese el tipo de contrato"
                      value={tipoContrato}
                      onChange={(e) => setTipoContrato(e.target.value)}
                      className={styles.selectInput}
                    />
                  </Form.Group>

                  <Form.Group controlId="formJornada" className="mb-3">
                    <Form.Label className={styles.formLabel}>Horario de trabajo</Form.Label>
                    <Form.Control
                      as="select"
                      className={styles.selectInput}
                      value={horaTrabajo}
                      onChange={(e) => setHoraTrabajo(e.target.value)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Tiempo Completo">Tiempo Completo</option>
                      <option value="Medio Tiempo">Medio Tiempo</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="formHabilidad" className="mb-3">
                    <Form.Label className={styles.formLabel}>Habilidad</Form.Label>
                    <div className={`d-flex flex-wrap ${styles.skillsContainer}`}>
                      {[".NET", "JAVA", "Metodologías Ágiles", "SCRUM", "Javascript", "Análisis de datos", "Python"].map((habilidad) => (
                        <Form.Check
                          type="checkbox"
                          label={habilidad}
                          className={`me-3 mb-2 ${styles.skillCheck}`}
                          key={habilidad}
                          checked={habilidades.includes(habilidad)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setHabilidades((prevHabilidades) =>
                              checked ? [...prevHabilidades, habilidad] : prevHabilidades.filter((h) => h !== habilidad)
                            );
                          }}
                        />
                      ))}
                    </div>
                  </Form.Group>

                  <Button variant="success" type="submit" className={`w-100 ${styles.filtrarButton}`}>
                    FILTRAR
                  </Button>
                </Form>
              </Card.Body>
            </Card>

            <Card className={`mb-4 ${styles.inscripcionesCard}`}>
              <Card.Header className={styles.inscripcionesHeader}>Tus Inscripciones</Card.Header>
              <Card.Body>
                {currentInscripciones.length === 0 ? (
                  <p className="text-center">No tienes inscripciones aún.</p>
                ) : (
                  <ListGroup variant="flush" className={styles.inscripcionesList}>
                    {currentInscripciones.map((inscripcion, index) => (
                      <ListGroup.Item key={index} className={styles.inscripcionItem}>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex">
                            <img
                              src={inscripcion.empresa.logo || "/assets/photoDefault.png"}
                              alt="Empresa"
                              className={styles.inscripcionEmpresaImg}
                            />
                            <div className="ms-3">
                              <strong className={styles.inscripcionTitulo}>{inscripcion.cargo}</strong>
                              <br />
                              <span className={styles.inscripcionFechas}>
                                Fecha de publicación: {new Date(inscripcion.fecha_publicacion).toLocaleDateString()}
                              </span>
                              <span className="mx-2">|</span>
                              <span className={styles.inscripcionFechas}>
                                Fecha de cierre: {new Date(inscripcion.fecha_cierre).toLocaleDateString()}
                              </span>
                              <br />
                              <strong>Empresa:</strong>{' '}
                              <a href="#" className={styles.empresaLink}>
                                {inscripcion.empresa.nombre}
                              </a>
                              <br />
                              <strong>Estado:</strong>
                              <span
                                className={`${styles.inscripcionEstado} ${
                                  inscripcion.estado === 'Pendiente'
                                    ? styles.estadoPendiente
                                    : inscripcion.estado === 'En segunda fase'
                                    ? styles.estadoSegundaFase
                                    : styles.estadoRechazada
                                }`}
                              >
                                {inscripcion.estado}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="danger"
                              className={`${styles.eliminarButton} ms-3`}
                              onClick={() => handleShowConfirmModal(inscripcion.id)}
                            >
                              <Delete sx={{ color: '#FFF' }} />
                            </Button>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* Modal de confirmación para eliminar inscripción */}
                <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    ¿Está seguro de que desea eliminar esta inscripción?
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                      Cancelar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => {
                        if (inscripcionToDelete !== null) {
                          handleEliminarInscripcion(inscripcionToDelete);
                        }
                      }}
                    >
                      Eliminar
                    </Button>
                  </Modal.Footer>
                </Modal>
              </Card.Body>
              <Card.Footer className={styles.paginationFooter}>
                <Pagination size="sm" className="justify-content-center mb-0">
                  <Pagination.First onClick={() => handleInsPageChange(1)} disabled={currentInsPage === 1} />
                  <Pagination.Prev onClick={() => handleInsPageChange(currentInsPage - 1)} disabled={currentInsPage === 1} />
                  {[...Array(totalInsPages)].map((_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentInsPage}
                      onClick={() => handleInsPageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => handleInsPageChange(currentInsPage + 1)} disabled={currentInsPage === totalInsPages} />
                  <Pagination.Last onClick={() => handleInsPageChange(totalInsPages)} disabled={currentInsPage === totalInsPages} />
                </Pagination>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>
      {/* Modal para mostrar detalles de la oferta */}
      <OfertaModal show={showModal} onHide={() => setShowModal(false)} oferta={selectedOferta} />
    </Layout>
  );
};

export default Ofertas;
