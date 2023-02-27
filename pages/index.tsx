import { HomePage } from '../components/HomePage';
import { canonicalContentPath } from '../lib/content';
import { getAllContent } from '../lib/content-loading';

export default HomePage;

export async function getStaticProps() {
    const allContent = await getAllContent();
    const source = allContent.get('/');
    return {
        props: {
            products: source.frontmatter.products.map((p) => {
                const path = canonicalContentPath(p.path);
                const content = allContent.get(path);
                return {
                    path,
                    title: content.frontmatter.title,
                    children: p.children?.map((c) => {
                        const path = canonicalContentPath(c);
                        const content = allContent.get(path);
                        return {
                            path,
                            title: content.frontmatter.title,
                        };
                    }) || [],
                };
            }),
        },
    };
}
