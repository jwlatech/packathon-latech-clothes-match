import {useEffect, useState} from 'react';

import {Container} from '~/components/Container';
import {Image} from '~/components';
import {getAspectRatioFromPercentage} from '~/lib/utils';

import {Schema} from './MatchExperienceResults.schema';
import type {MatchExperienceResultsCms} from './MatchExperienceResults.types';
import {useNavigate} from '@remix-run/react';

interface LocalProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku: string;
  weight: number;
  weightUnit: 'KILOGRAMS' | 'GRAMS'; // Adjust if there are other units
  image: IImage;
  price: Price;
  sellingPlanAllocations: {edges: any[]}; // Adjust as per actual structure
  compareAtPrice: string | null; // Consider using a numeric type if you need to perform calculations
  selectedOptions: SelectedOption[];
  product: IProduct;
}

interface IImage {
  altText: string | null;
  height: number;
  id: string;
  url: string;
  width: number;
}

interface IProduct {
  handle: string;
  id: string;
  productType: string; // Adjust type as per actual usage
  title: string;
  tags: string[];
}

interface SelectedOption {
  name: string;
  value: string;
}

interface Price {
  currencyCode: string;
  amount: string; // Consider using a numeric type if you need to perform calculations
}

function ProductCard({
  cms,
  handleSelectProduct,
  product,
  selected,
}: {
  cms: MatchExperienceResultsCms;
  handleSelectProduct: (product: LocalProductVariant) => void;
  product: LocalProductVariant;
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
          backgroundImage: `url(${product.image.url})`,
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
        <span>$50</span>
      </div>
    </div>
  );
}

export function MatchExperienceResults({
  cms,
}: {
  cms: MatchExperienceResultsCms;
}) {
  const [products, setProducts] = useState<LocalProductVariant[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (
      localStorage.getItem('like') === null ||
      localStorage.getItem('like') === '[]'
    ) {
      navigate('/pages/match');
    }
    setProducts(JSON.parse(localStorage.getItem('like') || '[]'));
  }, []);

  const recommendedProducts: any[] = [];
  const [selectedProducts, setSelectedProducts] = useState<
    LocalProductVariant[]
  >([...products]);

  const handleSelectProduct = (product: LocalProductVariant) => {
    if (selectedProducts.includes(product)) {
      setSelectedProducts(selectedProducts.filter((p) => p !== product));
    } else {
      setSelectedProducts([...selectedProducts, product]);
    }
  };
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
        <button className="w-full rounded-full bg-[#323232] px-[24px] py-[16px] font-[14px] text-white">
          Add selection to cart
        </button>
        <span className="mt-[10px] text-center text-white">
          *Add selected products to cart
        </span>
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
