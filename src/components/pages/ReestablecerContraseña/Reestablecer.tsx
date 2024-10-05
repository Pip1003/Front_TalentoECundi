import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { cambiarContraseña } from '../../../Services/RecuperacionService';

const Reestablecer: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Verificar si el token está presente
        if (!token) {
            navigate('/'); 
        }
    }, [token, navigate]);

    const handleActualizarContrasena = async () => {
        setError('');
        setSuccessMessage('');
        try {
            const response = await cambiarContraseña({ token, nuevaContrasena, confirmarContrasena });
            setSuccessMessage(response.message);

            // Eliminar el token del sessionStorage
            sessionStorage.removeItem('token');

            // Redirigir a la página de inicio de sesión u otra página
            navigate('/');
        } catch (error: any) {
            setError(error.message);
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
                {successMessage && <Typography color="success">{successMessage}</Typography>}
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
            </Container>
        </Layout>
    );
};

export default Reestablecer;
