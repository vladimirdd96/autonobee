"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const WavyBackground = ({
  children,
  className,
  colors,
  blur = 10,
  speed = "fast",
  backgroundOpacity = 0.1,
}: {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  blur?: number;
  speed?: "slow" | "fast";
  backgroundOpacity?: number;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const gradientColors = colors || ["#f9b72d", "#cccccc", "#ffffff"];
    const animationDuration = speed === "slow" ? "20s" : "10s";

    const createGradient = () => {
      const gradient = document.createElement("div");
      gradient.style.position = "absolute";
      gradient.style.width = "200%";
      gradient.style.height = "200%";
      gradient.style.top = "-50%";
      gradient.style.left = "-50%";
      gradient.style.background = `radial-gradient(circle at center, ${gradientColors.join(", ")})`;
      gradient.style.opacity = backgroundOpacity.toString();
      gradient.style.animation = `rotate ${animationDuration} linear infinite`;
      gradient.style.filter = `blur(${blur}px)`;
      gradient.style.zIndex = "-1";
      return gradient;
    };

    const gradient = createGradient();
    container.appendChild(gradient);

    // Add keyframes for rotation animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes rotate {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      container.removeChild(gradient);
      document.head.removeChild(style);
    };
  }, [colors, blur, speed, backgroundOpacity]);

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)}>
      {children}
    </div>
  );
}; 