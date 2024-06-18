import Head from 'next/head';
import Image from 'next/image';

import LogoBlack from '../../public/images/logo-black.svg';
import styles from './styles.module.scss';
import { LoginFooter } from './LoginFooter';
import { LoginForm } from './LoginForm';
import { useState } from 'react';
import { LoginAgreement } from './LoginAgreement';

export const getDestination = () => {
    const unsafeDestination = window.location.hash.length > 1 && new URLSearchParams(window.location.hash.slice(1)).get('destination');
    if (unsafeDestination && unsafeDestination.startsWith('/') && !unsafeDestination.startsWith('//') && !unsafeDestination.includes('\\')) {
        return unsafeDestination;
    }
    return '/';
};

export const LoginPage = () => {
    const [loginState, setLoginState] = useState<'login' | 'agreement'>('login');

    return (
        <>
            <Head>
                <title>Tempus Ex Documentation</title>
            </Head>
            <main className={styles.main}>
                <Image
                    priority
                    className={styles.logo}
                    src={LogoBlack}
                    height="84"
                    width="205"
                    alt="FusionFeed logo"
                ></Image>
                <div className={styles.wrapper}>
                    {loginState === 'login' && <LoginForm setLoginState={setLoginState} />}
                    {loginState === 'agreement' && <LoginAgreement setLoginState={setLoginState} />}
                </div>
            </main>
            <LoginFooter />
        </>
    );
};
