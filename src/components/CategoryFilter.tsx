"use client";

import { categories } from "@/data/memories";

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.key}
          onClick={() => onCategoryChange(cat.key)}
          className={`px-4 py-2 rounded-full text-sm transition-all ${
            activeCategory === cat.key
              ? "bg-gradient-to-r from-pink-main to-blue-sky text-white shadow-md scale-105"
              : "bg-bg-white text-text-brown hover:bg-pink-light border border-border-beige"
          }`}
        >
          {cat.emoji} {cat.label}
        </button>
      ))}
    </div>
  );
}
