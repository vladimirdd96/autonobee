"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const MeteorEffect = ({
  count = 20,
  color = "#f9b72d",
  className,
}: {
  count?: number;
  color?: string;
  className?: string;
}) => {
  const [meteors, setMeteors] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  useEffect(() => {
    const newMeteors = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
    }));
    setMeteors(newMeteors);
  }, [count]);

  return (
    <div className={cn("fixed pointer-events-none inset-0 -z-10", className)}>
      {meteors.map((meteor) => (
        <motion.div
          key={meteor.id}
          initial={{
            top: `${meteor.y}%`,
            left: `${meteor.x}%`,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            top: [`${meteor.y}%`, `${meteor.y + 50}%`],
            left: [`${meteor.x}%`, `${meteor.x - 25}%`],
            scale: [0, 1],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatDelay: Math.random() * 3,
            ease: "easeOut",
          }}
          className="absolute h-0.5 w-0.5"
          style={{
            background: color,
            boxShadow: `0 0 ${meteor.size * 2}px ${meteor.size}px ${color}`,
            transform: "rotate(215deg)",
          }}
        >
          <div
            className="absolute h-[100px] w-[1px]"
            style={{
              background: `linear-gradient(to bottom, ${color}, transparent)`,
              transform: "rotate(215deg) translateY(-100%)",
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}; 