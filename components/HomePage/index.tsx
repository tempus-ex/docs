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
      <Image
        src={image}
        width={350}
        height={180}
        alt={title}
        className={styles["product__image"]}
      />
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
        <h2 className={styles.header}>Documentation</h2>
        <div className={styles.section}>
          {/*TODO add blurb copy*/}
          <Product
            image={"./images/REST.svg"}
            title="REST API"
            blurb={""}
            link={"./fusionfeed/rest"}
            linkLabel="View Documentation"
          />
          {/*TODO add blurb copy*/}
          <Product
            image={"./images/GraphQL.svg"}
            title="GraphQL"
            blurb={""}
            link={"./fusionfeed/graphql"}
            linkLabel="View Documentation"
          />
        </div>
        <Divider />
        <h2 className={styles.header}>Support</h2>
        <div className={styles.section}>
          <Product
            image={"./images/Support.svg"}
            title={"Ask a Question"}
            blurb={
              "If you require any further assistance, please do not hesitate to contact us. Our team of experts is always available to help in any way we can. We would be more than happy to assist you with any questions or concerns you may have."
            }
            link={"mailto:support@tempus-ex.com"}
            linkLabel={"Contact Us"}
          />
        </div>
      </main>
      <Footer />
    </>
  );
};
