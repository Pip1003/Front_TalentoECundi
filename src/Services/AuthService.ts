import axios from 'axios';
import { API_URL } from '../config'; 

export const login = async (correo: string, contrasena: string) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/login`, {
      correo,
      contrasena,
    });

    const { token, usuario } = response.data; 

    // Guardar el token y los datos del usuario en localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario)); 

    // Asignar el token en la cabecera de las futuras peticiones
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Error en el servidor');
  }
};

export const getToken = () => {
  return localStorage.getItem('token');
};
