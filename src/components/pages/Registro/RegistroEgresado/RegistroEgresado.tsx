import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Layout from '../../../layouts/LayoutGeneral/Layout';
import { TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { RegistroEgresadoService } from '../../../../Services/RegistroEgService'; 
import { useNavigate } from 'react-router-dom';

const RegistroEgresado: React.FC = () => {
    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        codigo_estudiante: '',
        fecha_nacimiento: '',
        genero: '',
        ano_graduacion: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });

    const [errors, setErrors] = useState({
        nombres: '',
        apellidos: '',
        codigo_estudiante: '',
        fecha_nacimiento: '',
        genero: '',
        ano_graduacion: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: ''
    });

    // Estado para controlar el Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Estado para controlar si se debe redirigir
    const [shouldRedirect, setShouldRedirect] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setErrors({
            ...errors,
            [e.target.name]: ''
        });
    };

    const handleSelectChange = (e: any) => {
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

        if (!formData.nombres) {
            newErrors.nombres = 'El nombre es requerido';
            valid = false;
        }

        if (!formData.apellidos) {
            newErrors.apellidos = 'El apellido es requerido';
            valid = false;
        }

        if (!formData.codigo_estudiante) {
            newErrors.codigo_estudiante = 'El código de estudiante es requerido';
            valid = false;
        }

        if (!formData.fecha_nacimiento) {
            newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
            valid = false;
        }

        if (!formData.genero) {
            newErrors.genero = 'El género es requerido';
            valid = false;
        }

        if (!formData.ano_graduacion) {
            newErrors.ano_graduacion = 'El año de graduación es requerido';
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
                const response = await RegistroEgresadoService(formData);
                console.log(response);
                // Mostrar el Snackbar cuando el registro sea exitoso
                setOpenSnackbar(true);
                // Subir el scrollbar al principio de la página
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
                        Registro Egresado
                    </Typography>
                </Box>
                <Box sx={{ maxWidth: '100%' }}>
                    {/* Campos de formulario */}
                    <TextField
                        fullWidth
                        label="Nombres"
                        name="nombres"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.nombres}
                        onChange={handleChange}
                        error={!!errors.nombres}
                        helperText={errors.nombres}
                    />
                    <TextField
                        fullWidth
                        label="Apellidos"
                        name="apellidos"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.apellidos}
                        onChange={handleChange}
                        error={!!errors.apellidos}
                        helperText={errors.apellidos}
                    />
                    <TextField
                        fullWidth
                        label="Código de Estudiante"
                        name="codigo_estudiante"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.codigo_estudiante}
                        onChange={handleChange}
                        error={!!errors.codigo_estudiante}
                        helperText={errors.codigo_estudiante}
                    />
                    <TextField
                        fullWidth
                        label="Fecha de Nacimiento"
                        name="fecha_nacimiento"
                        type="date"
                        variant="outlined"
                        margin="normal"
                        focused
                        required
                        color="success"
                        value={formData.fecha_nacimiento}
                        onChange={handleChange}
                        error={!!errors.fecha_nacimiento}
                        helperText={errors.fecha_nacimiento}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Género</InputLabel>
                        <Select
                            label="Género"
                            name="genero"
                            required
                            color="success"
                            value={formData.genero}
                            onChange={handleSelectChange}
                            error={!!errors.genero}
                        >
                            <MenuItem value="Masculino">Masculino</MenuItem>
                            <MenuItem value="Femenino">Femenino</MenuItem>
                            <MenuItem value="Otro">Otro</MenuItem>
                        </Select>
                        <Typography color="error">{errors.genero}</Typography>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Año de Graduación</InputLabel>
                        <Select
                            label="Año de Graduación"
                            name="ano_graduacion"
                            required
                            color="success"
                            value={formData.ano_graduacion}
                            onChange={handleSelectChange}
                            error={!!errors.ano_graduacion}
                        >
                            <MenuItem value={2017}>2017</MenuItem>
                            <MenuItem value={2018}>2018</MenuItem>
                            <MenuItem value={2019}>2019</MenuItem>
                            <MenuItem value={2020}>2020</MenuItem>
                            <MenuItem value={2021}>2021</MenuItem>
                            <MenuItem value={2022}>2022</MenuItem>
                            <MenuItem value={2023}>2023</MenuItem>
                            <MenuItem value={2024}>2024</MenuItem>
                        </Select>
                        <Typography color="error">{errors.ano_graduacion}</Typography>
                    </FormControl>
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
                            margin: '0 auto',
                            marginTop: '20px',
                            marginBottom: '10px',
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
                        autoHideDuration={5000} // Se cerrará automáticamente después de 5 segundos
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Posicionado en la parte superior
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

export default RegistroEgresado;
