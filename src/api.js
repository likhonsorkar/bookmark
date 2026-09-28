// All calls go through the relative /api/* path so the browser only ever
// talks to its own origin. In dev, vite.config.js proxies /api -> publicapi.
// In production, the hosting layer must do the same proxying — see README.
const API_BASE = '/api'

async function getJson(path) {
  let res
  try {
    res = await fetch(`${API_BASE}${path}`)
  } catch {
    throw new Error('সার্ভারে পৌঁছানো যায়নি, ইন্টারনেট সংযোগ পরীক্ষা করুন।')
  }
  if (!res.ok) {
    throw new Error('সার্ভার থেকে তথ্য আনা যায়নি (কোড ' + res.status + ')')
  }
  return res.json()
}

export function fetchPostpaid(custNo) {
  return getJson(`/nesco_post/?cust_no=${encodeURIComponent(custNo)}`)
}

export function fetchPrepaid(custNo) {
  return getJson(`/nesco_pre/?cust_no=${encodeURIComponent(custNo)}`)
}
