import Link from "next/link";
import { Memory } from "@/data/memories";

interface TimelineProps {
  memories: Memory[];
}

export default function Timeline({ memories }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline center line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-pink-main via-blue-sky to-gold-warm transform -translate-x-1/2 hidden md:block" />

      <div className="space-y-12">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            className={`animate-fadeInUp flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-8`}
          >
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              {memory.milestone ? (
                <div className="w-8 h-8 rounded-full bg-gold-warm border-4 border-bg-cream shadow-[0_0_0_4px_var(--gold-light),0_0_0_8px_var(--pink-main)]" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-pink-main border-3 border-bg-cream shadow-[0_0_0_2px_var(--pink-main)]" />
              )}
            </div>

            {/* Content card */}
            <div className={`flex-1 max-w-xl ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
              <Link
                href={`/memory/${memory.id}`}
                className={`card-torn p-6 block transition-all hover:shadow-lg ${
                  memory.milestone ? "border-2 border-pink-main/30" : ""
                }`}
              >
                {/* Milestone ribbon */}
                {memory.milestone && memory.milestoneLabel && (
                  <div className="milestone-ribbon inline-block mb-4 text-sm">
                    🎀 {memory.milestoneLabel}
                  </div>
                )}

                {/* Date */}
                <p className="text-text-brown-light text-sm mb-2">
                  {new Date(memory.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* Title */}
                <h3 className="text-xl font-semibold text-text-brown mb-3 font-handwritten">
                  {memory.title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-brown-light mb-4">{memory.excerpt}</p>

                {/* Tags */}
                <div className={`flex flex-wrap gap-2 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                  {memory.tags.map((tag) => (
                    <span key={tag} className="tag-sticker">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Placeholder for photo */}
                <div className="mt-4 inline-block">
                  <div className="polaroid w-48 h-56 bg-gradient-to-br from-pink-light to-blue-light flex items-center justify-center text-text-brown-light">
                    <div className="text-center">
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-xs">照片待添加</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Empty space for other side on desktop */}
            <div className="hidden md:block flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
