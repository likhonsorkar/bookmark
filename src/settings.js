// Print preferences, stored per-device in localStorage (not synced anywhere),
// so each shop computer/browser can keep its own language / paper size / shop info.
const KEY = 'bookmark_print_settings_v2'
const OLD_KEY = 'bookmark_print_settings_v1'

export const defaultSettings = {
  language: 'bn', // 'bn' | 'en' — also decides which shop info (bn/en) prints
  pageSize: 'a5', // 'a5' | 'thermal80' | 'thermal58'
  shop: {
    show: false, // show shop info on the prepaid token receipt (invoice always shows it)
    // adText = optional advertise text printed at the bottom (invoice always, token receipt when show is on)
    bn: { name: '', phone: '', address: '', adText: '' },
    en: { name: '', phone: '', address: '', adText: '' },
  },
}

function migrate(parsed) {
  const merged = {
    ...defaultSettings,
    ...parsed,
    shop: {
      ...defaultSettings.shop,
      ...(parsed.shop || {}),
      bn: { ...defaultSettings.shop.bn, ...(parsed.shop?.bn || {}) },
      en: { ...defaultSettings.shop.en, ...(parsed.shop?.en || {}) },
    },
  }

  // one-time migration from the earlier single-language shop.name/phone/address
  const old = parsed.shop
  if (old && (old.name || old.phone || old.address) && !old.bn) {
    merged.shop.bn = {
      name: old.name || '',
      phone: old.phone || '',
      address: old.address || '',
    }
  }

  // earlier versions kept a single shared adText -> move it to the bn side
  if (old && old.adText && !old.bn?.adText) {
    merged.shop.bn = { ...merged.shop.bn, adText: old.adText }
  }

  if (merged.pageSize === 'thermal') merged.pageSize = 'thermal80'
  return merged
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return migrate(JSON.parse(raw))

    const oldRaw = localStorage.getItem(OLD_KEY)
    if (oldRaw) return migrate(JSON.parse(oldRaw))

    return defaultSettings
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings))
  } catch {
    // ignore write errors (private browsing, storage full, etc.)
  }
}
