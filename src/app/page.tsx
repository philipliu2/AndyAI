"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import { Memory, memories as staticMemories } from "@/data/memories";

const LOCAL_STORAGE_KEY = "andyai_custom_memories";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const [customMemories, setCustomMemories] = useState<Memory[]>([]);

  // Load custom memories from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        setCustomMemories(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse custom memories", e);
      }
    }
  }, []);

  // Listen for storage changes (for when admin page adds new memories)
  useEffect(() => {
    const handleStorage = () => {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        try {
          setCustomMemories(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse custom memories", e);
        }
      } else {
        setCustomMemories([]);
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Combine static and custom memories
  const allMemories = useMemo(() => {
    return [...staticMemories, ...customMemories];
  }, [customMemories]);

  const filteredMemories = useMemo(() => {
    // Sort by date
    const sorted = [...allMemories].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    let filtered = sorted;

    // Filter by category
    if (activeCategory !== "all") {
      filtered = filtered.filter((m) => m.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.title.toLowerCase().includes(query) ||
          m.content.toLowerCase().includes(query) ||
          m.excerpt.toLowerCase().includes(query) ||
          m.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return filtered;
  }, [allMemories, activeCategory, searchQuery, sortOrder]);

  // Count milestones (including custom)
  const milestoneCount = allMemories.filter((m) => m.milestone).length;

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-pink-light/50 to-transparent py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-handwritten text-4xl md:text-5xl text-text-brown mb-4">
            ✨ 时光记忆 ✨
          </h1>
          <p className="text-text-brown-light mb-6">
            记录小Andy的每一个珍贵时刻
          </p>
          <div className="flex justify-center gap-8 text-sm">
            <div className="bg-bg-white rounded-full px-6 py-3 shadow-sm border border-border-beige">
              <span className="text-pink-main font-semibold">{allMemories.length}</span> 条记忆
            </div>
            <div className="bg-bg-white rounded-full px-6 py-3 shadow-sm border border-border-beige">
              <span className="text-gold-warm font-semibold">{milestoneCount}</span> 个里程碑
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} />

      {/* Category Filter & Sort */}
      <section className="px-4 mb-4">
        <div className="flex flex-wrap items-center justify-center gap-4">
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          {/* Sort Toggle */}
          <div className="flex items-center gap-2 bg-bg-white rounded-full px-4 py-2 shadow-sm border border-border-beige">
            <span className="text-text-brown-light text-sm">排序：</span>
            <button
              onClick={() => setSortOrder("desc")}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                sortOrder === "desc"
                  ? "bg-pink-main text-white"
                  : "text-text-brown hover:bg-pink-light"
              }`}
            >
              最新优先
            </button>
            <button
              onClick={() => setSortOrder("asc")}
              className={`px-3 py-1 rounded-full text-sm transition-all ${
                sortOrder === "asc"
                  ? "bg-pink-main text-white"
                  : "text-text-brown hover:bg-pink-light"
              }`}
            >
              最早优先
            </button>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pb-16 w-full">
        {filteredMemories.length > 0 ? (
          <Timeline memories={filteredMemories} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌸</div>
            <p className="text-text-brown-light">
              {searchQuery
                ? "没有找到匹配的记录"
                : activeCategory !== "all"
                ? "暂无这类记录"
                : "暂无记录"}
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
