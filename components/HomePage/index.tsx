import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { Footer } from "../Footer";
import { Header } from "../Header";

import styles from "./styles.module.scss";

const Divider = () => {
  return <div className={styles.divider}></div>;
};

interface ProductProps {
  image: string;
  title: string;
  blurb: string;
  link: string;
  linkLabel: string;
}

const Product = ({ image, title, blurb, link, linkLabel }: ProductProps) => {
  return (
    <div className={styles.product}>
      <Image src={image} width={350} height={180} alt={title} className={styles["product__image"]} />
      <h5 className={styles["product__title"]}>{title}</h5>
      <p className={styles["product__blurb"]}>{blurb}</p>
      <Link href={link}>
        <button className={styles["product__link"]}>{linkLabel}</button>
      </Link>
    </div>
  );
};

export const HomePage = () => {
  return (
    <>
      <Head>
        <title>Tempus Ex Documentation</title>
      </Head>
      <Header />
      <main className={styles.main}>
        <h3 className={styles.header}>Documentation</h3>
        <div className={styles.section}>
          <Product
            image={"./images/REST.svg"}
            title="REST API v 1.0"
            blurb={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis tincidunt leo, eget vehicula mi consequat id. Cras sed velit fringilla, maximus dolor in, gravida felis. Proin viverra nibh eu posuere eleifend. Proin tempor condimentum fermentum. Duis suscipit molestie mi, sed euismod nisi dictum sed. Donec sed nibh ullamcorper, viverra sapien in, consectetur ligula. Nulla nisi velit, pulvinar vitae neque at, scelerisque ultricies tellus. Duis in posuere dolor. Aenean fringilla pretium nisl in pellentesque. Cras dignissim ipsum eget justo facilisis, at bibendum felis lacinia."
            }
            link={'./fusion-feed/rest'}
            linkLabel="View Documentation"
          />
          <Product
            image={"./images/GraphQL.svg"}
            title="GraphQL"
            blurb={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis tincidunt leo, eget vehicula mi consequat id. Cras sed velit fringilla, maximus dolor in, gravida felis. Proin viverra nibh eu posuere eleifend. Proin tempor condimentum fermentum. Duis suscipit molestie mi, sed euismod nisi dictum sed. Donec sed nibh ullamcorper, viverra sapien in, consectetur ligula. Nulla nisi velit, pulvinar vitae neque at, scelerisque ultricies tellus. Duis in posuere dolor. Aenean fringilla pretium nisl in pellentesque. Cras dignissim ipsum eget justo facilisis, at bibendum felis lacinia."
            }
            link={'./fusion-feed/graphql'}
            linkLabel="View Documentation"
          />
        </div>
        <Divider />
        <h3 className={styles.header}>Support</h3>
        <div className={styles.section}>
          <Product
            image={"./images/Support.svg"}
            title={
              "Ask a Question"
            }
            blurb={"If you require any further assistance, please do not hesitate to contact us. Our team of experts is always available to help in any way we can. We would be more than happy to assist you with any questions or concerns you may have."}
            link={"mailto:fusionfeed@tempus-ex.com"}
            linkLabel={"Contact Us"}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};