import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

import { Footer } from '../Footer';
import { Header } from '../Header';

import styles from './styles.module.scss';

interface ProductChildProps {
    path: string;
    title: string;
    children: ProductChildProps[];
}

interface ProductProps {
    link: string;
    linkLabel: string;
    image: string;
    title: string;
    description: string;
    children: ProductChildProps[];
}

export interface Props {
    products: ProductProps[];
}

const Product = (props: ProductProps) => {
    return (
        <div className={styles.product}>
            <Image src={`./images/${props.image}`} width={350} height={180} alt={props.title} className={styles['product__image']} />
            <h3 className={styles['product__title']}>{props.title}</h3>
            <p className={styles['product__blurb']}>{props.description}</p>
            <Link href={props.link}>
                <button className={styles['product__link']}>{props.linkLabel}</button>
            </Link>
            {props.children.length > 0 && (
                <>
                    <h4>Popular Pages</h4>
                    <ul className={styles['product__children']}>
                        {props.children.map((child) => (
                            <li key={child.path}>
                                <Link href={child.path}>{child.title}</Link>
                                {child.children.length > 0 && (
                                    <ul>
                                        {child.children.map((child) => (
                                            <li key={child.path}>
                                                <Link href={child.path}>{child.title}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export const HomePage = (props: Props) => {
    return (
        <>
            <Head>
                <title>Tempus Ex Documentation</title>
            </Head>
            <Header />
            <main className={styles.main}>
                <div className={styles.section}>
                    {props.products.map((product) => (
                        <Product key={product.link} {...product} />
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
};
