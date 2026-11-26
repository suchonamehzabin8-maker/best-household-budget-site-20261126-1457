// GharKharcha — SVG chart builders. Pure functions: data in, SVG string out.
// No libraries, no network. All charts are drawn from the household's own figures.

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function donutSVG(slices, size = 220) {
  // slices: [{label, value, color}] — values must sum > 0.
  const total = slices.reduce((s, x) => s + x.value, 0);
  if (total <= 0) return '<p class="empty">No spending yet this month.</p>';
  const cx = size / 2, cy = size / 2, r = size / 2 - 14, inner = r - 34;
  let start = 0;
  let paths = '';
  for (const s of slices) {
    if (s.value <= 0) continue;
    const frac = s.value / total;
    const end = start + frac * 360;
    const large = frac > 0.5 ? 1 : 0;
    const [x1, y1] = polar(cx, cy, r, start);
    const [x2, y2] = polar(cx, cy, r, end);
    const [ix1, iy1] = polar(cx, cy, inner, end);
    const [ix2, iy2] = polar(cx, cy, inner, start);
    paths += `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} L ${ix1.toFixed(1)} ${iy1.toFixed(1)} A ${inner} ${inner} 0 ${large} 0 ${ix2.toFixed(1)} ${iy2.toFixed(1)} Z" fill="${s.color}"><title>${s.label}: ৳${s.value.toLocaleString('en-IN')}</title></path>`;
    start = end;
  }
  const fmt = (n) => '৳' + n.toLocaleString('en-IN');
  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category donut chart" class="donut">
    ${paths}
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" class="donut-total">${fmt(total)}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" class="donut-label">spent this month</text>
  </svg>`;
}

function barChartSVG(months, size = { w: 560, h: 220 }) {
  // months: [{month, spent, income}] — grouped bars, spent vs income.
  const { w, h } = size;
  const padL = 8, padB = 26, padT = 18;
  const max = Math.max(...months.map((m) => Math.max(m.spent, m.income))) * 1.08;
  const chartH = h - padB - padT;
  const slot = w / months.length;
  const bw = Math.min(26, slot / 3.4);
  let bars = '';
  let labels = '';
  months.forEach((m, i) => {
    const x = slot * i + slot / 2;
    const spentH = (m.spent / max) * chartH;
    const incH = (m.income / max) * chartH;
    bars += `<rect x="${(x - bw - 3).toFixed(1)}" y="${(padT + chartH - spentH).toFixed(1)}" width="${bw}" height="${spentH.toFixed(1)}" rx="3" fill="#2e7d4f"><title>${m.month}: spent ৳${m.spent.toLocaleString('en-IN')}</title></rect>`;
    bars += `<rect x="${(x + 3).toFixed(1)}" y="${(padT + chartH - incH).toFixed(1)}" width="${bw}" height="${incH.toFixed(1)}" rx="3" fill="#d8cfae"><title>${m.month}: income ৳${m.income.toLocaleString('en-IN')}</title></rect>`;
    labels += `<text x="${x.toFixed(1)}" y="${h - 8}" text-anchor="middle" class="bar-label">${m.month}</text>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Monthly spending versus income bar chart" class="bars">
    ${bars}${labels}
  </svg>`;
}

function trendSVG(days, size = { w: 560, h: 180 }) {
  // days: [{day, amount}] — daily spending bars for the current month.
  const { w, h } = size;
  const padB = 24, padT = 14;
  const max = Math.max(...days.map((d) => d.amount), 1) * 1.1;
  const chartH = h - padB - padT;
  const slot = w / days.length;
  const bw = Math.max(4, slot - 3);
  let bars = '';
  let labels = '';
  days.forEach((d, i) => {
    const bh = (d.amount / max) * chartH;
    const x = slot * i + (slot - bw) / 2;
    bars += `<rect x="${x.toFixed(1)}" y="${(padT + chartH - bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${d.amount > 10000 ? '#c05a6e' : '#4a7fa5'}"><title>Nov ${d.day}: ৳${d.amount.toLocaleString('en-IN')}</title></rect>`;
    if (d.day % 5 === 1 || d.day === days.length) {
      labels += `<text x="${(x + bw / 2).toFixed(1)}" y="${h - 7}" text-anchor="middle" class="bar-label">${d.day}</text>`;
    }
  });
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Daily spending in November" class="bars">
    ${bars}${labels}
  </svg>`;
}

function progressBar(pct, color) {
  const p = Math.max(0, Math.min(100, pct));
  const over = pct > 100;
  return `<div class="pbar" role="progressbar" aria-valuenow="${Math.round(p)}" aria-valuemin="0" aria-valuemax="100">
    <div class="pbar-fill ${over ? 'over' : ''}" style="width:${p}%;background:${color}"></div>
  </div>`;
}

export { donutSVG, barChartSVG, trendSVG, progressBar };
