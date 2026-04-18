import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col paper-texture">
      <Header />

      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          {/* Avatar placeholder */}
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-pink-main to-blue-sky flex items-center justify-center text-6xl mb-6 shadow-lg">
            👶
          </div>
          <h1 className="font-handwritten text-3xl text-text-brown mb-2">
            关于 AndyAI
          </h1>
          <p className="text-text-brown-light">
            记录每一个珍贵时刻
          </p>
        </div>

        {/* Info card */}
        <div className="bg-bg-white rounded-2xl p-8 shadow-md border border-border-beige">
          <div className="space-y-6">
            <div>
              <h2 className="font-handwritten text-xl text-text-brown mb-2">👶 小Andy</h2>
              <p className="text-text-brown-light text-sm">
                一个可爱的小宝宝，正在探索这个美好的世界。
              </p>
            </div>

            <div className="border-t border-border-beige pt-6">
              <h2 className="font-handwritten text-xl text-text-brown mb-4">📖 这个网站</h2>
              <p className="text-text-brown-light text-sm leading-relaxed">
                这是一个专门为Andy创建的成长记录网站。我们希望通过这个网站，
                记录下他成长过程中的每一个重要时刻——第一次微笑、第一次走路、
                第一个生日...希望这些记忆能成为他长大后最珍贵的礼物。
              </p>
            </div>

            <div className="border-t border-border-beige pt-6">
              <h2 className="font-handwritten text-xl text-text-brown mb-4">💕 致谢</h2>
              <p className="text-text-brown-light text-sm leading-relaxed">
                感谢每一位关心Andy的家人和朋友。
                特别感谢为这个网站付出努力的每一个人。
              </p>
            </div>
          </div>
        </div>

        {/* Back home link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-pink-main hover:text-text-brown transition-colors"
          >
            ← 返回首页
          </a>
        </div>
      </main>

      <Footer />
    </div>
  );
}
