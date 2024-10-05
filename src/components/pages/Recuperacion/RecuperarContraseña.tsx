import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box } from '@mui/material';
import { solicitarRecuperacion, verificarCodigoRecuperacion } from '../../../Services/RecuperacionService';
import { useNavigate } from 'react-router-dom';

const RecuperacionContraseña: React.FC = () => {
    const [correo, setCorreo] = useState('');
    const [codigo, setCodigo] = useState('');
    const [token, setToken] = useState('');
    const [codigoValido, setCodigoValido] = useState(false);
    const [error, setError] = useState('');
    const [mostrarCodigo, setMostrarCodigo] = useState(false); 
    const navigate = useNavigate();

    const handleEnviarCodigo = async () => {
        setError('');
        try {
            const response = await solicitarRecuperacion({ correo });
            setToken(response.token); 
            setMostrarCodigo(true); 
            alert(response.message); 
        } catch (error: any) {
            setError(error.message);
            setMostrarCodigo(false); 
        }
    };

    const handleValidarCodigo = async () => {
        setError('');
        try {
            const response = await verificarCodigoRecuperacion({ token, codigoIngresado: codigo });
            setCodigoValido(true);
            navigate("/reestablecer-contraseña");
        } catch (error: any) {
            setError(error.message);
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
                                marginBottom: '20px',
                                display: 'block'
                            }}
                            onClick={handleValidarCodigo}
                        >
                            VALIDAR CÓDIGO
                        </Button>
                    </>
                )}

                {codigoValido && (
                    <Typography color="success">Código validado correctamente. Puedes proceder a restablecer tu contraseña.</Typography>
                )}
            </Container>
        </Layout>
    );
};

export default RecuperacionContraseña;
