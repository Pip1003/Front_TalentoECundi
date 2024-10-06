import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/pages/Login/Login';
import RolSeleccion from './components/pages/RolSeleccion/RolSeleccion';
import RecuperacionContraseña from './components/pages/Recuperacion/RecuperarContraseña';
import Reestablecer from './components/pages/ReestablecerContraseña/Reestablecer';
import RegistroEgresado from './components/pages/Registro/RegistroEgresado/RegistroEgresado';
import RegistroEmpresa from './components/pages/Registro/RegistroEmpresa/RegistroEmpresa';
import Ofertas from './components/pages/Inicio-Egresado/Ofertas';
import AuthGuard from './Guard/AuthGuard';
import Test from './components/pages/TestEgresado/Test';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro/seleccionar-rol" element={<RolSeleccion />} />
        <Route path="/recuperar-contraseña" element={<RecuperacionContraseña />} />
        <Route path="/reestablecer-contraseña" element={<Reestablecer />} />
        <Route path="/registro-egresado" element={<RegistroEgresado />} />
        <Route path="/registro-empresa" element={<RegistroEmpresa />} />
        <Route path="/inicio" element={ <AuthGuard requiredRole={1}><Ofertas /></AuthGuard>} />
        <Route path="/test" element={ <AuthGuard requiredRole={1}><Test /></AuthGuard>} />
      </Routes>
    </Router>
  );
};

export default App;
