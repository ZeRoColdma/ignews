import { loadStripe } from "@stripe/stripe-js";

export async function getStripeJs() {
  const stripeJs = await loadStripe(
    "pk_live_51KqEydFcTDXUwiBv3WK8ult4OofZ9EQ2K0WcjJL5qWpf36rr1yv3yVqAnJZzPzzaJnh8lGOnawll3n7rzschLc5100GhE7aSfD",
  );

  return stripeJs;
}
