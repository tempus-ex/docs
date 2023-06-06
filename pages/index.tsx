import { HomePage } from '../components/HomePage';
import { withAuth } from '../lib/auth';

export default HomePage;

export const getServerSideProps = withAuth(async function () {
    return {
        props: {},
    };
});
