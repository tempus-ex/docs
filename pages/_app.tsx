import { MDXProvider } from '@mdx-js/react'
import type { AppProps } from 'next/app';

import 'node_modules/highlight.js/styles/github.css';
import '../styles/global.scss';
import { DocsThemeContextProvider } from '@/components/Theme';
import { GraphQLExample } from '@/components/GraphQLExample';

const components = {
    GraphQLExample,
};

export default function App({ Component, pageProps }: AppProps) {
    return (
        <DocsThemeContextProvider>
            <MDXProvider components={components}>
                <Component {...pageProps} />
            </MDXProvider>
        </DocsThemeContextProvider>
    );
}
