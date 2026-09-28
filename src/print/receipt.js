// Builds a printable NESCO prepaid token receipt and sends it to the
// browser's print dialog, honouring the local print settings (language,
// paper size, optional shop info + advertise text).
import { loadSettings } from '../settings.js'
import { esc, nl2br, pageCss, openPrintWindow } from './shared.js'

const LABELS = {
  bn: {
    title: 'নেসকো প্রিপেইড মিটার টোকেন',
    date: 'তারিখ',
    meterNo: 'মিটার নম্বর',
    customerNo: 'কাস্টমার নম্বর',
    customerName: 'কাস্টমার নাম',
    tariff: 'ট্যারিফ প্রোগ্রাম',
    load: 'অনুমোদিত লোড',
    office: 'এস অ্যান্ড ডি / ইএসইউ',
    energyCost: 'এনার্জি খরচ',
    rebate: 'রিবেট',
    paidDebt: 'পরিশোধিত ঋণ',
    demand: 'ডিমান্ড চার্জ',
    rent: 'মিটার ভাড়া',
    vat: 'ভ্যাট',
    pfc: 'পিএফসি',
    total: 'মোট টাকা',
    paid: 'পরিশোধিত টাকা',
    units: 'আনুমানিক ইউনিট (kWh)',
    tokenNote: 'প্রতি ২০ ডিজিট টোকেন লেখার পর এন্টার চাপুন, তারপর পরের টোকেন লিখুন।',
    tk: 'টাকা',
  },
  en: {
    title: 'Nesco Prepaid Meter Token',
    date: 'Date',
    meterNo: 'Meter No.',
    customerNo: 'Customer No.',
    customerName: 'Customer Name',
    tariff: 'Tariff Program',
    load: 'Sanction Load',
    office: 'S&D/ESU',
    energyCost: 'Energy Cost',
    rebate: 'Rebate',
    paidDebt: 'Paid debt',
    demand: 'Demand Charge',
    rent: 'Meter Rent',
    vat: 'VAT',
    pfc: 'PFC',
    total: 'Total Amount',
    paid: 'Paid Amount',
    units: 'Estimate of units (KWh)',
    tokenNote: 'Please press Enter after each 20 digits Token, then continue to another new token.',
    tk: 'Tk',
  },
}

export function printRecharge(record) {
  const settings = loadSettings()
  const t = LABELS[settings.language] || LABELS.bn
  const shopInfo = settings.shop?.[settings.language] || {}

  const tokenParts = String(record.token || '')
    .split(/<br>/)
    .map((s) => s.replace(/,\s*$/, '').trim())
    .filter(Boolean)

  const infoRows = [
    [t.date, record.recharge_date],
    [t.meterNo, record.meter_no],
    [t.customerNo, record.customer_no],
    [t.customerName, record.customer_name],
    [t.tariff, record.tariff],
    [t.load, record.sanction_load],
    [t.office, record.organization],
  ]

  const moneyRows = [
    [t.energyCost, record.electricity_amount],
    [t.rebate, record.subsidy_amount],
    [t.paidDebt, record.debt_amount],
    [t.demand, record.demand_charge],
    [t.rent, record.meter_rent],
    [t.vat, record.tax],
    [t.pfc, record.pfc_charge],
  ]

  const shopBlock = settings.shop?.show
    ? `<div class="shop">
         ${shopInfo.name ? `<div class="shop-name">${esc(shopInfo.name)}</div>` : ''}
         ${shopInfo.phone ? `<div>${esc(shopInfo.phone)}</div>` : ''}
         ${shopInfo.address ? `<div>${esc(shopInfo.address)}</div>` : ''}
       </div>`
    : ''

  const adBlock =
    settings.shop?.show && shopInfo.adText ? `<div class="ad">${nl2br(shopInfo.adText)}</div>` : ''

  const html = `<!doctype html>
<html lang="${settings.language}">
<head>
<meta charset="utf-8" />
<title>${esc(t.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
<style>
  * { box-sizing: border-box; }
  body {
    font-family: 'Hind Siliguri', 'Inter', Arial, sans-serif;
    color: #111;
    padding: 0;
  }
  ${pageCss(settings.pageSize)}
  h1 { font-size: 1.05em; text-align: center; margin: 0 0 8px; }
  .shop { text-align: center; margin-bottom: 8px; font-size: 0.9em; }
  .shop-name { font-weight: 700; font-size: 1.3em; margin-bottom: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  td { padding: 2px 0; vertical-align: top; }
  td.label { color: #444; width: 55%; }
  td.value { text-align: right; font-weight: 600; }
  hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
  .total-row td { font-weight: 700; font-size: 1.05em; }
  .token {
    text-align: center;
    font-family: 'Inter', monospace;
    font-size: 1.15em;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin: 10px 0 6px;
    word-break: break-all;
  }
  .note { font-size: 0.72em; color: #555; text-align: center; margin-bottom: 8px; }
  .units { text-align: center; font-size: 0.9em; margin-top: 4px; }
  .ad {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px dashed #999;
    text-align: center;
    font-size: 0.82em;
    color: #333;
  }
</style>
</head>
<body>
  ${shopBlock}
  <h1>${esc(t.title)}</h1>
  <table>
    ${infoRows.map(([l, v]) => `<tr><td class="label">${esc(l)}</td><td class="value">${esc(v)}</td></tr>`).join('')}
  </table>
  <hr />
  <table>
    ${moneyRows
      .map(
        ([l, v]) =>
          `<tr><td class="label">${esc(l)}</td><td class="value">${esc(v)} ${esc(t.tk)}</td></tr>`
      )
      .join('')}
    <tr class="total-row">
      <td class="label">${esc(t.total)}</td>
      <td class="value">${esc(record.recharge_amount)} ${esc(t.tk)}</td>
    </tr>
    <tr>
      <td class="label">${esc(t.paid)}</td>
      <td class="value">${esc(record.paid_amount)} ${esc(t.tk)}</td>
    </tr>
  </table>
  <hr />
  ${tokenParts.map((tok) => `<div class="token">${esc(tok)}</div>`).join('')}
  <div class="note">${esc(t.tokenNote)}</div>
  <div class="units">${esc(t.units)}: ${esc(record.purchase_energy)}</div>
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
