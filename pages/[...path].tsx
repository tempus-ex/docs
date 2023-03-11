import { useRouter } from 'next/router';

import { DefaultPage, Props } from '../components/DefaultPage';
import { withAuth } from '../lib/auth';
import { canonicalContentPath } from '../lib/content';
import { getAllContent, getProductTableOfContents } from '../lib/content-loading';

export default DefaultPage;

interface Params {
    path: string[];
}

export const getServerSideProps = withAuth<Params, Props>(async function ({ req, res, params }) {
    if (!params) {
        return { notFound: true };
    }

    const allContent = await getAllContent();
    const tableOfContents = await getProductTableOfContents(params.path[0]);
    if (!tableOfContents) {
        return { notFound: true };
    }

    const path = '/' + params.path.join('/');
    const source = allContent.get(path);
    if (!source) {
        return { notFound: true };
    }

    return {
        props: {
            path,
            source,
            tableOfContents,
        },
    };
});
