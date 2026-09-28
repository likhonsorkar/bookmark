// Builds a printable bilingual cash memo / invoice. Which title and labels
// are used (বাংলা ক্যাশ মেমো vs English Invoice) follows the same language
// setting used for the NESCO token receipt.
import { loadSettings } from '../settings.js'
import { esc, nl2br, pageCss, openPrintWindow } from './shared.js'

const LABELS = {
  bn: {
    title: 'ক্যাশ মেমো',
    date: 'তারিখ',
    customer: 'ক্রেতার তথ্য',
    customerName: 'নাম',
    customerMobile: 'মোবাইল',
    customerAddress: 'ঠিকানা',
    product: 'পণ্য',
    qty: 'পরিমাণ',
    price: 'দর',
    netPrice: 'মোট দাম',
    subtotal: 'সাবটোটাল',
    discount: 'ডিসকাউন্ট',
    total: 'সর্বমোট',
    signature: 'স্বাক্ষর',
    tk: 'টাকা',
  },
  en: {
    title: 'Invoice',
    date: 'Date',
    customer: 'Customer Info',
    customerName: 'Name',
    customerMobile: 'Mobile',
    customerAddress: 'Address',
    product: 'Product',
    qty: 'Qty',
    price: 'Price',
    netPrice: 'Net Price',
    subtotal: 'Subtotal',
    discount: 'Discount',
    total: 'Total',
    signature: 'Signature',
    tk: 'Tk',
  },
}

export function printInvoice({ customer, items, discount }) {
  const settings = loadSettings()
  const t = LABELS[settings.language] || LABELS.bn
  const shopInfo = settings.shop?.[settings.language] || {}

  const rows = (items || []).filter((i) => i.product || i.qty || i.price)
  const subtotal = rows.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0)
  const discountNum = Number(discount) || 0
  const total = Math.max(subtotal - discountNum, 0)

  const now = new Date()
  const dateStr = now.toLocaleString(settings.language === 'bn' ? 'bn-BD' : 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const shopBlock = `<div class="shop">
    ${shopInfo.name ? `<div class="shop-name">${esc(shopInfo.name)}</div>` : ''}
    ${shopInfo.phone ? `<div>${esc(shopInfo.phone)}</div>` : ''}
    ${shopInfo.address ? `<div>${esc(shopInfo.address)}</div>` : ''}
  </div>`

  const adBlock = shopInfo.adText ? `<div class="ad">${nl2br(shopInfo.adText)}</div>` : ''

  const itemRows = rows
    .map((i) => {
      const net = (Number(i.qty) || 0) * (Number(i.price) || 0)
      return `<tr>
        <td class="p-name">${esc(i.product)}</td>
        <td class="p-num">${esc(i.qty)}</td>
        <td class="p-num">${esc(i.price)}</td>
        <td class="p-num">${net.toFixed(2)}</td>
      </tr>`
    })
    .join('')

  const html = `<!doctype html>
<html lang="${settings.language}">
<head>
<meta charset="utf-8" />
<title>${esc(t.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Hind Siliguri', 'Inter', Arial, sans-serif; color: #111; padding: 0; }
  ${pageCss(settings.pageSize)}
  h1 { font-size: 1.15em; text-align: center; margin: 0 0 2px; }
  .shop { text-align: center; margin-bottom: 8px; font-size: 0.9em; }
  .shop-name { font-weight: 700; font-size: 1.3em; margin-bottom: 2px; }
  .meta { font-size: 0.8em; color: #444; margin-bottom: 8px; text-align: center; }
  hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
  .block-title { font-size: 0.75em; color: #555; margin-bottom: 3px; text-transform: uppercase; letter-spacing: 0.03em; }
  .cust table { width: 100%; font-size: 0.88em; margin-bottom: 4px; }
  .cust td { padding: 1px 0; }
  .cust td.label { color: #555; width: 32%; }
  table.items { width: 100%; border-collapse: collapse; font-size: 0.85em; margin-bottom: 6px; }
  table.items th { text-align: left; font-size: 0.75em; color: #555; border-bottom: 1px solid #999; padding: 3px 2px; }
  table.items td { padding: 3px 2px; border-bottom: 1px solid #eee; }
  .p-num { text-align: right; white-space: nowrap; }
  table.sums { width: 100%; font-size: 0.9em; margin-top: 4px; }
  table.sums td { padding: 2px 0; }
  table.sums td.value { text-align: right; }
  .grand td { font-weight: 700; font-size: 1.1em; border-top: 1px dashed #999; padding-top: 5px; }
  .sign { margin-top: 30px; display: flex; justify-content: flex-end; }
  .sign-line { width: 55%; text-align: center; font-size: 0.85em; }
  .ad { margin-top: 14px; padding-top: 8px; border-top: 1px dashed #999; text-align: center; font-size: 0.82em; color: #333; }
  .sign-line .line { border-top: 1px solid #333; margin-bottom: 4px; height: 26px; }
</style>
</head>
<body>
  ${shopBlock}
  <h1>${esc(t.title)}</h1>
  <div class="meta">${esc(t.date)}: ${esc(dateStr)}</div>
  <hr />
  <div class="cust">
    <div class="block-title">${esc(t.customer)}</div>
    <table>
      <tr><td class="label">${esc(t.customerName)}</td><td>${esc(customer.name)}</td></tr>
      <tr><td class="label">${esc(t.customerMobile)}</td><td>${esc(customer.mobile)}</td></tr>
      <tr><td class="label">${esc(t.customerAddress)}</td><td>${esc(customer.address)}</td></tr>
    </table>
  </div>
  <hr />
  <table class="items">
    <thead>
      <tr>
        <th>${esc(t.product)}</th>
        <th class="p-num">${esc(t.qty)}</th>
        <th class="p-num">${esc(t.price)}</th>
        <th class="p-num">${esc(t.netPrice)}</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>
  <table class="sums">
    <tr><td>${esc(t.subtotal)}</td><td class="value">${subtotal.toFixed(2)} ${esc(t.tk)}</td></tr>
    ${
      discountNum
        ? `<tr><td>${esc(t.discount)}</td><td class="value">-${discountNum.toFixed(2)} ${esc(t.tk)}</td></tr>`
        : ''
    }
    <tr class="grand"><td>${esc(t.total)}</td><td class="value">${total.toFixed(2)} ${esc(t.tk)}</td></tr>
  </table>
  <div class="sign">
    <div class="sign-line"><div class="line"></div>${esc(t.signature)}</div>
  </div>
  ${adBlock}
</body>
</html>`

  openPrintWindow(
    html,
    settings.language === 'bn'
      ? 'পপআপ ব্লক করা আছে, অনুগ্রহ করে ব্রাউজারে পপআপ অনুমতি দিন।'
      : 'Popup blocked — please allow popups for this site.'
  )
}
