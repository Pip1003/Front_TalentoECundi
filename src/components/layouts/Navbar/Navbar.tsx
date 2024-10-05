import React from "react";
import styles from "./styles.module.css";
import { IoNotifications } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import Avatar from '@mui/material/Avatar';

import { Image } from "react-bootstrap";

const Navbar = () => {
    return (
        <div className={styles.navbar_container}>
            <div className={styles.logo_container}>
                <div className={styles.img_container}>
                    <Image src={"/assets/ESCUDO_COLOR.png"} className={styles.image} alt="Logo" />
                </div>
                <h1 className={styles.titulo}> Talento E-Cundi </h1>
            </div>
            <div className={styles.options}>
                <IoNotifications className={styles.icons} />
                <Avatar className={styles.avatar} alt="Card Principal" src={"/assets/dummy_profile.jpg"} variant="rounded" />
                <IoLogOutOutline className={styles.icons} />
            </div>
        </div>
    );
};

export default Navbar;