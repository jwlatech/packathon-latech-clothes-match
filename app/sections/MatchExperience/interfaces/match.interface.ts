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

export interface IVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string;
  weight: number;
  weightUnit: string;
  image: Image;
  price: Price;
  sellingPlanAllocations: SellingPlanAllocations;
  compareAtPrice: null;
  selectedOptions: SelectedOption[];
  product: ProductVariant;
}

interface ProductVariant {
  handle: string;
  id: string;
  productType: string;
  title: string;
  tags: string[];
}

interface SelectedOption {
  name: string;
  value: string;
}

interface SellingPlanAllocations {
  edges: any[];
}

interface Price {
  currencyCode: string;
  amount: string;
}

interface Image {
  altText: null;
  height: number;
  id: string;
  url: string;
  width: number;
}
