import { useRouter } from 'next/router';

import { DefaultPage } from '../components/DefaultPage';
import { canonicalContentPath } from '../lib/content';
import { getAllContent } from '../lib/content-loading';

export default DefaultPage;

interface Params {
    path: string[];
}

export async function getStaticProps({ params }: { params: Params }) {
    const allContent = await getAllContent();
    const source = allContent.get('/' + params.path.join('/'));
    return {
        props: {
            source,
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
