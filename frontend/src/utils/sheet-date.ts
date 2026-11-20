/**
 * Sheet dates are free text: usually ISO (2026-08-02) but staff may type D/M/YYYY,
 * possibly in Buddhist Era (2/8/2569). Returns a sortable timestamp; empty/unknown
 * values return -Infinity so they sort last in descending order.
 */
export function sheetDateValue(raw: string): number {
  const s = (raw || '').trim();
  if (!s) return Number.NEGATIVE_INFINITY;
  let y: number, m: number, d: number;
  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  const dmy = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})/);
  if (iso) {
    [y, m, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  } else if (dmy) {
    [d, m, y] = [Number(dmy[1]), Number(dmy[2]), Number(dmy[3])];
  } else {
    const t = Date.parse(s);
    return Number.isNaN(t) ? Number.NEGATIVE_INFINITY : t;
  }
  if (y > 2400) y -= 543;
  return Date.UTC(y, m - 1, d);
}
