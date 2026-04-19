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

      <div className="space-y-8 md:space-y-12">
        {memories.map((memory, index) => (
          <div
            key={memory.id}
            className={`animate-fadeInUp flex flex-col ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            } items-center gap-4 md:gap-8`}
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
            <div className={`w-full md:w-[18rem] flex-shrink-0 ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
              <Link
                href={`/memory/${memory.id}`}
                className={`card-torn p-4 block transition-all hover:shadow-lg ${
                  memory.milestone ? "border-2 border-pink-main/30" : ""
                }`}
              >
                {/* Milestone ribbon */}
                {memory.milestone && memory.milestoneLabel && (
                  <div className="milestone-ribbon inline-block mb-3 text-sm">
                    🎀 {memory.milestoneLabel}
                  </div>
                )}

                {/* Date */}
                <p className="text-text-brown-light text-xs mb-2">
                  {new Date(memory.date).toLocaleDateString("zh-CN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>

                {/* Title */}
                <h3 className="text-lg font-semibold text-text-brown mb-2 font-handwritten line-clamp-1">
                  {memory.title}
                </h3>

                {/* Excerpt */}
                <p className="text-text-brown-light text-sm line-clamp-2 mb-3">{memory.excerpt}</p>

                {/* Tags */}
                <div className={`flex flex-wrap gap-1 ${index % 2 === 0 ? "md:justify-end" : "md:justify-start"}`}>
                  {memory.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="tag-sticker text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Photo */}
                <div className="mt-3">
                  {memory.photos && memory.photos.length > 0 ? (
                    <div className={`rounded-xl overflow-hidden mx-auto w-48 aspect-video ${index % 2 === 0 ? "md:ml-auto" : "md:mr-auto"}`}>
                      <img
                        src={memory.photos[0]}
                        alt={memory.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-48 aspect-video bg-gradient-to-br from-pink-light to-blue-light rounded-xl flex items-center justify-center text-text-brown-light mx-auto">
                      <div className="text-center">
                        <div className="text-3xl mb-1">📷</div>
                        <p className="text-xs">照片待添加</p>
                      </div>
                    </div>
                  )}
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
