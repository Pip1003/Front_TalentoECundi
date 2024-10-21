import React, { useEffect, useState } from 'react';
import { Container, Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Avatar, Typography, Snackbar, Alert } from '@mui/material';
import Layout from '../../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';
import { obtenerPerfilEmpresa, actualizarPerfilEmpresa } from '../../../../Services/PerfilEmpresaService';
import { obtenerDepartamentos, obtenerCiudades } from '../../../../Services/DireccionService';

interface PerfilEmpresa {
    nit: string;
    nombre: string;
    telefono: string;
    correo_contacto: string;
    correo_usuario: string;
    pagina_web: string;
    descripcion: string;
    logo: string | null;
    banner: string | null;
    ciudad: string;
    departamento: string;
    direccion: string;
}

const ActualizarEmpresa: React.FC = () => {
    const [perfilEmpresa, setPerfilEmpresa] = useState<PerfilEmpresa | null>(null);
    const [departamentos, setDepartamentos] = useState<string[]>([]);
    const [ciudades, setCiudades] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedDepartamento, setSelectedDepartamento] = useState<string>('');
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    // Obtener el ID del usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');
    let idEmpresa: number | null = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        idEmpresa = usuario.id_relacionado;
    }

    useEffect(() => {
        const fetchPerfilEmpresa = async () => {
            if (idEmpresa) {
                try {
                    const data = await obtenerPerfilEmpresa(idEmpresa);
                    setPerfilEmpresa(data);
                    setSelectedDepartamento(data.departamento);
                } catch (error) {
                    console.error('Error al obtener el perfil de la empresa:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        const fetchDepartamentos = async () => {
            try {
                const data = await obtenerDepartamentos();
                setDepartamentos(data.map((d: any) => d.departamento));
            } catch (error) {
                console.error('Error al obtener los departamentos:', error);
            }
        };

        fetchPerfilEmpresa();
        fetchDepartamentos();
    }, [idEmpresa]);

    useEffect(() => {
        const fetchCiudades = async () => {
            if (selectedDepartamento) {
                try {
                    const data = await obtenerCiudades(selectedDepartamento);
                    setCiudades(data);
                } catch (error) {
                    console.error('Error al obtener las ciudades:', error);
                }
            }
        };

        fetchCiudades();
    }, [selectedDepartamento]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPerfilEmpresa((prev) => (prev ? { ...prev, [name]: value } : prev));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) { // Tamaño máximo de 5MB
                setSnackbarMessage('El archivo debe ser menor a 5MB');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                return;
            }
            setPerfilEmpresa((prev) => (prev ? { ...prev, [name]: file } : prev));
        }
    };

    const handleSave = async () => {
        if (idEmpresa && perfilEmpresa) {
            setLoading(true);
            try {
                await actualizarPerfilEmpresa(idEmpresa, perfilEmpresa);
                setSnackbarMessage('Perfil actualizado correctamente');
                setSnackbarSeverity('success');
                setSnackbarOpen(true);
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
                setSnackbarMessage('Error al actualizar el perfil');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <div className={styles.spinner}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <Layout>
            <Container className={styles.container}>
                <div className={styles.formContainer}>
                    {/* Sección Izquierda - Información del Perfil */}
                    <div className={styles.leftSection}>
                        <div className={styles.bannerContainer}>
                            {perfilEmpresa?.banner && (
                                <img
                                    src={`data:image/jpeg;base64,${perfilEmpresa.banner}`}
                                    alt="Banner de la empresa"
                                    className={styles.bannerImage}
                                />
                            )}
                        </div>
                        <div className={styles.profilePictureContainer}>
                            <Avatar
                                src={`data:image/jpeg;base64,${perfilEmpresa?.logo}`}
                                alt="Logo de la empresa"
                                className={styles.avatar}
                            />
                        </div>
                        <Typography variant="h5" className={styles.companyName}>
                            {perfilEmpresa?.nombre}
                        </Typography>
                        <Typography variant="body1" className={styles.companyInfo}>
                            NIT: {perfilEmpresa?.nit}
                        </Typography>
                        <Typography variant="body1" className={styles.companyInfo}>
                            Teléfono: {perfilEmpresa?.telefono}
                        </Typography>
                        <Typography variant="body1" className={styles.companyInfo}>
                            Correo de Contacto: {perfilEmpresa?.correo_contacto}
                        </Typography>
                        <Typography variant="body1" className={styles.companyInfo}>
                            Dirección: {perfilEmpresa?.direccion}
                        </Typography>
                    </div>

                    {/* Sección Derecha - Formulario de Edición */}
                    <div className={styles.rightSection}>
                        <Form className={styles.form}>
                            <Row className={styles.formRow}>
                                <Col md={6}>
                                    <Form.Group controlId="formNombre">
                                        <Form.Label className={styles.formLabel}>Nombre de la Empresa</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nombre"
                                            value={perfilEmpresa?.nombre}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formNit">
                                        <Form.Label className={styles.formLabel}>NIT</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="nit"
                                            value={perfilEmpresa?.nit}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className={styles.formRow}>
                                <Col md={6}>
                                    <Form.Group controlId="formTelefono">
                                        <Form.Label className={styles.formLabel}>Teléfono</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="telefono"
                                            value={perfilEmpresa?.telefono}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formCorreoContacto">
                                        <Form.Label className={styles.formLabel}>Correo de Contacto</Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="correo_contacto"
                                            value={perfilEmpresa?.correo_contacto}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className={styles.formRow}>
                                <Col md={6}>
                                    <Form.Group controlId="formDepartamento">
                                        <Form.Label className={styles.formLabel}>Departamento</Form.Label>
                                        <Form.Select
                                            name="departamento"
                                            value={perfilEmpresa?.departamento}
                                            onChange={(e) => {
                                                handleInputChange(e);
                                                setSelectedDepartamento(e.target.value);
                                            }}
                                            className={styles.customSelect}
                                        >
                                            <option value="">Seleccione un Departamento</option>
                                            {departamentos.map((dep) => (
                                                <option key={dep} value={dep}>
                                                    {dep}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formCiudad">
                                        <Form.Label className={styles.formLabel}>Ciudad</Form.Label>
                                        <Form.Select
                                            name="ciudad"
                                            value={perfilEmpresa?.ciudad}
                                            onChange={handleInputChange}
                                            className={styles.customSelect}
                                        >
                                            <option value="">Seleccione una Ciudad</option>
                                            {ciudades.map((ciudad) => (
                                                <option key={ciudad} value={ciudad}>
                                                    {ciudad}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row className={styles.formRow}>
                                <Col md={6}>
                                    <Form.Group controlId="formDireccion">
                                        <Form.Label className={styles.formLabel}>Dirección</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="direccion"
                                            value={perfilEmpresa?.direccion}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId="formPaginaWeb">
                                        <Form.Label className={styles.formLabel}>Página Web</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="pagina_web"
                                            value={perfilEmpresa?.pagina_web}
                                            onChange={handleInputChange}
                                            className={styles.formControl}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Form.Group controlId="formDescripcion" className={styles.formRow}>
                                <Form.Label className={styles.formLabel}>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="descripcion"
                                    rows={4}
                                    value={perfilEmpresa?.descripcion}
                                    onChange={handleInputChange}
                                    className={styles.formControl}
                                />
                            </Form.Group>
                            <Form.Group controlId="formLogo" className={styles.formRow}>
                                <Form.Label className={styles.formLabel}>Logo de la Empresa</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="logo"
                                    onChange={handleFileChange}
                                    className={styles.formControl}
                                />
                            </Form.Group>
                            <Form.Group controlId="formBanner" className={styles.formRow}>
                                <Form.Label className={styles.formLabel}>Banner de la Empresa</Form.Label>
                                <Form.Control
                                    type="file"
                                    name="banner"
                                    onChange={handleFileChange}
                                    className={styles.formControl}
                                />
                            </Form.Group>
                            <div className={styles.saveButtonContainer}>
                                <Button className={styles.saveButton} onClick={handleSave} disabled={loading}>
                                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </Container>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Layout>
    );
};

export default ActualizarEmpresa;
