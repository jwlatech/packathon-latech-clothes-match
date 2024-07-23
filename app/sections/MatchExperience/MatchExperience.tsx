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
  IProductCard,
} from './interfaces';
import {FirstStepMatch, ThirdStepMatch} from './components/steps';
import MatchLookIcon from './icons/MatchLookIcon';
import {SecondStepMatch} from './components/steps/secondStep';

import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

const INIT_FILTER: Ifilters = {
  selectedFilterCollectionValue: [],
};

function filterProducts(
  products: Product[],
  filter: Ifilters,
  selectedGender: string,
) {
  const {selectedFilterCollectionValue} = filter;

  if (selectedFilterCollectionValue.length === 0) return products;

  const genderProducts = products.filter((product) => {
    return product.tags
      .map((tag) => tag.toLocaleLowerCase())
      .includes(selectedGender.toLocaleLowerCase());
  });

  const selectedCollections = [
    ...new Set(
      filter.selectedFilterCollectionValue.map((filter) =>
        filter.collectionName.toLowerCase(),
      ),
    ),
  ];

  const collectionProducts = genderProducts.reduce<
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

  const selectedProducts = [
    ...new Set(
      filtredVariantsProducts.map(
        (variant: ProductVariant) => variant.product.id,
      ),
    ),
  ];

  const nonSelectedProducts = products
  .filter((product) => !selectedProducts.includes(product.id))
  .map((product) => {
    return product.variants.nodes.find(node => node.availableForSale);
  })
  .filter(variant => variant !== undefined);

  localStorage.setItem('nonSelectedProducts', JSON.stringify(nonSelectedProducts));

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
  const [variantsProducts, setVariantsProducts] = useState<ProductVariant[]>(
    [],
  );

  const [selectedGender, setSelectedGender] = useState<string>('Men');
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
    // Crear el nuevo filtro
    const newFilter = {
      gender: selectedGender,
      collectionName: filter.collectionName,
      title: filter.title,
      value,
    };

    // Filtrar la colección, excluyendo los que coinciden con collectionName y tienen diferente valor
    const filteredCollection = filtersByCollectionValue.filter(
      (filterCol) =>
        !(
          filterCol.collectionName === filter.collectionName &&
          filterCol.value !== value
        ),
    );

    // Agregar el nuevo filtro
    const newFiltersByCollectionValue = [...filteredCollection, newFilter];
    setFiltersByCollectionValue(newFiltersByCollectionValue);
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

  const handleFilters = debounce(
    (filter: Ifilters, products: Product[], selectedGender: string) => {
      const filtredVariantsProducts: ProductVariant[] = filterProducts(
        products,
        filter,
        selectedGender,
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
            imageURL: variant.image?.url || '',
            tags: product.tags,
          });
        }
      });

      // Convertir el mapa de vuelta a un array
      const uniqueProductsArray = Array.from(uniqueProductsMap.values());

      setFiltredProducts(uniqueProductsArray);
    },
    500,
  );

  const {setFilter} = useQueryFilters(INIT_FILTER, (filters) => {
    handleFilters(filters, fetchedProducts, selectedGender);
  });

  useEffect(() => {
    localStorage.setItem('like', JSON.stringify([]));
    localStorage.setItem('dislike', JSON.stringify([]));
    localStorage.setItem('nonSelectedProducts', JSON.stringify([]));
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
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
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

  const isDisabled = () => {
    if (stepView === 0) {
      return selectedCollections.length === 0;
    } else if (stepView === 1) {
      return filtersByCollectionValue.length === 0;
    }
  };

  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }
        `}
      >
        <div className="flex h-[calc(100vh-184px)] flex-col items-center justify-between gap-4 px-4 scrollbar-hide">
          <div className="flex justify-center">
            
          </div>
          <div
            className="scrollbar-hide"
            style={{flexGrow: 1, overflowX: 'hidden'}}
          >
            {menuView[stepView]}
          </div>
          <div className="w-full flex flex-col items-center justify-center gap-2 pb-6">
            {stepView <= 1 && (
              <button
                className={`flex w-full max-w-[300px] items-center justify-center rounded-full ${isDisabled() ? 'bg-[#646464]' : 'bg-[#323232]'}  py-3 text-white`}
                disabled={isDisabled()}
                onClick={() => setStepView(stepView + 1)}
              >
                Next
              </button>
            )}
            {stepView == 1 && (
              <button
                className={`flex w-fit items-center justify-center rounded-full text-[#323232] font-semibold`}
                onClick={() => setStepView(stepView - 1)}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
