"use client";

import Image from 'next/image';
import { Copy, MoreVertical } from 'lucide-react';

interface ContentCardProps {
  title: string;
  content: string;
  image?: string;
  date: string;
  category: string;
}

export default function ContentCard({ title, content, image, date, category }: ContentCardProps) {
  return (
    <div className="bg-grayDark rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      {image && (
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-5">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-primary px-2 py-1 rounded bg-primary/10">
            {category}
          </span>
          <span className="text-xs text-accent/70">{date}</span>
        </div>
        <h3 className="font-semibold text-lg text-accent mb-2">{title}</h3>
        <p className="text-accent/80 text-sm mb-4">{content}</p>
        <div className="flex justify-between items-center">
          <button className="text-xs text-primary hover:text-primary/80 flex items-center">
            <Copy className="w-4 h-4 mr-1" />
            Copy Content
          </button>
          <button className="text-accent/70 hover:text-accent">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
} 