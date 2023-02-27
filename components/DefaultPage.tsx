import Head from 'next/head';
import { MDXRemote } from 'next-mdx-remote';

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
            <main>
                <MDXRemote {...props.source} />
            </main>
        </>
    )
};
