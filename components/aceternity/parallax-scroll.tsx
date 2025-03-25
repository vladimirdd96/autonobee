"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  children,
  className,
  baseVelocity = 5,
  direction = "left",
}: {
  children: React.ReactNode;
  className?: string;
  baseVelocity?: number;
  direction?: "left" | "right";
}) => {
  const [width, setWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    setWidth(containerRef.current.offsetWidth);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-nowrap overflow-hidden relative"
      style={{ width: "100%", whiteSpace: "nowrap" }}
    >
      <motion.div
        ref={scrollerRef}
        className={cn("flex flex-nowrap gap-4", className)}
        animate={{
          x: direction === "left" ? [-width, 0] : [0, -width],
        }}
        transition={{
          duration: baseVelocity * 2,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}; 