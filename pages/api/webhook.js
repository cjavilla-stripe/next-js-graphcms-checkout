import Stripe from 'stripe'
import { GraphQLClient } from 'graphql-request';

const stripe = new Stripe('sk_test_51EceeUCZ6qsJgndJDSi5feJtMJs4e4SOOQL7TIGtQyIA7GsyJczBvxvrFsuB71OkREXySaFDzcjLYb2IoDmuX1jL00e4sdsH5H');
const graphcms = new GraphQLClient(
  'https://api-us-west-2.graphcms.com/v2/ckgv6s0bc783101wf9jfq4j0e/master'
);

export default async (req, res) => {
  const event = req.body;
  if(event.type === 'checkout.session.completed') {
    const {amount_total, customer, line_items, payment_intent} = await stripe.checkout.sessions.retrieve(event.data.object.id, {
      expand: ['line_items.data.price.product', 'customer', 'payment_intent.payment_method']
    });
    console.log({amount_total})
    console.log({customer})
    console.log({line_items})
    console.log({payment_intent})
    const {payment_method} = payment_intent;

    const {order} = await graphcms.request(
      `
        mutation CreateOrderQuery($data: OrderCreateInput!) {
          createOrder(data: $data) {
            id
            name
            email
            total
          }
        }
      `,
      {
        data: {
          name: customer.name || payment_method.billing_details.name || 'Unknown',
          email: customer.email,
          total: amount_total,
          orderItems: {
            create: line_items.data.map(({amount_total, quantity, price}) => ({
              price: amount_total,
              quantity: quantity,
              productId: price.product.metadata.productId,
              name: price.id,
            }))
          }
        }
      }
    );
  }
  res.json({ message: 'success' });
}
