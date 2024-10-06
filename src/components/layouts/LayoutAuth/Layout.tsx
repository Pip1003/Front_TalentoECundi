import React from 'react';
import Navbar from '../Navbar/Navbar';
import styles from './styles.module.css';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className={styles.content}>
            <Navbar />
            <div className={styles.container}>
                <div className='mt-4'>{children}</div>
            </div>
        </div>
    );
};

export default Layout;
