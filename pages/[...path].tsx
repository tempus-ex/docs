import { useRouter } from 'next/router';

import { DefaultPage } from '../components/DefaultPage';
import { canonicalContentPath } from '../lib/content';
import { getAllContent, getProductTableOfContents } from '../lib/content-loading';

export default DefaultPage;

interface Params {
    path: string[];
}

export async function getStaticProps({ params }: { params: Params }) {
    const allContent = await getAllContent();
    const tableOfContents = await getProductTableOfContents(params.path[0]);
    const path = '/' + params.path.join('/');
    const source = allContent.get(path);
    return {
        props: {
            path,
            source,
            tableOfContents,
        },
    };
}

export async function getStaticPaths() {
    const allContent = await getAllContent();
    const paths = Array.from(allContent.keys()).filter((p) => p !== '/').map((p) => ({
        params: {
            path: p.slice(1).split('/'),
        },
    }));
    return {
        paths,
        fallback: false,
    }
}
