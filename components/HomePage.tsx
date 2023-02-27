import Head from 'next/head';
import Link from 'next/link';

interface ProductChildProps {
    path: string;
    title: string;
}

interface ProductProps {
    path: string;
    title: string;
    children: ProductChildProps[];
}

interface Props {
    products: ProductProps[];
}

export const HomePage = (props: Props) => {
    return (
        <>
            <Head>
                <title>Tempus Ex Documentation</title>
            </Head>
            <main>
                <ul>
                    {props.products.map((p) => (
                        <li key={p.path}>
                            {p.title}
                            <ul>
                                {p.children.map((c) => (
                                    <li key={c.path}><Link href={c.path}>{c.title}</Link></li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </main>
        </>
    )
};
