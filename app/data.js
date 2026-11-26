// GharKharcha — all figures for the Rahman household, Dhanmondi, Dhaka.
// Taka (৳). Months are keys "2026-10", "2026-11", "2026-12".
// December holds planned (scheduled) entries only — the month has not happened yet.

const CATEGORIES = [
  { id: 'rent',      label: 'Rent',        color: '#5b7c5a' },
  { id: 'bazaar',    label: 'Bazaar',      color: '#2e7d4f' },
  { id: 'utilities', label: 'Utilities',   color: '#c98a2b' },
  { id: 'transport', label: 'Transport',   color: '#4a7fa5' },
  { id: 'school',    label: 'School fees', color: '#7a5ea3' },
  { id: 'health',    label: 'Health',      color: '#c05a6e' },
  { id: 'eating',    label: 'Eating out',  color: '#b4552d' },
  { id: 'clothing',  label: 'Clothing',    color: '#8a6d4b' },
  { id: 'savings',   label: 'Savings',     color: '#2f6f6a' },
  { id: 'other',     label: 'Other',       color: '#8a8f7a' },
];

const MONTHS = [
  { key: '2026-10', label: 'October 2026',  note: 'Closed month' },
  { key: '2026-11', label: 'November 2026', note: 'Current month' },
  { key: '2026-12', label: 'December 2026', note: 'Planned' },
];

const INCOME = {
  '2026-10': [
    { source: 'Salary — Rahim (bank)', amount: 72000 },
    { source: 'Tuition — Suchona', amount: 8000 },
    { source: 'Other — freelancing', amount: 5000 },
  ],
  '2026-11': [
    { source: 'Salary — Rahim (bank)', amount: 72000 },
    { source: 'Tuition — Suchona', amount: 8000 },
    { source: 'Other — freelancing', amount: 5000 },
  ],
  '2026-12': [
    { source: 'Salary — Rahim (bank)', amount: 72000 },
    { source: 'Tuition — Suchona', amount: 8000 },
    { source: 'Other — freelancing', amount: 5000 },
  ],
};

const BUDGETS = {
  '2026-10': { rent: 22000, bazaar: 16500, utilities: 7000, transport: 3000, school: 8500, health: 4500, eating: 4500, clothing: 3000, savings: 10000, other: 6000 },
  '2026-11': { rent: 22000, bazaar: 16500, utilities: 7000, transport: 3000, school: 8500, health: 4500, eating: 4500, clothing: 3000, savings: 10000, other: 6000 },
  '2026-12': { rent: 22000, bazaar: 16500, utilities: 7000, transport: 3000, school: 8500, health: 4500, eating: 4500, clothing: 3000, savings: 10000, other: 6000 },
};

