import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardActions,
    Button,
    Container,
    Paper,
    CircularProgress,
    Alert,
    Snackbar,
    Avatar,
    Divider,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerPostulados, rechazarPostulacion, pasarSegundaFase } from '../../../../Services/InscripcionService';
import Layout from '../../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';

interface Egresado {
    id: number;
    nombres: string;
    apellidos: string;
    codigo_estudiante: string;
    telefono: string;
    genero: string;
    fecha_nacimiento: string;
    imagen_perfil: string | null;
}

interface Inscripcion {
    id: number;
    id_oferta: number;
    id_egresado: number;
    fecha_inscripcion: string;
    estado: string;
    egresado: Egresado;
}

const VerPostulados: React.FC = () => {
    const { id_oferta } = useParams<{ id_oferta: string }>();
    const navigate = useNavigate();
    const [inscripciones, setInscripciones] = useState<Inscripcion[] | null>(null); 
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openConfirmDialog, setOpenConfirmDialog] = useState<{ open: boolean, action: string, id: number | null }>({ open: false, action: '', id: null });
    const itemsPerPage = 1;

    const usuarioString = localStorage.getItem('usuario');
    let id_empresa: number | null = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        id_empresa = usuario?.id_relacionado;
    }

    useEffect(() => {
        const cargarPostulados = async () => {
            if (id_empresa && id_oferta) {
                try {
                    const data = await obtenerPostulados(Number(id_oferta), id_empresa);
                    setInscripciones(data.inscripciones);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };
        cargarPostulados();
    }, [id_oferta, id_empresa]);

    const handleConfirmAction = (action: string, id_inscripcion: number) => {
        setOpenConfirmDialog({ open: true, action, id: id_inscripcion });
    };

    const handleCloseDialog = () => {
        setOpenConfirmDialog({ open: false, action: '', id: null });
    };

    const handleRechazarPostulacion = async () => {
        if (openConfirmDialog.id !== null) {
            try {
                await rechazarPostulacion(openConfirmDialog.id);
                setInscripciones((prevInscripciones) => 
                    prevInscripciones ? prevInscripciones.filter((inscripcion) => inscripcion.id !== openConfirmDialog.id) : []
                );
                setSnackbarMessage('Postulación rechazada exitosamente.');
            } catch (err: any) {
                setError(err.message);
            }
            handleCloseDialog();
        }
    };

    const handlePasarSegundaFase = async () => {
        if (openConfirmDialog.id !== null) {
            try {
                await pasarSegundaFase(openConfirmDialog.id);
                setSnackbarMessage('Egresado pasado a segunda fase exitosamente.');
                setInscripciones((prevInscripciones) => 
                    prevInscripciones ? prevInscripciones.map((inscripcion) =>
                        inscripcion.id === openConfirmDialog.id
                            ? { ...inscripcion, estado: 'En segunda fase' }
                            : inscripcion
                    ) : []
                );
            } catch (err: any) {
                setError(err.message);
            }
            handleCloseDialog();
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarMessage(null);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) {
        return (
            <Layout>
                <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    const paginatedInscripciones = inscripciones ? inscripciones.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];

    return (
        <Layout>
            <Container className="mt-4 mb-5">
                <Paper elevation={3} className={styles.container} sx={{ padding: 4 }}>
                    <Typography variant="h4" gutterBottom className={styles.title} align="center" sx={{ marginBottom: 4 }}>
                        Egresados Postulados
                    </Typography>

                    {error && (
                        <Alert severity="error" className="mb-3">
                            {error}
                        </Alert>
                    )}

                    {paginatedInscripciones.length > 0 ? (
                        paginatedInscripciones.map((inscripcion) => (
                            <Card key={inscripcion.id} className={`${styles.card} mt-4`} sx={{ padding: 2, boxShadow: 3 }}>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center" sx={{ width: '30%' }}>
                                            <Avatar
                                                src={inscripcion.egresado.imagen_perfil || "/assets/img/photoDefault.webp"}
                                                sx={{ width: 80, height: 80, marginRight: 2 }}
                                            />
                                            <Box>
                                                <Typography variant="h6">
                                                    {inscripcion.egresado.nombres} {inscripcion.egresado.apellidos}
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Box sx={{ width: '40%' }}>
                                            <Typography variant="subtitle1" gutterBottom>
                                                Datos de información
                                            </Typography>
                                            <Divider sx={{ marginBottom: 2 }} />
                                            <Typography variant="body2">
                                                <strong>Código Estudiante:</strong> {inscripcion.egresado.codigo_estudiante}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Teléfono:</strong> {inscripcion.egresado.telefono}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Género:</strong> {inscripcion.egresado.genero}
                                            </Typography>
                                            <Typography variant="body2">
                                                <strong>Fecha de Nacimiento:</strong> {new Date(inscripcion.egresado.fecha_nacimiento).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="body2" className="mt-2">
                                                <strong>Estado:</strong> {inscripcion.estado}
                                            </Typography>
                                        </Box>

                                        <Box display="flex" flexDirection="column" alignItems="center" sx={{ width: '15%' }}>
                                            <Button
                                                variant="contained"
                                                onClick={() => navigate(`/ver-perfil-egresado/${inscripcion.id_egresado}`)}
                                                style={{ backgroundColor: '#00482B', color: '#ffffff', marginBottom: '8px', width: '100%' }}
                                            >
                                                Ver Perfil
                                            </Button>
                                            {inscripcion.estado !== 'En segunda fase' && (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleConfirmAction('segundaFase', inscripcion.id)}
                                                    style={{ backgroundColor: '#00482B', color: '#FFF', marginBottom: '8px', width: '100%' }}
                                                >
                                                    Pasar a Segunda Fase
                                                </Button>
                                            )}
                                            <Button
                                                variant="contained"
                                                onClick={() => handleConfirmAction('rechazar', inscripcion.id)}
                                                style={{ backgroundColor: '#f44336', color: '#ffffff', width: '100%' }}
                                            >
                                                Rechazar
                                            </Button>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography variant="h6" align="center" className="mt-4">
                            No se encontraron postulados.
                        </Typography>
                    )}

                    {inscripciones && inscripciones.length > itemsPerPage && (
                        <Box className={styles.pagination} mt={4} display="flex" justifyContent="center">
                            <Pagination
                                count={Math.ceil(inscripciones.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                            />
                        </Box>
                    )}
                </Paper>
                <Snackbar
                    open={!!snackbarMessage}
                    message={snackbarMessage}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    sx={{ backgroundColor: '#C89104' }}
                />

                <Dialog
                    open={openConfirmDialog.open}
                    onClose={handleCloseDialog}
                >
                    <DialogTitle>Confirmar acción</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {openConfirmDialog.action === 'rechazar' ? '¿Está seguro de que desea rechazar esta postulación?' : '¿Está seguro de que desea pasar a segunda fase a este egresado?'}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} style={{ backgroundColor: '#00482B', color: '#FFF' }}>
                            Cancelar
                        </Button>
                        <Button
                            onClick={openConfirmDialog.action === 'rechazar' ? handleRechazarPostulacion : handlePasarSegundaFase}
                            style={{ backgroundColor: '#00482B', color: '#FFF' }}
                            variant="contained"
                        >
                            Confirmar
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Layout>
    );
};

export default VerPostulados;
