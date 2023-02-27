import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';

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
                <title>{frontmatter.title}</title>
            </Head>
            <Header />
            <main>
                <MDXRemote {...props.source} />
            </main>
            <Footer />
        </>
    )
};
