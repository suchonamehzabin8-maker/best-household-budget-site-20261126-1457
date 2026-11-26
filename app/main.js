// GharKharcha — router, state and interactions.
// State: base figures from data.js, user changes kept in localStorage (guarded).
// Re-renders the current page whenever state changes.

import { CATEGORIES, MONTHS, INCOME, BUDGETS, TRANSACTIONS, BILLS, GOALS } from './data.js';
import { fmt, renderDashboard, renderTransactions, renderBudgets, renderBills, renderGoals, renderReports, renderPlanner } from './views.js';

const STORE_KEY = 'gharkharcha-v1';
const DEFAULT_MONTH = '2026-11';

function loadStored() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return { added: {}, deleted: [], budgets: {}, billsPaid: {}, goalsSaved: {}, planner: { income: 85000, needs: 50, wants: 30, save: 20 } };
    const parsed = JSON.parse(raw);
    return {
      added: parsed.added || {},
      deleted: Array.isArray(parsed.deleted) ? parsed.deleted : [],
      budgets: parsed.budgets || {},
      billsPaid: parsed.billsPaid || {},
      goalsSaved: parsed.goalsSaved || {},
      planner: { income: 85000, needs: 50, wants: 30, save: 20, ...(parsed.planner || {}) },
    };
  } catch {
    return { added: {}, deleted: [], budgets: {}, billsPaid: {}, goalsSaved: {}, planner: { income: 85000, needs: 50, wants: 30, save: 20 } };
  }
}

function saveStored() {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(stored)); } catch { /* storage unavailable — site still works in memory */ }
}

const stored = loadStored();

const ui = { month: DEFAULT_MONTH, route: 'dashboard', filterCat: '', filterQ: '' };

function transactionsFor(month) {
  const base = TRANSACTIONS[month] || [];
  const added = stored.added[month] || [];
  const deleted = new Set(stored.deleted);
  return [...base, ...added]
    .filter((t) => !deleted.has(t.id))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function budgetsFor(month) {
  return { ...(BUDGETS[month] || {}), ...(stored.budgets[month] || {}) };
}

function billsFor() {
  return BILLS.map((b) => ({ ...b, paid: Object.prototype.hasOwnProperty.call(stored.billsPaid, b.id) ? stored.billsPaid[b.id] : b.paid }));
}

function goalsFor() {
  return GOALS.map((g) => ({ ...g, saved: stored.goalsSaved[g.id] ?? g.saved }));
}

function buildState() {
  const all = transactionsFor(ui.month);
  const byCat = {};
  let spent = 0;
  for (const t of all) {
    byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    spent += t.amount;
  }
  const incomeTotal = (INCOME[ui.month] || []).reduce((a, x) => a + x.amount, 0);
  let filtered = all;
  if (ui.filterCat) filtered = filtered.filter((t) => t.category === ui.filterCat);
  if (ui.filterQ) {
    const q = ui.filterQ.toLowerCase();
    filtered = filtered.filter((t) => (t.merchant + ' ' + (t.note || '')).toLowerCase().includes(q));
  }
  return {
    month: ui.month,
    transactions: filtered,
    allTransactions: all,
    byCat,
    spentTotal: spent,
    incomeTotal,
    savingsSpent: byCat.savings || 0,
    txCount: all.length,
    budgets: budgetsFor(ui.month),
    bills: billsFor(),
    goals: goalsFor(),
    filterCat: ui.filterCat,
    filterQ: ui.filterQ,
    planner: stored.planner,
  };
}

const ROUTES = {
  dashboard: renderDashboard,
  transactions: renderTransactions,
  budgets: renderBudgets,
  bills: renderBills,
  goals: renderGoals,
  reports: renderReports,
  planner: renderPlanner,
};

const TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transactions',
  budgets: 'Budgets',
  bills: 'Bills & recurring',
  goals: 'Savings goals',
  reports: 'Reports & insights',
  planner: '50/30/20 planner',
};

function parseHash() {
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const [route] = h.split('/');
  return ROUTES[route] ? route : 'dashboard';
}

