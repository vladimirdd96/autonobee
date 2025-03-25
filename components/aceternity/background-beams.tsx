"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("animate");
    }
  }, [isInView, controls]);

  return (
    <div
      ref={ref}
      className={cn(
        "relative w-full h-[100vh] overflow-hidden bg-background",
        className
      )}
    >
      <div className="relative z-20">{children}</div>
    </div>
  );
}; 