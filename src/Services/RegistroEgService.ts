import axios from 'axios';
import { API_URL } from '../config'; 

export const RegistroEgresadoService = async (egresadoData: any) => {
    try {
        const response = await axios.post(`${API_URL}/registro/egresado`, egresadoData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
};
