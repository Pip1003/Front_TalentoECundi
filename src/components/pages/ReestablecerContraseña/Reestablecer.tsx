import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { cambiarContraseña } from '../../../Services/RecuperacionService';

const Reestablecer: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false); 
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success'); 

    useEffect(() => {
        // Verificar si el token está presente
        if (!token) {
            navigate('/'); 
        }
    }, [token, navigate]);

    // Manejar el cierre del Snackbar
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleActualizarContrasena = async () => {
        setError('');
        setSnackbarMessage('');
        try {
            const response = await cambiarContraseña({ token, nuevaContrasena, confirmarContrasena });
            setSnackbarMessage(response.message); 
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            // Eliminar el token del sessionStorage
            sessionStorage.removeItem('token');

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error: any) {
            setError(error.message);
            setSnackbarMessage(error.message); 
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Layout>
            <Container className="mt-4">
                <Box sx={{ color: '#00482B', fontWeight: '40px', textAlign: 'center', marginBottom: '30px' }}>
                    <Typography variant="h4" gutterBottom>
                        Recuperación de Contraseña
                    </Typography>
                </Box>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    variant="outlined"
                    type="password"
                    margin="normal"
                    color="success"
                    focused
                    required
                    value={nuevaContrasena}
                    onChange={(e) => setNuevaContrasena(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="Confirmar Nueva Contraseña"
                    variant="outlined"
                    type="password"
                    margin="normal"
                    color="success"
                    focused
                    required
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                />
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#00482B',
                        color: '#fff',
                        width: '250px',
                        height: '40px',
                        margin: '0 auto',
                        marginTop: '20px',
                        marginBottom: '20px',
                        display: 'block'
                    }}
                    onClick={handleActualizarContrasena}
                >
                    ACTUALIZAR CONTRASEÑA
                </Button>

                {/* Snackbar para mostrar mensajes de éxito o error */}
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

export default Reestablecer;
