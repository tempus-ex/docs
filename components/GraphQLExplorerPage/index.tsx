import { useEffect, useState } from 'react';
import { useTheme } from '@graphiql/react';
import { createGraphiQLFetcher, Fetcher } from '@graphiql/toolkit';
import GraphiQL from 'graphiql';
import getConfig from 'next/config';
import cookie from 'js-cookie';
import Head from 'next/head';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

import styles from './styles.module.scss';
import 'node_modules/graphiql/graphiql.css';

import { Footer } from '../Footer';
import { Header } from '../Header';
import { useDocsTheme } from '../Theme';

const { publicRuntimeConfig } = getConfig();

export interface Props {
    source: MDXRemoteSerializeResult;
}

export const GraphQLExplorerPage = ({ source: { frontmatter } }: Props) => {
    const [ fetcher, setFetcher ] = useState<Fetcher | null>(null);
    const { setTheme } = useTheme();
    const { theme: docsTheme } = useDocsTheme();
    const [ query, setQuery ] = useState<string | undefined>(undefined);
    const [ variables, setVariables ] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (fetcher) {
            setTheme(docsTheme);
        }
    }, [docsTheme, fetcher, setTheme]);

    useEffect(() => {
        const { hash } = window.location;

        if (hash) {
            const params = new URLSearchParams(hash.slice(1));
            const query = params.get('query');
            if (query) {
                setQuery(query);
                setVariables('');
                if ('pushState' in window.history) {
                    window.history.pushState('', document.title, window.location.pathname + window.location.search);
                } else {
                    window.location.hash = '';
                }
            }
        }

        const url = publicRuntimeConfig.fusionFeedUrl + '/v2/graphql';
        const subscriptionUrl = publicRuntimeConfig.fusionFeedUrl + '/v2/graphql-ws';
        const token = cookie.get('fftoken');
        setFetcher(() =>
            createGraphiQLFetcher({
                headers: {
                    Authorization: `token ${token}`,
                },
                subscriptionUrl,
                url,
                wsConnectionParams: {
                    Authorization: `token ${token}`,
                },
            }),
        );
    }, []);

    return (
        <>
            <Head>
                <title>{frontmatter?.title as string}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.wrapper}>{fetcher && (
                    <GraphiQL
                        fetcher={fetcher}
                        query={query}
                        variables={variables}
                    />
                )}</div>
            </main>
            <Footer />
        </>
    );
};
