import { HomePage, Props } from '../components/HomePage';
import { canonicalContentPath, Frontmatter } from '../lib/content';
import { getAllContent } from '../lib/content-loading';

export default HomePage;

interface ProductFrontmatterChild {
    path: string;
    children: ProductFrontmatterChild[];
}

interface ProductFrontmatter {
    link: string;
    linkLabel: string;
    image: string;
    title: string;
    description: string;
    children: ProductFrontmatterChild[];
}

interface HomePageFrontmatter extends Frontmatter {
    products: ProductFrontmatter[];
}

export const getStaticProps = async function () {
    const allContent = await getAllContent();
    const content = allContent.get('/')!;
    const frontmatter = content.frontmatter as unknown as HomePageFrontmatter;

    return {
        props: {
            products: frontmatter.products.map((p) => {
                return {
                    link: p.link,
                    linkLabel: p.linkLabel,
                    image: p.image,
                    title: p.title,
                    description: p.description,
                    children: p.children?.map((c) => {
                        const path = canonicalContentPath(c.path);
                        const content = allContent.get(path)!;

                        return {
                            path,
                            title: content.frontmatter.title,
                            children: c.children?.map((c) => {
                                const path = canonicalContentPath(c.path);
                                const content = allContent.get(path)!;

                                return {
                                    path,
                                    title: content.frontmatter.title,
                                };
                            }) || [],
                        };
                    }) || [],
                };
            }),
        },
    };
};
