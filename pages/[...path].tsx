import { useRouter } from 'next/router';

import { DefaultPage, Props } from '../components/DefaultPage';
import { canonicalContentPath } from '../lib/content';
import { getAllContent, getProductTableOfContents } from '../lib/content-loading';

export default DefaultPage;

interface Params {
    path: string[];
}

export const getStaticProps = async function ({ params }: { params: Params }) {
    if (!params) {
        return { notFound: true };
    }

    const allContent = await getAllContent();
    const tableOfContents = await getProductTableOfContents(params.path[0]);
    if (!tableOfContents) {
        return { notFound: true };
    }

    const path = '/' + params.path.join('/');
    const content = allContent.get(path);
    if (!content) {
        return { notFound: true };
    }

    return {
        props: {
            path,
            filePath: content.filePath,
            source: content.source,
            tableOfContents,
            headings: content.headings,
        },
    };
};

export const getStaticPaths = async function () {
    const allContent = await getAllContent();

    return {
        fallback: false,
        paths: Array.from(allContent.keys()).filter((key) => ![
            '/',
            '/fusionfeed/rest/explorer-and-reference',
            '/fusionfeed/graphql/explorer-and-reference',
        ].includes(key)).map((key) => ({
            params: {
                path: canonicalContentPath(key).split('/').slice(1),
            },
        })),
    };
};
