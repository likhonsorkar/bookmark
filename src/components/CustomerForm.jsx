import { useState } from 'react'

export default function CustomerForm({ onSubmit, loading, placeholder }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-line rounded-xl p-4 mb-5"
    >
      <label htmlFor="cust_no" className="block text-sm text-gray-500 mb-2">
        কনজ্যুমার নম্বর
      </label>
      <div className="flex gap-2.5 flex-col sm:flex-row">
        <input
          id="cust_no"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder || 'যেমনঃ 71031423'}
          className="flex-1 px-3.5 py-2.5 rounded-lg border border-line bg-paper text-base focus:outline-none focus:ring-2 focus:ring-brand-purple"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2.5 rounded-lg bg-brand-purple text-white font-semibold text-sm disabled:bg-gray-400"
        >
          {loading ? 'খোঁজা হচ্ছে…' : 'দেখুন'}
        </button>
      </div>
    </form>
  )
}
