"use client";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  rx = "30%",
  ry = "30%",
  className,
  containerClassName,
  borderClassName,
  borderRadius = "1rem",
}: {
  children: React.ReactNode;
  duration?: number;
  rx?: string;
  ry?: string;
  className?: string;
  containerClassName?: string;
  borderClassName?: string;
  borderRadius?: string;
}) => {
  const pathRef = useRef<any>();
  const progress = useMotionValue<number>(0);

  useAnimationFrame((time) => {
    try {
      const length = pathRef.current?.getTotalLength();
      if (length) {
        const pxPerMillisecond = length / duration;
        progress.set((time * pxPerMillisecond) % length);
      }
    } catch (e) {
      // If the element is not rendered yet, just keep the current progress value
      // This ensures smooth transition once the element is ready
    }
  });

  const x = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        return pathRef.current.getPointAtLength(val).x;
      } catch (e) {
        return 0;
      }
    }
  );
  const y = useTransform(
    progress,
    (val) => {
      if (!pathRef.current) return 0;
      try {
        return pathRef.current.getPointAtLength(val).y;
      } catch (e) {
        return 0;
      }
    }
  );

  const transform = useMotionTemplate`translateX(${x}px) translateY(${y}px) translateX(-50%) translateY(-50%)`;

  return (
    <div
      className={cn(
        "relative h-fit w-fit overflow-hidden p-[1px] group",
        containerClassName
      )}
      style={{
        borderRadius: borderRadius,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ borderRadius: `calc(${borderRadius} * 0.96)` }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute h-full w-full"
          width="100%"
          height="100%"
        >
          <rect
            fill="none"
            width="100%"
            height="100%"
            rx={rx}
            ry={ry}
            ref={pathRef}
          />
        </svg>
        <motion.div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            display: "inline-block",
            transform,
          }}
        >
          <div
            className={cn(
              "h-20 w-20 bg-[radial-gradient(var(--color-primary)_40%,transparent_60%)] opacity-[0.8]",
              borderClassName
            )}
          />
        </motion.div>
      </div>

      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-[inherit] bg-background/20 backdrop-blur-sm border border-primary/10 text-sm antialiased transition-colors group-hover:bg-background/30 group-active:bg-background/40",
          className
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        <div className="text-primary/80 group-hover:text-primary transition-colors font-medium">
          {children}
        </div>
      </div>
    </div>
  );
}; 