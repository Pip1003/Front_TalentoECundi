import React from 'react';
import Navbar from '../Navbar/Navbar';
import { Container } from 'react-bootstrap';
import styles from './styles.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div>
            <Navbar />
            <div className={styles.container}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
