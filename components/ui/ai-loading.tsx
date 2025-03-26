"use client";

import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { LoadingDots } from "./loading-dots";

export const AILoading = () => {
  return (
    <div className="flex items-start space-x-3 p-3">
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary" />
        </div>
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <div className="flex-1">
        <div className="bg-grayDark/50 rounded-lg p-3">
          <div className="text-accent/80 text-sm mb-2">AI is thinking</div>
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}; 