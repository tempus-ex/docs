import { createStyles, Header as MantineHeader } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';

import logo from '../public/images/logo.svg';

const useStyles = createStyles((theme) => ({
    header: {
        padding: 16,
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
    },
    logo: {
        height: 32,
        marginRight: 8,
        width: 32,
    },
    homeLink: {
        alignItems: 'center',
        color: 'inherit',
        display: 'flex',
        textDecoration: 'none',
    },
}));

export const Header = () => {
    const { classes } = useStyles();

    return (
        <MantineHeader className={classes.header} height={64}>
            <Link className={classes.homeLink} href="/">
                <Image alt="Tempus Ex" className={classes.logo} src={logo} />
                <span>Tempus Ex Docs</span>
            </Link>
        </MantineHeader>
    )
};
