import {useNavigate} from '@remix-run/react';
import { ProductVariant } from '@shopify/hydrogen-react/storefront-api-types';
import React, {useEffect, useState} from 'react';
import {
  DislikeIcon,
  IProductCard,
  LikeIcon,
  SwipeableCard,
} from '~/sections/MatchExperience';

interface ThirdStepMatchProps {
  filtredProducts: IProductCard[];
  setFiltredProducts: React.Dispatch<React.SetStateAction<IProductCard[]>>;
  variantsProducts: ProductVariant[];
}

const ThirdStepMatch = ({
  filtredProducts,
  setFiltredProducts,
  variantsProducts,
}: ThirdStepMatchProps) => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState<number>(
    filtredProducts.length - 1,
  );
  const [swipeDirection, setSwipeDirection] = useState<
    'left' | 'right' | undefined
  >(undefined);

  const swipe = (index: number, direction: string) => {
    if (index < 0) return;

    const selectedProduct = filtredProducts[index];
    const newVariantsProducts = variantsProducts.filter(
      (variant) => variant.product.handle === selectedProduct.title,
    );

    if (direction === 'right') {
      const localItems = JSON.parse(localStorage.getItem('like') || '[]');
      const newLocalItems = [...localItems, ...newVariantsProducts];
      localStorage.setItem('like', JSON.stringify(newLocalItems));
    } else if (direction === 'left') {
      const localItems = JSON.parse(localStorage.getItem('dislike') || '[]');
      const newLocalItems = [...localItems, ...newVariantsProducts];
      localStorage.setItem('dislike', JSON.stringify(newLocalItems));
    }
  };

  const removeCard = (index: number) => {
    setFiltredProducts((prevProducts) =>
      prevProducts.filter((_, i) => i !== index),
    );
    setCurrentIndex((prevIndex) => prevIndex - 1);
    setSwipeDirection(undefined); // Resetear la dirección de swipe
  };

  const handleLeftButtonClick = () => {
    if (currentIndex >= 0) {
      setSwipeDirection('left');
    }
  };

  const handleRightButtonClick = () => {
    if (currentIndex >= 0) {
      setSwipeDirection('right');
    }
  };

  useEffect(() => {
    if (filtredProducts.length == 0) {
      navigate('/pages/match-results');
    }
  }, [filtredProducts]);

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-[70%] justify-center">
        {filtredProducts.map((product, index) => (
          <SwipeableCard
            key={product.title}
            index={index} // Aseguramos que la tarjeta superior tenga el índice correcto
            product={product}
            onSwipe={swipe}
            onCardLeftScreen={removeCard}
            swipeDirection={index === currentIndex ? swipeDirection : undefined}
          />
        ))}
      </div>
      {filtredProducts.length > 0 && (
        <div className="flex gap-4">
          <div className="cursor-pointer" onClick={handleLeftButtonClick}>
            <DislikeIcon className="text-red-400" />
          </div>
          <div
            className="cursor-pointer transition duration-300 active:scale-95"
            onClick={handleRightButtonClick}
          >
            <LikeIcon className="text-green-300" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdStepMatch;
