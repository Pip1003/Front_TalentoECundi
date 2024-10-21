import axios from 'axios';
import { API_URL } from '../config';


export const ObtenerPerfilEgresado = async (id_egresado: number) => {
    try {
        const response = await axios.get(`${API_URL}/perfilEgresado/${id_egresado}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener el perfil del egresado');
    }
};

export const obtenerPerfil = async (id_egresado: number) => {
    try {
        const response = await axios.get(`${API_URL}/perfilEgresado/actualizar/${id_egresado}`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener los datos del perfil');
    }
};


export const obtenerTitulos = async () => {
    try {
        const response = await axios.get(`${API_URL}/titulos`);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al obtener los títulos disponibles');
    }
};

export const actualizarPerfilEgresado = async (id_egresado: number, perfilData: any) => {
    try {
        console.log(perfilData);
        const response = await axios.put(`${API_URL}/perfilEgresado/${id_egresado}`, perfilData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al actualizar el perfil del egresado');
    }
};