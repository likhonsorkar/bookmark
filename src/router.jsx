// Tiny History-API router (no library). Real URLs like /prepaid, /invoice work on
// refresh, back/forward and new-tab. Cloudflare Pages serves index.html for any
// unknown path, so deep links never 404.
import { useEffect, useState } from 'react'

function currentPath() {
  const p = window.location.pathname.replace(/\/+$/, '')
  return p === '' ? '/' : p
}

export function navigate(to) {
  if (to === window.location.pathname) return
  window.history.pushState({}, '', to)
  window.dispatchEvent(new PopStateEvent('popstate'))
  window.scrollTo(0, 0)
}

export function usePath() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => {
    const onChange = () => setPath(currentPath())
    window.addEventListener('popstate', onChange)
    return () => window.removeEventListener('popstate', onChange)
  }, [])
  return path
}

// Normal <a> (so ctrl/middle-click opens a new tab) that navigates without a page reload.
export function Link({ to, onClick, ...rest }) {
  function handleClick(e) {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handleClick} {...rest} />
}
