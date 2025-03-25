"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextSpotlightProps {
  children: React.ReactNode;
  className?: string;
  highlightClassName?: string;
  spotlightSize?: number;
  spotlightColor?: string;
}

export const TextSpotlight = ({
  children,
  className,
  highlightClassName,
  spotlightSize = 400,
  spotlightColor = "rgba(249, 183, 45, 0.1)",
}: TextSpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsMounted(true);
    
    const updateMousePosition = (ev: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      
      mousePosition.current = { x, y };
      setPosition({ x, y });
    };
    
    const handleMouseMove = (ev: MouseEvent) => {
      updateMousePosition(ev);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMouseLeave = () => {
    mousePosition.current = { x: 0, y: 0 };
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      onMouseLeave={handleMouseLeave}
    >
      {isMounted && (
        <div
          className="pointer-events-none absolute -inset-px z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            opacity: position.x !== 0 ? 1 : 0,
            background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent)`,
          }}
        />
      )}
      <div className={cn("relative z-20", highlightClassName)}>
        {children}
      </div>
    </div>
  );
}; 