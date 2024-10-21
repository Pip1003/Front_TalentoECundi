import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import Layout from '../../layouts/LayoutGeneral/Layout';
import { login } from '../../../Services/AuthService';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(email, password);
      if (response) {
        if (response.usuario.id_rol === 2) {
          navigate('/publicaciones');
        } else if (response.usuario.id_rol === 1) {
          navigate('/inicio');
        }
      }
      //console.log('Login exitoso:', response);

    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <Layout>
      <h2 className="text-center">Inicio de Sesión</h2>
      <Form onSubmit={handleSubmit} className="p-4 rounded">
        {error && <p className="text-danger text-center">{error}</p>}
        <Form.Group controlId="formEmail">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            placeholder="example@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100 mt-4">
          Iniciar Sesión
        </Button>
      </Form>
      <div className="text-center mt-2">
        <a href="/recuperar-contraseña" className="d-block mb-3">Recuperar Contraseña</a>
        <a href="/registro/seleccionar-rol" className="d-block">Registrarse</a>
      </div>
    </Layout>
  );
};

export default Login;
