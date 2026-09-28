// Small helpers shared by every printable document (token receipt, invoice, …)
export function esc(v) {
  return String(v ?? '').replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
}

export function nl2br(v) {
  return esc(v).replace(/\n/g, '<br/>')
}

export function pageCss(pageSize) {
  if (pageSize === 'thermal58') {
    return `
      @page { size: 58mm auto; margin: 2mm; }
      body { width: 52mm; font-size: 10.5px; }
    `
  }
  if (pageSize === 'thermal80') {
    return `
      @page { size: 80mm auto; margin: 3mm; }
      body { width: 74mm; font-size: 12px; }
    `
  }
  return `
    @page { size: A5; margin: 12mm; }
    body { max-width: 480px; margin: 0 auto; font-size: 14px; }
  `
}

export function openPrintWindow(html, blockedMessage) {
  const win = window.open('', '_blank', 'width=460,height=680')
  if (!win) {
    alert(blockedMessage)
    return null
  }
  win.document.open()
  win.document.write(html)
  win.document.close()
  win.onload = () => {
    win.focus()
    win.print()
  }
  return win
}
