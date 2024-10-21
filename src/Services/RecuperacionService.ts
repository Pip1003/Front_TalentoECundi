import axios from 'axios';
import { API_URL } from '../config';

export const solicitarRecuperacion = async (data: { correo: string }) => {
    try {
        const response = await axios.post(`${API_URL}/recuperar`, data);
        return response.data; 
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
};

export const verificarCodigoRecuperacion = async (data: { token: string; codigoIngresado: string }) => {
    try {
        const response = await axios.post(`${API_URL}/verificar-codigo`, data);
        // Guardar el token en el sessionStorage
        if (response.data.token) {  
            sessionStorage.setItem('token', response.data.token);
        }

        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
};

export const cambiarContraseña = async (data: { token: any; nuevaContrasena: string; confirmarContrasena: string }) => {
    try {
        const response = await axios.post(`${API_URL}/cambiar-contrasena`, data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
};

