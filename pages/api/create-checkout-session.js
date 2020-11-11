import Stripe from 'stripe'
import { GraphQLClient } from 'graphql-request';

const stripe = new Stripe('sk_test_51EceeUCZ6qsJgndJDSi5feJtMJs4e4SOOQL7TIGtQyIA7GsyJczBvxvrFsuB71OkREXySaFDzcjLYb2IoDmuX1jL00e4sdsH5H');
const graphcms = new GraphQLClient(
  'https://api-us-west-2.graphcms.com/v2/ckgv6s0bc783101wf9jfq4j0e/master'
);

export default async (req, res) => {
  const productId = req.body.id;

  const {product} = await graphcms.request(
    `
      query ProductPageQuery($id: ID!) {
        product(where: {id: $id}) {
          price
          id
        }
      }
    `,
    {
      id: req.body.id,
    }
  )

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/?id={CHECKOUT_SESSION_ID}',
      cancel_url: `http://localhost:3000/products/${productId}`,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          unit_amount: product.price,
          currency: 'usd',
          product_data: {
            name: 'Test',
            metadata: {
              productId: productId
            }
          }
        },
        quantity: 1,
      }],
    });
    res.json(session)
    return;
  } catch (e) {
    res.json({ error: { message: e }});
    return;
  }
}
