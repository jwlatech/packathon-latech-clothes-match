import {useLoaderData} from '@remix-run/react';
import {useInView} from 'react-intersection-observer';
import TinderCard from 'react-tinder-card';
import {useState} from 'react';

import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';
import {useProductsFromHandles} from '~/hooks';

import type {MatchExperienceCms} from './MatchExperience.types';
import {Schema} from './MatchExperience.schema';

export function MatchExperience({cms}: {cms: MatchExperienceCms}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });
  const {media, section} = cms;
  const {image, yesImage, noImage, aspectMobile} = {...media};
  const data: any = useLoaderData();
  const productHandles = [];
  for (const collection of data.collections) {
    for (const product of collection.products.edges) {
      productHandles.push(product.node.handle);
    }
  }
  const products = useProductsFromHandles(productHandles);

  const [lastDirection, setLastDirection] = useState();

  const swiped = (direction: any, nameToDelete: any) => {
    console.log('removing: ' + nameToDelete);
    setLastDirection(direction);
  };

  const outOfFrame = (name: any) => {
    console.log(name + ' left the screen!');
  };
  console.log(products);
  return (
    <Container container={cms.container}>
      <div
        className={`${section?.fullBleed ? '' : 'px-contained'} ${
          section?.verticalPadding ? 'py-contained' : ''
        }`}
      >
        <div className="flex h-[calc(100vh-200px)] flex-col items-center justify-center gap-5">
          <Image
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
          />
          <div
            className="flex w-full grow justify-center px-[36px] relative"
            id="cardContainer"
          >
            {products.map((product: any) => (
              <TinderCard
                key={product.id}
                className="swipe absolute h-full"
                onSwipe={(dir) => swiped(dir, product.title)}
                onCardLeftScreen={() => outOfFrame(product.title)}
              >
                <div
                  className="size-full max-w-[500px] rounded-[24px]"
                  style={{
                    backgroundImage: `url(${product.featuredImage.url})`,
                    backgroundPosition: 'center',
                  }}
                >
                  <h3 className="text-transparent">{product.title}</h3>
                </div>
              </TinderCard>
            ))}
          </div>
          <div>
            <h4>Nombre del producto</h4>
          </div>
          <div className="flex flex-row justify-center gap-5">
            <Image
              data={{
                altText: noImage?.imageMobile?.altText || noImage?.alt,
                url: noImage?.imageMobile?.src,
                width: noImage?.imageMobile?.width,
                height: noImage?.imageMobile?.height,
              }}
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={noImage?.cropMobile}
              width="66"
              loading="lazy"
            />
            <Image
              data={{
                altText: yesImage?.imageMobile?.altText || yesImage?.alt,
                url: yesImage?.imageMobile?.src,
                width: yesImage?.imageMobile?.width,
                height: yesImage?.imageMobile?.height,
              }}
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={yesImage?.cropMobile}
              width="66"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </Container>
  );
}

MatchExperience.displayName = 'MatchExperience';
MatchExperience.Schema = Schema;
