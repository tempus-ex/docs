import { API } from '@stoplight/elements';
import getConfig from 'next/config';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { useEffect, useRef, useState } from 'react';

import { Footer } from '../Footer';
import { Header } from '../Header';

import styles from './styles.module.scss';

const { publicRuntimeConfig } = getConfig();

export interface Props {
    source: MDXRemoteSerializeResult;
}

const getToken = () =>
    document.cookie
        .split('; ')
        .find((row) => row.startsWith('fftoken='))
        ?.split('=')[1];

const getAuthorization = () => {
    const token = getToken();
    if (!token) {
        return '';
    }
    const tokenType = token.includes('.') ? 'Bearer' : 'token';
    return `${tokenType} ${token}`;
};

const specUrl = `${publicRuntimeConfig.fusionFeedUrl}/v2/openapi.json`;

function redactFromNode(node: Node, sensitiveText: string, replacement: string) {
    if (node.hasChildNodes()) {
        node.childNodes.forEach((child) => {
            redactFromNode(child, sensitiveText, replacement);
        });
    } else if (node.textContent?.includes(sensitiveText)) {
        node.textContent = node.textContent.replaceAll(sensitiveText, replacement);
    }
}

export const RESTExplorerPage = (props: Props) => {
    const wrapperRef = useRef(null);
    const [spec, setSpec] = useState('');

    useEffect(() => {
        // Get credentials and configure the explorer.
        const authorization = getAuthorization();
        if (!authorization) {
            alert('Please authenticate to view this page.');
            return;
        }

        window.localStorage.setItem(
            'TryIt_securitySchemeValues',
            JSON.stringify({
                ApiKeyAuth: authorization,
            }),
        );

        // Fetch the spec.
        fetch(specUrl, {
            headers: {
                authorization,
            },
        })
            .then((res) => res.json())
            .then((spec) => {
                if (spec.servers.length === 1) {
                    spec.servers[0].url = publicRuntimeConfig.fusionFeedUrl + spec.servers[0].url;
                }
                setSpec(spec);
            })
            .catch((err) => alert(err));

        // Censor the credentials wherever they appear in the explorer.
        const sensitiveText = authorization;
        const replacement = 'INSERT_YOUR_AUTHORIZATION_HERE';
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'characterData') {
                    redactFromNode(mutation.target, sensitiveText, replacement);
                } else if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        redactFromNode(node, sensitiveText, replacement);
                    });
                }
            }
        });
        if (wrapperRef.current) {
            observer.observe(wrapperRef.current, {
                characterData: true,
                childList: true,
                subtree: true,
            });
        }
        return () => observer.disconnect();
    }, []);

    const frontmatter = props.source.frontmatter;

    return (
        <>
            <Head>
                <title>{frontmatter?.title as string}</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.wrapper + ' elements-api'} ref={wrapperRef}>
                    {spec && <API apiDescriptionDocument={spec} router="hash" />}
                </div>
            </main>
            <Footer />
        </>
    );
};
