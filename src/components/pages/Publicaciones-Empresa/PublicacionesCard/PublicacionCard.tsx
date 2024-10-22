import React, { useEffect, useState } from 'react';
import {
    Card,
    Button
} from 'react-bootstrap';
import {
    Box,
    Typography,
    CircularProgress,
    Container,
    Alert,
    Pagination,
    Paper,
    Snackbar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { Add, CheckCircleOutline, CancelOutlined } from '@mui/icons-material';
import Layout from '../../../layouts/LayoutAuth/Layout';
import { obtenerPublicacionesPorEmpresa, eliminarPublicacion } from '../../../../Services/OfertaService';
import EditarOfertaModal from '../EditarOfertaModal/EditarOfertaModal';
import styles from './styles.module.css';
import { Link } from 'react-router-dom';

interface Ubicacion {
    ciudad: string;
    departamento: string;
    direccion: string;
}

interface Oferta {
    id: number;
    cargo: string;
    descripcion: string;
    fecha_publicacion: string;
    fecha_cierre: string;
    estado: string;
    salario: string;
    tipo_contrato: string;
    experiencia_requerida: string;
    hora_trabajo: string;
    habilidades: string;
    idiomas: string;
    ubicacion: Ubicacion;
}

const PublicacionCard: React.FC = () => {
    const [publicaciones, setPublicaciones] = useState<Oferta[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 2;
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [selectedOferta, setSelectedOferta] = useState<Oferta | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

    const usuarioString = localStorage.getItem('usuario');
    let id_empresa: number | null = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        id_empresa = usuario?.id_relacionado;
    }

    useEffect(() => {
        const cargarPublicaciones = async () => {
            if (id_empresa) {
                try {
                    const data = await obtenerPublicacionesPorEmpresa(id_empresa);
                    setPublicaciones(data.ofertas);
                    setLoading(false);
                } catch (err: any) {
                    setError(err.message);
                    setLoading(false);
                }
            }
        };
        cargarPublicaciones();
    }, [id_empresa]);

    const handleEliminar = async (id_oferta: number) => {
        if (id_empresa) {
            try {
                await eliminarPublicacion(id_empresa, id_oferta);
                setPublicaciones(publicaciones.filter((oferta) => oferta.id !== id_oferta));
                setSnackbarMessage('Publicación eliminada exitosamente.');
                setSelectedOferta(null);
                setOpenDeleteModal(false);
            } catch (err: any) {
                setError(err.message);
            }
        }
    };

    const handleEditar = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        setOpenModal(true);
    };

    const handleSave = () => {
        setOpenModal(false);
        setSnackbarMessage('Oferta actualizada exitosamente.');
        // Recargar publicaciones
        if (id_empresa) {
            obtenerPublicacionesPorEmpresa(id_empresa).then((data) => setPublicaciones(data.ofertas));
        }
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage(null);
    };

    const handleOpenDeleteModal = (oferta: Oferta) => {
        setSelectedOferta(oferta);
        setOpenDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setOpenDeleteModal(false);
    };

    const paginatedPublicaciones = publicaciones.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <Layout>
            <Container className="mt-4 mb-5">
                <Paper elevation={3} className={styles.container}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ marginBottom: '20px' }}>
                        <Typography variant="h4" gutterBottom>
                            Publicaciones Creadas
                        </Typography>
                        <Button
                            variant="contained"
                            className={styles.customButton}
                            href='/crear-oferta'
                        >
                            <Add style={{ marginRight: '8px' }} />
                            Agregar Nueva Oferta
                        </Button>
                    </Box>

                    {publicaciones.length > 0 ? (
                        paginatedPublicaciones.map((oferta) => (
                            <Card key={oferta.id} className={`${styles.card} h-100`}>
                                <Card.Body>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Typography variant="h6" gutterBottom>
                                            {oferta.cargo}
                                        </Typography>
                                        <Box display="flex" alignItems="center">
                                            {oferta.estado === 'A' ? (
                                                <CheckCircleOutline style={{ color: '#4caf50', marginRight: '8px' }} />
                                            ) : (
                                                <CancelOutlined style={{ color: '#f44336', marginRight: '8px' }} />
                                            )}
                                            <Typography variant="body2" className={styles.estadoOferta}>
                                                {oferta.estado === 'A' ? 'Oferta Abierta' : 'Oferta Cerrada'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary">
                                        {oferta.descripcion}
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography variant="body2">
                                            <strong>Salario:</strong> ${oferta.salario}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Tipo de Contrato:</strong> {oferta.tipo_contrato}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Fecha de Publicación:</strong> {new Date(oferta.fecha_publicacion).toLocaleDateString()}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Fecha de Cierre:</strong> {new Date(oferta.fecha_cierre).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                </Card.Body>
                                <Card.Footer className={styles.cardFooterButtons}>
                                    <Button
                                        className={styles.customButton}
                                        onClick={() => handleEditar(oferta)}
                                        variant='contained'
                                    >
                                        Editar
                                    </Button>
                                    <Button
                                        className={styles.customButton}
                                        onClick={() => handleOpenDeleteModal(oferta)}
                                        variant='contained'
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
                                        className={styles.customButton}
                                        href={`/ver-postulados/${oferta.id}`}
                                        variant="contained"
                                    >
                                        Ver Postulados
                                    </Button>
                                </Card.Footer>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="h6" align="center">
                            No se encontraron publicaciones.
                        </Typography>
                    )}
                    {publicaciones.length > itemsPerPage && (
                        <Box className={styles.pagination}>
                            <Pagination
                                count={Math.ceil(publicaciones.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </Paper>
                <EditarOfertaModal
                    open={openModal}
                    onClose={() => setOpenModal(false)}
                    oferta={selectedOferta}
                    id_empresa={id_empresa!}
                    onSave={handleSave}
                />
                <Dialog
                    open={openDeleteModal}
                    onClose={handleCloseDeleteModal}
                >
                    <DialogTitle>Eliminar Oferta</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            ¿Está seguro de que desea eliminar esta oferta de empleo? Esta acción no se puede deshacer.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDeleteModal} variant="contained" style={{ backgroundColor: '#00482B', color: '#FFF' }}>
                            No
                        </Button>
                        <Button
                            onClick={() => handleEliminar(selectedOferta!.id)}
                            style={{ backgroundColor: '#00482B', color: '#FFF' }}
                            variant="contained"
                        >
                            Sí, eliminar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Snackbar
                    open={!!snackbarMessage}
                    message={snackbarMessage}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ backgroundColor: '#C89104' }}
                />
            </Container>
        </Layout>
    );
};

export default PublicacionCard;
