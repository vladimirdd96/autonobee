"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, createContext, useContext } from "react";

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined);

export const CardHoverEffect = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [isMouseEntered, setIsMouseEntered] = useState(false);

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <div
        className={cn(
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-10",
          className
        )}
        onMouseEnter={() => setIsMouseEntered(true)}
        onMouseLeave={() => setIsMouseEntered(false)}
      >
        {children}
      </div>
    </MouseEnterContext.Provider>
  );
};

export const CardContainer = ({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseEntered] = useMouseEnter();

  return (
    <div
      className={cn("relative h-full w-full p-4", containerClassName)}
    >
      <div
        className={cn(
          "relative h-full w-full rounded-xl p-6 shadow-xl transition-all duration-200",
          className,
          {
            "bg-accent/10 shadow-accent/5": isMouseEntered,
            "bg-background/80 shadow-background/10": !isMouseEntered,
          }
        )}
        ref={containerRef}
      >
        {children}
      </div>
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3 className={cn("mt-4 text-xl font-bold text-accent", className)}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p className={cn("mt-2 text-accent/80", className)}>
      {children}
    </p>
  );
};

export const CardIcon = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("text-accent", className)}>
      {children}
    </div>
  );
};

function useMouseEnter() {
  const context = useContext(MouseEnterContext);
  if (context === undefined) {
    throw new Error("useMouseEnter must be used within a MouseEnterProvider");
  }
  return context;
} 