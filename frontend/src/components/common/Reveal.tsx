'use client';

import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
}

export const Reveal = ({ 
  children, 
  width = "100%", 
  delay = 0.2,
  direction = "up",
  distance = 50
}: RevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const mainControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      mainControls.start("visible");
    }
  }, [isInView, mainControls]);

  const getVariants = () => {
    const initial = {
      opacity: 0,
      x: direction === "left" ? -distance : direction === "right" ? distance : 0,
      y: direction === "up" ? distance : direction === "down" ? -distance : 0,
    };

    return {
      hidden: initial,
      visible: { 
        opacity: 1, 
        x: 0, 
        y: 0,
        transition: { 
          duration: 0.8, 
          delay: delay,
          ease: [0.25, 0.1, 0.25, 1] as any, 
        }
      },
    };
  };

  return (
    <div ref={ref} style={{ position: "relative", width, overflow: "hidden" }}>
      <motion.div
        variants={getVariants()}
        initial="hidden"
        animate={mainControls}
      >
        {children}
      </motion.div>
    </div>
  );
};

export const RevealList = ({ 
  children, 
  staggerDelay = 0.1,
  baseDelay = 0.2 
}: { 
  children: React.ReactNode[], 
  staggerDelay?: number,
  baseDelay?: number 
}) => {
  return (
    <>
      {React.Children.map(children, (child, index) => (
        <Reveal delay={baseDelay + index * staggerDelay}>
          {child}
        </Reveal>
      ))}
    </>
  );
};
