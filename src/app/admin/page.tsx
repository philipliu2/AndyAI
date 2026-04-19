"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Memory, categories, memories as staticMemories } from "@/data/memories";

const LOCAL_STORAGE_KEY = "andyai_custom_memories";

function getCustomMemories(): Memory[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCustomMemories(memories: Memory[]) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(memories));
}

function addCustomMemory(memory: Omit<Memory, "id">): Memory {
  const customMemories = getCustomMemories();
  const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newMemory: Memory = { ...memory, id };
  customMemories.push(newMemory);
  saveCustomMemories(customMemories);
  return newMemory;
}

function updateCustomMemory(memory: Memory) {
  const customMemories = getCustomMemories();
  const index = customMemories.findIndex((m) => m.id === memory.id);
  if (index !== -1) {
    customMemories[index] = memory;
    saveCustomMemories(customMemories);
  }
}

function deleteCustomMemory(id: string) {
  const customMemories = getCustomMemories().filter((m) => m.id !== id);
  saveCustomMemories(customMemories);
}

function copyToCustom(memory: Memory): Memory {
  const { id, ...rest } = memory;
  const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return addCustomMemory({ ...rest, id: newId } as Omit<Memory, "id">);
}

function exportMemories(memories: Memory[]) {
  if (memories.length === 0) {
    alert("暂无记录可导出");
    return;
  }
  const code = memories.map((m) => `{
    id: "${m.id}",
    title: "${m.title.replace(/"/g, '\\"')}",
    date: "${m.date}",
    category: "${m.category}",
    tags: ${JSON.stringify(m.tags)},
    cover: "${m.cover}",
    milestone: ${m.milestone}${m.milestoneLabel ? `,\n    milestoneLabel: "${m.milestoneLabel}"` : ""},
    excerpt: "${m.excerpt.replace(/"/g, '\\"')}",
    photos: ${JSON.stringify(m.photos)},
    content: \`${m.content.replace(/`/g, "\\`")}\`,
  }`).join(",\n\n");

  const exportWindow = window.open("", "_blank");
  if (exportWindow) {
    exportWindow.document.write(`<html><body><pre>${code}</pre><p>请将以上内容添加到 src/data/memories.ts 的 memories 数组中</p></body></html>`);
  }
}

type EditMode = "add" | "edit" | "customize-preset";

