"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const AnimatedGradientText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <motion.span
      className={cn(
        "bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/70 to-primary/50",
        className
      )}
      initial={{ backgroundPosition: "0% 50%" }}
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      {text}
    </motion.span>
  );
}; 