function render() {
  ui.route = parseHash();
  const view = document.getElementById('view');
  const s = buildState();
  view.innerHTML = ROUTES[ui.route](s);
  document.querySelectorAll('.nav-link').forEach((a) => {
    a.classList.toggle('active', a.dataset.route === ui.route);
    if (a.dataset.route === ui.route) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.title = `GharKharcha — ${TITLES[ui.route]}`;
  window.scrollTo(0, 0);
}

function rerender(keepFocus) {
  const active = keepFocus ? document.activeElement : null;
  render();
  if (keepFocus && active && active.id) {
    const next = document.getElementById(active.id);
    if (next) { next.focus(); if (next.setSelectionRange && next.value) { try { next.setSelectionRange(next.value.length, next.value.length); } catch { /* e.g. number inputs */ } } }
  }
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const action = el.dataset.action;
  if (action === 'month') {
    ui.month = el.dataset.month;
    ui.filterCat = ''; ui.filterQ = '';
    render();
  } else if (action === 'delete-tx') {
    if (confirm(`Delete “${el.getAttribute('aria-label')?.replace('Delete ', '') || 'this transaction'}”?`)) {
      stored.deleted.push(el.dataset.id);
      saveStored();
      render();
    }
  } else if (action === 'toggle-bill') {
    const b = billsFor().find((x) => x.id === el.dataset.id);
    stored.billsPaid[el.dataset.id] = !b.paid;
    saveStored();
    render();
  } else if (action === 'goal-add') {
    const amt = Number(el.dataset.amount) || 0;
    const g = goalsFor().find((x) => x.id === el.dataset.id);
    stored.goalsSaved[el.dataset.id] = (g ? g.saved : 0) + amt;
    saveStored();
    render();
  }
});

document.addEventListener('input', (e) => {
  const el = e.target;
  if (el.id === 'filter-cat') { ui.filterCat = el.value; render(); const n = document.getElementById('filter-cat'); if (n) n.focus(); }
  else if (el.id === 'filter-q') { ui.filterQ = el.value; render(); const n = document.getElementById('filter-q'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } }
  else if (el.dataset.action === 'budget-range') {
    const cat = el.dataset.cat;
    const val = Number(el.value);
    stored.budgets[ui.month] = { ...budgetsFor(ui.month), [cat]: val };
    saveStored();
    render();
    const n = document.querySelector(`input[data-action="budget-range"][data-cat="${cat}"]`);
    if (n) n.focus();
  } else if (el.dataset.action === 'budget-input') {
    const cat = el.dataset.cat;
    const val = Math.max(0, Number(el.value) || 0);
    stored.budgets[ui.month] = { ...budgetsFor(ui.month), [cat]: val };
    saveStored();
    render();
    const n = document.querySelector(`input[data-action="budget-input"][data-cat="${cat}"]`);
    if (n) { n.focus(); try { n.setSelectionRange(n.value.length, n.value.length); } catch { /* number inputs do not support selection */ } }
  } else if (el.closest('#planner-form')) {
    const form = el.closest('#planner-form');
    const fd = new FormData(form);
    stored.planner = {
      income: Math.max(1000, Number(fd.get('income')) || 85000),
      needs: Number(fd.get('needs')) || 0,
      wants: Number(fd.get('wants')) || 0,
      save: Number(fd.get('save')) || 0,
    };
    saveStored();
    render();
    const name = el.getAttribute('name');
    const n = document.querySelector(`#planner-form input[name="${name}"]`);
    if (n) n.focus();
  }
});

document.addEventListener('submit', (e) => {
  if (e.target.id === 'add-tx') {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amount = Number(fd.get('amount'));
    const merchant = String(fd.get('merchant') || '').trim();
    const date = String(fd.get('date') || '2026-11-26');
    const category = String(fd.get('category') || 'other');
    const note = String(fd.get('note') || '').trim();
    if (!merchant || !amount || amount <= 0) return;
    const month = date.slice(0, 7);
    const tx = { id: 'u' + Date.now().toString(36), date, merchant, category, amount, note };
    stored.added[month] = [...(stored.added[month] || []), tx];
    saveStored();
    ui.month = month;
    ui.filterCat = ''; ui.filterQ = '';
    render();
    const msg = document.getElementById('add-msg');
    if (msg) msg.textContent = `Added “${merchant}” — ${fmt(amount)} on ${date}.`;
  } else if (e.target.classList.contains('goal-custom')) {
    e.preventDefault();
    const fd = new FormData(e.target);
    const amount = Number(fd.get('amount'));
    const id = e.target.dataset.goal;
    if (!amount || amount <= 0) return;
    const g = goalsFor().find((x) => x.id === id);
    stored.goalsSaved[id] = (g ? g.saved : 0) + amount;
    saveStored();
    render();
  }
});

window.addEventListener('hashchange', render);
render();
