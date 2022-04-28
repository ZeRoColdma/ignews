import { NextApiRequest, NextApiResponse } from "next";
import { stripe } from "../../services/stripe";
import { getSession } from "next-auth/client";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";

type User = {
  ref: {
    id: string;
  };

  data: {
    stripe_customer_id: string;
  };
};

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const session = await getSession({ req: request });

    const user = fauna.query<User>(
      q.Get(q.Match(q.Index("users_by_email"), q.Casefold(session.user.email))),
    );

    if (!user) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
      });

      await fauna.query(
        q.Update(q.Ref(q.Collection("users"), user), {
          data: {
            sripe_custome_id: stripeCustomer.id,
          },
        }),
      );
    }

    //   const stripeCheckoutSession = await stripe.checkout.sessions.create({
    //     customer: stripeCustomer,
    //     payment_method_types: ["card"],
    //     billing_address_collection: "required",
    //     line_items: [
    //       {
    //         price: "price_1KqFI0FcTDXUwiBvKKGfQWiV",
    //         quantity: 1,
    //       },
    //     ],
    //     mode: "subscription",
    //     allow_promotion_codes: true,
    //     success_url: "http://localhost:3000/posts",
    //     cancel_url: "http://localhost:3000",
    //   });

    //   return response.status(200).json({
    //     sessionId: stripeCheckoutSession.id,
    //   });
    // } else {
    //   response.setHeader("Allow", "POST");
    //   response.status(405).end("Method Not Allowed");
  }
};
