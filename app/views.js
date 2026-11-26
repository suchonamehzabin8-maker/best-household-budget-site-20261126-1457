// GharKharcha — page renderers. Pure functions: state in, HTML string out.
// main.js owns the state and wires up the controls these pages declare.

import { CATEGORIES, MONTHS, INCOME, BUDGETS, TRANSACTIONS, MONTHLY_TOTALS, BILLS, GOALS, HOUSEHOLD } from './data.js';
import { donutSVG, barChartSVG, trendSVG, progressBar } from './charts.js';

const fmt = (n) => '৳' + Math.round(n).toLocaleString('en-IN');
const catOf = (id) => CATEGORIES.find((c) => c.id === id) || { label: id, color: '#888' };
const monthLabel = (key) => (MONTHS.find((m) => m.key === key) || {}).label || key;

function monthSwitcher(current) {
  return `<div class="month-switch" role="group" aria-label="Choose month">
    ${MONTHS.map((m) => `<button class="chip ${m.key === current ? 'active' : ''}" data-action="month" data-month="${m.key}">${m.label.replace(' 2026', '')}<span class="chip-note">${m.note}</span></button>`).join('')}
  </div>`;
}

function summaryCards(s) {
  const income = s.incomeTotal;
  const spent = s.spentTotal;
  const left = income - spent;
  const saved = s.savingsSpent;
  const rate = income > 0 ? Math.round((saved / income) * 100) : 0;
  return `<section class="cards" aria-label="Month summary">
    <div class="card stat"><span class="stat-label">Income</span><strong>${fmt(income)}</strong><span class="stat-sub">Salary ৳72,000 · Tuition ৳8,000 · Other ৳5,000</span></div>
    <div class="card stat"><span class="stat-label">Spent so far</span><strong>${fmt(spent)}</strong><span class="stat-sub">${s.txCount} transactions in ${monthLabel(s.month)}</span></div>
    <div class="card stat ${left < 0 ? 'bad' : 'good'}"><span class="stat-label">Left to spend</span><strong>${fmt(left)}</strong><span class="stat-sub">${left < 0 ? 'Over budget this month' : 'Still in the green'}</span></div>
    <div class="card stat"><span class="stat-label">Saved</span><strong>${fmt(saved)}</strong><span class="stat-sub">${rate}% of income set aside</span></div>
  </section>`;
}

function renderDashboard(s) {
  const slices = CATEGORIES.map((c) => ({ label: c.label, value: s.byCat[c.id] || 0, color: c.color }))
    .filter((x) => x.value > 0)
    .sort((a, b) => b.value - a.value);
  const legend = slices.map((x) => {
    const pct = s.spentTotal > 0 ? Math.round((x.value / s.spentTotal) * 100) : 0;
    return `<li><span class="dot" style="background:${x.color}"></span>${x.label}<strong>${fmt(x.value)}</strong><span class="pct">${pct}%</span></li>`;
  }).join('');
  const upcoming = s.bills.filter((b) => !b.paid).slice(0, 3);
  const topCats = slices.slice(0, 3);
  const recent = s.transactions.slice(0, 5);
  return `
  <header class="page-head">
    <div><h1>Dashboard</h1><p>${HOUSEHOLD.name} · ${HOUSEHOLD.area} · ${monthLabel(s.month)}</p></div>
    ${monthSwitcher(s.month)}
  </header>
  ${summaryCards(s)}
  <div class="grid-2">
    <section class="card">
      <h2>Where the money went</h2>
      <div class="donut-wrap">${donutSVG(slices)}<ul class="legend">${legend}</ul></div>
    </section>
    <section class="card">
      <h2>Six months: spending vs income</h2>
      ${barChartSVG(MONTHLY_TOTALS)}
      <p class="legend-inline"><span class="swatch" style="background:#2e7d4f"></span> Spent <span class="swatch" style="background:#d8cfae"></span> Income</p>
      <p class="note">November is tracking ৳2,875 under income. The household has stayed under income every month since June.</p>
    </section>
  </div>
  <div class="grid-3">
    <section class="card">
      <h2>Biggest costs</h2>
      <ol class="ranked">${topCats.map((c, i) => `<li><span class="rank">${i + 1}</span>${c.label}<strong>${fmt(c.value)}</strong></li>`).join('')}</ol>
      <p class="note">Rent is fixed at ৳22,000. Bazaar is the one the family can move — weekly shops at Karwan Bazar average ৳1,700.</p>
      <a class="link" href="#/budgets">See all budgets →</a>
    </section>
    <section class="card">
      <h2>Bills still to pay</h2>
      ${upcoming.length ? `<ul class="bill-mini">${upcoming.map((b) => `<li>${b.name}<strong>${fmt(b.amount)}</strong><span>due ${b.dueDay} Nov</span></li>`).join('')}</ul>` : '<p class="note">All November bills are paid. Well done.</p>'}
      <a class="link" href="#/bills">Manage bills →</a>
    </section>
    <section class="card">
      <h2>Savings goals</h2>
      <ul class="goal-mini">${s.goals.slice(0, 3).map((g) => `<li>${g.name}<strong>${Math.round((g.saved / g.target) * 100)}%</strong>${progressBar((g.saved / g.target) * 100, '#2f6f6a')}</li>`).join('')}</ul>
      <a class="link" href="#/goals">All savings goals →</a>
    </section>
  </div>
  <section class="card">
    <h2>Latest transactions</h2>
    <table class="tx-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th></tr></thead>
    <tbody>${recent.map((t) => `<tr><td>${t.date.slice(5)}</td><td>${t.merchant}</td><td><span class="tag" style="background:${catOf(t.category).color}">${catOf(t.category).label}</span></td><td class="num">${fmt(t.amount)}</td></tr>`).join('')}</tbody></table>
    <a class="link" href="#/transactions">Full ledger →</a>
  </section>`;
}

