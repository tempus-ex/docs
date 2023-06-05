import { RESTExplorerPage, Props } from '../../../components/RESTExplorerPage';
import { withAuth } from '../../../lib/auth';
import { getAllContent } from '../../../lib/content-loading';

export default RESTExplorerPage;

export const getServerSideProps = withAuth<{}, Props>(async function ({ params }) {
    const allContent = await getAllContent();
    const content = allContent.get(`/fusionfeed/rest/explorer-and-reference`);
    if (!content) {
        return { notFound: true };
    }

    return {
        props: {
            source: content.source,
        },
    };
});
