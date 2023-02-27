import { Header as MantineHeader } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

import logo from '../public/images/logo.svg';
import styles from '../styles/Header.module.css';

export const Header = () => {
    return (
        <MantineHeader className={styles.header}>
            <Link className={styles['home-link']} href="/">
                <Image alt="Tempus Ex" className={styles.logo} src={logo} />
                <span>Tempus Ex Docs</span>
            </Link>
        </MantineHeader>
    )
};
