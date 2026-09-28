import { useState } from 'react'
import CustomerForm from '../components/CustomerForm.jsx'
import InfoGrid from '../components/InfoGrid.jsx'
import { fetchPostpaid } from '../api.js'

const PAGE_SIZE = 15

export default function Postpaid() {
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
      const result = await fetchPostpaid(custNo)
      if (!result?.success || !result?.customer?.name) {
        setError('এই কনজ্যুমার নম্বরে কোনো পোস্টপেইড তথ্য পাওয়া যায়নি।')
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
  const summary = data?.bill_summary
  const bills = data?.all_bills || []
  const shown = bills.slice(0, visibleCount)

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
            <div className="lg:col-span-2 grid grid-cols-3 gap-2.5 content-start">
              <div className="bg-white border border-line rounded-xl p-3.5 text-center">
                <span className="block text-2xl font-bold">{summary?.total_bills ?? '—'}</span>
                <span className="block text-xs text-gray-500 mt-0.5">মোট বিল</span>
              </div>
              <div className="bg-white border border-line rounded-xl p-3.5 text-center">
                <span className="block text-2xl font-bold text-green-600">{summary?.paid_bills ?? '—'}</span>
                <span className="block text-xs text-gray-500 mt-0.5">পরিশোধিত</span>
              </div>
              <div className="bg-white border border-line rounded-xl p-3.5 text-center">
                <span className="block text-2xl font-bold text-brand-red">{summary?.unpaid_bills ?? '—'}</span>
                <span className="block text-xs text-gray-500 mt-0.5">বকেয়া</span>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white border border-line rounded-xl px-5 py-4.5">
              <h3 className="text-base font-semibold mb-3.5">{c.name}</h3>
              <InfoGrid
                rows={[
                  { label: 'পিতা/স্বামীর নাম', value: c.father_or_husband_name },
                  { label: 'ঠিকানা', value: c.address },
                  { label: 'অফিস', value: c.office },
                  { label: 'ফিডার', value: c.feeder },
                  { label: 'মিটার নম্বর', value: c.meter_no },
                  { label: 'অনুমোদিত লোড', value: c.sanctioned_load },
                  { label: 'ট্যারিফ', value: c.tariff },
                  { label: 'মিটার স্ট্যাটাস', value: c.meter_status },
                  { label: 'সংযোগ ফেজ', value: c.connection_phase },
                  { label: 'বর্তমান অবস্থা', value: data.status },
                ]}
              />
            </div>
          </div>

          <div className="bg-white border border-line rounded-xl px-5 py-4.5">
            <h3 className="text-base font-semibold mb-3.5">বিলের তালিকা ({bills.length}টি)</h3>

            {/* Mobile: card list */}
            <div className="sm:hidden space-y-3">
              {shown.map((b) => (
                <div
                  key={b.bill_no}
                  className={`rounded-lg border border-line p-3.5 ${
                    b.payment_status === 'Paid' ? 'bg-paper' : 'bg-red-50'
                  }`}
                >
                  <div className="flex justify-between items-baseline gap-2">
                    <span className="font-semibold text-sm">
                      {b.month} {b.year}
                    </span>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                        b.payment_status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-100 text-brand-red'
                      }`}
                    >
                      {b.payment_status === 'Paid' ? 'পরিশোধিত' : 'বকেয়া'}
                    </span>
                  </div>
                  <div className="mt-1.5 flex justify-between text-xs text-gray-500">
                    <span>
                      বিল ৳{b.total_bill} {b.late_fee !== '0' && `+ লেট ফি ৳${b.late_fee}`}
                    </span>
                    <span>{b.payment_method || '—'}</span>
                  </div>
                  {b.paid_date && <div className="mt-1 text-xs text-gray-400">পরিশোধ {b.paid_date}</div>}
                </div>
              ))}
            </div>

            {/* Desktop/tablet: table */}
            <div className="hidden sm:block overflow-x-auto border-t border-line">
              <table className="w-full border-collapse text-sm min-w-[520px]">
                <thead>
                  <tr>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">মাস/বছর</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">বিল</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">লেট ফি</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">পরিশোধ</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">মাধ্যম</th>
                    <th className="text-left font-semibold text-gray-500 text-xs px-2 py-2.5 border-b border-line whitespace-nowrap">অবস্থা</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((b) => (
                    <tr key={b.bill_no} className={b.payment_status === 'Paid' ? '' : 'bg-red-50'}>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{b.month} {b.year}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">৳{b.total_bill}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">৳{b.late_fee}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{b.paid_date || '—'}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">{b.payment_method || '—'}</td>
                      <td className="px-2 py-2.5 border-b border-line whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs ${
                            b.payment_status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-brand-red'
                          }`}
                        >
                          {b.payment_status === 'Paid' ? 'পরিশোধিত' : 'বকেয়া'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {visibleCount < bills.length && (
              <button
                onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                className="mt-3.5 w-full py-2.5 rounded-lg border border-dashed border-line text-brand-purple text-sm"
              >
                আরও দেখুন ({bills.length - visibleCount}টি বাকি)
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
