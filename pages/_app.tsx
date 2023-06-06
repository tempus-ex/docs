import type { AppProps } from 'next/app';

import 'node_modules/highlight.js/styles/github.css';
import '../styles/global.scss';
import { DocsThemeContextProvider } from '@/components/Theme';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <DocsThemeContextProvider>
            <Component {...pageProps} />
        </DocsThemeContextProvider>
    );
}
