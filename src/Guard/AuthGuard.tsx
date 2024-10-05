import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: number;
}

function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('usuario');
  const usuario = storedUser ? JSON.parse(storedUser) : null;
  const navigate = useNavigate();

  console.log(requiredRole);
  console.log(usuario);

  useEffect(() => {
    if (!token) {
      navigate("/"); // Si no hay token, redirige al login
    } else if (requiredRole && usuario?.id_rol !== requiredRole) {
      navigate("/"); // Si no tiene el rol requerido, redirige al login u otra página
    }
  }, [token, requiredRole, usuario, navigate]);

  if (!token || (requiredRole && usuario?.id_rol !== requiredRole)) {
    return null; // No renderiza nada si no está autenticado o no tiene el rol requerido
  }

  return <>{children}</>;
}

export default AuthGuard;
