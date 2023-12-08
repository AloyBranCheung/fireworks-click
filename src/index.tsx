import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export interface FireworkConfig {
  clientX: number;
  clientY: number;
  color: string;
}

const Fireworks: React.FunctionComponent = () => {
  const [stack, setStack] = useState<FireworkConfig[]>([]);

  const FIREWORK_DIMENSIONS = {
    x: 6.25,
    y: 6.25,
  };

  const NUM_FIREWORKS = 75;

  const OFFSET = 100;

  const randomRange = (range = OFFSET) => Math.random() * range;

  useEffect(() => {
    const colors = ["#711DB0", "#C21292", "#EF4040", "#FFA732"];
    const randomColor = () => colors[Math.floor(randomRange(colors.length))];
    const handleMouseDown = (e: MouseEvent) => {
      const { clientX, clientY } = e;

      const color = randomColor();

      setStack((prevStack: FireworkConfig[]) => [
        ...prevStack,
        ...new Array(NUM_FIREWORKS).fill(0).map(() => ({
          clientX: clientX - FIREWORK_DIMENSIONS.x / 2 + randomRange(),
          clientY: clientY - FIREWORK_DIMENSIONS.y / 2 + randomRange(),
          color,
        })),
      ]);

      setTimeout(() => {
        setStack((prevStack: FireworkConfig[]) =>
          prevStack.slice(NUM_FIREWORKS)
        );
      }, 300);
    };

    window.addEventListener("mousedown", handleMouseDown);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [FIREWORK_DIMENSIONS.x, FIREWORK_DIMENSIONS.y]);
  return createPortal(
    <AnimatePresence>
      {stack.map((coords: FireworkConfig) => {
        const top = coords.clientY - OFFSET / 2 - 50;
        const left = coords.clientX - OFFSET / 2;
        const randomTop = randomRange(601) - 301 + top;
        const randomLeft = randomRange(601) - 301 + left;

        return (
          <motion.div
            key={`${coords.clientY}-${coords.clientX}`}
            initial={{
              top,
              left,
              position: "fixed",
              backgroundColor: coords.color,
              height: FIREWORK_DIMENSIONS.y,
              width: FIREWORK_DIMENSIONS.x,
              opacity: 0,
              zIndex: 999,
            }}
            animate={{
              opacity: [0, 80, 90, 100],
              top: randomTop,
              left: randomLeft,
              zIndex: 999,
            }}
            exit={{
              opacity: 0,
              top: randomTop + 100,
              left: randomLeft + 5,
              zIndex: 999,
            }}
            transition={{ duration: 0.6 }}
          />
        );
      })}
    </AnimatePresence>,
    document.body
  );
};

export default Fireworks;
