import {
    createStyles,
    ThemeIcon,
    Text,
    Title,
    Container,
    SimpleGrid,
    useMantineTheme,
} from '@mantine/core';
import Head from 'next/head';
import Link from 'next/link';

import styles from '../styles/HomePage.module.css';
import { Footer } from './Footer';
import { Header } from './Header';

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

interface FeatureProps {
    title: React.ReactNode;
    description: React.ReactNode;
}

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },
}));

export function Feature({ title, description }: FeatureProps) {
    const theme = useMantineTheme();

    return (
        <div>
            <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>{title}</Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                {description}
            </Text>
        </div>
    );
}

export const HomePage = (props: Props) => {
    const { classes, theme } = useStyles();

    return (
        <>
            <Head>
                <title>Tempus Ex Documentation</title>
            </Head>
            <Header />
            <main>
                <Container className={classes.wrapper}>
                    <SimpleGrid
                        mt={60}
                        cols={3}
                        spacing={theme.spacing.xl * 2}
                        breakpoints={[
                            { maxWidth: 980, cols: 2, spacing: 'xl' },
                            { maxWidth: 755, cols: 1, spacing: 'xl' },
                        ]}
                    >
                        {props.products.map((p) => (
                            <Feature
                                key={p.path}
                                title={p.title}
                                description={p.description}
                            >
                                <ul>
                                    {p.children.map((c) => (
                                        <li key={c.path}><Link href={c.path}>{c.title}</Link></li>
                                    ))}
                                </ul>
                            </Feature>
                        ))}
                    </SimpleGrid>
                </Container>
            </main>
            <Footer />
        </>
    )
};
