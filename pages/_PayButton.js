import {loadStripe} from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_vAZ3gh1LcuM7fW4rKNvqafgB00DR9RKOjN');

export default ({id}) => {
  // some how get page params?

  const handleClick = async (e) => {
    e.preventDefault();

    const stripe = await stripePromise;

    // create checkout session
    const session = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
        }),
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
      });

    // redirect to checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
  }

  return (
    <button onClick={handleClick}>Pay</button>
  )
}