// id, date, merchant, category, amount (৳), note
const TRANSACTIONS = {
  '2026-11': [
    { id: 'n01', date: '2026-11-01', merchant: 'House rent — Dhanmondi flat', category: 'rent', amount: 22000, note: 'Paid by bank transfer' },
    { id: 'n02', date: '2026-11-02', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 2000, note: 'Rice, lentils, vegetables' },
    { id: 'n03', date: '2026-11-02', merchant: 'Swapno supermarket', category: 'bazaar', amount: 1300, note: 'Oil, sugar, soap, spices' },
    { id: 'n04', date: '2026-11-02', merchant: 'Pathao ride — office', category: 'transport', amount: 180, note: 'Dhanmondi to Motijheel' },
    { id: 'n05', date: '2026-11-03', merchant: 'DESCO electricity bill', category: 'utilities', amount: 2850, note: 'October usage' },
    { id: 'n06', date: '2026-11-03', merchant: 'Bismillah Pharmacy', category: 'health', amount: 640, note: 'Fever medicine for Arif' },
    { id: 'n07', date: '2026-11-04', merchant: 'Rickshaw — school run', category: 'transport', amount: 120, note: '' },
    { id: 'n08', date: '2026-11-05', merchant: 'Link3 internet bill', category: 'utilities', amount: 1500, note: '20 Mbps monthly' },
    { id: 'n09', date: '2026-11-05', merchant: 'Meena Bazar', category: 'bazaar', amount: 1000, note: 'Chicken, eggs, milk' },
    { id: 'n10', date: '2026-11-06', merchant: 'School fees — Viqarunnisa', category: 'school', amount: 8000, note: 'November tuition + exam fee' },
    { id: 'n11', date: '2026-11-07', merchant: 'Star Kabab — family dinner', category: 'eating', amount: 1450, note: 'Friday dinner out' },
    { id: 'n12', date: '2026-11-07', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1900, note: 'Fish, vegetables, fruit' },
    { id: 'n13', date: '2026-11-08', merchant: 'Uber — airport pickup', category: 'transport', amount: 620, note: 'Picking up uncle from airport' },
    { id: 'n14', date: '2026-11-09', merchant: 'Titas gas bill', category: 'utilities', amount: 1080, note: 'Monthly gas' },
    { id: 'n15', date: '2026-11-09', merchant: 'Shwapno — monthly stock-up', category: 'bazaar', amount: 1200, note: 'Rice 25kg, atta, oil' },
    { id: 'n16', date: '2026-11-10', merchant: 'DPS — savings deposit', category: 'savings', amount: 10000, note: 'Monthly DPS at Dutch-Bangla Bank' },
    { id: 'n17', date: '2026-11-11', merchant: 'Pathao Food — biryani', category: 'eating', amount: 650, note: 'Lunch at home' },
    { id: 'n18', date: '2026-11-11', merchant: 'Metro rail — Uttara trip', category: 'transport', amount: 200, note: 'Two tickets' },
    { id: 'n19', date: '2026-11-12', merchant: 'Dhaka WASA water bill', category: 'utilities', amount: 1240, note: 'Monthly water' },
    { id: 'n20', date: '2026-11-12', merchant: 'New Market — school shoes', category: 'clothing', amount: 1250, note: 'Shoes for Tanvir' },
    { id: 'n21', date: '2026-11-13', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1500, note: 'Vegetables, beef, fruit' },
    { id: 'n22', date: '2026-11-14', merchant: 'Square Hospital — checkup', category: 'health', amount: 1500, note: 'Doctor visit + tests' },
    { id: 'n23', date: '2026-11-14', merchant: 'CNG — Gulshan visit', category: 'transport', amount: 350, note: '' },
    { id: 'n24', date: '2026-11-15', merchant: 'Aarong — winter panjabi', category: 'clothing', amount: 1650, note: 'Panjabi for Rahim' },
    { id: 'n25', date: '2026-11-15', merchant: 'KFC Dhanmondi', category: 'eating', amount: 850, note: 'Kids treat after exam' },
    { id: 'n26', date: '2026-11-16', merchant: 'Bazar — fish market', category: 'bazaar', amount: 700, note: 'Rui fish, prawns' },
    { id: 'n28', date: '2026-11-17', merchant: 'Pathao ride — office', category: 'transport', amount: 190, note: '' },
    { id: 'n30', date: '2026-11-19', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1700, note: 'Weekly vegetables + chicken' },
    { id: 'n31', date: '2026-11-19', merchant: 'Rickshaw + bus fares', category: 'transport', amount: 260, note: 'Daily commute' },
    { id: 'n32', date: '2026-11-20', merchant: 'Popular Diagnostics — blood test', category: 'health', amount: 1450, note: 'Routine blood work' },
    { id: 'n34', date: '2026-11-21', merchant: 'Café — friends meetup', category: 'eating', amount: 620, note: 'Coffee with old friends' },
    { id: 'n35', date: '2026-11-21', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1500, note: 'Fish, vegetables, eggs' },
    { id: 'n36', date: '2026-11-22', merchant: 'Electrician — fan repair', category: 'other', amount: 850, note: 'Ceiling fan fix' },
    { id: 'n37', date: '2026-11-23', merchant: 'Pathao ride — office', category: 'transport', amount: 175, note: '' },
    { id: 'n38', date: '2026-11-23', merchant: 'Unimart — groceries', category: 'bazaar', amount: 800, note: 'Snacks, juice, biscuits' },
    { id: 'n39', date: '2026-11-24', merchant: 'Pharmacy — vitamins', category: 'health', amount: 720, note: 'Monthly vitamins' },
    { id: 'n40', date: '2026-11-24', merchant: 'Bus + rickshaw fares', category: 'transport', amount: 230, note: '' },
    { id: 'n41', date: '2026-11-25', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1600, note: 'Vegetables, chicken, fruit' },
    { id: 'n43', date: '2026-11-26', merchant: 'Maid salary — November', category: 'other', amount: 5000, note: 'Monthly salary' },
    { id: 'n44', date: '2026-11-26', merchant: 'Pizza — family night', category: 'eating', amount: 900, note: 'Pizza Hut delivery' },
    { id: 'n45', date: '2026-11-26', merchant: 'Metro rail — office', category: 'transport', amount: 100, note: '' },
    { id: 'n46', date: '2026-11-26', merchant: 'Swapno — milk & bread', category: 'bazaar', amount: 300, note: 'Daily essentials' },
  ],
  '2026-10': [
    { id: 'o01', date: '2026-10-01', merchant: 'House rent — Dhanmondi flat', category: 'rent', amount: 22000, note: '' },
    { id: 'o02', date: '2026-10-02', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 2100, note: '' },
    { id: 'o03', date: '2026-10-03', merchant: 'DESCO electricity bill', category: 'utilities', amount: 2680, note: '' },
    { id: 'o04', date: '2026-10-04', merchant: 'Meena Bazar', category: 'bazaar', amount: 1500, note: '' },
    { id: 'o05', date: '2026-10-05', merchant: 'Link3 internet bill', category: 'utilities', amount: 1500, note: '' },
    { id: 'o06', date: '2026-10-06', merchant: 'School fees — Viqarunnisa', category: 'school', amount: 8000, note: '' },
    { id: 'o07', date: '2026-10-08', merchant: 'Titas gas bill', category: 'utilities', amount: 1080, note: '' },
    { id: 'o08', date: '2026-10-09', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 2000, note: '' },
    { id: 'o09', date: '2026-10-10', merchant: 'DPS — savings deposit', category: 'savings', amount: 10000, note: '' },
    { id: 'o10', date: '2026-10-11', merchant: 'Dhaka WASA water bill', category: 'utilities', amount: 1180, note: '' },
    { id: 'o11', date: '2026-10-12', merchant: 'Pathao rides — week', category: 'transport', amount: 940, note: '' },
    { id: 'o12', date: '2026-10-13', merchant: 'Star Kabab — dinner', category: 'eating', amount: 1320, note: '' },
    { id: 'o13', date: '2026-10-15', merchant: 'Bismillah Pharmacy', category: 'health', amount: 890, note: '' },
    { id: 'o14', date: '2026-10-16', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 2200, note: '' },
    { id: 'o15', date: '2026-10-17', merchant: 'Aarong — shirts', category: 'clothing', amount: 3200, note: 'Puja shopping' },
    { id: 'o16', date: '2026-10-18', merchant: 'Uber — family trip', category: 'transport', amount: 780, note: '' },
    { id: 'o17', date: '2026-10-19', merchant: 'Swapno — monthly stock-up', category: 'bazaar', amount: 2600, note: '' },
    { id: 'o18', date: '2026-10-20', merchant: 'Square Hospital — dentist', category: 'health', amount: 2200, note: '' },
    { id: 'o19', date: '2026-10-21', merchant: 'Metro rail + bus', category: 'transport', amount: 420, note: '' },
    { id: 'o20', date: '2026-10-22', merchant: 'KFC Dhanmondi', category: 'eating', amount: 880, note: '' },
    { id: 'o21', date: '2026-10-23', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1900, note: '' },
    { id: 'o24', date: '2026-10-26', merchant: 'Maid salary — October', category: 'other', amount: 5000, note: '' },
    { id: 'o26', date: '2026-10-28', merchant: 'Rickshaw + CNG fares', category: 'transport', amount: 610, note: '' },
    { id: 'o27', date: '2026-10-29', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 1800, note: '' },
    { id: 'o28', date: '2026-10-30', merchant: 'Café — birthday treat', category: 'eating', amount: 1450, note: '' },
  ],
  '2026-12': [
    { id: 'd01', date: '2026-12-01', merchant: 'House rent — Dhanmondi flat', category: 'rent', amount: 22000, note: 'Planned', planned: true },
    { id: 'd02', date: '2026-12-03', merchant: 'DESCO electricity bill', category: 'utilities', amount: 2900, note: 'Planned', planned: true },
    { id: 'd03', date: '2026-12-05', merchant: 'Link3 internet bill', category: 'utilities', amount: 1500, note: 'Planned', planned: true },
    { id: 'd04', date: '2026-12-06', merchant: 'School fees — Viqarunnisa', category: 'school', amount: 8000, note: 'Planned', planned: true },
    { id: 'd05', date: '2026-12-07', merchant: 'Karwan Bazar weekly bazaar', category: 'bazaar', amount: 2700, note: 'Planned', planned: true },
    { id: 'd06', date: '2026-12-10', merchant: 'DPS — savings deposit', category: 'savings', amount: 10000, note: 'Planned', planned: true },
    { id: 'd07', date: '2026-12-12', merchant: 'Titas gas bill', category: 'utilities', amount: 1080, note: 'Planned', planned: true },
    { id: 'd08', date: '2026-12-26', merchant: 'Maid salary — December', category: 'other', amount: 5000, note: 'Planned', planned: true },
  ],
};

