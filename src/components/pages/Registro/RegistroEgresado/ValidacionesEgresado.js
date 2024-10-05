// utils/validations.js
export const validateEgresadoForm = (formData) => {
    let errors = {};

    if (!formData.nombres.trim()) {
        errors.nombres = 'El campo de nombres es requerido';
    }
    if (!formData.apellidos.trim()) {
        errors.apellidos = 'El campo de apellidos es requerido';
    }
    if (!formData.codigo_estudiante.trim()) {
        errors.codigo_estudiante = 'El código de estudiante es requerido';
    }
    if (!formData.fecha_nacimiento) {
        errors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    }
    if (!formData.genero) {
        errors.genero = 'El género es requerido';
    }
    if (!formData.ano_graduacion) {
        errors.ano_graduacion = 'El año de graduación es requerido';
    }
    if (!formData.correo.trim()) {
        errors.correo = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
        errors.correo = 'El correo no es válido';
    }
    if (!formData.contrasena.trim()) {
        errors.contrasena = 'La contraseña es requerida';
    } else if (formData.contrasena.length < 6) {
        errors.contrasena = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (formData.contrasena !== formData.confirmarContrasena) {
        errors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    return errors;
};
