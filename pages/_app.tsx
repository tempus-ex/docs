import { MantineProvider } from '@mantine/core';
import type { AppProps } from 'next/app';

import '../node_modules/highlight.js/styles/github.css';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'light',
                globalStyles: (theme) => ({
                    a: {
                        textDecoration: 'none',
                    },
                }),
            }}
        >
            <Component {...pageProps} />
        </MantineProvider>
    );
}