function renderTransactions(s) {
  const opts = CATEGORIES.map((c) => `<option value="${c.id}" ${s.filterCat === c.id ? 'selected' : ''}>${c.label}</option>`).join('');
  const rows = s.transactions.map((t) => `<tr>
    <td>${t.date}</td><td>${t.merchant}${t.note ? `<span class="tx-note">${t.note}</span>` : ''}${t.planned ? ' <span class="planned-tag">planned</span>' : ''}</td>
    <td><span class="tag" style="background:${catOf(t.category).color}">${catOf(t.category).label}</span></td>
    <td class="num">${fmt(t.amount)}</td>
    <td><button class="btn small danger" data-action="delete-tx" data-id="${t.id}" aria-label="Delete ${t.merchant}">Delete</button></td>
  </tr>`).join('');
  return `
  <header class="page-head">
    <div><h1>Transactions</h1><p>Every taka in and out — ${s.transactions.length} entries in ${monthLabel(s.month)}</p></div>
    ${monthSwitcher(s.month)}
  </header>
  ${summaryCards(s)}
  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-tx" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-26" required></label>
      <label>What was it? <input type="text" name="merchant" placeholder="e.g. Karwan Bazar weekly bazaar" required maxlength="80"></label>
      <label>Category <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select></label>
      <label>Amount (৳) <input type="number" name="amount" min="1" max="1000000" step="1" placeholder="2500" required></label>
      <label>Note <input type="text" name="note" placeholder="Optional note" maxlength="80"></label>
      <button type="submit" class="btn primary">Add transaction</button>
    </form>
    <p class="note" id="add-msg" role="status"></p>
  </section>
  <section class="card">
    <h2>Ledger</h2>
    <div class="filters">
      <label>Category <select id="filter-cat"><option value="">All categories</option>${opts}</select></label>
      <label>Search <input type="search" id="filter-q" placeholder="Search merchant or note…" value="${s.filterQ || ''}"></label>
      <span class="filter-count">${s.transactions.length} shown · total ${fmt(s.spentTotal)}</span>
    </div>
    ${s.transactions.length ? `<div class="table-wrap"><table class="tx-table"><thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
      : '<p class="empty">Nothing matches that filter. Try clearing the search.</p>'}
  </section>`;
}

function renderBudgets(s) {
  const rows = CATEGORIES.map((c) => {
    const budget = s.budgets[c.id] || 0;
    const spent = s.byCat[c.id] || 0;
    const left = budget - spent;
    const pct = budget > 0 ? (spent / budget) * 100 : 0;
    const status = pct > 100 ? 'Over budget' : pct > 85 ? 'Nearly there' : 'On track';
    return `<article class="budget-row">
      <div class="budget-head"><span class="dot" style="background:${c.color}"></span><strong>${c.label}</strong><span class="budget-status ${pct > 100 ? 'bad' : ''}">${status}</span></div>
      <div class="budget-amounts"><span>Spent <strong>${fmt(spent)}</strong> of <strong>${fmt(budget)}</strong></span><span class="${left < 0 ? 'bad-text' : ''}">${left < 0 ? 'Over by ' + fmt(-left) : fmt(left) + ' left'}</span></div>
      ${progressBar(pct, c.color)}
      <label class="budget-edit">Monthly budget (৳)
        <input type="range" min="0" max="30000" step="500" value="${budget}" data-action="budget-range" data-cat="${c.id}" aria-label="${c.label} budget slider">
        <input type="number" min="0" max="100000" step="100" value="${budget}" data-action="budget-input" data-cat="${c.id}" aria-label="${c.label} budget amount">
      </label>
    </article>`;
  }).join('');
  const totalBudget = Object.values(s.budgets).reduce((a, b) => a + b, 0);
  return `
  <header class="page-head">
    <div><h1>Category budgets</h1><p>Monthly limits for ${monthLabel(s.month)} — drag a slider or type a new amount; it saves automatically.</p></div>
    ${monthSwitcher(s.month)}
  </header>
  <section class="card total-bar"><span>Total budgeted</span><strong>${fmt(totalBudget)}</strong><span>Income ${fmt(s.incomeTotal)}</span><span class="${totalBudget > s.incomeTotal ? 'bad-text' : 'good-text'}">${totalBudget > s.incomeTotal ? 'Over income by ' + fmt(totalBudget - s.incomeTotal) : fmt(s.incomeTotal - totalBudget) + ' of income unbudgeted'}</span></section>
  <div class="budget-grid">${rows}</div>`;
}

function renderBills(s) {
  const unpaid = s.bills.filter((b) => !b.paid);
  const unpaidTotal = unpaid.reduce((a, b) => a + b.amount, 0);
  const paidTotal = s.bills.filter((b) => b.paid).reduce((a, b) => a + b.amount, 0);
  return `
  <header class="page-head">
    <div><h1>Bills &amp; recurring</h1><p>Everything that repeats each month — tap “Mark paid” when it is done.</p></div>
  </header>
  <section class="cards">
    <div class="card stat"><span class="stat-label">Still to pay</span><strong>${fmt(unpaidTotal)}</strong><span class="stat-sub">${unpaid.length} bill${unpaid.length === 1 ? '' : 's'} unpaid</span></div>
    <div class="card stat"><span class="stat-label">Paid this month</span><strong>${fmt(paidTotal)}</strong><span class="stat-sub">${s.bills.length - unpaid.length} of ${s.bills.length} bills done</span></div>
    <div class="card stat"><span class="stat-label">Monthly recurring total</span><strong>${fmt(unpaidTotal + paidTotal)}</strong><span class="stat-sub">Rent, utilities, school, savings</span></div>
  </section>
  <section class="card">
    <h2>November bills</h2>
    <ul class="bill-list">
      ${s.bills.map((b) => `<li class="${b.paid ? 'paid' : ''}">
        <div><strong>${b.name}</strong><span class="bill-payee">${b.payee} · ${b.frequency} · due ${b.dueDay} Nov</span></div>
        <strong>${fmt(b.amount)}</strong>
        <button class="btn ${b.paid ? '' : 'primary'}" data-action="toggle-bill" data-id="${b.id}">${b.paid ? '✓ Paid — undo' : 'Mark paid'}</button>
      </li>`).join('')}
    </ul>
    <p class="note">Paying a bill here only marks it in this household's tracker — it does not pay the real bill. Rent and the DPS are already done for November; Grameenphone and Dish TV are still open.</p>
  </section>`;
}

function renderGoals(s) {
  return `
  <header class="page-head">
    <div><h1>Savings goals</h1><p>Four things the family is saving for — add money and watch the bar move.</p></div>
  </header>
  <div class="goal-grid">
    ${s.goals.map((g) => {
      const pct = Math.min(100, (g.saved / g.target) * 100);
      const left = g.target - g.saved;
      return `<article class="card goal-card">
        <h2>${g.name}</h2>
        <p class="goal-amount"><strong>${fmt(g.saved)}</strong> of ${fmt(g.target)}</p>
        ${progressBar(pct, '#2f6f6a')}
        <p class="note">${g.note}</p>
        <p class="${left <= 0 ? 'good-text' : ''}">${left <= 0 ? 'Goal reached!' : fmt(left) + ' to go · ' + Math.round(pct) + '% there'}</p>
        <div class="goal-actions">
          <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="500">+ ৳500</button>
          <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="1000">+ ৳1,000</button>
          <button class="btn small" data-action="goal-add" data-id="${g.id}" data-amount="5000">+ ৳5,000</button>
        </div>
        <form class="goal-custom" data-goal="${g.id}">
          <label>Add custom amount (৳) <input type="number" name="amount" min="1" max="1000000" step="1" placeholder="2000" required></label>
          <button type="submit" class="btn small primary">Add</button>
        </form>
      </article>`;
    }).join('')}
  </div>
  <section class="card">
    <h2>How the goals are funded</h2>
    <p>The DPS (৳10,000 a month) feeds the emergency fund first. Whatever is left after bills and bazaar goes to the next goal in line — this month that is the new fridge, at ৳18,000 of ৳45,000.</p>
  </section>`;
}

function renderReports(s) {
  const byMerchant = {};
  for (const t of s.allTransactions) byMerchant[t.merchant] = (byMerchant[t.merchant] || 0) + t.amount;
  const topMerchants = Object.entries(byMerchant).sort((a, b) => b[1] - a[0]).slice(0, 6);
  const days = {};
  for (const t of s.allTransactions) days[t.date.slice(8)] = (days[t.date.slice(8)] || 0) + t.amount;
  const dayArr = Object.entries(days).map(([day, amount]) => ({ day: Number(day), amount })).sort((a, b) => a.day - b.day);
  const bigDays = dayArr.filter((d) => d.amount > 10000);
  const catRows = CATEGORIES.map((c) => ({ ...c, spent: s.byCat[c.id] || 0, budget: s.budgets[c.id] || 0 }))
    .sort((a, b) => b.spent - a.spent);
  const bazaarAvg = Math.round((s.byCat.bazaar || 0) / 4);
  const rate = s.incomeTotal > 0 ? Math.round(((s.savingsSpent) / s.incomeTotal) * 100) : 0;
  return `
  <header class="page-head">
    <div><h1>Reports &amp; insights</h1><p>What November actually looks like, in numbers.</p></div>
    ${monthSwitcher(s.month)}
  </header>
  <div class="grid-2">
    <section class="card">
      <h2>Daily spending — November</h2>
      ${trendSVG(dayArr)}
      <p class="note">Red bars are days over ৳10,000 — the 1st is the big one, rent day. Ordinary days sit under ৳3,000.</p>
    </section>
    <section class="card">
      <h2>Where it goes, by category</h2>
      <table class="tx-table"><thead><tr><th>Category</th><th class="num">Spent</th><th class="num">Budget</th><th class="num">Share</th></tr></thead>
      <tbody>${catRows.map((c) => `<tr><td><span class="dot" style="background:${c.color}"></span> ${c.label}</td><td class="num">${fmt(c.spent)}</td><td class="num">${fmt(c.budget)}</td><td class="num">${s.spentTotal ? Math.round((c.spent / s.spentTotal) * 100) + '%' : '—'}</td></tr>`).join('')}</tbody></table>
    </section>
  </div>
  <div class="grid-2">
    <section class="card">
      <h2>Top places money goes</h2>
      <ol class="ranked">${topMerchants.map((m, i) => `<li><span class="rank">${i + 1}</span>${m[0]}<strong>${fmt(m[1])}</strong></li>`).join('')}</ol>
    </section>
    <section class="card">
      <h2>Insights</h2>
      <ul class="insights">
        <li><strong>Biggest cost is rent</strong> — ৳22,000, 29% of November spending. It never moves, so the family budgets around it.</li>
        <li><strong>Bazaar averages ${fmt(bazaarAvg)} a week</strong> across six weekly bazaar trips and supermarket runs.</li>
        <li><strong>Savings rate is ${rate}%</strong> — the ৳10,000 DPS went out on the 10th, before any discretionary spending.</li>
        <li><strong>${bigDays.length} big-bill day${bigDays.length === 1 ? '' : 's'}</strong> in November (over ৳10,000 each). The big one was the 1st — rent day, a fixed cost, not shopping.</li>
        <li><strong>Transport is ৳${(s.byCat.transport || 0).toLocaleString('en-IN')} so far</strong>, under the ৳5,500 budget — metro rail trips replaced two Pathao rides a week.</li>
      </ul>
    </section>
  </div>`;
}

function renderPlanner(s) {
  const p = s.planner;
  const needs = Math.round((p.income * p.needs) / 100);
  const wants = Math.round((p.income * p.wants) / 100);
  const save = Math.round((p.income * p.save) / 100);
  const actualNeeds = (s.byCat.rent || 0) + (s.byCat.bazaar || 0) + (s.byCat.utilities || 0) + (s.byCat.transport || 0) + (s.byCat.school || 0) + (s.byCat.health || 0);
  const actualWants = (s.byCat.eating || 0) + (s.byCat.clothing || 0) + (s.byCat.other || 0);
  const actualSave = s.byCat.savings || 0;
  return `
  <header class="page-head">
    <div><h1>50 / 30 / 20 planner</h1><p>Split the household income into needs, wants and savings — then see how November actually compares.</p></div>
  </header>
  <section class="card">
    <h2>Your split</h2>
    <form class="form-grid planner-form" id="planner-form">
      <label>Monthly income (৳) <input type="number" name="income" min="1000" max="10000000" step="1000" value="${p.income}"></label>
      <label>Needs % <input type="range" name="needs" min="0" max="100" value="${p.needs}"><output>${p.needs}%</output></label>
      <label>Wants % <input type="range" name="wants" min="0" max="100" value="${p.wants}"><output>${p.wants}%</output></label>
      <label>Savings % <input type="range" name="save" min="0" max="100" value="${p.save}"><output>${p.save}%</output></label>
    </form>
    <p class="${p.needs + p.wants + p.save === 100 ? 'good-text' : 'bad-text'}" role="status">Percentages add up to ${p.needs + p.wants + p.save}% ${p.needs + p.wants + p.save === 100 ? '— a full split.' : '— adjust so they total 100%.'}</p>
    <div class="split-bars">
      <div class="split-row"><span>Needs — rent, bazaar, bills, school, health</span><strong>${fmt(needs)}</strong>${progressBar(p.needs, '#2e7d4f')}</div>
      <div class="split-row"><span>Wants — eating out, clothing, extras</span><strong>${fmt(wants)}</strong>${progressBar(p.wants, '#c98a2b')}</div>
      <div class="split-row"><span>Savings — DPS and goals</span><strong>${fmt(save)}</strong>${progressBar(p.save, '#2f6f6a')}</div>
    </div>
  </section>
  <section class="card">
    <h2>Plan vs November reality</h2>
    <table class="tx-table"><thead><tr><th>Bucket</th><th class="num">Plan</th><th class="num">Actual</th><th class="num">Difference</th></tr></thead>
    <tbody>
      <tr><td>Needs</td><td class="num">${fmt(needs)}</td><td class="num">${fmt(actualNeeds)}</td><td class="num ${actualNeeds > needs ? 'bad-text' : 'good-text'}">${actualNeeds > needs ? '+' + fmt(actualNeeds - needs) : '−' + fmt(needs - actualNeeds)}</td></tr>
      <tr><td>Wants</td><td class="num">${fmt(wants)}</td><td class="num">${fmt(actualWants)}</td><td class="num ${actualWants > wants ? 'bad-text' : 'good-text'}">${actualWants > wants ? '+' + fmt(actualWants - wants) : '−' + fmt(wants - actualWants)}</td></tr>
      <tr><td>Savings</td><td class="num">${fmt(save)}</td><td class="num">${fmt(actualSave)}</td><td class="num ${actualSave >= save ? 'good-text' : 'bad-text'}">${actualSave >= save ? '+' + fmt(actualSave - save) : '−' + fmt(save - actualSave)}</td></tr>
    </tbody></table>
    <p class="note">On the classic 50/30/20 split of ৳85,000, needs get ৳42,500 — but Dhaka rent alone takes ৳22,000, so this household runs closer to 69/16/12. The planner lets you set your own split instead of forcing the textbook one.</p>
  </section>`;
}

export { fmt, monthLabel, renderDashboard, renderTransactions, renderBudgets, renderBills, renderGoals, renderReports, renderPlanner };