// Six-month spending totals (Jun–Nov 2026) for the trend chart.
const MONTHLY_TOTALS = [
  { month: 'Jun', spent: 71200, income: 85000 },
  { month: 'Jul', spent: 76800, income: 85000 },
  { month: 'Aug', spent: 73400, income: 85000 },
  { month: 'Sep', spent: 78900, income: 85000 },
  { month: 'Oct', spent: 78230, income: 85000 },
  { month: 'Nov', spent: 82125, income: 85000 },
];

const BILLS = [
  { id: 'b01', name: 'House rent', payee: 'Landlord — Dhanmondi flat', amount: 22000, dueDay: 1,  frequency: 'Monthly', paid: true },
  { id: 'b02', name: 'DESCO electricity', payee: 'DESCO', amount: 2850, dueDay: 3, frequency: 'Monthly', paid: true },
  { id: 'b03', name: 'Link3 internet', payee: 'Link3 Technologies', amount: 1500, dueDay: 5, frequency: 'Monthly', paid: true },
  { id: 'b04', name: 'School fees', payee: 'Viqarunnisa Noon School', amount: 8000, dueDay: 6, frequency: 'Monthly', paid: true },
  { id: 'b05', name: 'Titas gas', payee: 'Titas Gas', amount: 1080, dueDay: 9, frequency: 'Monthly', paid: true },
  { id: 'b06', name: 'Dhaka WASA water', payee: 'Dhaka WASA', amount: 1240, dueDay: 12, frequency: 'Monthly', paid: true },
  { id: 'b07', name: 'Grameenphone mobile', payee: 'Grameenphone', amount: 650, dueDay: 17, frequency: 'Monthly', paid: false },
  { id: 'b08', name: 'Dish TV', payee: 'Dish TV Bangladesh', amount: 900, dueDay: 25, frequency: 'Monthly', paid: false },
  { id: 'b09', name: 'Maid salary', payee: 'House help', amount: 5000, dueDay: 26, frequency: 'Monthly', paid: true },
  { id: 'b10', name: 'DPS savings', payee: 'Dutch-Bangla Bank', amount: 10000, dueDay: 10, frequency: 'Monthly', paid: true },
];

const GOALS = [
  { id: 'g01', name: 'Emergency fund', target: 150000, saved: 92000, note: '6 months of essentials, kept in a separate DPS' },
  { id: 'g02', name: 'Eid shopping fund', target: 25000, saved: 11500, note: 'Clothes and gifts for the whole family' },
  { id: 'g03', name: 'New fridge', target: 45000, saved: 18000, note: 'Replace the 12-year-old fridge before summer' },
  { id: 'g04', name: "Children's education fund", target: 200000, saved: 64000, note: 'College fund for Tanvir and Ayesha' },
];

const HOUSEHOLD = {
  name: 'Rahman family',
  area: 'Dhanmondi, Dhaka',
  members: 4,
  tagline: 'A Dhaka household keeping every taka in sight.',
};

export { CATEGORIES, MONTHS, INCOME, BUDGETS, TRANSACTIONS, MONTHLY_TOTALS, BILLS, GOALS, HOUSEHOLD };
