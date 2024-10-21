import axios from 'axios';
import { API_URL } from '../config';


export const obtenerPublicacionesPorEmpresa = async (id_empresa: number) => {
  try {
    const response = await axios.get(`${API_URL}/verPublicaciones/${id_empresa}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener las publicaciones de empleo');
  }
};

export const crearPublicacion = async (datosOferta: any) => {
  try {
    const response = await axios.post(`${API_URL}/crearOferta`, datosOferta);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al crear la oferta de empleo');
  }
};

export const editarPublicacion = async (id_empresa: number, id_oferta: number, datosOferta: any) => {
  try {
    const response = await axios.put(`${API_URL}/editarOferta/${id_empresa}/${id_oferta}`, datosOferta);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al editar la oferta de empleo');
  }
};

export const eliminarPublicacion = async (id_empresa: number, id_oferta: number) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminarOferta/${id_empresa}/${id_oferta}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al eliminar la oferta de empleo');
  }
};

export const cerrarOferta = async (id_empresa: number, id_oferta: number) => {
  try {
    const response = await axios.patch(`${API_URL}/cerrarOferta/${id_empresa}/${id_oferta}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al cerrar la oferta de empleo');
  }
};

export const obtenerPublicacionesGenerales = async () => {
  try {
    const response = await axios.get(`${API_URL}/verPublicacionesGenerales`);
    return response.data.ofertas;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error al obtener las publicaciones generales');
  }
};

export const filtrarOfertas = async (params: {
  salario_minimo?: string;
  salario_maximo?: string;
  id_modalidad?: string;
  tipo_contrato?: string;
  hora_trabajo?: string;
  habilidades?: string;
}) => {
  try {
    const response = await axios.get(`${API_URL}/filtrarOfertas`, { params });
    return response.data;
  } catch (error) {
    console.error('Error al filtrar las ofertas:', error);
    throw new Error('No se pudieron filtrar las ofertas. Inténtelo más tarde.');
  }
};
