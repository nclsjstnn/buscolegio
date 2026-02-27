import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-10 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-col gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <a href="/" className="flex items-baseline gap-0.5 group">
            <span className="text-gray-800 text-lg font-bold tracking-tight group-hover:opacity-70 transition-opacity">
              buscolegio
            </span>
            <span className="text-blue-600 text-sm font-medium">.com</span>
          </a>
          <nav>
            <Link href="/sobre-nosotros" className="text-sm text-gray-500 hover:text-blue-700 transition-colors">
              Sobre nosotros
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-gray-400">
          <span>
            Vibecodeado con ♥ desde Chile por{' '}
            <a
              href="https://github.com/nclsjstnn"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors underline underline-offset-2"
            >
              Nicolas Justiniano
            </a>
          </span>
          <span>© {new Date().getFullYear()} buscolegio.com</span>
        </div>
      </div>
    </footer>
  )
}
