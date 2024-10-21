import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './styles.module.css';

interface Empresa {
  nombre: string;
  logo: string | null;
}

interface Oferta {
  id: number;
  cargo: string;
  descripcion: string;
  id_modalidad: number;
  fecha_publicacion: string;
  fecha_cierre: string;
  salario: string;
  tipo_contrato: string;
  experiencia_requerida: string;
  hora_trabajo: string;
  habilidades: string;
  idiomas: string;
  empresa: Empresa;
}

interface OfertaModalProps {
  show: boolean;
  onHide: () => void;
  oferta: Oferta | null;
}

const OfertaModal: React.FC<OfertaModalProps> = ({ show, onHide, oferta }) => {
  if (!oferta) return null;

  const modalidadDescripcion = (id_modalidad: number) => {
    switch (id_modalidad) {
      case 1:
        return 'Presencial';
      case 2:
        return 'Remoto';
      case 3:
        return 'Híbrido';
      default:
        return 'Desconocido';
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{oferta.cargo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className={styles.modalContent}>
          <p><strong>Empresa:</strong> {oferta.empresa.nombre}</p>
          <p><strong>Fecha de publicación:</strong> {new Date(oferta.fecha_publicacion).toLocaleDateString()}</p>
          <p><strong>Fecha de cierre:</strong> {new Date(oferta.fecha_cierre).toLocaleDateString()}</p>
          <p><strong>Descripción:</strong> {oferta.descripcion}</p>
          <p><strong>Habilidades:</strong> {oferta.habilidades}</p>
          <p><strong>Idiomas:</strong> {oferta.idiomas}</p>
          <p><strong>Experiencia requerida:</strong> {oferta.experiencia_requerida}</p>
          <p><strong>Tipo de contrato:</strong> {oferta.tipo_contrato}</p>
          <p><strong>Horario de trabajo:</strong> {oferta.hora_trabajo}</p>
          <p><strong>Modalidad:</strong> {modalidadDescripcion(oferta.id_modalidad)}</p>
          <p><strong>Salario:</strong> {oferta.salario} COP</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfertaModal;
