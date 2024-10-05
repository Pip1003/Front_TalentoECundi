import React from 'react';
import './Layout.css';
import Logo from './../LogoCard/Logo';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout-container justify-content-center align-items-center">
      <Logo />
      <div className="content-container mt-4">{children}</div>
    </div>
  );
};

export default Layout;
