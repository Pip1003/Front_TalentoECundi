import axios from 'axios';
import { API_URL } from '../config'; 

export const RegistroEmpresaService = async (empresaData: any) => {
    try {
        const response = await axios.post(`${API_URL}/registro/empresa`, empresaData);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error en el servidor');
    }
};