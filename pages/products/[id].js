import {GraphQLClient} from 'graphql-request';
import PayButton from '../_PayButton.js';

const graphcms = new GraphQLClient(
  'https://api-us-west-2.graphcms.com/v2/ckgv6s0bc783101wf9jfq4j0e/master'
)

export async function getStaticProps({params}) {
  const {product} = await graphcms.request(
    `
      query ProductPageQuery($id: ID!) {
        product(where: {id: $id}) {
          price
          name
          id
        }
      }
    `,
    {
      id: params.id,
    }
  )
  return {
    props: {
      product
    }
  }
}

export async function getStaticPaths() {
  const {products} = await graphcms.request(
    `
      {
        products {
          id
        }
      }
    `
  )
  return {
    paths: products.map(({id}) => ({
      params: {
        id
      }
    })),
    fallback: false,
  }
}

export default ({product}) => {
  const {name, price, id} = product;

  return (
    <div>
      {name} - {price}
      <PayButton id={id} />
    </div>
  )
}
