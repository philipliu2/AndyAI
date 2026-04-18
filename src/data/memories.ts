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

export const memories: Memory[] = [
  {
    id: "2024-03-15-manny",
    title: "满月啦！",
    date: "2024-03-15",
    category: "milestone",
    tags: ["满月", "成长记录"],
    cover: "/photos/manny.jpg",
    milestone: true,
    milestoneLabel: "满月",
    excerpt: "今天是小Andy满月的日子！体重5.2kg，身高57cm",
    photos: ["/photos/manny-1.jpg", "/photos/manny-2.jpg"],
    content: `今天是小Andy满月的日子！

体重：5.2kg (出生3.2kg)
身高：57cm (出生50cm)

谢谢大家送来的祝福和礼物 💕

这是我们人生中最特别的一个月，看着你从一个小小的婴儿变成了会抬头、会微笑的小宝宝。

妈妈和爸爸会好好记录你的每一个成长瞬间！`
  },
  {
    id: "2024-05-20-100days",
    title: "百天纪念",
    date: "2024-05-20",
    category: "milestone",
    tags: ["百天", "成长记录"],
    cover: "/photos/100days.jpg",
    milestone: true,
    milestoneLabel: "百天",
    excerpt: "Andy来到这个世界100天啦！",
    photos: ["/photos/100days-1.jpg"],
    content: `Andy来到这个世界100天啦！

这100天里，你学会了：
- 会抬头了
- 会对人微笑了
- 会咿咿呀呀说话了

每一天都是惊喜，爱你哦宝贝 💕`
  },
  {
    id: "2024-09-01-first-steps",
    title: "迈出第一步",
    date: "2024-09-01",
    category: "first",
    tags: ["第一次走路", "里程碑"],
    cover: "/photos/first-steps.jpg",
    milestone: true,
    milestoneLabel: "第一次走路",
    excerpt: "今天Andy迈出了人生的第一步！",
    photos: ["/photos/first-steps-1.jpg"],
    content: `今天是小Andy人生中非常重要的日子！

在客厅的地毯上，你扶着茶几站稳，然后松开手，摇摇晃晃地走了两步到我怀里。

虽然只有短短的两步，但这却是你成长的巨大里程碑！

我的小宝贝，你长大了！ 🥰`
  },
  {
    id: "2024-12-25-christmas",
    title: "第一个圣诞节",
    date: "2024-12-25",
    category: "festival",
    tags: ["圣诞节", "节日"],
    cover: "/photos/christmas.jpg",
    milestone: false,
    excerpt: "Andy的第一个圣诞节",
    photos: ["/photos/christmas-1.jpg"],
    content: `🎄 Andy的第一个圣诞节

虽然你还小，不懂什么是圣诞节，但我们还是给你准备了一份小礼物。

希望以后的每一年，我们都能一起庆祝这个温暖的节日。

圣诞快乐，我的小天使！ 🎅🎁`
  },
  {
    id: "2025-01-01-newyear",
    title: "2025新年快乐",
    date: "2025-01-01",
    category: "festival",
    tags: ["新年", "节日"],
    cover: "/photos/newyear.jpg",
    milestone: false,
    excerpt: "2025年的第一天",
    photos: ["/photos/newyear-1.jpg"],
    content: `🎊 2025年的第一天

新的一年，新的开始！

祝愿我的小Andy健康快乐成长！

也祝愿大家新年快乐！ 🥳`
  },
  {
    id: "2025-03-15-first-birthday",
    title: "1岁生日",
    date: "2025-03-15",
    category: "birthday",
    tags: ["1岁", "生日"],
    cover: "/photos/birthday-1.jpg",
    milestone: true,
    milestoneLabel: "1岁生日",
    excerpt: "祝我的小宝贝1岁生日快乐！",
    photos: ["/photos/birthday-1.jpg", "/photos/birthday-2.jpg", "/photos/birthday-3.jpg"],
    content: `🎂 Andy 1岁生日快乐！

这一年过得太快了，仿佛昨天你才刚出生，今天就已经1岁了。

现在的你会走路了，会叫爸爸妈妈了，会和我们互动了。

谢谢你选择成为我们的孩子，爸爸妈妈永远爱你！ 💕`
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
