// tokens.jsx — shared data, formatters, category meta, simple icons
// All accents share L≈0.72 C≈0.12 in oklch; only hue varies (warm-harmonised).

const CATS = {
  food:    { name: '餐饮',  color: 'oklch(0.72 0.135 52)',  soft: 'oklch(0.94 0.04 60)' },
  transit: { name: '交通',  color: 'oklch(0.70 0.10 235)',  soft: 'oklch(0.95 0.025 235)' },
  shop:    { name: '购物',  color: 'oklch(0.72 0.12 5)',    soft: 'oklch(0.95 0.03 5)' },
  home:    { name: '居家',  color: 'oklch(0.70 0.09 155)',  soft: 'oklch(0.95 0.03 155)' },
  fun:     { name: '娱乐',  color: 'oklch(0.70 0.11 305)',  soft: 'oklch(0.95 0.03 305)' },
  income:  { name: '收入',  color: 'oklch(0.68 0.12 152)',  soft: 'oklch(0.94 0.04 152)' },
  other:   { name: '其他',  color: 'oklch(0.66 0.03 80)',   soft: 'oklch(0.94 0.012 80)' },
};

const T = {
  cream:  '#f6efe4',
  cream2: '#efe6d8',
  card:   '#fffdf9',
  ink:    '#2b2620',
  ink2:   '#6f665a',
  ink3:   '#a99e8e',
  line:   'rgba(43,38,32,0.08)',
  accent: 'oklch(0.68 0.145 48)',
  accentSoft: 'oklch(0.95 0.035 55)',
  good:   'oklch(0.66 0.12 152)',
};

const fmt = (n, dec = 2) => {
  const neg = n < 0;
  const s = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  return (neg ? '-' : '') + s;
};
const money = (n, dec = 2) => '¥' + fmt(Math.abs(n), dec);

const seedTxns = () => ([
  { id: 1, cat: 'food',   merchant: '星巴克 · 拿铁',   amt: -38,     time: '今天 09:24', day: '今天' },
  { id: 2, cat: 'transit',merchant: '地铁 · 早高峰',    amt: -6,      time: '今天 08:50', day: '今天' },
  { id: 3, cat: 'home',   merchant: '盒马 · 一周买菜',  amt: -124.5,  time: '昨天 19:12', day: '昨天' },
  { id: 4, cat: 'fun',    merchant: '万达影城 · 电影票',amt: -88,     time: '昨天 20:40', day: '昨天' },
  { id: 5, cat: 'shop',   merchant: '优衣库 · 卫衣',    amt: -299,    time: '前天 14:30', day: '前天' },
  { id: 6, cat: 'food',   merchant: '瑞幸 · 生椰拿铁',  amt: -19,     time: '前天 10:05', day: '前天' },
]);

const OVERVIEW = {
  spent: 3842.5,
  income: 18000,
  budget: 6000,
  goal:   { name: '冲绳旅行基金', saved: 7400, target: 12000 },
  shared: { name: '我们的家', month: 2180, mePct: 0.6, owed: 218 },
};

const Icon = ({ d, size = 24, sw = 1.8, fill = 'none', stroke = 'currentColor', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={style}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);
const PATHS = {
  home:   'M3 10.5L12 3l9 7.5M5 9.5V20h14V9.5',
  list:   'M8 7h12M8 12h12M8 17h12M4 7h.01M4 12h.01M4 17h.01',
  chart:  'M5 21V11M12 21V4M19 21v-7',
  target: 'M12 21V9M12 9l-4 3M12 9l4 3M5 5h14l-2 4H7L5 5z',
  user:   'M12 12a4 4 0 100-8 4 4 0 000 8zM5 20c0-3.3 3-6 7-6s7 2.7 7 6',
  plus:   'M12 5v14M5 12h14',
  wallet: 'M3 8a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8zM16 12h3',
};

Object.assign(window, { CATS, T, fmt, money, seedTxns, OVERVIEW, Icon, PATHS });
