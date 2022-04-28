import { GetServerSideProps } from "next";
import { stripe } from "../services/stripe";

import Head from "next/head";
import { SubscriveButton } from "../components/SubscriptionButton";

import styles from "./home.module.scss";

interface HomeProps {
  product: {
    priceId: string;
    unit_amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome </span>
          <h1>
            News about the <span>React</span> world
          </h1>
          <p>
            Get acess to all the publication <br />
            <span>for {product.unit_amount} month</span>
          </p>
          <SubscriveButton priceId={product.priceId} />
        </section>

        <img src="/images/avatar.svg" alt="Girl Codign" />
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const price = await stripe.prices.retrieve("price_1KqFI0FcTDXUwiBvKKGfQWiV");

  const product = {
    priceId: price.id,
    unit_amount: new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
  };
};
