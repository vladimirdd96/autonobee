"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface Step {
  title: string;
  description: string;
}

interface MultiStepLoaderProps {
  steps: Step[];
}

export function MultiStepLoader({ steps }: MultiStepLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          setCompletedSteps((completed) => [...completed, prev]);
          return prev + 1;
        }
        clearInterval(timer);
        setCompletedSteps((completed) => [...completed, prev]);
        return prev;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, [steps.length]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isActive = currentStep === index;
          const isCompleted = completedSteps.includes(index);

          return (
            <motion.div
              key={step.title}
              className={`p-6 rounded-lg border ${
                isActive
                  ? "border-primary bg-primary/5"
                  : isCompleted
                  ? "border-primary/50 bg-primary/10"
                  : "border-primary/10 bg-background/50"
              } relative overflow-hidden transition-colors`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? "bg-primary text-background"
                      : isActive
                      ? "border-2 border-primary text-primary"
                      : "border-2 border-primary/20 text-primary/20"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{step.title}</h3>
                  <p className="text-accent/80 text-sm">{step.description}</p>
                </div>
              </div>

              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 2.5, ease: "easeInOut" }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
} 