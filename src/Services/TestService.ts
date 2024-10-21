import axios from 'axios';
import { API_URL } from '../config'; 

export const obtenerTestConDetalles = async (idTest: any) => {
    try {
        const response = await axios.get(`${API_URL}/test/${idTest}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el test con detalles', error);
        throw error;
    }
};

export const enviarRespuestasTest = async (idTest: any, idEgresado: number, respuestas: any) => {
    try {
        const response = await axios.post(`${API_URL}/test/${idTest}/respuestas`, {
            egresado_id: idEgresado,
            respuestas,
        });
        return response.data; 
    } catch (error) {
        console.error('Error al enviar respuestas', error);
        throw error;
    }
};

export const obtenerResultadosTest = async (idEgresado: number) => {
    try {
        const response = await axios.get(`${API_URL}/test/${idEgresado}/resultados`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los resultados del test', error);
        throw error;
    }
};