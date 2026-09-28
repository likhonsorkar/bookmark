import { useState } from 'react'
import { printInvoice } from '../print/invoice.js'
import { toNumber, money } from '../numbers.js'

function emptyItem() {
  return { id: Math.random().toString(36).slice(2), product: '', qty: '', price: '' }
}

export default function Invoice() {
  const [customer, setCustomer] = useState({ name: '', mobile: '', address: '' })
  const [items, setItems] = useState([emptyItem(), emptyItem(), emptyItem()])
  const [discount, setDiscount] = useState('')

  function updateItem(id, patch) {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addRow() {
    setItems((prev) => [...prev, emptyItem()])
  }

  function removeRow(id) {
    setItems((prev) => (prev.length > 1 ? prev.filter((it) => it.id !== id) : prev))
  }

  const subtotal = items.reduce((sum, it) => sum + toNumber(it.qty) * toNumber(it.price), 0)
  const discountNum = toNumber(discount)
  const total = Math.max(subtotal - discountNum, 0)

  function handlePrint() {
    printInvoice({ customer, items, discount })
  }

  return (
    <section className="max-w-3xl">
      <h1 className="text-xl font-semibold mb-1">ক্যাশ মেমো / ইনভয়েস</h1>
      <p className="text-sm text-gray-500 mb-6">
        প্রিন্ট সেটিংসে ভাষা বাংলা রাখলে "ক্যাশ মেমো" আর English রাখলে "Invoice" হিসেবে প্রিন্ট হবে।
      </p>

      <div className="bg-white border border-line rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">ক্রেতার তথ্য</h2>
        <div className="grid sm:grid-cols-3 gap-3">
          <input
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            placeholder="নাম"
            className="px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
          />
          <input
            value={customer.mobile}
            onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
            placeholder="মোবাইল"
            className="px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
          />
          <input
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            placeholder="ঠিকানা"
            className="px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
          />
        </div>
      </div>

      <div className="bg-white border border-line rounded-xl p-5 mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-500">পণ্যের তালিকা</h2>
          <button
            onClick={addRow}
            className="text-xs px-3 py-1.5 rounded-full border border-line text-brand-purple hover:bg-purple-50"
          >
            + নতুন লাইন
          </button>
        </div>

        <div className="hidden sm:grid grid-cols-[1fr_90px_110px_110px_28px] gap-2 text-xs text-gray-500 mb-2 px-1">
          <span>পণ্য</span>
          <span>পরিমাণ</span>
          <span>দর</span>
          <span>মোট দাম</span>
          <span />
        </div>

        <div className="space-y-2">
          {items.map((it) => {
            const net = toNumber(it.qty) * toNumber(it.price)
            return (
              <div
                key={it.id}
                className="grid grid-cols-2 sm:grid-cols-[1fr_90px_110px_110px_28px] gap-2 items-center"
              >
                <input
                  value={it.product}
                  onChange={(e) => updateItem(it.id, { product: e.target.value })}
                  placeholder="পণ্যের নাম"
                  className="col-span-2 sm:col-span-1 px-3 py-2 rounded-lg border border-line bg-paper text-sm"
                />
                <input
                  value={it.qty}
                  onChange={(e) => updateItem(it.id, { qty: e.target.value })}
                  placeholder="পরিমাণ"
                  inputMode="decimal"
                  className="px-3 py-2 rounded-lg border border-line bg-paper text-sm"
                />
                <input
                  value={it.price}
                  onChange={(e) => updateItem(it.id, { price: e.target.value })}
                  placeholder="দর"
                  inputMode="decimal"
                  className="px-3 py-2 rounded-lg border border-line bg-paper text-sm"
                />
                <span className="px-1 text-sm text-right font-medium">{net ? money(net) : '—'}</span>
                <button
                  onClick={() => removeRow(it.id)}
                  className="text-gray-400 hover:text-brand-red text-lg leading-none justify-self-end"
                  aria-label="লাইন মুছুন"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-white border border-line rounded-xl p-5 mb-5">
        <div className="flex justify-between items-center py-1 text-sm">
          <span className="text-gray-500">সাবটোটাল</span>
          <span>{money(subtotal)} টাকা</span>
        </div>
        <div className="flex justify-between items-center py-1 text-sm">
          <label htmlFor="discount" className="text-gray-500">
            ডিসকাউন্ট
          </label>
          <input
            id="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            inputMode="decimal"
            placeholder="0"
            className="w-28 px-3 py-1.5 rounded-lg border border-line bg-paper text-sm text-right"
          />
        </div>
        <div className="flex justify-between items-center pt-2 mt-2 border-t border-line font-semibold text-base">
          <span>সর্বমোট</span>
          <span>{money(total)} টাকা</span>
        </div>
      </div>

      <button
        onClick={handlePrint}
        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-brand-purple text-white font-semibold text-sm"
      >
        প্রিন্ট করুন
      </button>
    </section>
  )
}
