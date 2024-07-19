import React, {useEffect} from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
  animate,
} from 'framer-motion';
import {Product} from '@shopify/hydrogen-react/storefront-api-types';

interface SwipeableCardProps {
  product: Product;
  index: number;
  onSwipe: (index: number, direction: string) => void;
  onCardLeftScreen: (index: number) => void;
  swipeDirection?: "left" | "right";
}

const SwipeableCard: React.FC<SwipeableCardProps> = ({
  product,
  index,
  onSwipe,
  onCardLeftScreen,
  swipeDirection,
}) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20]);

  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const dislikeOpacity = useTransform(x, [-50, -150], [0, 1]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: { offset: { x: number } }
  ) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      onSwipe(index, "right");
      onCardLeftScreen(index);
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe(index, "left");
      onCardLeftScreen(index);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 }); // Animar suavemente de vuelta al centro
    }
  };

  useEffect(() => {
    if (swipeDirection) {
      const direction = swipeDirection === "right" ? 200 : -200;
      animate(x, direction, {
        type: "spring",
        stiffness: 300,
        damping: 30,
        onComplete: () => {
          onSwipe(index, swipeDirection);
          onCardLeftScreen(index);
        }
      });
    }
  }, [swipeDirection, x, onSwipe, onCardLeftScreen, index]);

  return (
    <AnimatePresence>
      <motion.div
        style={{
          position: "absolute",
          width: "300px",
          height: "400px",
          backgroundColor: "#023ED4", // Color de fondo
          borderRadius: "10px",
          cursor: "grab",
          x,
          rotate,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
        drag="x"
        dragConstraints={{ left: -300, right: 300 }}
        onDragEnd={handleDragEnd}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            backgroundColor: "green",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            opacity: likeOpacity,
          }}
        >
          Like
        </motion.div>
        <motion.div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            backgroundColor: "red",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            opacity: dislikeOpacity,
          }}
        >
          Dislike
        </motion.div>
        {/* <h1 style={{ fontSize: "24px", fontWeight: "bold", color: "#000000" }}>
          {product.title}
        </h1> */}
        <img
          src={product.featuredImage?.url}
          alt={product.title}
          style={{ width: "80%", height: "80%", objectFit: "contain" }}
          draggable="false"
        />
      </motion.div>
    </AnimatePresence>
  );
};

export default SwipeableCard;