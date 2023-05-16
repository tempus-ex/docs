import { Header as MantineHeader } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

import styles from './styles.module.scss';
import logo from '../../public/images/logo.svg';

export const Header = () => {
    return (
        <MantineHeader className={styles.header} height={64}>
            <Link className={styles['home-link']} href="/">
                <Image alt="Tempus Ex" className={styles.logo} src={logo} />
                <span>Tempus Ex Docs</span>
            </Link>
        </MantineHeader>
    )
};
