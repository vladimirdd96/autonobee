"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  items: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duplicateItems, setDuplicateItems] = useState(items);

  useEffect(() => {
    // Duplicate items to create seamless loop
    setDuplicateItems([...items, ...items]);
  }, [items]);

  const baseVelocity = speed === "fast" ? 2 : 1;
  const directionMultiplier = direction === "left" ? -1 : 1;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex flex-nowrap overflow-hidden",
        className
      )}
      style={{
        maskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
      }}
    >
      <motion.div
        className="flex gap-4 min-w-full"
        initial={{ x: 0 }}
        animate={{ x: `${100 * directionMultiplier}%` }}
        transition={{
          duration: 20 / baseVelocity,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        {...(pauseOnHover && {
          whileHover: { animationPlayState: "paused" },
        })}
      >
        {duplicateItems.map((item, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 px-4 py-3 bg-gradient-to-br from-background/30 via-grayDark/20 to-background/40 backdrop-blur-sm rounded-xl border border-primary/10"
          >
            {item.icon && (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center mb-3">
                {item.icon}
              </div>
            )}
            <h3 className="text-sm font-semibold text-accent mb-1">{item.title}</h3>
            <p className="text-xs text-accent/70">{item.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}; 