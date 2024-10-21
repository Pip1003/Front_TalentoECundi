import React from 'react';
import { useLocation } from 'react-router-dom';

const PDFViewer: React.FC = () => {
  const location = useLocation();
  const { state } = location;

  // Extraer el archivo PDF en base64 desde el estado
  const pdfBase64 = state?.pdfBase64;

  if (!pdfBase64) {
    return <div>No se pudo cargar el PDF.</div>;
  }

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <iframe
        title="Currículum PDF"
        src={`data:application/pdf;base64,${pdfBase64}`}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
      />
    </div>
  );
};

export default PDFViewer;
