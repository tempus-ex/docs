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

import { Footer } from './Footer';
import { Header } from './Header';

interface ProductChildProps {
    path: string;
    title: string;
}

interface ProductProps {
    path: string;
    icon: string;
    title: string;
    description: string;
    children: ProductChildProps[];
}

export interface Props {
    products: ProductProps[];
}

const useStyles = createStyles((theme) => ({
    wrapper: {
        paddingTop: theme.spacing.xl * 4,
        paddingBottom: theme.spacing.xl * 4,
    },
}));

export function Product(props: ProductProps) {
    const theme = useMantineTheme();

    const icons = require(`@tabler/icons-react`);
    const Icon = icons[props.icon];

    return (
        <div>
            <ThemeIcon variant="light" size={40} radius={40}>
                <Icon size={20} stroke={1.5} />
            </ThemeIcon>
            <Text style={{ marginTop: theme.spacing.sm, marginBottom: 7 }}>
                <Link href={props.path}>{props.title}</Link>
            </Text>
            <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                {props.description}
            </Text>
            <ul>
                {props.children.map((c) => (
                    <li key={c.path}><Link href={c.path}>{c.title}</Link></li>
                ))}
            </ul>
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
                        {props.products.map((p) => (<Product key={p.path} {...p} />))}
                    </SimpleGrid>
                </Container>
            </main>
            <Footer />
        </>
    )
};