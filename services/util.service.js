export function isValidDateStr(str) {
  return typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str)
}

export function clampDateRange(from, to) {
  let f = isValidDateStr(from) ? from : ''
  let t = isValidDateStr(to) ? to : ''
  if (f && t && f > t) [f, t] = [t, f]
  return { from: f, to: t }
}

export function weekAgoDateStr() {
  const d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  return d.toISOString().slice(0, 10) // YYYY-MM-DD
}
