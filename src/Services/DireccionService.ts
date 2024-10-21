import axios from 'axios';
import { API_URL } from '../config'; 


export const obtenerDepartamentos = async () => {
  try {
    const response = await axios.get(`${API_URL}/departamentos`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener departamentos');
  }
};

export const obtenerCiudades = async (departamento: any) => {
  try {
    const response = await axios.get(`${API_URL}/ciudades/${departamento}`);
    return response.data;
  } catch (error: any) {
    throw new Error('Error al obtener municipios');
  }
};
