"use client";

import { useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Memory, categories } from "@/data/memories";

const LOCAL_STORAGE_KEY = "andyai_custom_memories";

function getCustomMemories(): Memory[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCustomMemory(memory: Omit<Memory, "id">): Memory {
  const customMemories = getCustomMemories();
  const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newMemory: Memory = { ...memory, id };
  customMemories.push(newMemory);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customMemories));
  return newMemory;
}

function deleteCustomMemory(id: string) {
  const customMemories = getCustomMemories().filter((m) => m.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customMemories));
}

function exportMemories() {
  const customMemories = getCustomMemories();
  if (customMemories.length === 0) {
    alert("暂无自定义记录可导出");
    return;
  }
  const code = customMemories.map((m) => `{
    id: "${m.id}",
    title: "${m.title}",
    date: "${m.date}",
    category: "${m.category}",
    tags: ${JSON.stringify(m.tags)},
    cover: "${m.cover}",
    milestone: ${m.milestone}${m.milestoneLabel ? `,\n    milestoneLabel: "${m.milestoneLabel}"` : ""},
    excerpt: "${m.excerpt}",
    photos: ${JSON.stringify(m.photos)},
    content: \`${m.content}\`,
  }`).join(",\n\n");

  const exportWindow = window.open("", "_blank");
  if (exportWindow) {
    exportWindow.document.write(`<html><body><pre>${code}</pre><p>请将以上内容添加到 src/data/memories.ts 的 memories 数组中</p></body></html>`);
  }
}

export default function AdminPage() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "daily" as Memory["category"],
    tags: "",
    milestone: false,
    milestoneLabel: "",
    excerpt: "",
    content: "",
  });
  const [savedMemories, setSavedMemories] = useState<Memory[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load saved memories on mount
  useState(() => {
    setSavedMemories(getCustomMemories());
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const newMemory = saveCustomMemory({
      title: formData.title,
      date: formData.date,
      category: formData.category,
      tags,
      cover: "",
      milestone: formData.milestone,
      milestoneLabel: formData.milestone ? formData.milestoneLabel : undefined,
      excerpt: formData.excerpt,
      photos: [],
      content: formData.content,
    });

    setSavedMemories(getCustomMemories());
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Reset form
    setFormData({
      title: "",
      date: "",
      category: "daily",
      tags: "",
      milestone: false,
      milestoneLabel: "",
      excerpt: "",
      content: "",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("确定删除这条记录？")) {
      deleteCustomMemory(id);
      setSavedMemories(getCustomMemories());
    }
  };

  const handleRefresh = () => {
    setSavedMemories(getCustomMemories());
  };

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-handwritten text-3xl text-text-brown">📝 添加记录</h1>
          <Link href="/" className="text-pink-main hover:text-text-brown text-sm">
            ← 返回首页
          </Link>
        </div>

        {/* Add Form */}
        <form onSubmit={handleSubmit} className="bg-bg-white rounded-2xl p-6 shadow-md border border-border-beige mb-8">
          <div className="grid gap-4">
            {/* Title */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">标题</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
                placeholder="例如：第一次叫妈妈"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">日期</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">分类</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Memory["category"] })}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
              >
                {categories.filter(c => c.key !== "all").map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.emoji} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">标签（用逗号分隔）</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
                placeholder="例如：成长, 第一次, 可爱"
              />
            </div>

            {/* Milestone */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.milestone}
                  onChange={(e) => setFormData({ ...formData, milestone: e.target.checked })}
                  className="w-5 h-5 rounded accent-pink-main"
                />
                <span className="text-text-brown text-sm">里程碑标记</span>
              </label>
              {formData.milestone && (
                <input
                  type="text"
                  value={formData.milestoneLabel}
                  onChange={(e) => setFormData({ ...formData, milestoneLabel: e.target.value })}
                  className="flex-1 px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
                  placeholder="里程碑名称，如：走路、满月"
                />
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">摘要</label>
              <input
                type="text"
                required
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50"
                placeholder="一句话描述这一刻"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-text-brown text-sm mb-1 font-medium">详细内容</label>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50 resize-none"
                placeholder="记录这一刻的详细故事..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 w-full bg-gradient-to-r from-pink-main to-blue-sky text-white py-3 rounded-full font-medium hover:shadow-lg transition-all"
          >
            保存记录
          </button>

          {showSuccess && (
            <p className="mt-4 text-center text-green-600 font-medium">
              ✅ 记录已保存！
            </p>
          )}
        </form>

        {/* Saved Records */}
        <div className="bg-bg-white rounded-2xl p-6 shadow-md border border-border-beige">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-handwritten text-xl text-text-brown">💾 已保存的记录</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="text-sm text-pink-main hover:text-text-brown"
              >
                刷新
              </button>
              <button
                onClick={exportMemories}
                className="text-sm bg-pink-main text-white px-3 py-1 rounded-full hover:bg-text-brown transition-colors"
              >
                导出代码
              </button>
            </div>
          </div>

          {savedMemories.length === 0 ? (
            <p className="text-text-brown-light text-center py-8">暂无已保存的记录</p>
          ) : (
            <div className="space-y-3">
              {savedMemories.map((memory) => (
                <div key={memory.id} className="flex items-center justify-between p-3 bg-pink-light/30 rounded-lg">
                  <div>
                    <p className="font-medium text-text-brown">{memory.title}</p>
                    <p className="text-sm text-text-brown-light">{memory.date}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(memory.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    删除
                  </button>
                </div>
              ))}
            </div>
          )}

          <p className="mt-4 text-xs text-text-brown-light text-center">
            💡 提示：导出的代码需要添加到 src/data/memories.ts 中并重新部署才能永久保存
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
