import clsx from 'clsx';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';

export type LoginAgreementProps = {
    setLoginState: (formState: 'login' | 'agreement') => void;
};

export const LoginAgreement = ({ setLoginState }: LoginAgreementProps) => {
    const router = useRouter();

    const declineAgreement = () => {
        cookie.remove('ffcookie');
        setLoginState('login');
    };

    const acceptAgreement = () => {
        cookie.set('ffagreement', 'true');
        const destination = new URLSearchParams(window.location.search).get('destination');
        router.push(destination || '/');
    };

    return (
        <>
            <iframe
                className={styles['agreement__iframe']}
                src={`./license-agreement.pdf#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0`}
            ></iframe>
            <div className={styles['agreement__button-row']}>
                <button
                    onClick={declineAgreement}
                    className={clsx({
                        [styles['button--bordered']]: true,
                        [styles['agreement__decline-button']]: true,
                    })}
                >
                    Decline
                </button>
                <button onClick={acceptAgreement} className={styles['button']}>
                    Accept
                </button>
            </div>
        </>
    );
};
