// Cloudflare Pages Function: same-origin proxy for the public NESCO APIs.
// The browser calls  /api/nesco_pre/?cust_no=...  on its own domain, and this
// function forwards it to publicapi.likhon.com.bd — so no CORS problem in production.
const UPSTREAM = 'https://publicapi.likhon.com.bd'
const ALLOWED = ['/nesco_pre/', '/nesco_post/'] // don't let this become an open proxy

export async function onRequestGet({ request }) {
  const url = new URL(request.url)
  const upstreamPath = url.pathname.replace(/^\/api/, '')

  if (!ALLOWED.some((p) => upstreamPath === p || upstreamPath === p.slice(0, -1))) {
    return new Response(JSON.stringify({ success: false, error: 'Not found' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    })
  }

  try {
    const upstream = await fetch(`${UPSTREAM}${upstreamPath}${url.search}`, {
      headers: { accept: 'application/json' },
    })
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        'content-type': upstream.headers.get('content-type') || 'application/json',
        'cache-control': 'no-store',
      },
    })
  } catch {
    return new Response(JSON.stringify({ success: false, error: 'Upstream unreachable' }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    })
  }
}
