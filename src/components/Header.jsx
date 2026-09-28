import { Link } from '../router.jsx'

export default function Header({ path }) {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 text-left">
          <img src="/logo.png" alt="Bookmark" width="32" height="32" className="w-8 h-8 rounded-lg" />
          <span>
            <strong className="block text-base leading-tight text-ink">Bookmark</strong>
            <small className="hidden sm:block text-xs text-gray-500 leading-tight">bookmark.likhon.com.bd</small>
          </span>
        </Link>

        <div className="flex items-center gap-2.5">
          {path !== '/' && (
            <Link
              to="/"
              className="text-sm text-brand-purple border border-line rounded-full px-4 py-2 bg-white hover:bg-purple-50 transition-colors"
            >
              ← সব বুকমার্ক
            </Link>
          )}
          <Link
            to="/settings"
            aria-label="প্রিন্ট সেটিংস"
            title="প্রিন্ট সেটিংস"
            className={`w-9 h-9 flex items-center justify-center rounded-full border border-line bg-white hover:bg-purple-50 transition-colors ${
              path === '/settings' ? 'text-brand-purple' : 'text-gray-500'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
