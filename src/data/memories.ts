export interface Memory {
  id: string;
  title: string;
  date: string;
  category: "milestone" | "birthday" | "first" | "school" | "travel" | "daily" | "festival";
  tags: string[];
  cover: string;
  milestone: boolean;
  milestoneLabel?: string;
  excerpt: string;
  photos: string[];
  content: string;
}

export const babyInfo = {
  name: "Andy",
  birthDate: "2025-10-01",
  birthPlace: "香港大学医院",
  gender: "boy",
};

export const memories: Memory[] = [
  {
    id: "2025-10-01-birth",
    title: "欢迎来到这个世界",
    date: "2025-10-01",
    category: "milestone",
    tags: ["出生", "第一天", "里程碑"],
    cover: "/photos/birth.jpg",
    milestone: true,
    milestoneLabel: "出生",
    excerpt: "2025年10月1日，Andy在香港大学医院平安出生！",
    photos: ["/photos/birth-1.jpg", "/photos/birth-2.jpg"],
    content: `🎉 2025年10月1日国庆节🎉

今天是我们生命中最特别的一天。

小Andy在香港大学医院平安出生！

感谢医护人员的悉心照料。

欢迎来到这个世界，我的小宝贝！

爸爸妈妈会永远爱你 💕`,
  },
];

export const categories = [
  { key: "all", label: "全部", emoji: "✨" },
  { key: "milestone", label: "里程碑", emoji: "🎀" },
  { key: "birthday", label: "生日", emoji: "🎂" },
  { key: "first", label: "第一次", emoji: "⭐" },
  { key: "school", label: "上学", emoji: "📚" },
  { key: "travel", label: "旅行", emoji: "✈️" },
  { key: "daily", label: "日常", emoji: "🌸" },
  { key: "festival", label: "节日", emoji: "🎉" },
] as const;
