import { Container } from '@mantine/core';
import Head from 'next/head';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { Footer } from './Footer';
import { Header } from './Header';

interface Props {
    source: MDXRemoteSerializeResult;
}

export const DefaultPage = (props: Props) => {
    const frontmatter = props.source.frontmatter;

    return (
        <>
            <Head>
                <title>{frontmatter?.title}</title>
            </Head>
            <Header />
            <main>
                <Container>
                    <MDXRemote {...props.source} />
                </Container>
            </main>
            <Footer />
        </>
    )
};
