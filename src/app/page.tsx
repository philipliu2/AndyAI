"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Timeline from "@/components/Timeline";
import CategoryFilter from "@/components/CategoryFilter";
import { memories } from "@/data/memories";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredMemories = useMemo(() => {
    const sorted = [...memories].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (activeCategory === "all") return sorted;
    return sorted.filter((m) => m.category === activeCategory);
  }, [activeCategory]);

  // Count milestones
  const milestoneCount = memories.filter((m) => m.milestone).length;

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
              <span className="text-pink-main font-semibold">{memories.length}</span> 条记忆
            </div>
            <div className="bg-bg-white rounded-full px-6 py-3 shadow-sm border border-border-beige">
              <span className="text-gold-warm font-semibold">{milestoneCount}</span> 个里程碑
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4">
        <CategoryFilter
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      </section>

      {/* Timeline */}
      <main className="flex-1 max-w-4xl mx-auto px-4 pb-16 w-full">
        {filteredMemories.length > 0 ? (
          <Timeline memories={filteredMemories} />
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌸</div>
            <p className="text-text-brown-light">
              暂无{activeCategory !== "all" ? "这类" : ""}记录
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
