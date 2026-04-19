"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Memory, memories as staticMemories } from "@/data/memories";

const LOCAL_STORAGE_KEY = "andyai_custom_memories";

interface MemoryPageProps {
  params: Promise<{ id: string }>;
}

export default function MemoryPage({ params }: MemoryPageProps) {
  const [memory, setMemory] = useState<Memory | null>(null);
  const [allMemories, setAllMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load memory by ID
    const loadMemory = async () => {
      const { id } = await params;

      // Load custom memories from localStorage
      let customMemories: Memory[] = [];
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (stored) {
          try {
            customMemories = JSON.parse(stored);
          } catch (e) {
            console.error("Failed to parse custom memories", e);
          }
        }
      }

      const allMems = [...staticMemories, ...customMemories];
      setAllMemories(allMems);

      const found = allMems.find((m) => m.id === id);
      setMemory(found || null);
      setLoading(false);
    };

    loadMemory();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col paper-texture">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-text-brown-light">加载中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!memory) {
    return (
      <div className="min-h-screen flex flex-col paper-texture">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          <div className="text-6xl mb-4">🔍</div>
          <p className="text-text-brown-light mb-4">未找到这条记录</p>
          <Link href="/" className="text-pink-main hover:text-text-brown">
            ← 返回首页
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Get adjacent memories for navigation
  const sortedMemories = [...allMemories].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentIndex = sortedMemories.findIndex((m) => m.id === memory.id);
  const prevMemory = sortedMemories[currentIndex + 1];
  const nextMemory = sortedMemories[currentIndex - 1];

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-pink-main hover:text-text-brown transition-colors mb-8"
        >
          ← 返回时光轴
        </Link>

        {/* Main memory card */}
        <article className="bg-bg-white rounded-2xl shadow-lg overflow-hidden border border-border-beige">
          {/* Milestone ribbon */}
          {memory.milestone && memory.milestoneLabel && (
            <div className="bg-gradient-to-r from-pink-main to-blue-sky p-4 text-center">
              <span className="text-white font-handwritten text-xl">
                🎀 {memory.milestoneLabel}
              </span>
            </div>
          )}

          {/* Date header */}
          <div className="bg-gradient-to-r from-pink-light/50 to-blue-light/50 p-6 text-center border-b border-border-beige">
            <p className="text-text-brown-light text-sm mb-1">
              {new Date(memory.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
                weekday: "long",
              })}
            </p>
            <h1 className="font-handwritten text-3xl text-text-brown">
              {memory.title}
            </h1>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Photo */}
            <div className="mb-8 text-center">
              {memory.photos && memory.photos.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-4">
                  {memory.photos.map((photo, idx) => (
                    <div key={idx} className="polaroid w-72 h-80 overflow-hidden">
                      <img
                        src={photo}
                        alt={`${memory.title} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="polaroid w-72 h-80 mx-auto bg-gradient-to-br from-pink-light to-blue-light flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">📷</div>
                    <p className="text-text-brown-light text-sm">照片待添加</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content text */}
            <div className="prose prose-brown max-w-none mb-8">
              <p className="text-lg text-text-brown leading-relaxed whitespace-pre-wrap">
                {memory.content}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {memory.tags.map((tag) => (
                <span key={tag} className="tag-sticker">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Excerpt */}
            <div className="bg-pink-light/30 rounded-xl p-6 border-l-4 border-pink-main">
              <p className="text-text-brown-light italic">{memory.excerpt}</p>
            </div>
          </div>
        </article>

        {/* Navigation between memories */}
        <nav className="flex justify-between items-center mt-8 gap-4">
          {prevMemory ? (
            <Link
              href={`/memory/${prevMemory.id}`}
              className="flex-1 bg-bg-white rounded-xl p-4 shadow hover:shadow-md transition-all border border-border-beige group"
            >
              <p className="text-text-brown-light text-sm mb-1">← 上一篇</p>
              <p className="text-text-brown font-handwritten group-hover:text-pink-main transition-colors">
                {prevMemory.title}
              </p>
              <p className="text-text-brown-light text-xs mt-1">
                {prevMemory.date}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {nextMemory ? (
            <Link
              href={`/memory/${nextMemory.id}`}
              className="flex-1 bg-bg-white rounded-xl p-4 shadow hover:shadow-md transition-all border border-border-beige text-right group"
            >
              <p className="text-text-brown-light text-sm mb-1">下一篇 →</p>
              <p className="text-text-brown font-handwritten group-hover:text-pink-main transition-colors">
                {nextMemory.title}
              </p>
              <p className="text-text-brown-light text-xs mt-1">
                {nextMemory.date}
              </p>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </nav>
      </main>

      <Footer />
    </div>
  );
}
