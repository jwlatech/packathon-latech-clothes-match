import {useEffect, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import type {ProductVariant} from '@shopify/hydrogen-react/storefront-api-types';

import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';

import {BYOBAddToCart} from '../BuildYourOwnBundle/BYOBAddToCart';

import {Schema} from './MatchExperienceResults.schema';
import type {MatchExperienceResultsCms} from './MatchExperienceResults.types';

function ProductCard({
  cms,
  handleSelectProduct,
  product,
  selected,
}: {
  cms: MatchExperienceResultsCms;
  handleSelectProduct: (product: ProductVariant) => void;
  product: ProductVariant;
  selected: boolean;
}) {
  const {icons} = cms;
  const {nonIcon, yesIcon, aspectMobile} = icons;
  return (
    <div
      className="flex cursor-pointer flex-col"
      onClick={() => handleSelectProduct(product)}
    >
      <div
        className="relative h-[204px] w-[151px] rounded-[20px]"
        style={{
          backgroundImage: `url(${product.image?.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute right-[12px] top-[12px] size-[32px]">
          {selected ? (
            <Image
              data={{
                altText: yesIcon?.imageMobile?.altText || yesIcon?.alt,
                url: yesIcon?.imageMobile?.src,
                width: yesIcon?.imageMobile?.width,
                height: yesIcon?.imageMobile?.height,
              }}
              className="bg-transparent"
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={yesIcon?.cropMobile}
              width="32"
              loading="lazy"
            />
          ) : (
            <Image
              data={{
                altText: nonIcon?.imageMobile?.altText || nonIcon?.alt,
                url: nonIcon?.imageMobile?.src,
                width: nonIcon?.imageMobile?.width,
                height: nonIcon?.imageMobile?.height,
              }}
              className="bg-transparent"
              aspectRatio={getAspectRatioFromPercentage(aspectMobile)}
              crop={nonIcon?.cropMobile}
              width="88"
              loading="lazy"
            />
          )}
        </div>
      </div>
      <div className="mt-[12px] max-w-[121px]">
        <p className="truncate font-bold">{product.product.title}</p>
      </div>
      <div className="mt-[2px]">
        <span>${product.price.amount}</span>
      </div>
    </div>
  );
}

export function MatchExperienceResults({
  cms,
}: {
  cms: MatchExperienceResultsCms;
}) {
  const [products, setProducts] = useState<ProductVariant[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<ProductVariant[]>([
    ...products,
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      localStorage.getItem('like') === null ||
      localStorage.getItem('like') === '[]'
    ) {
      navigate('/pages/match');
    }
    const products = JSON.parse(localStorage.getItem('like') || '[]');
    setProducts(products);
    setSelectedProducts(products);
  }, []);

  const recommendedProducts: any[] = [];

  const handleSelectProduct = (product: ProductVariant) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  console.log(selectedProducts);
  return (
    <Container container={cms.container}>
      <div
        className="fixed bottom-0 z-50 flex h-[112px] w-full flex-col rounded-t-[16px] bg-blue-500 px-[16px] py-[10px]"
        style={{
          background:
            'linear-gradient(0deg, rgba(0, 0, 0, 0.40) 0%, rgba(255, 255, 255, 0.40) 100%)',
          boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <BYOBAddToCart
          className="rounded-[100px] border-none bg-[#323232] px-[24px] py-[16px] text-[14px] text-white"
          bundle={selectedProducts}
          addToCartUnlocked={true}
          total={`$${selectedProducts
            .reduce((a, b) => a + Number(b.price.amount), 0)
            .toFixed(2)
            .toString()}`}
        />
        <span className="mt-[10px] text-center text-white">
          *Add selected products to cart
        </span>
        {/* <button className="w-full rounded-full bg-[#323232] px-[24px] py-[16px] font-[14px] text-white">
          Add selection to cart
        </button>
        <span className="mt-[10px] text-center text-white">
          *Add selected products to cart
        </span> */}
      </div>
      <div className="flex flex-col justify-center">
        <div className="flex flex-col justify-center gap-5 text-center">
          <div className="px-[16px]">
            <div>
              <h4>Recommended Matches</h4>
            </div>
            <div>
              <p>
                All the products have been specially selected for you, and the
                best part? They`re in your size!
              </p>
            </div>
          </div>
          <div
            id="recommendedProducts"
            className="flex flex-row gap-4 overflow-x-auto px-[16px] text-left"
          >
            {recommendedProducts.map((product, index) => (
              <ProductCard
                handleSelectProduct={handleSelectProduct}
                product={product}
                selected={selectedProducts.includes(product)}
                cms={cms}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 flex flex-col justify-center">
          <div className="text-center">
            <h4>Your match selection</h4>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-5">
            {products.map((product, index) => (
              <ProductCard
                handleSelectProduct={handleSelectProduct}
                product={product}
                selected={selectedProducts.includes(product)}
                cms={cms}
                key={index}
              />
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}

MatchExperienceResults.displayName = 'MatchExperienceResults';
MatchExperienceResults.Schema = Schema;
