"use client";
import React, { useState, ReactNode } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

type AnimatedTooltipProps = {
  id: number;
  name: string;
  children: ReactNode;
};

export const AnimatedTooltip = ({ id, name, children }: AnimatedTooltipProps) => {
  const [hovered, setHovered] = useState(false);
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);

  const rotate = useSpring(useTransform(x, [-100, 100], [-45, 45]), springConfig);
  const translateX = useSpring(useTransform(x, [-100, 100], [-50, 50]), springConfig);

  const handleMouseMove = (event: any) => {
    const halfWidth = event.currentTarget.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth);
  };

  return (
    <div
      className="group relative inline-block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <AnimatePresence mode="popLayout">
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.6 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 260,
                damping: 10,
              },
            }}
            exit={{ opacity: 0, y: 20, scale: 0.6 }}
            style={{
              translateX,
              rotate,
              whiteSpace: "nowrap",
            }}
            className="absolute top-10 left-1/2 z-50 -translate-x-1/2 rounded-md px-3 py-2 text-xs shadow-xl text-primary"
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>

      <div onMouseMove={handleMouseMove} className="cursor-pointer">
        {children}
      </div>
    </div>
  );
};
