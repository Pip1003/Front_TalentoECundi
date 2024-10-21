import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  SelectChangeEvent,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from '@mui/material';
import Layout from '../../../layouts/LayoutAuth/Layout';
import { Row, Col } from 'react-bootstrap';
import { obtenerDepartamentos, obtenerCiudades } from '../../../../Services/DireccionService';
import { obtenerPerfil, obtenerTitulos, actualizarPerfilEgresado } from '../../../../Services/PerfilEgresadoService';
import styles from './styles.module.css';

interface Titulo {
  nombre: string;
  estado: string;
}

interface FormDataState {
  nombres: string;
  apellidos: string;
  documento: string | null;
  codigo_estudiante: string;
  fecha_nacimiento: string;
  genero: string;
  ano_graduacion: string;
  telefono: string | null;
  ciudad: string | null;
  departamento: string | null;
  direccion: string | null;
  titulos: Titulo[];
  imagen_perfil: File | string | null;
  curriculum: File | string | null;
}

const ActualizarEgresado: React.FC = () => {
  const [formData, setFormData] = useState<FormDataState>({
    nombres: '',
    apellidos: '',
    documento: '',
    codigo_estudiante: '',
    fecha_nacimiento: '',
    genero: '',
    ano_graduacion: '',
    telefono: '',
    ciudad: null,
    departamento: null,
    direccion: '',
    titulos: [{ nombre: '', estado: '' }],
    imagen_perfil: '',
    curriculum: '',
  });

  const [departamentos, setDepartamentos] = useState<Array<{ id: string; departamento: string }>>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [titulosDisponibles, setTitulosDisponibles] = useState<Array<{ id: string; nombre: string }>>([]);
  const [estadosTitulo, setEstadosTitulo] = useState<Array<{ id: string; nombre: string }>>([
    { id: '1', nombre: 'Graduado' },
    { id: '2', nombre: 'Estudiando' },
  ]);

  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Obtener los datos del usuario desde el localStorage
  const usuarioString = localStorage.getItem('usuario');
  let idEgresado: any = null;

  if (usuarioString) {
    const usuario = JSON.parse(usuarioString);
    idEgresado = usuario.id_relacionado;
  }

  // Cargar departamentos al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const deps = await obtenerDepartamentos();
        setDepartamentos(deps);
      } catch (error) {
        console.error('Error al obtener los departamentos:', error);
      }
    };
    cargarDatos();

    obtenerTitulos()
      .then((data) => setTitulosDisponibles(data))
      .catch((error) => console.error('Error al obtener los títulos', error));

    obtenerPerfil(idEgresado)
      .then((data) => {
        const updatedData = {
          ...formData,
          ...data,
          titulos: data.titulos ?? []
        };
        setFormData(updatedData);
      })
      .catch((error) => console.error('Error al obtener los datos del perfil', error));
  }, [idEgresado]);

  // Cargar ciudades cuando el departamento cambia
  useEffect(() => {
    if (formData.departamento) {
      const cargarCiudades = async () => {
        try {
          const ciudadesData = await obtenerCiudades(formData.departamento);
          setCiudades(ciudadesData);
        } catch (error) {
          console.error('Error al obtener ciudades:', error);
        }
      };
      cargarCiudades();
    }
  }, [formData.departamento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      const { name } = e.target;

      // Validar imagen de perfil
      if (name === 'imagen_perfil') {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedImageTypes.includes(file.type)) {
          setSnackbarMessage('Formato de imagen no válido. Solo se permiten archivos .jpg, .jpeg, .png');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
          setSnackbarMessage('El tamaño de la imagen no debe exceder los 5MB');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
      }

      // Validar currículum
      if (name === 'curriculum') {
        if (file.type !== 'application/pdf') {
          setSnackbarMessage('Formato de currículum no válido. Solo se permiten archivos .pdf');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
        if (file.size > 10 * 1024 * 1024) { // 10MB
          setSnackbarMessage('El tamaño del currículum no debe exceder los 10MB');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
          return;
        }
      }

      setFormData({ ...formData, [name]: file });
    }
  };

  const agregarTitulo = () => {
    setFormData({
      ...formData,
      titulos: [...formData.titulos, { nombre: '', estado: '' }],
    });
  };

  const manejarCambioTitulo = (index: number, campo: string, valor: string) => {
    const nuevosTitulos = [...formData.titulos];
    nuevosTitulos[index] = { ...nuevosTitulos[index], [campo]: valor };
    setFormData({ ...formData, titulos: nuevosTitulos });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Crear un objeto FormData para manejar los archivos
      const formDataToSend = new FormData();

      formDataToSend.append('nombres', formData.nombres);
      formDataToSend.append('apellidos', formData.apellidos);
      formDataToSend.append('documento', formData.documento || '');
      formDataToSend.append('codigo_estudiante', formData.codigo_estudiante);
      formDataToSend.append('fecha_nacimiento', formData.fecha_nacimiento);
      formDataToSend.append('genero', formData.genero);
      formDataToSend.append('ano_graduacion', formData.ano_graduacion);
      formDataToSend.append('telefono', formData.telefono || '');
      formDataToSend.append('ciudad', formData.ciudad || '');
      formDataToSend.append('departamento', formData.departamento || '');
      formDataToSend.append('direccion', formData.direccion || '');

      // Agregar archivos
      if (formData.imagen_perfil && formData.imagen_perfil instanceof File) {
        formDataToSend.append('imagen_perfil', formData.imagen_perfil);
      }

      if (formData.curriculum && formData.curriculum instanceof File) {
        formDataToSend.append('curriculum', formData.curriculum);
      }

      // Filtrar y agregar títulos válidos
      formData.titulos.forEach((titulo, index) => {
        const tituloId = titulosDisponibles.find((t) => t.nombre === titulo.nombre)?.id;
        if (tituloId) {
          formDataToSend.append(`titulos[${index}][id_titulo]`, tituloId);
          formDataToSend.append(`titulos[${index}][estado]`, titulo.estado);
        }
      });

      await actualizarPerfilEgresado(idEgresado, formDataToSend);

      setSnackbarMessage('Perfil actualizado correctamente');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      setSnackbarMessage('Error al actualizar el perfil');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Layout>
      <Box sx={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Row>
          {/* Columna izquierda para la imagen de perfil */}
          <Col xs={12} md={4}>
            <Paper className={styles.whiteBackgroundContainer}>
              <Box textAlign="center" padding="20px">
                <img
                  src={
                    formData.imagen_perfil && !(formData.imagen_perfil instanceof File)
                      ? `data:image/jpeg;base64,${formData.imagen_perfil}`
                      : formData.imagen_perfil instanceof File
                        ? URL.createObjectURL(formData.imagen_perfil)
                        : 'https://via.placeholder.com/150'
                  }
                  alt="Perfil"
                  className={styles.profileImage}
                />
                <Typography variant="h6" className={styles.profileName}>
                  {formData.nombres} {formData.apellidos}
                </Typography>

                <Button className={styles.uploadButton} variant="contained" component="label" fullWidth>
                  Subir Imagen de Perfil
                  <input type="file" name="imagen_perfil" hidden onChange={handleFileChange} />
                </Button>

                <Typography variant="body2" color="textSecondary" align="center" marginTop="10px">
                  Subir imagen en formato .jpg o .png. Tamaño máximo 5MB.
                </Typography>
              </Box>
            </Paper>
          </Col>

          {/* Columna derecha para el formulario */}
          <Col xs={12} md={8}>
            <Paper className={styles.whiteBackgroundContainer}>
              <Box component="form" onSubmit={handleSubmit} padding="20px">
                <Typography variant="h4" gutterBottom align="center" className={styles.title}>
                  Editar Perfil
                </Typography>

                <TextField
                  label="Nombres"
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Apellidos"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Documento"
                  name="documento"
                  value={formData.documento}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Código Estudiante"
                  name="codigo_estudiante"
                  value={formData.codigo_estudiante}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Fecha de Nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  value={formData.fecha_nacimiento}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />

                <FormControl fullWidth margin="normal">
                  <InputLabel>Género</InputLabel>
                  <Select name="genero" label="Genero" value={formData.genero} onChange={handleChange}>
                    <MenuItem value="M">Masculino</MenuItem>
                    <MenuItem value="F">Femenino</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  fullWidth
                  margin="normal"
                />

                {/* Sección de Ubicación */}
                <Typography variant="h6" className={`${styles.headingSmall} ${styles.textMuted} mb-2 mt-3 `}>
                  Ubicación
                </Typography>

                <Row>
                  <Col xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Departamento</InputLabel>
                      <Select
                        name="departamento"
                        label="Departamento"
                        value={formData.departamento || ''}
                        onChange={(e) => handleChange(e as SelectChangeEvent)}
                      >
                        {departamentos.map((dep) => (
                          <MenuItem key={dep.id} value={dep.departamento}>
                            {dep.departamento}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>

                  <Col xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Ciudad</InputLabel>
                      <Select
                        name="ciudad"
                        label="Ciudad"
                        value={formData.ciudad || ''}
                        onChange={(e) => handleChange(e as SelectChangeEvent)}
                      >
                        {ciudades.map((ciudad) => (
                          <MenuItem key={ciudad} value={ciudad}>
                            {ciudad}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Col>
                </Row>

                {/* Sección de títulos */}
                <Typography variant="h6" className={`${styles.headingSmall} ${styles.textMuted} mb-2 mt-3`}>
                  Títulos
                </Typography>

                {formData.titulos.length > 0 ? (
                  formData.titulos.map((titulo, index) => (
                    <Row key={index}>
                      <Col xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Nombre del Título</InputLabel>
                          <Select
                            value={titulo.nombre}
                            onChange={(e) => manejarCambioTitulo(index, 'nombre', e.target.value)}
                            label="Nombre del Título"
                          >
                            {titulosDisponibles.map((tituloDisponible) => (
                              <MenuItem key={tituloDisponible.id} value={tituloDisponible.nombre}>
                                {tituloDisponible.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Col>

                      <Col xs={12} md={6}>
                        <FormControl fullWidth margin="normal">
                          <InputLabel>Estado</InputLabel>
                          <Select
                            label="Estado"
                            value={titulo.estado}
                            onChange={(e) => manejarCambioTitulo(index, 'estado', e.target.value)}
                          >
                            {estadosTitulo.map((estado) => (
                              <MenuItem key={estado.id} value={estado.nombre}>
                                {estado.nombre}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Col>
                    </Row>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">No tiene títulos registrados.</Typography>
                )}

                <Button variant="outlined" onClick={agregarTitulo} fullWidth>
                  Agregar otro título
                </Button>

                {/* Sección de Hoja de Vida */}
                <Typography variant="h6" className={`${styles.headingSmall} ${styles.textMuted} mb-2 mt-3`}>
                  Hoja de Vida
                </Typography>

                <Button className={styles.uploadButton} variant="contained" component="label" fullWidth>
                  {formData.curriculum ? 'Actualizar Hoja de Vida' : 'Subir Curriculum'}
                  <input type="file" name="curriculum" hidden accept=".pdf" onChange={handleFileChange} />
                </Button>

                <Typography variant="body2" color="textSecondary" align="center" marginTop="10px">
                  Subir documento en formato .pdf. Tamaño máximo 10MB.
                </Typography>

                {/* Botón para enviar */}
                <Button className={styles.submitButton} type="submit" variant="contained" fullWidth>
                  Guardar Cambios
                </Button>
              </Box>
            </Paper>
          </Col>
        </Row>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default ActualizarEgresado;
