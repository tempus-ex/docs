import Link from 'next/link';
import styles from './styles.module.scss';

export const LoginFooter = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles['footer__links']}>
                <Link className={styles['footer__link']} href="https://tempus-ex.com/">
                    Home
                </Link>
                <Link className={styles['footer__link']} href="./license-agreement.pdf" target="blank">
                    Terms & Privacy
                </Link>
                <Link className={styles['footer__link']} href="mailto:support@tempus-ex.com">
                    Contact
                </Link>
            </div>
            <p className={styles['footer__patent']}>Protected by U.S. Patent Nos. 11,140,328 & 11,172,248</p>
        </footer>
    );
};
