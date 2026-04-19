export default function Header() {
  return (
    <header className="bg-bg-white/80 backdrop-blur-sm border-b border-border-beige sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-main to-blue-sky flex items-center justify-center text-white text-xl">
              👶
            </div>
            <div>
              <h1 className="font-handwritten text-xl text-text-brown">AndyAI</h1>
              <p className="text-xs text-text-brown-light">记录每一个珍贵时刻</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-4">
            <a href="/" className="text-text-brown hover:text-pink-main transition-colors text-sm">
              首页
            </a>
            <a href="/about" className="text-text-brown hover:text-pink-main transition-colors text-sm">
              关于
            </a>
            <a href="/admin" className="text-pink-main hover:text-text-brown transition-colors text-sm font-medium">
              📝 管理
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
