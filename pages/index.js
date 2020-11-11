import Link from 'next/link';
import { GraphQLClient } from 'graphql-request';

export async function getStaticProps() {
  const graphcms = new GraphQLClient(
    'https://api-us-west-2.graphcms.com/v2/ckgv6s0bc783101wf9jfq4j0e/master'
  );

  const { products } = await graphcms.request(
    `
      {
        products {
          id
          name
          price
        }
      }
    `
  );

  return {
    props: {
      products,
    },
  };
}

export default ({ products }) => {

  return products.map(({ id, name, price }) => (
    <div>
      <Link key={id} href={`/products/${id}`}>
        <a>{name} - {price}</a>
      </Link>
    </div>
  ));
}
