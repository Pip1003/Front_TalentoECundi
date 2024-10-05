import React from 'react';
import { Image } from 'react-bootstrap';
import './Logo.css';

const Logo = () => {
  return (
    <div className="d-flex justify-content-center align-items-center mt-3 mb-4">
      <Image src="/assets/ESCUDO_COLOR.png" alt="Logo" className='logo-img' />
      <h1 className="titulo ms-3">Talento E-Cundi</h1>
    </div>
  );
};

export default Logo;