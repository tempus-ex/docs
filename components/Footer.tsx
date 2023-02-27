import { Text } from '@mantine/core';
import Image from 'next/image';

import logo from '../public/images/logo.svg';
import styles from '../styles/Footer.module.css';

export const Footer = () => {
    return (
        <footer className={styles.footer}>
            <Text color="dimmed" size="sm">
                ©{(new Date()).getFullYear()} Tempus Ex Machina, Inc.
            </Text>
        </footer>
    )
};