export default function AdminPage() {
  const [customMemories, setCustomMemories] = useState<Memory[]>([]);
  const [editMode, setEditMode] = useState<EditMode>("add");
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    category: "daily" as Memory["category"],
    tags: "",
    milestone: false,
    milestoneLabel: "",
    excerpt: "",
    content: "",
    photos: "" as string | string[],
  });

  // Load custom memories on mount
  useEffect(() => {
    setCustomMemories(getCustomMemories());
  }, []);

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      category: "daily",
      tags: "",
      milestone: false,
      milestoneLabel: "",
      excerpt: "",
      content: "",
      photos: [],
    });
    setEditingMemory(null);
    setEditMode("add");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const tags = formData.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const photos = Array.isArray(formData.photos) ? formData.photos : formData.photos ? [formData.photos] : [];

    const memoryData = {
      title: formData.title,
      date: formData.date,
      category: formData.category,
      tags,
      cover: "",
      milestone: formData.milestone,
      milestoneLabel: formData.milestone ? formData.milestoneLabel : undefined,
      excerpt: formData.excerpt,
      photos,
      content: formData.content,
    };

    if (editMode === "edit" && editingMemory) {
      updateCustomMemory({ ...memoryData, id: editingMemory.id });
      handleSuccess("✅ 记录已更新！");
    } else {
      addCustomMemory(memoryData);
      handleSuccess("✅ 记录已保存！");
    }

    setCustomMemories(getCustomMemories());
    resetForm();
  };

  const handleEdit = (memory: Memory) => {
    setEditMode("edit");
    setEditingMemory(memory);
    setFormData({
      title: memory.title,
      date: memory.date,
      category: memory.category,
      tags: memory.tags.join(", "),
      milestone: memory.milestone,
      milestoneLabel: memory.milestoneLabel || "",
      excerpt: memory.excerpt,
      content: memory.content,
      photos: memory.photos,
    });
  };

  const handleCustomizePreset = (memory: Memory) => {
    // Create a custom copy of a preset memory
    const newMemory = copyToCustom(memory);
    setCustomMemories(getCustomMemories());
    handleSuccess("✅ 已复制到自定义记录，可编辑！");
    handleEdit(newMemory);
  };

  const handleDelete = (id: string) => {
    if (confirm("确定删除这条记录？")) {
      deleteCustomMemory(id);
      setCustomMemories(getCustomMemories());
      if (editingMemory?.id === id) {
        resetForm();
      }
    }
  };

  const handleRefresh = () => {
    setCustomMemories(getCustomMemories());
  };

  const staticMemoryIds = new Set(staticMemories.map((m) => m.id));

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-handwritten text-3xl text-text-brown">📝 管理记录</h1>
          <Link href="/" className="text-pink-main hover:text-text-brown text-sm">
            ← 返回首页
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => { resetForm(); setEditMode("add"); }}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              editMode === "add" ? "bg-pink-main text-white" : "bg-bg-white text-text-brown border border-border-beige"
            }`}
          >
            ➕ 添加新记录
          </button>
          <button
            onClick={() => { setEditMode("customize-preset"); setEditingMemory(null); }}
            className={`px-4 py-2 rounded-full text-sm transition-all ${
              editMode === "customize-preset" ? "bg-pink-main text-white" : "bg-bg-white text-text-brown border border-border-beige"
            }`}
          >
            ✏️ 编辑预设节点
          </button>
        </div>

        {/* Form Section */}
        {editMode !== "customize-preset" && (
          <form onSubmit={handleSubmit} className="bg-bg-white rounded-2xl p-6 shadow-md border border-border-beige mb-8">
            <h2 className="font-handwritten text-xl text-text-brown mb-4">
              {editMode === "edit" ? "✏️ 编辑记录" : "➕ 添加新记录"}
            </h2>

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
                  {categories.filter((c) => c.key !== "all").map((cat) => (
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

              {/* Photo URLs */}
              <div>
                <label className="block text-text-brown text-sm mb-1 font-medium">照片链接（用换行分隔，可添加多张）</label>
                <textarea
                  value={Array.isArray(formData.photos) ? formData.photos.join("\n") : formData.photos}
                  onChange={(e) => setFormData({ ...formData, photos: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-border-beige focus:outline-none focus:ring-2 focus:ring-pink-main/50 resize-none"
                  placeholder="https://github.com/philipliu2/AndyAI/raw/main/public/photos/xxx.jpg"
                />
                <p className="text-xs text-text-brown-light mt-1">
                  💡 使用 PicGo 上传图片到 GitHub，然后粘贴图片链接
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-main to-blue-sky text-white py-3 rounded-full font-medium hover:shadow-lg transition-all"
              >
                {editMode === "edit" ? "更新记录" : "保存记录"}
              </button>
              {editMode === "edit" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full font-medium border border-border-beige hover:bg-pink-light transition-all"
                >
                  取消
                </button>
              )}
            </div>

            {showSuccess && (
              <p className="mt-4 text-center text-green-600 font-medium">
                {successMessage}
              </p>
            )}
          </form>
        )}

        {/* Customize Preset Section */}
        {editMode === "customize-preset" && (
          <div className="bg-bg-white rounded-2xl p-6 shadow-md border border-border-beige mb-8">
            <h2 className="font-handwritten text-xl text-text-brown mb-4">✏️ 编辑预设节点</h2>
            <p className="text-text-brown-light text-sm mb-4">
              点击「编辑」将预设节点复制为自定义记录，然后可以修改内容
            </p>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {staticMemories.map((memory) => (
                <div key={memory.id} className="flex items-center justify-between p-3 bg-pink-light/30 rounded-lg">
                  <div>
                    <p className="font-medium text-text-brown">{memory.title}</p>
                    <p className="text-sm text-text-brown-light">{memory.date}</p>
                  </div>
                  <button
                    onClick={() => handleCustomizePreset(memory)}
                    className="text-pink-main hover:text-text-brown text-sm px-3 py-1 rounded-full border border-pink-main hover:bg-pink-light transition-all"
                  >
                    编辑
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Records List */}
        <div className="bg-bg-white rounded-2xl p-6 shadow-md border border-border-beige">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-handwritten text-xl text-text-brown">💾 自定义记录</h2>
            <div className="flex gap-2">
              <button
                onClick={handleRefresh}
                className="text-sm text-pink-main hover:text-text-brown"
              >
                刷新
              </button>
              <button
                onClick={() => exportMemories(customMemories)}
                className="text-sm bg-pink-main text-white px-3 py-1 rounded-full hover:bg-text-brown transition-colors"
              >
                导出代码
              </button>
            </div>
          </div>

          {customMemories.length === 0 ? (
            <p className="text-text-brown-light text-center py-8">暂无自定义记录</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {customMemories.map((memory) => (
                <div key={memory.id} className="flex items-center justify-between p-3 bg-pink-light/30 rounded-lg">
                  <div>
                    <p className="font-medium text-text-brown">{memory.title}</p>
                    <p className="text-sm text-text-brown-light">{memory.date}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(memory)}
                      className="text-blue-500 hover:text-blue-700 text-sm px-3 py-1 rounded-full border border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(memory.id)}
                      className="text-red-500 hover:text-red-700 text-sm px-3 py-1 rounded-full border border-red-500 hover:bg-red-50 transition-all"
                    >
                      删除
                    </button>
                  </div>
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
