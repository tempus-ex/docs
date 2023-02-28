import { IconPhoto } from '@tabler/icons-react';

import { HomePage } from '../components/HomePage';
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

export async function getStaticProps() {
    const allContent = await getAllContent();
    const source = allContent.get('/')!;
    const frontmatter = source.frontmatter as unknown as HomePageFrontmatter;

    return {
        props: {
            products: frontmatter.products.map((p) => {
                const path = canonicalContentPath(p.path);
                const content = allContent.get(path)!;
                const frontmatter = content.frontmatter as unknown as Frontmatter;

                return {
                    path,
                    icon: p.icon,
                    title: frontmatter.title,
                    description: p.description,
                    children: p.children?.map((c) => {
                        const path = canonicalContentPath(c);
                        const content = allContent.get(path)!;
                        const frontmatter = content.frontmatter as unknown as Frontmatter;

                        return {
                            path,
                            title: frontmatter.title,
                        };
                    }) || [],
                };
            }),
        },
    };
}
