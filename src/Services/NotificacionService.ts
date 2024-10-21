import axios from 'axios';

import { API_URL } from '../config';


export const obtenerNotificaciones = async (idUsuario: number) => {
  try {
    const response = await axios.get(`${API_URL}/notificaciones/${idUsuario}`);
    return response.data.notificaciones;
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    throw error;
  }
};


export const actualizarEstadoNotificaciones = async (idUsuario: number, notificacionesIds: number[]) => {
  try {
    await axios.put(`${API_URL}/notificaciones/${idUsuario}`, { notificacionesIds });
  } catch (error) {
    console.error('Error al actualizar el estado de las notificaciones:', error);
    throw error;
  }
};