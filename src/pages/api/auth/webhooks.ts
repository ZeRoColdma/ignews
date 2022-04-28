import Stripe from "stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import { stripe } from "../../../services/stripe";

async function buffer(readable: Readable) {
  const chunk = [];

  for await (const chunk of readable) {
    chunk.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunk);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const relevantEvents = new Set(["checkout.session.completed"]);

export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === "POST") {
    const buf = await buffer(request);
    const secret = request.headers["stripe-signature"];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf,
        secret,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    const type = event.type;

    if (relevantEvents.has(type)) {
      console.log(`Received ${type} event`);
    }

    return response.json({ received: true });

  } else {
    response.setHeader("Allow", "POST");
    response.status(405).end("Method Not Allowed");
  }
};
