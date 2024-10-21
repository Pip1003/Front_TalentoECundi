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
import TestEgresado from './components/pages/TestEgresado/Test';
import ResultadosTest from './components/pages/ResultadosTest/ResultadosTest';
import PerfilEgresadoPage from './components/pages/PerfilEgresado/PerfilEgresado';
import ActualizarEgresado from './components/pages/PerfilEgresado/ActualizarDatos/ActualizarEgresado';
import PublicacionCard from './components/pages/Publicaciones-Empresa/PublicacionesCard/PublicacionCard';
import CrearOferta from './components/pages/Publicaciones-Empresa/CrearOferta/CrearOferta';
import VerPostulados from './components/pages/Publicaciones-Empresa/VerPostulados/VerPostulados';
import VerPerfilEgresado from './components/pages/Publicaciones-Empresa/PerfilEgresado/VerPerfilEgresado';
import PerfilEmpresaPage from './components/pages/PerfilEmpresa/PerfilEmpresa';
import ActualizarEmpresa from './components/pages/PerfilEmpresa/ActualizarDatos/ActualizarEmpresa';
import PdfViewer from './components/pages/PerfilEgresado/VerPDF/PDFViewer';

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
        <Route path="/perfilEgresado" element={ <AuthGuard requiredRole={1}><PerfilEgresadoPage /></AuthGuard>} />
        <Route path="/actualizar-perfil-egresado" element={ <AuthGuard requiredRole={1}><ActualizarEgresado /></AuthGuard>} />
        <Route path="/test" element={ <AuthGuard requiredRole={1}><TestEgresado /></AuthGuard>} />
        <Route path="/resultadosTest" element={ <AuthGuard requiredRole={1}><ResultadosTest /></AuthGuard>} />
        <Route path="/visualizar-cv" element={<PdfViewer />} />

        <Route path="/publicaciones" element={ <AuthGuard requiredRole={2}><PublicacionCard /></AuthGuard>} />
        <Route path="/crear-oferta" element={ <AuthGuard requiredRole={2}><CrearOferta /></AuthGuard>} />
        <Route path="/ver-postulados/:id_oferta" element={ <AuthGuard requiredRole={2}><VerPostulados /></AuthGuard>} />
        <Route path="/ver-perfil-egresado/:id_egresado" element={ <AuthGuard requiredRole={2}><VerPerfilEgresado /></AuthGuard>} />
        <Route path="/perfilEmpresa" element={ <AuthGuard requiredRole={2}><PerfilEmpresaPage /></AuthGuard>} />
        <Route path="/actualizar-perfil-empresa" element={ <AuthGuard requiredRole={2}><ActualizarEmpresa /></AuthGuard>} />
      </Routes>
    </Router>
  );
};

export default App;
