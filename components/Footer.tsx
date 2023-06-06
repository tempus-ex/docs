import { createStyles, Text } from '@mantine/core';
import Image from 'next/image';

import styles from '../styles/Footer.module.css';

const useStyles = createStyles((theme) => ({
    footer: {
        height: 64,
        padding: 16,
        marginTop: 16,
        textAlign: 'right',
    },
}));

export const Footer = () => {
    const { classes } = useStyles();

    return (
        <footer className={classes.footer}>
            <Text color="dimmed" size="sm">
                ©{new Date().getFullYear()} Tempus Ex Machina, Inc.
            </Text>
        </footer>
    );
};
