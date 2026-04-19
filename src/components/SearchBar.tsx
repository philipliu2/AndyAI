"use client";

import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索记忆..."
          className="w-full px-6 py-3 rounded-full bg-bg-white border border-border-beige shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-main/50 focus:border-pink-main transition-all text-text-brown placeholder:text-text-brown-light/50"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-brown-light">
          🔍
        </span>
      </div>
    </div>
  );
}
