import { useState } from 'react';
import { Alert } from '@mantine/core';
import Link from 'next/link';
import clsx from 'clsx';
import cookie from 'js-cookie';

import { getDestination } from '.';
import { validateFusionFeedToken } from '../../lib/fusionfeed';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

export type LoginFormProps = {
    setLoginState: (formState: 'login' | 'agreement') => void;
};

export const LoginForm = ({ setLoginState }: LoginFormProps) => {
    const [isBusy, setIsBusy] = useState(false);
    const [remember, setRemember] = useState(false);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();

    const login = () => {
        setIsBusy(true);
        setErrorMessage('');

        validateFusionFeedToken(token)
            .then((ok) => {
                if (ok) {
                    cookie.set('fftoken', token, {
                        expires: remember ? 30 : undefined,
                    });
                    const agreement = cookie.get('ffagreement');
                    if (!agreement) {
                        setLoginState('agreement');
                    } else {
                        router.push(getDestination());
                    }
                } else {
                    setErrorMessage('Invalid token.');
                    setIsBusy(false);
                }
            })
            .catch((e) => {
                setErrorMessage('An unexpected error occurred: ' + e.message);
                setIsBusy(false);
            });
    };

    return (
        <>
            <h4 className={styles['title']}>Sign In</h4>
            {errorMessage && (
                <Alert className={styles['form__alert']} color="red">
                    {errorMessage}
                </Alert>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
                className={styles.form}
            >
                <input
                    type="password"
                    disabled={isBusy}
                    autoComplete="current-password"
                    className={clsx({
                        [styles['form__key-input']]: true,
                        [styles['form__key-input--error']]: errorMessage,
                    })}
                    onChange={(e) => setToken(e.currentTarget.value)}
                    placeholder="Enter Your API Key"
                    value={token}
                />

                <label className={styles['form__remember']}>
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => {
                            setRemember(e.target.checked);
                        }}
                    />
                    {`Remember Me`}
                </label>

                <button type="submit" className={styles.button}>
                    Sign In
                </button>
            </form>
            <p>
                We&apos;d love to help you get started with our API!
                <Link className={styles['form__contact-link']} href={`mailto:support@tempus-ex.com`}>
                    Contact Us
                </Link>
            </p>
        </>
    );
};
