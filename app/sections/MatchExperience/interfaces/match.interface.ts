import { Product } from "@shopify/hydrogen-react/storefront-api-types";

export interface Ifilters {
  sizeShirt: string;
  sizeShoes: string;
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
