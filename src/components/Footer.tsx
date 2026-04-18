export default function Footer() {
  return (
    <footer className="bg-bg-white border-t border-border-beige mt-auto py-8">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-2 mb-4">
          <span className="text-2xl">💕</span>
          <span className="text-2xl">🌸</span>
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-text-brown-light text-sm mb-2">
          用心记录，用爱陪伴
        </p>
        <p className="text-text-brown-light text-xs">
          © {new Date().getFullYear()} AndyAI · Made with ❤️
        </p>
      </div>
    </footer>
  );
}
