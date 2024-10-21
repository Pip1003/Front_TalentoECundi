import React, { useEffect, useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
  MenuItem,
  Alert,
  Box,
  Grid,
} from '@mui/material';
import Layout from '../../../layouts/LayoutAuth/Layout';
import { crearPublicacion } from '../../../../Services/OfertaService';
import { obtenerDepartamentos, obtenerCiudades } from '../../../../Services/DireccionService';
import styles from './styles.module.css';

const CrearOferta: React.FC = () => {
  const [formData, setFormData] = useState({
    cargo: '',
    departamento: '',
    ciudad: '',
    direccion: '',
    id_modalidad: '',
    descripcion: '',
    fecha_cierre: '',
    salario: '',
    tipo_contrato: '',
    experiencia_requerida: '',
    hora_trabajo: '',
    vacantes_disponibles: '',
    habilidades: '',
    idiomas: '',
  });
  const [departamentos, setDepartamentos] = useState<Array<{ id: number; departamento: string }>>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const usuarioString = localStorage.getItem('usuario');
    let id_empresa: number | null = null;

    if (usuarioString) {
        const usuario = JSON.parse(usuarioString);
        id_empresa = usuario?.id_relacionado;
    }

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
    if (formData.departamento) {
      const cargarCiudades = async () => {
        try {
          const data = await obtenerCiudades(formData.departamento);
          setCiudades(data);
        } catch (err) {
          setError('Error al obtener las ciudades');
        }
      };
      cargarCiudades();
    } else {
      setCiudades([]);
    }
  }, [formData.departamento]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'departamento') {
      setFormData({ ...formData, [name]: value, ciudad: '' }); // Limpiar la ciudad al cambiar el departamento
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
  
    try {
      if (!id_empresa) {
        setError("Error: No se pudo determinar el ID de la empresa.");
        setLoading(false);
        return;
      }
  
      
      const datosOferta = {
        ...formData,
        id_empresa,
      };
  
      await crearPublicacion(datosOferta);
      setSuccess('Oferta de empleo creada exitosamente.');
      setFormData({
        cargo: '',
        departamento: '',
        ciudad: '',
        direccion: '',
        id_modalidad: '',
        descripcion: '',
        fecha_cierre: '',
        salario: '',
        tipo_contrato: '',
        experiencia_requerida: '',
        hora_trabajo: '',
        vacantes_disponibles: '',
        habilidades: '',
        idiomas: '',
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <Layout>
      <Container className="mt-4 mb-5">
        <Paper elevation={3} className={styles.container}>
          <Typography variant="h4" gutterBottom className={styles.title}>
            Crear Nueva Oferta de Empleo
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

          <form onSubmit={handleSubmit}>
            <TextField
              label="Cargo"
              name="cargo"
              value={formData.cargo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Departamento"
                  name="departamento"
                  value={formData.departamento}
                  onChange={handleChange}
                  select
                  fullWidth
                  margin="normal"
                  required
                  className={styles.input}
                >
                  {departamentos.map((dep) => (
                    <MenuItem key={dep.id} value={dep.departamento}>
                      {dep.departamento}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  select
                  fullWidth
                  margin="normal"
                  required
                  className={styles.input}
                  disabled={!formData.departamento}
                >
                  {ciudades.map((ciudad, index) => (
                    <MenuItem key={index} value={ciudad}>
                      {ciudad}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />
            <TextField
              label="Modalidad"
              name="id_modalidad"
              value={formData.id_modalidad}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              select
              className={styles.input}
            >
              <MenuItem value="1">Presencial</MenuItem>
              <MenuItem value="2">Remoto</MenuItem>
              <MenuItem value="3">Híbrido</MenuItem>
            </TextField>
            <TextField
              label="Descripción"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              multiline
              rows={4}
              className={styles.input}
            />
            <TextField
              label="Fecha de Cierre"
              name="fecha_cierre"
              value={formData.fecha_cierre}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="date"
              InputLabelProps={{ shrink: true }}
              className={styles.input}
            />
            <TextField
              label="Salario"
              name="salario"
              value={formData.salario}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />
            <TextField
              label="Tipo de Contrato"
              name="tipo_contrato"
              value={formData.tipo_contrato}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />
            <TextField
              label="Experiencia Requerida"
              name="experiencia_requerida"
              value={formData.experiencia_requerida}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />
            <TextField
              label="Horario de Trabajo"
              name="hora_trabajo"
              value={formData.hora_trabajo}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              className={styles.input}
            />
            <TextField
              label="Vacantes Disponibles"
              name="vacantes_disponibles"
              value={formData.vacantes_disponibles}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              type="number"
              className={styles.input}
            />
            <TextField
              label="Habilidades"
              name="habilidades"
              value={formData.habilidades}
              onChange={handleChange}
              fullWidth
              margin="normal"
              className={styles.input}
              placeholder="Ingrese habilidades separadas por comas"
            />
            <TextField
              label="Idiomas"
              name="idiomas"
              value={formData.idiomas}
              onChange={handleChange}
              fullWidth
              margin="normal"
              className={styles.input}
              placeholder="Ingrese idiomas separados por comas"
            />

            <Box mt={4} display="flex" justifyContent="center">
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className={styles.customButton}
              >
                {loading ? 'Creando...' : 'Crear Oferta'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </Layout>
  );
};

export default CrearOferta;
