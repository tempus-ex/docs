import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';

import logo from '../../public/images/logo.svg';
import styles from './styles.module.scss';
import { useDocsTheme } from '../Theme';

export const Header = () => {
    const { theme, setTheme } = useDocsTheme();

    const toggleDarkMode = (checked: boolean) => {
        setTheme(checked ? 'dark' : 'light');
    };

    return (
        <header
            className={clsx({
                [styles.header]: true,
                [styles['header--dark-mode']]: theme === 'dark',
            })}
        >
            <div className={styles['header__inner']}>
                <Link className={styles['header__link']} href="/">
                    <Image alt="Tempus Ex" className={styles['header__logo']} src={logo} />
                    <span className={styles['header__text']}>Documentation</span>
                </Link>
            </div>
        </header>
    );
};
