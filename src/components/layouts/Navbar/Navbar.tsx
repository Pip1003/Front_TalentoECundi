import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { IoNotifications } from 'react-icons/io5';
import { IoLogOutOutline } from 'react-icons/io5';
import Avatar from '@mui/material/Avatar';
import { Dropdown, Badge, ListGroup, Spinner, Image, Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerNotificaciones, actualizarEstadoNotificaciones } from '../../../Services/NotificacionService';

interface Notificacion {
    id: number;
    id_usuario: number;
    titulo: string;
    mensaje: string;
    fecha: string;
    estado: 'Leída' | 'No Leída';
}

const Navbar: React.FC = () => {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

    const navigate = useNavigate();

    // Obtener los datos del usuario desde el localStorage
    const usuarioString = localStorage.getItem('usuario');
    let idUsuario: number | null = null;
    let idRol: number | null = null;
    let imagenPerfil: string | null = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        idUsuario = usuario.id;
        idRol = usuario.id_rol;
        imagenPerfil = usuario.imagen;
    }

    useEffect(() => {
        const fetchNotificaciones = async () => {
            if (idUsuario) {
                try {
                    setLoading(true);
                    const data = await obtenerNotificaciones(idUsuario);
                    setNotificaciones(data);
                } catch (error) {
                    console.error('Error al obtener notificaciones:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchNotificaciones();
    }, [idUsuario]);

    // Marcar notificaciones como leídas
    const marcarComoLeidas = async (ids: number[]) => {
        if (idUsuario) {
            try {
                await actualizarEstadoNotificaciones(idUsuario, ids);
                setNotificaciones((prev) =>
                    prev.map((notif) =>
                        ids.includes(notif.id) ? { ...notif, estado: 'Leída' } : notif
                    )
                );
            } catch (error) {
                console.error('Error al marcar notificaciones como leídas:', error);
            }
        }
    };

    // Al hacer clic en el dropdown de notificaciones
    const handleDropdownClick = () => {
        const notificacionesNoLeidas = notificaciones
            .filter((notif) => notif.estado === 'No Leída')
            .map((notif) => notif.id);
        if (notificacionesNoLeidas.length > 0) {
            marcarComoLeidas(notificacionesNoLeidas);
        }
    };

    // Mostrar el modal de confirmación de cierre de sesión
    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    // Cerrar sesión
    const handleLogoutConfirm = () => {
        // Eliminar token y datos de usuario de localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');

        // Redirigir al formulario de login
        navigate('/');
    };

    // Redirigir al perfil según el rol del usuario
    const handleAvatarClick = () => {
        if (idRol === 1) {
            navigate('/perfilEgresado');
        } else if (idRol === 2) {
            navigate('/perfilEmpresa');
        }
    };

    const handleLogoClick = () => {
        if (idRol === 1) {
            navigate('/inicio');
        } else if (idRol === 2) {
            navigate('/publicaciones');
        }
    };

    return (
        <>
            <div className={styles.navbar_container}>
                <div className={styles.logo_container} onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                    <div className={styles.img_container}>
                        <Image src={'/assets/ESCUDO_COLOR.png'} className={styles.image} alt="Logo" />
                    </div>
                    <h1 className={styles.titulo}> Talento E-Cundi </h1>
                </div>
                <div className={styles.options}>
                    <div className={styles.notificationIconContainer}>
                        <Dropdown onClick={handleDropdownClick} align="end">
                            <Dropdown.Toggle
                                variant="link"
                                id="dropdown-notifications"
                                className={styles.icons}
                                bsPrefix="dropdown-toggle-custom"
                            >
                                <IoNotifications className={styles.notificationIcon} />
                                {notificaciones.some((notif) => notif.estado === 'No Leída') && (
                                    <span className={styles.notificationBadge}>
                                        {notificaciones.filter((notif) => notif.estado === 'No Leída').length}
                                    </span>
                                )}
                            </Dropdown.Toggle>

                            <Dropdown.Menu className={styles.dropdownMenu}>
                                <Dropdown.Header>Notificaciones</Dropdown.Header>
                                {loading ? (
                                    <div className="text-center p-3">
                                        <Spinner animation="border" size="sm" />
                                    </div>
                                ) : notificaciones.length === 0 ? (
                                    <div className="text-center p-3">No tienes notificaciones</div>
                                ) : (
                                    <ListGroup variant="flush">
                                        {notificaciones.map((notif) => (
                                            <ListGroup.Item
                                                key={notif.id}
                                                className={`${styles.notificacionItem} ${notif.estado === 'No Leída' ? styles.noLeida : ''}`}
                                            >
                                                <div className={styles.notificacionTitulo}>{notif.titulo}</div>
                                                <div className={styles.notificacionMensaje}>{notif.mensaje}</div>
                                                <div className={styles.notificacionFecha}>{new Date(notif.fecha).toLocaleString()}</div>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <Avatar
                        className={styles.avatar}
                        alt="Card Principal"
                        src={imagenPerfil ? `data:image/jpeg;base64,${imagenPerfil}` : '/assets/photoDefault.png'}
                        variant="circular"
                        onClick={handleAvatarClick}
                        style={{ cursor: 'pointer' }}
                    />
                    <IoLogOutOutline className={styles.icons} onClick={handleLogoutClick} />
                </div>
            </div>

            {/* Modal de confirmación de cierre de sesión */}
            <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar cierre de sesión</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas cerrar sesión?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleLogoutConfirm}>
                        Cerrar sesión
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Navbar;
