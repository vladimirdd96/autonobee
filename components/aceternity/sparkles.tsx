"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type SparklesProps = {
  children: React.ReactNode;
  className?: string;
  color?: string;
  count?: number;
  minSize?: number;
  maxSize?: number;
  style?: React.CSSProperties;
};

interface Sparkle {
  id: string;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  createdAt: number;
  style?: React.CSSProperties;
}

const useRandomInterval = (
  callback: () => void,
  minDelay: number,
  maxDelay: number
) => {
  const timeoutId = useRef<number | null>(null);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handleTimeout = () => {
      const nextDelay = Math.random() * (maxDelay - minDelay) + minDelay;
      timeoutId.current = window.setTimeout(() => {
        savedCallback.current();
        handleTimeout();
      }, nextDelay);
    };

    handleTimeout();

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
    };
  }, [minDelay, maxDelay]);

  return timeoutId;
};

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const generateSparkle = (
  color: string,
  minSize: number,
  maxSize: number
): Sparkle => {
  return {
    id: String(random(10000, 99999)),
    x: random(0, 100),
    y: random(0, 100),
    size: random(minSize, maxSize),
    duration: Math.random() * 2 + 1,
    delay: Math.random() * 2,
    createdAt: Date.now(),
    style: {
      position: 'absolute',
      top: `${random(0, 100)}%`,
      left: `${random(0, 100)}%`,
      transform: `scale(${Math.random()})`,
    },
  };
};

export function Sparkles({
  children,
  color = "#f9b72d",
  count = 4,
  minSize = 10,
  maxSize = 15,
  className,
  style,
}: SparklesProps) {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useRandomInterval(() => {
    const hasEnoughSparkles = sparkles.length >= count;
    if (hasEnoughSparkles) {
      const oldestSparkle = sparkles.sort((a, b) => a.createdAt - b.createdAt)[0];
      const newSparkles = sparkles
        .filter((sparkle) => sparkle.id !== oldestSparkle.id)
        .concat(generateSparkle(color, minSize, maxSize));
      setSparkles(newSparkles);
    } else {
      setSparkles([...sparkles, generateSparkle(color, minSize, maxSize)]);
    }
  }, 50, 500);

  return (
    <span className={cn("relative inline-block", className)} style={style}>
      {sparkles.map((sparkle) => (
        <SparkleInstance
          key={sparkle.id}
          color={color}
          size={sparkle.size}
          style={sparkle.style || {}}
        />
      ))}
      <span className="relative z-10">{children}</span>
    </span>
  );
}

interface SparkleInstanceProps {
  color: string;
  size: number;
  style: React.CSSProperties;
}

function SparkleInstance({ color, size, style }: SparkleInstanceProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute block"
          style={{ ...style, color }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 160 160"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
              fill="currentColor"
            />
          </svg>
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export const SparklesCore = ({
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleDensity = 100,
  className = "",
  particleColor = "#FFD700",
}: {
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleDensity?: number;
  className?: string;
  particleColor?: string;
}) => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles: Sparkle[] = [];
      for (let i = 0; i < particleDensity; i++) {
        newSparkles.push({
          id: `sparkle-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * (maxSize - minSize) + minSize,
          duration: Math.random() * 2 + 1,
          delay: Math.random() * 2,
          createdAt: Date.now(),
          style: {
            position: 'absolute',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            transform: `scale(${Math.random()})`,
          },
        });
      }
      setSparkles(newSparkles);
    };

    generateSparkles();
  }, [particleDensity, minSize, maxSize]);

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background }}
    >
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            background: particleColor,
            boxShadow: `0 0 ${sparkle.size * 2}px ${particleColor}`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}; 