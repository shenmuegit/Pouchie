// data.jsx — richer shared model for the deep-dive screens (depends on tokens.jsx)

// full month ledger grouped by day
const LEDGER = [
  { day: '今天 · 6月5日', sum: -44, items: [
    { id: 't1', cat: 'food', merchant: '星巴克', note: '拿铁 ×1', amt: -38, time: '09:24' },
    { id: 't2', cat: 'transit', merchant: '地铁', note: '早高峰 2 号线', amt: -6, time: '08:50' },
  ]},
  { day: '昨天 · 6月4日', sum: -212.5, items: [
    { id: 't3', cat: 'home', merchant: '盒马', note: '一周买菜', amt: -124.5, time: '19:12', split: true },
    { id: 't4', cat: 'fun', merchant: '万达影城', note: '电影票 ×2', amt: -88, time: '20:40', split: true },
  ]},
  { day: '6月3日 周二', sum: -318, items: [
    { id: 't5', cat: 'shop', merchant: '优衣库', note: '卫衣', amt: -299, time: '14:30' },
    { id: 't6', cat: 'food', merchant: '瑞幸', note: '生椰拿铁', amt: -19, time: '10:05' },
  ]},
  { day: '6月2日 周一', sum: 18000 - 156, items: [
    { id: 't7', cat: 'income', merchant: '工资', note: '6 月薪资', amt: 18000, time: '10:00' },
    { id: 't8', cat: 'food', merchant: '海底捞', note: '聚餐 AA', amt: -156, time: '19:30', split: true },
  ]},
  { day: '6月1日 周日', sum: -268, items: [
    { id: 't9', cat: 'home', merchant: '宜家', note: '收纳盒 ×3', amt: -168, time: '15:20' },
    { id: 't10', cat: 'fun', merchant: 'Switch', note: '游戏《星之卡比》', amt: -100, time: '21:00' },
  ]},
];

// category breakdown (sums to 3842.5)
const BREAKDOWN = [
  { cat: 'food',    label: '餐饮', amt: 1306,   pct: 0.34, n: 24 },
  { cat: 'shop',    label: '购物', amt: 845,    pct: 0.22, n: 7 },
  { cat: 'home',    label: '居家', amt: 692,    pct: 0.18, n: 9 },
  { cat: 'fun',     label: '娱乐', amt: 534,    pct: 0.14, n: 5 },
  { cat: 'transit', label: '交通', amt: 465.5,  pct: 0.12, n: 31 },
];

// daily spend trend for the month (¥) — 14 visible days
const TREND = [120, 64, 210, 0, 156, 318, 268, 88, 124, 44, 92, 176, 210, 60];

// monthly comparison (last 6 months expense)
const MONTHS = [
  { m: '1月', v: 4120 }, { m: '2月', v: 5380 }, { m: '3月', v: 3960 },
  { m: '4月', v: 4510 }, { m: '5月', v: 4230 }, { m: '6月', v: 3842.5, now: true },
];

// goal detail
const GOAL = {
  name: '冲绳旅行基金', emoji: '🏝️', saved: 7400, target: 12000,
  monthly: 1200, etaMonths: 4, opened: '2026 · 3月',
  deposits: [
    { d: '6月1日', amt: 1200, note: '月初定存' },
    { d: '5月22日', amt: 500, note: '副业收入' },
    { d: '5月1日', amt: 1200, note: '月初定存' },
    { d: '4月15日', amt: 800, note: '退税' },
    { d: '4月1日', amt: 1200, note: '月初定存' },
    { d: '3月1日', amt: 2500, note: '建立目标' },
  ],
};

// shared ledger detail
const SHARED = {
  name: '我们的家', month: 2180, owed: 218, mePaid: 1308, taPaid: 872,
  members: [ { n: '我', c: 'me' }, { n: 'Ta', c: 'fun' } ],
  entries: [
    { id: 's1', cat: 'home', merchant: '盒马 · 一周买菜', amt: 124.5, payer: '我', time: '6月4日', mine: 62.25 },
    { id: 's2', cat: 'fun', merchant: '万达影城 · 电影票', amt: 88, payer: 'Ta', time: '6月4日', mine: 44 },
    { id: 's3', cat: 'food', merchant: '海底捞 · 聚餐', amt: 156, payer: '我', time: '6月2日', mine: 78 },
    { id: 's4', cat: 'home', merchant: '物业费 · 6月', amt: 680, payer: '我', time: '6月1日', mine: 340 },
    { id: 's5', cat: 'home', merchant: '水电燃气', amt: 232, payer: 'Ta', time: '6月1日', mine: 116 },
    { id: 's6', cat: 'shop', merchant: '宜家 · 收纳', amt: 168, payer: '我', time: '6月1日', mine: 84 },
  ],
};

// the single transaction shown on the detail screen
const DETAIL = {
  cat: 'home', merchant: '盒马鲜生', note: '一周买菜 · 周末囤货',
  amt: -124.5, date: '2026年6月4日 周三', time: '19:12',
  account: '招商银行 ·· 6688', method: '微信支付',
  split: { with: 'Ta', total: 124.5, mine: 62.25, theirs: 62.25 },
  tags: ['必需', '生鲜'],
};

Object.assign(window, { LEDGER, BREAKDOWN, TREND, MONTHS, GOAL, SHARED, DETAIL });
