import React, { useEffect, useState } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
    MenuItem,
} from '@mui/material';
import styles from './styles.module.css';
import { editarPublicacion, cerrarOferta } from '../../../../Services/OfertaService';
import { obtenerDepartamentos, obtenerCiudades } from '../../../../Services/DireccionService';

interface EditarOfertaModalProps {
    open: boolean;
    onClose: () => void;
    oferta: any;
    id_empresa: number;
    onSave: () => void;
}

const EditarOfertaModal: React.FC<EditarOfertaModalProps> = ({
    open,
    onClose,
    oferta,
    id_empresa,
    onSave,
}) => {
    const [formData, setFormData] = useState<any>({
        ...oferta,
        ubicacion: oferta?.ubicacion || { departamento: '', ciudad: '', direccion: '' }
    });
    const [departamentos, setDepartamentos] = useState<Array<{ id: number; departamento: string }>>([]);
    const [ciudades, setCiudades] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (oferta) {
            setFormData({
                ...oferta,
                ubicacion: oferta.ubicacion || { departamento: '', ciudad: '', direccion: '' }
            });
            // Limpiar los mensajes de éxito y error cuando cambia la oferta
            setError(null);
            setSuccess(null);
        }
    }, [oferta]);

    useEffect(() => {
        // Cargar departamentos al montar el componente
        const cargarDepartamentos = async () => {
            try {
                const data = await obtenerDepartamentos();
                setDepartamentos(data);
            } catch (err) {
                setError('Error al obtener los departamentos');
            }
        };
        cargarDepartamentos();
    }, []);

    useEffect(() => {
        // Cargar ciudades cuando cambia el departamento
        if (formData.ubicacion?.departamento) {
            const cargarCiudades = async () => {
                try {
                    const data = await obtenerCiudades(formData.ubicacion.departamento);
                    setCiudades(data);
                } catch (err) {
                    setError('Error al obtener las ciudades');
                }
            };
            cargarCiudades();
        } else {
            setCiudades([]);
        }
    }, [formData.ubicacion?.departamento]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'departamento') {
            setFormData({
                ...formData,
                ubicacion: {
                    ...formData.ubicacion,
                    departamento: value,
                    ciudad: '', // Limpiar la ciudad cuando cambia el departamento
                }
            });
        } else {
            setFormData({
                ...formData,
                ubicacion: {
                    ...formData.ubicacion,
                    [name]: value,
                }
            });
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await editarPublicacion(id_empresa, formData.id, formData);
            setSuccess('Oferta actualizada exitosamente.');
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCerrarOferta = async () => {
        try {
            await cerrarOferta(id_empresa, formData.id);
            setSuccess('Oferta cerrada exitosamente.');
            onSave();
            onClose();
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!oferta) {
        return null;
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box className={styles.modalContent}>
                <Typography variant="h5" className={styles.modalTitle}>
                    Editar Oferta de Empleo
                </Typography>

                {error && (
                    <Alert severity="error" className="mb-3">
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" className="mb-3">
                        {success}
                    </Alert>
                )}

                <TextField
                    label="Cargo"
                    name="cargo"
                    value={formData.cargo || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Departamento"
                    name="departamento"
                    value={formData.ubicacion?.departamento || ''}
                    onChange={handleSelectChange}
                    select
                    fullWidth
                    margin="normal"
                    required
                >
                    {departamentos.map((dep) => (
                        <MenuItem key={dep.id} value={dep.departamento}>
                            {dep.departamento}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Ciudad"
                    name="ciudad"
                    value={formData.ubicacion?.ciudad || ''}
                    onChange={handleSelectChange}
                    select
                    fullWidth
                    margin="normal"
                    required
                    disabled={!formData.ubicacion?.departamento}
                >
                    {ciudades.map((ciudad, index) => (
                        <MenuItem key={index} value={ciudad}>
                            {ciudad}
                        </MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Dirección"
                    name="direccion"
                    value={formData.ubicacion?.direccion || ''}
                    onChange={(e) => {
                        setFormData({
                            ...formData,
                            ubicacion: {
                                ...formData.ubicacion,
                                direccion: e.target.value
                            }
                        });
                    }}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Modalidad"
                    name="id_modalidad"
                    value={formData.id_modalidad || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    select
                >
                    <MenuItem value="1">Presencial</MenuItem>
                    <MenuItem value="2">Remoto</MenuItem>
                    <MenuItem value="3">Híbrido</MenuItem>
                </TextField>

                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={formData.descripcion || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    multiline
                    rows={3}
                />

                <TextField
                    label="Fecha de Cierre"
                    name="fecha_cierre"
                    value={formData.fecha_cierre ? new Date(formData.fecha_cierre).toISOString().split('T')[0] : ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    type="date"
                    InputLabelProps={{ shrink: true }}
                />

                <TextField
                    label="Salario"
                    name="salario"
                    value={formData.salario || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Tipo de Contrato"
                    name="tipo_contrato"
                    value={formData.tipo_contrato || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Experiencia Requerida"
                    name="experiencia_requerida"
                    value={formData.experiencia_requerida || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Horario de Trabajo"
                    name="hora_trabajo"
                    value={formData.hora_trabajo || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                />

                <TextField
                    label="Vacantes Disponibles"
                    name="vacantes_disponibles"
                    value={formData.vacantes_disponibles || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    required
                    type="number"
                />

                <TextField
                    label="Habilidades"
                    name="habilidades"
                    value={formData.habilidades || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Ingrese habilidades separadas por comas"
                />

                <TextField
                    label="Idiomas"
                    name="idiomas"
                    value={formData.idiomas || ''}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                    placeholder="Ingrese idiomas separados por comas"
                />

                {formData.estado === 'C' && (
                    <TextField
                        label="Estado"
                        name="estado"
                        value={formData.estado}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        select
                    >
                        <MenuItem value="A">Abierto</MenuItem>
                        <MenuItem value="C">Cerrado</MenuItem>
                    </TextField>
                )}

                <Grid container spacing={2} className="mt-4" justifyContent={formData.estado === 'C' ? 'center' : 'space-between'}>
                    <Grid item xs={formData.estado === 'C' ? 12 : 6}>
                        <Button
                            variant="contained"
                            style={{ backgroundColor: '#00482B', color: '#ffffff' }}
                            onClick={handleSave}
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </Grid>
                    {formData.estado === 'A' && (
                        <Grid item xs={6}>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#00482B', color: '#ffffff' }}
                                onClick={handleCerrarOferta}
                                fullWidth
                            >
                                Cerrar Oferta
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Modal>
    );
};

export default EditarOfertaModal;
