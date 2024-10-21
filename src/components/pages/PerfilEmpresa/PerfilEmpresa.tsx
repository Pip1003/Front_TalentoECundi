import React, { useEffect, useState } from 'react';
import { Container, Card, Spinner, Button } from 'react-bootstrap';
import { Avatar, Typography, Divider } from '@mui/material';
import { MdLocationOn, MdEdit } from 'react-icons/md';
import { FaPhoneAlt, FaGlobe, FaEnvelope } from 'react-icons/fa';
import Layout from '../../layouts/LayoutAuth/Layout';
import styles from './styles.module.css';
import { obtenerPerfilEmpresa } from '../../../Services/PerfilEmpresaService';

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

const PerfilEmpresaPage: React.FC = () => {
    const [perfilEmpresa, setPerfilEmpresa] = useState<PerfilEmpresa | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

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
                } catch (error) {
                    console.error('Error al obtener el perfil de la empresa:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPerfilEmpresa();
    }, [idEmpresa]);

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
                {perfilEmpresa && (
                    <Card className={styles.profileCard}>
                        {perfilEmpresa.banner && (
                            <div className={styles.bannerContainer}>
                                <img
                                    src={`data:image/jpeg;base64,${perfilEmpresa.banner}`}
                                    alt="Banner de la empresa"
                                    className={styles.banner}
                                />
                                <Button href='/actualizar-perfil-empresa' className={styles.editIcon}>
                                    <MdEdit size={24} color="#fff" />
                                </Button>
                            </div>
                        )}
                        <Card.Body className={styles.profileBody}>
                            <div className={styles.logoContainer}>
                                <Avatar
                                    src={`data:image/jpeg;base64,${perfilEmpresa.logo}`}
                                    alt="Logo de la empresa"
                                    className={styles.logo}
                                    sx={{ width: 120, height: 120 }}
                                />
                            </div>
                            <div className={styles.companyInfo}>
                                <Typography className={styles.companyName}>
                                    {perfilEmpresa.nombre}
                                </Typography>
                                <Typography variant="subtitle1" color="textSecondary">
                                    NIT: {perfilEmpresa.nit}
                                </Typography>
                            </div>
                            <Divider className="my-4" />
                            <div className={styles.companyContact}>
                                <div className={styles.contactItem}>
                                    <FaEnvelope className={styles.contactIcon} /> {perfilEmpresa.correo_usuario}
                                </div>
                                <div className={styles.contactItem}>
                                    <FaEnvelope className={styles.contactIcon} /> {perfilEmpresa.correo_contacto}
                                </div>
                                <div className={styles.contactItem}>
                                    <FaPhoneAlt className={styles.contactIcon} /> {perfilEmpresa.telefono}
                                </div>
                                <div className={styles.contactItem}>
                                    <MdLocationOn className={styles.contactIcon} /> {perfilEmpresa.ciudad}, {perfilEmpresa.departamento}
                                </div>
                                <div className={styles.contactItem}>
                                    <FaGlobe className={styles.contactIcon} /> {perfilEmpresa.pagina_web || 'No especificada'}
                                </div>
                            </div>
                            <div className={styles.description}>
                                <Typography variant="h6">Descripción</Typography>
                                <Typography variant="body1" color="textSecondary">
                                    {perfilEmpresa.descripcion || 'No se ha proporcionado una descripción de la empresa.'}
                                </Typography>
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </Container>
        </Layout>
    );
};

export default PerfilEmpresaPage;
