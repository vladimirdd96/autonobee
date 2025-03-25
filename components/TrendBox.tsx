"use client";

import { TrendingUp, TrendingDown } from 'lucide-react';

interface TrendBoxProps {
  title: string;
  percentage: number;
  category: string;
  isIncreasing: boolean;
}

export default function TrendBox({ title, percentage, category, isIncreasing }: TrendBoxProps) {
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
          {percentage}%
        </div>
        <div className="ml-2 text-xs text-[#cccccc]/70">
          vs last week
        </div>
      </div>
      <div className="mt-4 h-2 w-full bg-[#000000]/40 rounded-full overflow-hidden">
        <div 
          className="h-full bg-[#f9b72d]" 
          style={{ width: `${Math.min(percentage * 3, 100)}%` }}
        />
      </div>
    </div>
  );
} 