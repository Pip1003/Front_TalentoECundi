import axios from 'axios';
import { API_URL } from '../config';

export const obtenerPostulados = async (id_oferta: number, id_empresa: number) => {
  try {
    const response = await axios.get(`${API_URL}/empresa/${id_empresa}/oferta/${id_oferta}/egresadosPostulados`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener los postulados');
  }
};

export const rechazarPostulacion = async (id_inscripcion: number) => {
  try {
    const response = await axios.patch(`${API_URL}/inscripcion/${id_inscripcion}/rechazar`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al rechazar la postulación');
  }
};

export const pasarSegundaFase = async (id_inscripcion: number) => {
  try {
    const response = await axios.patch(`${API_URL}/inscripcion/${id_inscripcion}/segundaFase`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al pasar a segunda fase');
  }
};

export const obtenerInscripcionesEgresado = async (id_egresado: number) => {
  try {
    const response = await axios.get(`${API_URL}/verInscripciones/${id_egresado}`);
    return response.data.inscripciones;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener las inscripciones del egresado');
  }
};

export const inscribirOferta = async (id_egresado: number, id_oferta: number) => {
  try {
    const response = await axios.post(`${API_URL}/inscribir`, {
      id_egresado,
      id_oferta,
    });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error('Error desconocido al inscribirse en la oferta');
    }
  }
};
export const eliminarInscripcion = async (idEgresado: number, idInscripcion: number) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminarInscripcion/${idEgresado}/${idInscripcion}`);
    return response.data;
  } catch (error) {
    throw new Error('Error al eliminar la inscripción');
  }
};

