[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/suchonamehzabin8-maker/best-household-budget-site-20261126-1457/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/suchonamehzabin8-maker/best-household-budget-site-20261126-1457/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# GharKharcha — a household budget site

A Dhaka household's budget companion. The Rahman family (Dhanmondi) tracks its
monthly income of ৳85,000 across real November 2026 spending: rent, Karwan
Bazar shops, DESCO and WASA bills, school fees, transport, health, eating out
and savings — 42 real transactions for November, plus October actuals and
December plans.

**Pages** (all reachable from the top nav, all working):

- **Dashboard** — income, spending, money left and savings rate; a donut of
  spending by category; six months of spending vs income; bills still to pay;
  savings goals at a glance.
- **Transactions** — the full ledger with a category filter and search, an
  add-transaction form (new entries update every total and chart), and delete.
- **Budgets** — a monthly limit per category with sliders and amounts that
  update progress bars and remaining money live.
- **Bills & recurring** — ten monthly bills with due days and mark-paid toggles.
- **Goals** — four savings goals with quick-add and custom contributions.
- **Reports & insights** — daily spending chart, category table, top merchants
  and plain-language insights computed from the data.
- **Planner** — a 50/30/20 split that recomputes live, compared against what
  November actually cost.

Everything runs offline from static files under `app/` — no build step, no
network requests, no external libraries or fonts. Charts are hand-drawn inline
SVG. Edits are saved in the browser's localStorage. It works on a desktop and
on a phone (390px layout stacks cleanly).

**Run it:** `node serve.ts`, then open http://localhost:8080.

**Hand it in:** `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`
