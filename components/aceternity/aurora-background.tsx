"use client";
import { cn } from "@/lib/utils";
import React from "react";

export function AuroraBackground({
  className,
  children,
  primaryColor = "hsl(47, 100%, 50%)",
  secondaryColor = "hsl(0, 0%, 80%)",
  size = "40%",
  blur = "60px",
  position = { x: 0, y: 0 },
  svgOpacity = 0.25
}: {
  className?: string;
  children?: React.ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  size?: string;
  blur?: string;
  position?: { x: number; y: number };
  svgOpacity?: number;
}) {
  return (
    <div
      className={cn(
        "w-full relative bg-background overflow-visible",
        className
      )}
    >
      <div
        className="absolute inset-0 overflow-visible opacity-50"
        style={{
          zIndex: 1
        }}
      >
        <div
          style={{
            position: "absolute",
            top: `calc(50% - ${size} + ${position.y}px)`,
            left: `calc(50% - ${size} + ${position.x}px)`,
            width: `calc(2 * ${size})`,
            height: `calc(2 * ${size})`,
            background: `radial-gradient(circle at center, ${primaryColor}, transparent)`,
            filter: `blur(${blur})`,
            opacity: svgOpacity
          }}
          className="animate-aurora"
        />
        <div
          style={{
            position: "absolute",
            top: `calc(50% - ${size} - ${position.y}px)`,
            right: `calc(50% - ${size} - ${position.x}px)`,
            width: `calc(2 * ${size})`,
            height: `calc(2 * ${size})`,
            background: `radial-gradient(circle at center, ${secondaryColor}, transparent)`,
            filter: `blur(${blur})`,
            opacity: svgOpacity
          }}
          className="animate-aurora"
        />
      </div>
      {children}
    </div>
  );
} 