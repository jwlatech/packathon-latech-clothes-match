import {useLoaderData} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import {useEffect, useState} from 'react';
import type {Product} from '@shopify/hydrogen-react/storefront-api-types';
import {debounce} from 'lodash';

import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';
import {useProductsFromHandles} from '~/hooks';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';
import {useQueryFilters} from './hooks/filters.hook';
import GenderToggle from './components/steps/firstStep/GenderToggle';
import type {
  Ifilters,
  ICustomCollection,
  IfilterCollection,
  IfilterCollectionValue,
} from './interfaces';
import {Chip} from './components/common';
import {FirstStepMatch} from './components/steps';
import MatchLookIcon from './icons/MatchLookIcon';
import {SecondStepMatch} from './components/steps/secondStep';

const INIT_FILTER = {
  sizeShirt: '',
  sizeShoes: '',
};

function filterProducts(products: Product[], filter: Ifilters) {
  return products.filter((product) => {
    let matchesShirt = true;
    let matchesShoes = true;

    if (filter.sizeShirt && filter.sizeShirt !== '') {
      matchesShirt = product.variants.nodes.some(
        (variant) =>
          variant.title.toLocaleLowerCase() ===
            filter.sizeShirt.toLocaleLowerCase() && variant.availableForSale,
      );
    }

    if (filter.sizeShoes && filter.sizeShoes !== '') {
      matchesShoes = product.variants.nodes.some(
        (variant) =>
          variant.title.toLocaleLowerCase() ===
            filter.sizeShoes.toLocaleLowerCase() && variant.availableForSale,
      );
    }

    return matchesShirt || matchesShoes;
  });
}

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const {media, section} = cms;
  const {image, yesImage, noImage, aspectMobile} = {...media};
  const data: any = useLoaderData();

  // console.log('collections', data.collections);

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

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const INIT_PRODUCTS_STATE = filterProducts(fetchedProducts, INIT_FILTER);
  const [filtredProducts, setFiltredProducts] =
    useState<Product[]>(INIT_PRODUCTS_STATE);

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
          console.log('filter', filter);
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
        (filterCol) =>
          filterCol.collectionName === filter.collectionName &&
          filterCol.value === value,
      )
    ) {
      const filteredCollection = filtersByCollectionValue.filter(
        (filterCol) =>
          !(
            filterCol.collectionName === filter.collectionName &&
            filterCol.value === value
          ),
      );

      setFiltersByCollectionValue(filteredCollection);
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

  const [currentIndex, setCurrentIndex] = useState<number>(
    filtredProducts.length - 1,
  );
  const [swipeDirection, setSwipeDirection] = useState<
    'left' | 'right' | undefined
  >(undefined);

  const handleFilters = debounce(
    (
      filter: Ifilters,
      setFiltredProducts: React.Dispatch<React.SetStateAction<Product[]>>,
      products: Product[],
    ) => {
      const filtredData = filterProducts(products, filter);

      setFiltredProducts(filtredData);
    },
    500,
  );

  const {setMultipleFilters} = useQueryFilters(INIT_FILTER, (filters) => {
    handleFilters(filters, setFiltredProducts, fetchedProducts);
  });

  useEffect(() => {
    const newFilters = {
      sizeShirt: 'medium',
      sizeShoes: '12',
    };

    if (fetchedProducts.length > 0) {
      setFiltredProducts(fetchedProducts);
      setMultipleFilters(newFilters);
      setTimeout(() => {
        setIsLoading(false);
      }, 100);
    }
  }, [fetchedProducts]);

  useEffect(() => {
    if (filtredProducts.length > 0) {
      setCurrentIndex(filtredProducts.length - 1);
    }
  }, [filtredProducts]);

  useEffect(() => {
    localStorage.setItem('like', JSON.stringify([]));
    localStorage.setItem('dislike', JSON.stringify([]));
  }, []);

  const swipe = (index: number, direction: string) => {
    if (index < 0) return;

    if (direction === 'right') {
      const localItems = JSON.parse(localStorage.getItem('like') || '[]');
      localItems.push(filtredProducts[index]);
      localStorage.setItem('like', JSON.stringify(localItems));
    } else if (direction === 'left') {
      const localItems = JSON.parse(localStorage.getItem('dislike') || '[]');
      localItems.push(filtredProducts[index]);
      localStorage.setItem('dislike', JSON.stringify(localItems));
    }

    // Acción basada en la dirección del swipe
    console.log(`You swiped ${direction} on ${filtredProducts[index].title}`);
  };

  const removeCard = (index: number) => {
    setFiltredProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index),
    );
    setCurrentIndex((prevIndex) => prevIndex - 1);
    setSwipeDirection(undefined); // Resetear la dirección de swipe
  };

  const handleLeftButtonClick = () => {
    console.log('currentIndex', currentIndex);
    if (currentIndex >= 0) {
      setSwipeDirection('left');
    }
  };

  const handleRightButtonClick = () => {
    if (currentIndex >= 0) {
      setSwipeDirection('right');
    }
  };

  const [stepView, setStepView] = useState<number>(0);

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
            {/* <Image
              data={{
                altText: image?.imageMobile?.altText || image?.alt,
                url: image?.imageMobile?.src,
                width: image?.imageMobile?.width,
                height: image?.imageMobile?.height,
              }}
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={image?.cropMobile}
              width="88"
              loading="lazy"
            /> */}
          </div>
          <div style={{flexGrow: 1}}>
            {menuView[stepView]}
            {/* <FirstStepMatch
              collections={customCollections}
              handleSelectCollection={handleSelectCollection}
              isSelectedCollection={isSelectedCollection}
            /> */}
          </div>
          <button
            className="flex w-full max-w-[300px] items-center justify-center rounded-full bg-[#323232] py-2 text-white "
            onClick={() => setStepView(stepView + 1)}
          >
            Next
          </button>

          {/* <div className="flex w-full gap-2 justify-center px-[36px]">
            {customCollections.map((collection, index) => (
              <Chip
                label={collection.title}
                isSelected={isSelectedCollection(collection)}
                key={collection.title}
                onClick={() => handleSelectCollection(collection)}
              />
            ))}
          </div>
          <div>
            {filtersByCollection.length > 0 && (
              <div className="flex flex-col gap-4">
                {filtersByCollection.map((filter) => (
                  <div className="flex flex-col gap-2" key={filter.title}>
                    <div className="flex w-full items-center justify-center">
                      <p className="font-semibold">{filter.collectionName}</p>
                    </div>
                    <div className="flex gap-2">
                      {filter.values.map((value) => (
                        <div
                          className={`cursor-pointer ${isSelectedFilter(filter.collectionName, value) ? 'bg-stone-900 text-white' : 'bg-neutral-200 text-neutral-400'} rounded-full px-6 py-2 select-none`}
                          key={value}
                          onClick={() =>
                            handleSelectedFilterCollectionValue(filter, value)
                          }
                        >
                          <p>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex w-full grow justify-center px-[36px]">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <div className="size-full flex justify-center items-center max-w-[500px] rounded-[24px] bg-white">
                {filtredProducts.length > 0 &&
                  !isLoading &&
                  filtredProducts.map((product, index) => (
                    <SwipeableCard
                      key={product.title}
                      index={index} // Aseguramos que la tarjeta superior tenga el índice correcto
                      product={product}
                      onSwipe={swipe}
                      onCardLeftScreen={removeCard}
                      swipeDirection={
                        index === currentIndex ? swipeDirection : undefined
                      }
                    />
                  ))}
              </div>
            )}
          </div>
          {filtredProducts.length > 0 && (
            <div className="flex gap-4">
              <div className="cursor-pointer" onClick={handleLeftButtonClick}>
                <DislikeIcon className="text-red-400" />
              </div>
              <div
                className="cursor-pointer active:scale-95 transition duration-300"
                onClick={handleRightButtonClick}
              >
                <LikeIcon className="text-green-300" />
              </div>
            </div>
          )} */}
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
