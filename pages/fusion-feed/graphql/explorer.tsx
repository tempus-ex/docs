import { GraphQLExplorerPage, Props } from '../../../components/GraphQLExplorerPage';
import { withAuth } from '../../../lib/auth';
import { getAllContent } from '../../../lib/content-loading';

export default GraphQLExplorerPage;

export const getServerSideProps = withAuth<{}, Props>(async function ({ params }) {
    const allContent = await getAllContent();
    const source = allContent.get(`/fusion-feed/graphql/explorer`);
    if (!source) {
        return { notFound: true };
    }

    return {
        props: {
            source,
        },
    };
});
