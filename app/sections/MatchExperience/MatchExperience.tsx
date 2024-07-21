import {useLoaderData} from '@remix-run/react';
import {useEffect, useState} from 'react';
import type {Product} from '@shopify/hydrogen-react/storefront-api-types';
import {debounce} from 'lodash';

import {Container} from '~/components/Container';
import {useProductsFromHandles} from '~/hooks';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';
import {useQueryFilters} from './hooks/filters.hook';
import type {
  Ifilters,
  ICustomCollection,
  IfilterCollection,
  IfilterCollectionValue,
  IVariant,
  IProductCard,
} from './interfaces';
import {FirstStepMatch, ThirdStepMatch} from './components/steps';
import MatchLookIcon from './icons/MatchLookIcon';
import {SecondStepMatch} from './components/steps/secondStep';

const INIT_FILTER: Ifilters = {
  selectedFilterCollectionValue: [],
};

function filterProducts(products: Product[], filter: Ifilters) {
  const {selectedFilterCollectionValue} = filter;

  if (selectedFilterCollectionValue.length === 0) return products;

  const selectedCollections = [
    ...new Set(
      filter.selectedFilterCollectionValue.map((filter) =>
        filter.collectionName.toLowerCase(),
      ),
    ),
  ];

  const collectionProducts = products.reduce<
    Record<string, (typeof products)[0]['variants']['nodes']>
  >((acc, product) => {
    product.collections.nodes.forEach((collection) => {
      const collectionHandle = collection.handle.toLowerCase();
      if (selectedCollections.includes(collectionHandle)) {
        if (!acc[collectionHandle]) {
          acc[collectionHandle] = [];
        }
        acc[collectionHandle].push(...product.variants.nodes);
      }
    });
    return acc;
  }, {});

  const filtredVariantsProducts: any[] = [];

  selectedFilterCollectionValue.forEach((filterCollectionValue) => {
    const collectionKey = filterCollectionValue.collectionName.toLowerCase();
    const variants = collectionProducts[collectionKey];

    if (variants) {
      variants.forEach((variant) => {
        if (
          variant.title.toLocaleLowerCase() ===
            filterCollectionValue.value.toLocaleLowerCase() &&
          variant.availableForSale
        ) {
          filtredVariantsProducts.push(variant);
        }
      });
    } else {
      console.log(`No variants found for collection: ${collectionKey}`);
    }
  });

  return filtredVariantsProducts;
}

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {section} = cms;
  const data: any = useLoaderData();

  const productHandles = data.collections.flatMap((collection: any) =>
    collection.products.edges.map((product: any) => product.node.handle),
  );

  const collections: ICustomCollection[] = data.collections.flatMap(
    (collection: any) => {
      return {
        title: collection.title,
        filters: collection.products.filters,
        products: collection.products.edges.map(
          (product: any) => product.node.handle,
        ),
      };
    },
  );

  const fetchedProducts = useProductsFromHandles(productHandles);
  const [filtredProducts, setFiltredProducts] = useState<IProductCard[]>([]);
  const [variantsProducts, setVariantsProducts] = useState<IVariant[]>([]);

  const [customCollections, setCustomCollections] =
    useState<ICustomCollection[]>(collections);
  const [selectedCollections, setSelectedCollections] = useState<
    ICustomCollection[]
  >([]);

  const [filtersByCollection, setFiltersByCollection] = useState<
    IfilterCollection[]
  >([]);
  const [filtersByCollectionValue, setFiltersByCollectionValue] = useState<
    IfilterCollectionValue[]
  >([]);

  const [stepView, setStepView] = useState<number>(0);

  const handleSelectCollection = (collection: ICustomCollection) => {
    if (selectedCollections.includes(collection)) {
      setSelectedCollections(
        selectedCollections.filter((c) => c.title !== collection.title),
      );

      const newFiltersByCollection = filtersByCollection.filter(
        (filter) => filter.collectionName !== collection.title,
      );

      setFiltersByCollection(newFiltersByCollection);

      return;
    }
    const newSelectedCollections = [...selectedCollections, collection];
    setSelectedCollections(newSelectedCollections);

    const filtersCollections = newSelectedCollections
      .map((collection) => {
        const filterSize = collection.filters.find((filter) => {
          if (filter.label.toLocaleLowerCase().includes('size')) return filter; // Usar includes en lugar de contains
        });

        // Asegúrate de que filterSize no sea undefined
        if (filterSize) {
          return {
            collectionName: collection.title,
            title: filterSize.label,
            values: filterSize.values.map((value: any) => value.label),
          };
        }
      })
      .filter((item): item is IfilterCollection => item !== undefined); // Filtrar undefined resultados si no se encontró filterSize

    setFiltersByCollection(filtersCollections);
  };

  const handleSelectedFilterCollectionValue = (
    filter: IfilterCollection,
    value: string,
  ) => {
    if (
      filtersByCollectionValue.find(
        (filterCol) => filterCol.collectionName === filter.collectionName,
      )
    ) {
      const filteredCollection = filtersByCollectionValue.filter(
        (filterCol) =>
          !(
            filterCol.collectionName === filter.collectionName &&
            filterCol.value !== value
          ),
      );
      const newFilter = {
        collectionName: filter.collectionName,
        title: filter.title,
        value,
      };
      const newFiltersByCollectionValue = [...filteredCollection, newFilter];
      setFiltersByCollectionValue(newFiltersByCollectionValue);
    } else {
      const newFilter = {
        collectionName: filter.collectionName,
        title: filter.title,
        value,
      };
      const newFiltersByCollectionValue = [
        ...filtersByCollectionValue,
        newFilter,
      ];
      setFiltersByCollectionValue(newFiltersByCollectionValue);
    }
  };

  const isSelectedCollection = (collection: ICustomCollection) => {
    return selectedCollections.includes(collection);
  };

  const isSelectedFilter = (filterCollection: string, value: string) => {
    return filtersByCollectionValue.find(
      (filter) =>
        filter.collectionName === filterCollection && filter.value === value,
    );
  };

  const handleFilters = debounce((filter: Ifilters, products: Product[]) => {
    const filtredVariantsProducts: IVariant[] = filterProducts(
      products,
      filter,
    );

    setVariantsProducts(filtredVariantsProducts);

    const uniqueProductsMap = new Map<string, IProductCard>();

    filtredVariantsProducts.forEach((variant) => {
      const product = variant.product;
      if (!uniqueProductsMap.has(product.handle)) {
        uniqueProductsMap.set(product.handle, {
          title: product.handle,
          id: product.id,
          price: variant.price.amount,
          imageURL: variant.image.url,
          tags: product.tags,
        });
      }
    });

    // Convertir el mapa de vuelta a un array
    const uniqueProductsArray = Array.from(uniqueProductsMap.values());

    setFiltredProducts(uniqueProductsArray);
  }, 500);

  const {setFilter} = useQueryFilters(INIT_FILTER, (filters) => {
    handleFilters(filters, fetchedProducts);
  });

  useEffect(() => {
    localStorage.setItem('like', JSON.stringify([]));
    localStorage.setItem('dislike', JSON.stringify([]));
  }, []);

  useEffect(() => {
    setFilter('selectedFilterCollectionValue', filtersByCollectionValue);
  }, [filtersByCollectionValue]);

  const menuView: {[key: number]: JSX.Element} = {
    0: (
      <FirstStepMatch
        collections={customCollections}
        handleSelectCollection={handleSelectCollection}
        isSelectedCollection={isSelectedCollection}
      />
    ),
    1: (
      <SecondStepMatch
        filtersByCollection={filtersByCollection}
        isSelectedFilter={isSelectedFilter}
        handleSelectedFilterCollectionValue={
          handleSelectedFilterCollectionValue
        }
      />
    ),
    2: (
      <ThirdStepMatch
        filtredProducts={filtredProducts}
        setFiltredProducts={setFiltredProducts}
        variantsProducts={variantsProducts}
      />
    ),
  };

  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }`}
      >
        <div className="flex h-[calc(100vh-184px)] flex-col items-center justify-between gap-8 px-4">
          <div className="flex justify-center">
            <MatchLookIcon className="h-[60px] w-[80px]" />
          </div>
          <div style={{flexGrow: 1}}>{menuView[stepView]}</div>
          {stepView <= 1 && (
            <button
              className="flex w-full max-w-[300px] items-center justify-center rounded-full bg-[#323232] py-2 text-white "
              onClick={() => setStepView(stepView + 1)}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
