import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} from 'graphql';
import {
  globalIdField
} from 'graphql-relay';

import {
  registerType,
  nodeInterface
} from '../../interface/NodeInterface';
import { connectionDefinitions } from '../../core/connection/CustomConnectionType';

const ProductType = registerType(
  new GraphQLObjectType({
    name: 'Product',
    description: 'Represents Product',
    fields: () => ({
      id: globalIdField('Product'),
      _id: {
        type: GraphQLInt,
        description: 'Real ID',
        resolve: obj => obj.id
      },
      name: {
        type: GraphQLString,
        description: 'Product name',
        resolve: obj => obj.name,
      },
      brand: {
        type: GraphQLString,
        description: 'Product brand',
        resolve: obj => obj.brand,
      },
      ean: {
        type: GraphQLString,
        description: 'Product EAN',
        resolve: obj => obj.ean,
      },
      price: {
        type: GraphQLString,
        description: 'Price field',
        resolve: obj => obj.price,
      },
      image: {
        type: GraphQLString,
        description: 'ImageURL ',
        resolve: obj => obj.image,
      }
    }),
    interfaces: () => [nodeInterface],
  })
)
export default ProductType;

export const ProductConnection = connectionDefinitions({
  name: 'Product',
  nodeType: GraphQLNonNull(ProductType),
});