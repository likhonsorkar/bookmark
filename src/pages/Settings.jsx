import { useState } from 'react'
import { loadSettings, saveSettings } from '../settings.js'

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-gray-500">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full relative transition-colors ${
          checked ? 'bg-brand-purple' : 'bg-gray-300'
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
            checked ? 'left-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  )
}

function ChoiceButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2.5 rounded-lg border text-sm transition-colors ${
        active ? 'bg-brand-purple text-white border-brand-purple' : 'border-line text-ink'
      }`}
    >
      {children}
    </button>
  )
}

export default function Settings() {
  const [settings, setSettings] = useState(() => loadSettings())
  const [saved, setSaved] = useState(false)

  function update(patch) {
    const next = { ...settings, ...patch }
    setSettings(next)
    saveSettings(next)
    flashSaved()
  }

  function updateShop(patch) {
    const next = { ...settings, shop: { ...settings.shop, ...patch } }
    setSettings(next)
    saveSettings(next)
    flashSaved()
  }

  function updateShopLang(lang, patch) {
    const next = {
      ...settings,
      shop: { ...settings.shop, [lang]: { ...settings.shop[lang], ...patch } },
    }
    setSettings(next)
    saveSettings(next)
    flashSaved()
  }

  function flashSaved() {
    setSaved(true)
    window.clearTimeout(flashSaved._t)
    flashSaved._t = window.setTimeout(() => setSaved(false), 1200)
  }

  return (
    <section className="pt-3 max-w-2xl">
      <h1 className="text-xl font-semibold mb-1">প্রিন্ট সেটিংস</h1>
      <p className="text-sm text-gray-500 mb-6">
        এই সেটিংস শুধু এই ডিভাইস/ব্রাউজারে সংরক্ষিত থাকে — অন্য কম্পিউটার বা ফোনে আলাদাভাবে সেট
        করতে হবে।
      </p>

      <div className="bg-white border border-line rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">প্রিন্টের ভাষা</h2>
        <p className="text-xs text-gray-400 mb-3">
          এই ভাষা অনুযায়ী টোকেন রসিদ ও ক্যাশ মেমো/ইনভয়েস — দুটোই প্রিন্ট হবে (বাংলা হলে "ক্যাশ মেমো",
          English হলে "Invoice")।
        </p>
        <div className="flex gap-3">
          <ChoiceButton active={settings.language === 'bn'} onClick={() => update({ language: 'bn' })}>
            বাংলা
          </ChoiceButton>
          <ChoiceButton active={settings.language === 'en'} onClick={() => update({ language: 'en' })}>
            English
          </ChoiceButton>
        </div>
      </div>

      <div className="bg-white border border-line rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-3">প্রিন্ট পেইজের সাইজ</h2>
        <div className="grid grid-cols-3 gap-2">
          <ChoiceButton active={settings.pageSize === 'a5'} onClick={() => update({ pageSize: 'a5' })}>
            A5
          </ChoiceButton>
          <ChoiceButton
            active={settings.pageSize === 'thermal80'}
            onClick={() => update({ pageSize: 'thermal80' })}
          >
            থার্মাল ৮০মিমি
          </ChoiceButton>
          <ChoiceButton
            active={settings.pageSize === 'thermal58'}
            onClick={() => update({ pageSize: 'thermal58' })}
          >
            থার্মাল ৫৮মিমি
          </ChoiceButton>
        </div>
      </div>

      <div className="bg-white border border-line rounded-xl p-5 mb-4">
        <h2 className="text-sm font-semibold text-gray-500 mb-1">দোকানের তথ্য</h2>
        <p className="text-xs text-gray-400 mb-4">
          ক্যাশ মেমো/ইনভয়েসে সবসময় দেখাবে। প্রিপেইড টোকেন রসিদে দেখাতে চাইলে নিচের টগল অন করুন।
          বাংলা ও English দুই ভাষার তথ্যই আলাদা করে রাখুন — সেটিংসে যে ভাষা বাছাই করবেন সেটাই প্রিন্ট হবে।
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">বাংলায়</h3>
            <div className="space-y-2">
              <input
                value={settings.shop.bn.name}
                onChange={(e) => updateShopLang('bn', { name: e.target.value })}
                placeholder="দোকানের নাম"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <input
                value={settings.shop.bn.phone}
                onChange={(e) => updateShopLang('bn', { phone: e.target.value })}
                placeholder="মোবাইল নম্বর"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <input
                value={settings.shop.bn.address}
                onChange={(e) => updateShopLang('bn', { address: e.target.value })}
                placeholder="ঠিকানা"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <textarea
                value={settings.shop.bn.adText}
                onChange={(e) => updateShopLang('bn', { adText: e.target.value })}
                placeholder="বিজ্ঞাপন/প্রমোশনাল টেক্সট (রসিদের নিচে)"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm resize-y"
              />
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-gray-500 mb-2">English</h3>
            <div className="space-y-2">
              <input
                value={settings.shop.en.name}
                onChange={(e) => updateShopLang('en', { name: e.target.value })}
                placeholder="Shop name"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <input
                value={settings.shop.en.phone}
                onChange={(e) => updateShopLang('en', { phone: e.target.value })}
                placeholder="Mobile number"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <input
                value={settings.shop.en.address}
                onChange={(e) => updateShopLang('en', { address: e.target.value })}
                placeholder="Address"
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm"
              />
              <textarea
                value={settings.shop.en.adText}
                onChange={(e) => updateShopLang('en', { adText: e.target.value })}
                placeholder="Advertise text (printed at the bottom)"
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-lg border border-line bg-paper text-sm resize-y"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-line">
          <ToggleRow
            label="প্রিপেইড টোকেন রসিদেও দোকানের তথ্য দেখাবে?"
            checked={settings.shop.show}
            onChange={(v) => updateShop({ show: v })}
          />
        </div>

        <p className="text-xs text-gray-400 mt-3">
          বিজ্ঞাপন টেক্সট ক্যাশ মেমোতে সবসময় নিচে দেখাবে; টোকেন রসিদে শুধু তখনই দেখাবে যখন উপরের টগল অন থাকবে। একাধিক লাইন লিখলে প্রিন্টেও আলাদা লাইনে আসবে।
        </p>
      </div>

      <p className={`text-xs text-green-600 transition-opacity ${saved ? 'opacity-100' : 'opacity-0'}`}>
        সংরক্ষিত হয়েছে ✓
      </p>
    </section>
  )
}
