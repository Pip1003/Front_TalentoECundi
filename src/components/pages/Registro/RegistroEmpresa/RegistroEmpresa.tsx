import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';
import { RegistroEmpresaService } from '../../../../Services/RegistroEmService'; // Asegúrate de que la ruta sea correcta
import { useNavigate } from 'react-router-dom';

const RegistroEmpresa: React.FC = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        nit: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });

    const [errors, setErrors] = useState({
        nombre: '',
        nit: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });

    // Estado para controlar el Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Estado para controlar si se debe redirigir
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const validateForm = () => {
        let valid = true;
        const newErrors = { ...errors };

        if (!formData.nombre) {
            newErrors.nombre = 'El nombre de la empresa es requerido';
            valid = false;
        }

        if (!formData.nit) {
            newErrors.nit = 'El NIT es requerido';
            valid = false;
        }

        if (!formData.correo) {
            newErrors.correo = 'El correo es requerido';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
            newErrors.correo = 'El correo no es válido';
            valid = false;
        }

        if (!formData.contrasena) {
            newErrors.contrasena = 'La contraseña es requerida';
            valid = false;
        }

        if (formData.contrasena !== formData.confirmarContrasena) {
            newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async () => {
        if (validateForm()) {
            try {
                const response = await RegistroEmpresaService(formData);
                console.log(response);
                // Mostrar el Snackbar cuando el registro sea exitoso
                setOpenSnackbar(true);
              
                window.scrollTo({ top: 0, behavior: 'smooth' });
               
                setTimeout(() => setShouldRedirect(true), 1500); 
            } catch (error: any) {
                if (error.message === 'El correo ya está registrado') {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        correo: 'El correo ya está registrado'
                    }));
                } else {
                    console.log(error.message);
                }
            }
        }
    };

    
    useEffect(() => {
        if (shouldRedirect) {
            navigate('/'); 
        }
    }, [shouldRedirect, navigate]);

    // Función para cerrar el Snackbar manualmente
    const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Layout>
            <Container className="mt-4">
                <Box sx={{ color: '#00482B', fontWeight: '40px', textAlign: 'center', marginBottom: '30px' }}>
                    <Typography variant="h4" gutterBottom>
                        Registro Empresa
                    </Typography>
                </Box>
                <Box sx={{ maxWidth: '100%' }}>
                    <TextField
                        fullWidth
                        label="Nombre de la empresa"
                        name="nombre"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.nombre}
                        onChange={handleChange}
                        error={!!errors.nombre}
                        helperText={errors.nombre}
                    />
                    <TextField
                        fullWidth
                        label="NIT"
                        name="nit"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.nit}
                        onChange={handleChange}
                        error={!!errors.nit}
                        helperText={errors.nit}
                    />
                    <TextField
                        fullWidth
                        label="Correo Electrónico"
                        name="correo"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.correo}
                        onChange={handleChange}
                        error={!!errors.correo}
                        helperText={errors.correo}
                    />
                    <TextField
                        fullWidth
                        label="Contraseña"
                        name="contrasena"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.contrasena}
                        onChange={handleChange}
                        error={!!errors.contrasena}
                        helperText={errors.contrasena}
                    />
                    <TextField
                        fullWidth
                        label="Confirmar Contraseña"
                        name="confirmarContrasena"
                        variant="outlined"
                        type="password"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.confirmarContrasena}
                        onChange={handleChange}
                        error={!!errors.confirmarContrasena}
                        helperText={errors.confirmarContrasena}
                    />
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#00482B',
                            color: '#fff',
                            width: '180px',
                            height: '42px',
                            padding: '8px 22px',
                            borderRadius: 'var(--borderRadius)',
                            opacity: 1,
                            margin: '30px auto 0',
                            display: 'block'
                        }}
                        onClick={handleSubmit}
                    >
                        REGISTRARSE
                    </Button>
                    <Button
                        variant="outlined"
                        sx={{
                            color: '#00482B',
                            width: '180px',
                            height: '42px',
                            padding: '8px 22px',
                            borderRadius: 'var(--borderRadius)',
                            opacity: 1,
                            margin: '10px auto 0',
                            display: 'block'
                        }}
                        href='/'
                    >
                        Iniciar Sesión
                    </Button>

                    {/* Snackbar para mostrar el mensaje de éxito */}
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={5000} 
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
                    >
                        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                            ¡Registro exitoso!
                        </Alert>
                    </Snackbar>
                </Box>
            </Container>
        </Layout>
    );
};

export default RegistroEmpresa;
