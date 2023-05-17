import styles from './styles.module.scss';

export const Footer = () => {

    return (
        <footer className={styles.footer}>
            ©{(new Date()).getFullYear()} Tempus Ex Machina, Inc.
        </footer>
    )
};
