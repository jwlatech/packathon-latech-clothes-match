import {Product} from '@shopify/hydrogen-react/storefront-api-types';

export interface Ifilters {
  selectedFilterCollectionValue: IfilterCollectionValue[];
}

export interface IfilterCollection {
  collectionName: string;
  title: string;
  values: string[];
}

export interface IfilterCollectionValue {
  collectionName: string;
  title: string;
  value: string;
}

export interface ICustomCollection {
  title: string;
  filters: any[];
  products: Product[];
}

export interface IProductCard {
  title: string;
  id: string
  price: string
  imageURL: string
  tags: string[]
}