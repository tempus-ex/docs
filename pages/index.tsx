import {promises as fs} from 'fs';
import Head from 'next/head'
import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemote } from 'next-mdx-remote'

export default function Home(props) {
    return (
        <>
            <Head>
                <title>Tempus Ex Docs</title>
            </Head>
            <main>
                <MDXRemote {...props.source} />
            </main>
        </>
    )
}

export async function getStaticProps() {
    const source = await fs.readFile('content/index.mdx', 'utf8');
    const mdxSource = await serialize(source, { parseFrontmatter: true });
    return { props: { source: mdxSource } };
}
