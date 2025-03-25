"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - left;
    const mouseY = e.clientY - top;

    const rotateXValue = ((mouseY - height / 2) / height) * 20;
    const rotateYValue = ((mouseX - width / 2) / width) * 20;

    setRotateX(-rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={containerRef}
      className={cn("relative perspective-1000", containerClassName)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className={cn("preserve-3d", className)}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const CardBody = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("h-full w-full", className)}>
      {children}
    </div>
  );
};

export const CardItem = ({
  children,
  className,
  translateZ = 0,
}: {
  children: React.ReactNode;
  className?: string;
  translateZ?: number;
}) => {
  return (
    <motion.div
      className={cn("preserve-3d", className)}
      style={{
        transform: `translateZ(${translateZ}px)`,
      }}
    >
      {children}
    </motion.div>
  );
}; 