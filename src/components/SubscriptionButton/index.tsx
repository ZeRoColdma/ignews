import { useSession, signIn } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss";

interface SubscriptionButtonProps {
  priceId: string;
}

export function SubscriveButton({ priceId }: SubscriptionButtonProps) {
  const [session] = useSession();

  async function handleSubscription() {
    if (!session) {
      signIn("github");
      return;
    }

    try {
      const response = await api.post("/subscribe");

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <button
      onClick={handleSubscription}
      type="button"
      className={styles.subscribeButton}
    >
      Subscribe Now
    </button>
  );
}
