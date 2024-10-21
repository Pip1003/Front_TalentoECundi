import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { solicitarRecuperacion, verificarCodigoRecuperacion } from '../../../Services/RecuperacionService';
import { useNavigate } from 'react-router-dom';

const RecuperacionContraseña: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [token, setToken] = useState('');
    const [codigoValido, setCodigoValido] = useState(false);
    const [error, setError] = useState('');
    const [mostrarCodigo, setMostrarCodigo] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false); // Controla el Snackbar
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Mensaje del Snackbar
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success'); // Severidad del Snackbar
    const navigate = useNavigate();

    // Manejar el cierre del Snackbar
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleEnviarCodigo = async () => {
        setError('');
        try {
            const response = await solicitarRecuperacion({ correo });
            setToken(response.token);
            setMostrarCodigo(true);

            // Mostrar Snackbar en lugar de alert
            setSnackbarMessage(response.message);
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

        } catch (error: any) {
            setError(error.message);
            setMostrarCodigo(false);

            // Mostrar Snackbar en lugar de alert
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleValidarCodigo = async () => {
        setError('');
        try {
            const response = await verificarCodigoRecuperacion({ token, codigoIngresado: codigo });
            setCodigoValido(true);

            // Mostrar mensaje de éxito en el Snackbar
            setSnackbarMessage('Código validado correctamente. Serás redirigido.');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Redirigir después de 2 segundos
            setTimeout(() => {
                navigate("/reestablecer-contraseña");
            }, 2000);

        } catch (error: any) {
            setError(error.message);

            // Mostrar Snackbar en lugar de alert
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Layout>
            <Container className="mt-3">
                <Box sx={{ color: '#00482B', fontWeight: '40px', textAlign: 'center', marginBottom: '30px' }}>
                    <Typography variant="h4" gutterBottom>
                        Recuperación de Contraseña
                    </Typography>
                </Box>
                {error && <Typography color="error" sx={{ marginBottom: "20px" }}>{error}</Typography>}
                <TextField
                    fullWidth
                    required
                    label="Correo Electrónico"
                    variant="outlined"
                    placeholder="Example@Example.com"
                    color="success"
                    focused
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#00482B',
                        color: '#fff',
                        width: '180px',
                        height: '42px',
                        margin: '0 auto',
                        marginTop: '20px',
                        marginBottom: '20px',
                        display: 'block'
                    }}
                    onClick={handleEnviarCodigo}
                >
                    ENVIAR CÓDIGO
                </Button>

                {/* Mostrar el campo del código solo si mostrarCodigo es verdadero */}
                {mostrarCodigo && (
                    <>
                        <TextField
                            fullWidth
                            required
                            label="Código"
                            placeholder="1 2 3 4 5 6"
                            margin="normal"
                            variant="outlined"
                            color="success"
                            type="text"
                            focused
                            value={codigo}
                            onChange={(e) => setCodigo(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#00482B',
                                color: '#fff',
                                width: '180px',
                                height: '42px',
                                margin: '0 auto',
                                marginTop: '20px',
                                marginBottom: '10px',
                                display: 'block'
                            }}
                            onClick={handleValidarCodigo}
                        >
                            VALIDAR CÓDIGO
                        </Button>

                        {/* Descripción indicando que el código expirará en 1 hora */}
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: 'center',
                                color: '#555',
                                fontStyle: 'italic',
                                marginBottom: '20px'
                            }}
                        >
                            El código expirará en 1 hora.
                        </Typography>
                    </>
                )}

                {/* Snackbar para mensajes */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={4000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                >
                    <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </Layout>
    );
};

export default RecuperacionContraseña;
