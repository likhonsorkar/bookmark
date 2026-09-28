import { useState } from 'react'
import CustomerForm from '../components/CustomerForm.jsx'
import InfoGrid from '../components/InfoGrid.jsx'
import { fetchPrepaid } from '../api.js'
import { printRecharge } from '../print/receipt.js'

const PAGE_SIZE = 15

export default function Prepaid() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  async function handleSearch(custNo) {
    setLoading(true)
    setError('')
    setData(null)
    setVisibleCount(PAGE_SIZE)
    try {
      const result = await fetchPrepaid(custNo)
      const hasCustomer =
        result?.customer && !Array.isArray(result.customer) && Object.keys(result.customer).length > 0
      if (!result?.success || !hasCustomer) {
        setError('এই কনজ্যুমার নম্বরে কোনো প্রিপেইড তথ্য পাওয়া যায়নি।')
      } else {
        setData(result)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const c = data?.customer
  const balanceKey = c && Object.keys(c).find((k) => k.startsWith('অবশিষ্ট ব্যালেন্স'))
  const history = data?.recharge_history || []
  const shown = history.slice(0, visibleCount)

  return (
    <section>
      <div className="max-w-xl">
        <CustomerForm onSubmit={handleSearch} loading={loading} />
      </div>
      {error && (
        <p className="bg-red-50 text-brand-red border border-red-200 px-3.5 py-3 rounded-lg mb-5">{error}</p>
      )}

      {c && (
        <>
          <div className="grid gap-5 lg:grid-cols-5 mb-5">
            <div className="lg:col-span-2 bg-ink text-white rounded-xl px-5 py-5">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-purple-200">অবশিষ্ট ব্যালেন্স</span>
                <span className="font-mono tabular-nums text-4xl font-bold text-brand-amber tracking-wide">
                  ৳ {balanceKey ? c[balanceKey] : '—'}
                </span>
              </div>
              <div className="mt-3 pt-2.5 border-t border-dashed border-purple-900 flex gap-5 flex-wrap text-sm text-purple-200">
                <span>মিনিমাম রিচার্জ ৳{c['মিনিমাম রিচার্জের পরিমাণ (টাকা)'] ?? '—'}</span>
                <span>মিটার নম্বর {c['মিটার নম্বর'] ?? '—'}</span>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white border border-line rounded-xl px-5 py-4.5">
              <h3 className="text-base font-semibold mb-3.5">{c['গ্রাহকের নাম']}</h3>
              <InfoGrid
                rows={[
                  { label: 'ঠিকানা', value: c['ঠিকানা'] },
                  { label: 'মোবাইল', value: c['মোবাইল'] },
                  { label: 'বিদ্যুৎ অফিস', value: c['সংশ্লিষ্ট বিদ্যুৎ অফিস'] },
                  { label: 'ফিডার', value: c['ফিডারের নাম'] },
                  { label: 'কনজ্যুমার নম্বর', value: c['কনজ্যুমার নম্বর'] },
                  { label: 'অনুমোদিত লোড', value: c['অনুমোদিত লোড (কি.ও)'] },
                  { label: 'ট্যারিফ', value: c['অনুমোদিত ট্যারিফ'] },
                  { label: 'মিটারের ধরণ', value: c['মিটারের ধরণ'] },
                  { label: 'মিটার স্ট্যাটাস', value: c['মিটার স্ট্যাটাস'] },
                  { label: 'স্থাপনের তারিখ', value: c['মিটার স্থাপনের তারিখ'] },
                ]}
              />
            </div>
          </div>

          <div className="bg-white border border-line rounded-xl px-5 py-4.5">
            <h3 className="text-base font-semibold mb-3.5">
              রিচার্জ হিস্টোরি ({data.total_recharges ?? history.length}টি)
            </h3>

            {/* Mobile: card list */}
            <div className="sm:hidden space-y-3">
              {shown.map((r) => (
                <div key={r.order} className="rounded-lg border border-line p-3.5 bg-paper">
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-sm">{r.recharge_date}</span>
                    <span className="font-bold text-brand-purple">৳{r.recharge_amount}</span>
                  </div>
                  <div className="mt-1 flex justify-between text-xs text-gray-500">
                    <span>{r.purchase_energy} kWh</span>
                    <span>{r.recharge_method}</span>
                  </div>
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="flex-1 font-mono text-[11px] text-gray-500 break-all">
                      {r.token?.replace(/<br>/g, ' / ')}
                    </span>
                    <button
                      onClick={() => printRecharge(r)}
                      className="shrink-0 text-xs px-2.5 py-1 rounded-full border border-line text-brand-purple bg-white"
                    >
                      প্রিন্ট
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop/tablet: table */}
            <div className="hidden sm:block overflow-x-auto border-t border-line">
              <table className="w-full border-collapse text-sm min-w-[520px]">
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">তারিখ</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">টাকা</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">ইউনিট (kWh)</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">মাধ্যম</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">প্রিন্ট</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">টোকেন</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((r) => (
                    <tr key={r.order}>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{r.recharge_date}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">৳{r.recharge_amount}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{r.purchase_energy}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{r.recharge_method}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">
                        <button
                          onClick={() => printRecharge(r)}
                          className="text-xs px-2.5 py-1 rounded-full border border-line text-brand-purple hover:bg-purple-50"
                        >
                          প্রিন্ট
                        </button>
                      </td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap font-mono text-xs text-gray-500">
                        {r.token?.replace(/<br>/g, ' / ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleCount < history.length && (
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="mt-3.5 w-full py-2.5 rounded-lg border border-dashed border-line text-brand-purple text-sm"
              >
                আরও দেখুন ({history.length - visibleCount}টি বাকি)
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
