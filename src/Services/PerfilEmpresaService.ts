import axios from 'axios';

import { API_URL } from '../config';

export const obtenerPerfilEmpresa = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/perfilEmpresa/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el perfil de la empresa:', error);
    throw error;
  }
};

export const actualizarPerfilEmpresa = async (idEmpresa: number, perfil: any) => {
  const formData = new FormData();

  formData.append('nit', perfil.nit);
  formData.append('nombre', perfil.nombre);
  formData.append('telefono', perfil.telefono);
  formData.append('correo_contacto', perfil.correo_contacto);
  formData.append('pagina_web', perfil.pagina_web);
  formData.append('descripcion', perfil.descripcion);
  formData.append('ciudad', perfil.ciudad);
  formData.append('departamento', perfil.departamento);
  formData.append('direccion', perfil.direccion);

  if (perfil.logo) {
      formData.append('logo', perfil.logo);
  }

  if (perfil.banner) {
      formData.append('banner', perfil.banner);
  }

  try {
      const response = await axios.put(`${API_URL}/perfilEmpresa/${idEmpresa}`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });
      return response.data;
  } catch (error) {
      console.error('Error al actualizar el perfil de la empresa:', error);
      throw error;
  }
};