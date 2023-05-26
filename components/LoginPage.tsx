import { useState } from 'react';
import { Alert, createStyles, Container, PasswordInput } from '@mantine/core';
import Head from 'next/head';

import { Footer } from './Footer';
import { Header } from './Header';

import { validateFusionFeedToken } from '../lib/fusionfeed';

const useStyles = createStyles((theme) => ({
    alert: {
        marginBottom: theme.spacing.md,
    },
    wrapper: {
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },
}));

export const LoginPage = () => {
    const { classes } = useStyles();

    const [isBusy, setIsBusy] = useState(false);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const login = () => {
        setIsBusy(true);
        setErrorMessage('');

        validateFusionFeedToken(token)
            .then((ok) => {
                if (ok) {
                    document.cookie = 'fftoken=' + token;
                    const destination = (new URLSearchParams(window.location.hash.slice(1))).get('destination');
                    window.location.href = destination || '/';
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
            <Head>
                <title>Tempus Ex Documentation</title>
            </Head>
            <Header />
            <main>
                <Container className={classes.wrapper}>
                    {errorMessage && (
                        <Alert className={classes.alert} color="red">{errorMessage}</Alert>
                    )}
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        login();
                    }}>
                        <PasswordInput
                            disabled={isBusy}
                            onChange={(e) => setToken(e.currentTarget.value)}
                            placeholder="FusionFeed Token"
                            value={token}
                        />
                    </form>
                </Container>
            </main>
            <Footer />
        </>
    )
};
