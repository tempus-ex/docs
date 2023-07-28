import { Paper } from '@mantine/core';
import { Prism } from '@mantine/prism';
import Image from 'next/image';
import Link from 'next/link';

import graphqlIcon from '../../node_modules/@tabler/icons/icons/brand-graphql.svg';

import styles from './styles.module.scss';

interface Props {
    document: string;
    version: string;
}

export const GraphQLExample = (props: Props) => {
    return (
        <div>
            <Prism className={styles.code} copyLabel="Copy" language="graphql">{props.document}</Prism>
            <Paper className={styles.footer}>
                <Link className={styles['footer__link']} href={`/fusionfeed/graphql/explorer-and-reference#version=${props.version}&query=${encodeURIComponent(props.document)}`} target="_blank">
                    <Image src={graphqlIcon} alt="GraphQL Explorer" />
                    <span className={styles['footer__text']}>Open in GraphQL Explorer</span>
                </Link>
            </Paper>
        </div>
    );
};
