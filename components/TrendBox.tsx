"use client";

import { TrendingUp, TrendingDown } from 'lucide-react';

export interface TrendBoxProps {
  title: string;
  percentage: number;
  category: string;
  isIncreasing: boolean;
  isPostCount?: boolean | string;
}

export default function TrendBox({ 
  title, 
  percentage, 
  category, 
  isIncreasing,
  isPostCount = false
}: TrendBoxProps) {
  // Determine the unit to display
  let unit = '%';
  if (isPostCount) {
    unit = typeof isPostCount === 'string' ? isPostCount : 'K';
  }
  
  // Determine the description
  const description = isPostCount ? 'posts' : 'vs last week';
  
  // Calculate width for the progress bar
  const calculateWidth = () => {
    if (!isPostCount) return Math.min(percentage * 3, 100);
    
    // For post counts, scale differently
    return Math.min(percentage * 5, 100);
  };
  
  return (
    <div className="bg-[#000000]/20 backdrop-blur-sm border border-[#f9b72d]/10 rounded-lg p-4 hover:shadow-lg transition-shadow">
      <span className="text-xs font-medium text-[#f9b72d] px-2 py-1 rounded bg-[#f9b72d]/10 mb-2 inline-block">
        {category}
      </span>
      <h3 className="font-semibold text-[#ffffff] mt-2 mb-1">{title}</h3>
      <div className="flex items-center mt-3">
        <div 
          className={`text-sm font-bold flex items-center ${
            isIncreasing ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {isIncreasing ? 
            <TrendingUp className="w-4 h-4 mr-1" /> : 
            <TrendingDown className="w-4 h-4 mr-1" />
          } 
          {percentage}{unit}
        </div>
        <div className="ml-2 text-xs text-[#cccccc]/70">
          {description}
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-[#000000]/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#f9b72d]" 
          style={{ width: `${calculateWidth()}%` }}
        />
      </div>
    </div>
  );
} 