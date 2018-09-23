// @flow

import DataLoader from 'dataloader';
import querystring from 'querystring';
import connectionFromVtex from './ProductConnection'
import { GraphQLContext } from '../../TypeDefinition';

type ProductType = {
  id: string,
  productId: Number,
  productName: string,
  brand: string,
  items: Array<Object>
}

export default class Product {
  id: string;
  _id: Number;
  name: string;
  brand: string;
  ean: string;
  price: string;
  image: string;

  constructor(data: ProductType) {
    this.id = data.productId.toString();
    this._id = data.productId;
    this.name = data.productName;
    this.brand = data.brand;
    this.ean = data.items[0].ean;
    this.price = data.items[0].sellers[0].commertialOffer.Price;
    this.image = data.items[0].images[0].imageUrl;
  }
}

const loadProduct = function (args) {
  let fq = []
  if(args.ean) {
    fq.push("alternateIds_Ean:"+args.ean)
  }
  if(args.id) {
    fq.push("productId:"+args.id)
  }
  if(args.word) {
    fq.push(args.word)
  }
  let query = {
    fq,
    _from: 0,
    _to: 49
  }
  if(args._from != null && args._from != undefined){
    query._from = args._from
  }
  if(args._to != null && args._to != undefined){
    query._to = args._to
  }
  query = querystring.stringify(query)
  try {
    return fetch(`https://www.savegnago.com.br/api/catalog_system/pub/products/search?${query}`)
  } catch (err) {
    console.log(err)
    throw new Error(err)
  }
  
}

export const getLoader = () => new DataLoader((args: Array<Object>) => Promise.all(args.map(loadProduct)));

export const load = async ({ user: viewer, dataloaders }, args) => {
  if (!args) return null;
  let data = await dataloaders.ProductLoader.load(args);
  data = await data.json()
  if (!data) return null;

  return new Product(data[0])
};

export const clearCache = ({ dataloaders }, args: Object) => {
  return dataloaders.ProductLoader.clear(args);
};

export const loadProducts = async (context: GraphQLContext, args: Object) => {
  if (!args) return null;

  return connectionFromVtex({
    context,
    loader: load,
    args
  })
};
