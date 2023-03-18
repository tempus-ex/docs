import { HomePage, Props } from '../components/HomePage';
import { withAuth } from '../lib/auth';
import { canonicalContentPath, Frontmatter } from '../lib/content';
import { getAllContent } from '../lib/content-loading';

export default HomePage;

interface ProductFrontmatter {
    path: string;
    icon: string;
    description: string;
    children: string[];
}

interface HomePageFrontmatter extends Frontmatter {
    products: ProductFrontmatter[];
}

export const getServerSideProps = withAuth<{}, Props>(async function () {
    const allContent = await getAllContent();
    const content = allContent.get('/')!;
    const frontmatter = content.frontmatter as unknown as HomePageFrontmatter;

    return {
        props: {
            products: frontmatter.products.map((p) => {
                const path = canonicalContentPath(p.path);
                const content = allContent.get(path)!;

                return {
                    path,
                    icon: p.icon,
                    title: content.frontmatter.title,
                    description: p.description,
                    children: p.children?.map((c) => {
                        const path = canonicalContentPath(c);
                        const content = allContent.get(path)!;

                        return {
                            path,
                            title: content.frontmatter.title,
                        };
                    }) || [],
                };
            }),
        },
    };
});
