import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Prepaid from './pages/Prepaid.jsx'
import Postpaid from './pages/Postpaid.jsx'
import Invoice from './pages/Invoice.jsx'
import Settings from './pages/Settings.jsx'
import { Link, usePath } from './router.jsx'

const routes = {
  '/': { title: 'Bookmark | likhon.com.bd', page: Home },
  '/prepaid': { title: 'নেসকো প্রিপেইড | Bookmark', page: Prepaid },
  '/postpaid': { title: 'নেসকো পোস্টপেইড | Bookmark', page: Postpaid },
  '/invoice': { title: 'ক্যাশ মেমো | Bookmark', page: Invoice },
  '/settings': { title: 'প্রিন্ট সেটিংস | Bookmark', page: Settings },
}

function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-xl font-semibold mb-2">পেইজটি পাওয়া যায়নি</h1>
      <Link to="/" className="text-brand-purple text-sm">
        ← সব বুকমার্কে ফিরে যান
      </Link>
    </div>
  )
}

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function App() {
  const path = usePath()
  const online = useOnline()
  const route = routes[path]
  const Page = route?.page || NotFound

  useEffect(() => {
    document.title = route?.title || 'Bookmark'
  }, [route])

  return (
    <div className="min-h-screen">
      <Header path={path} />
      {!online && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center px-4 py-2">
          আপনি অফলাইনে আছেন — ক্যাশ মেমো ও সেটিংস কাজ করবে, নেসকো তথ্য দেখতে ইন্টারনেট লাগবে।
        </div>
      )}
      <main className="max-w-6xl mx-auto px-5 md:px-8 pb-16 pt-6">
        <Page />
        {(path === '/prepaid' || path === '/postpaid') && (
          <footer className="mt-8 pt-4 border-t border-line text-xs text-center text-gray-500">
            বিদ্যুৎ বিল দেখার এই সেবাটি NESCO-র সরকারি সার্ভিস নয়, শুধু তথ্য দেখানোর সুবিধার জন্য তৈরি।
          </footer>
        )}
      </main>
    </div>
  )
}
