// DirectionB.jsx — 圆润治愈 (Rounded & Cozy). Soft peach gradients, chunky radii, jar.
const FB = "'Nunito', 'PingFang SC', -apple-system, system-ui, sans-serif";

function TabBarB({ active, setActive, onAdd }) {
  const tabs = [['home', '首页'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  const acc = CATS.food.color;
  return (
    <div style={{ position: 'absolute', left: 16, right: 16, bottom: 22, zIndex: 40,
      height: 64, borderRadius: 32, background: 'rgba(255,253,249,0.86)',
      backdropFilter: 'blur(16px) saturate(160%)', WebkitBackdropFilter: 'blur(16px) saturate(160%)',
      boxShadow: '0 12px 34px -10px rgba(120,70,30,0.3), 0 0 0 1px rgba(255,255,255,0.5) inset',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <button key="add" onClick={onAdd} style={{
          width: 54, height: 54, borderRadius: 27, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(145deg, oklch(0.74 0.15 58), oklch(0.66 0.15 38))', color: '#fff',
          boxShadow: '0 8px 20px -4px oklch(0.68 0.15 48), 0 2px 4px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-12px)' }}>
          <Icon d={PATHS.plus} size={28} sw={2.6} />
        </button>
      ) : (
        <button key={t[0]} onClick={() => setActive(t[0])} style={{
          background: 'none', border: 'none', cursor: 'pointer', position: 'relative',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
          color: active === t[0] ? acc : T.ink3, width: 52, padding: '6px 0' }}>
          <Icon d={PATHS[t[0]]} size={23} sw={active === t[0] ? 2.3 : 1.9} />
          <span style={{ fontSize: 10, fontWeight: active === t[0] ? 800 : 600, fontFamily: FB }}>{t[1]}</span>
        </button>
      ))}
    </div>
  );
}

function HomeB() {
  const [txns, setTxns] = React.useState(seedTxns);
  const [spent, setSpent] = React.useState(OVERVIEW.spent);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('home');
  const [m, setM] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = OVERVIEW.goal.saved / OVERVIEW.goal.target;
  const acc = CATS.food.color;

  const save = ({ amt, cat }) => {
    setTxns((p) => [{ id: Date.now(), cat, merchant: CATS[cat].name + ' · 新记录', amt, time: '刚刚', day: '今天' }, ...p]);
    setSpent((s) => s + Math.abs(amt));
    setOpen(false);
  };

  const shortcuts = ['food', 'transit', 'shop', 'fun'];
  const ring = 92, rad = 40, circ = 2 * Math.PI * rad;

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', color: T.ink, fontFamily: FB,
      background: 'linear-gradient(180deg, oklch(0.93 0.05 62) 0%, oklch(0.95 0.03 70) 22%, ' + T.cream + ' 46%)' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 18px 130px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 62, paddingBottom: 16 }}>
          <div>
            <div style={{ fontSize: 15, color: T.ink2, fontWeight: 700 }}>嘿，林一 ☀️</div>
            <div style={{ fontSize: 25, fontWeight: 800, letterSpacing: -0.5, marginTop: 1 }}>今天也要好好记账～</div>
          </div>
        </div>

        {/* hero: big budget ring on peach card */}
        <div style={{ borderRadius: 30, padding: '22px 22px 24px', marginBottom: 16, position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(150deg, oklch(0.75 0.14 58), oklch(0.68 0.15 40))',
          boxShadow: '0 18px 40px -14px oklch(0.66 0.15 45)' }}>
          <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: 90, background: 'rgba(255,255,255,0.12)', top: -50, right: -40 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative', width: ring, height: ring, flexShrink: 0 }}>
              <svg width={ring} height={ring} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="9" />
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke="#fff" strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={circ} strokeDashoffset={m ? circ * pct : circ}
                  style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(.3,.8,.3,1)' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                <span style={{ fontSize: 22, fontWeight: 800, lineHeight: 1 }}>{Math.round((1 - pct) * 100)}%</span>
                <span style={{ fontSize: 10, fontWeight: 700, opacity: 0.85 }}>剩余</span>
              </div>
            </div>
            <div style={{ color: '#fff' }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, opacity: 0.9 }}>本月还能花</div>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1, fontVariantNumeric: 'tabular-nums', marginTop: 2 }}>¥{fmt(Math.floor(left), 0)}</div>
              <div style={{ fontSize: 12.5, fontWeight: 700, opacity: 0.85, marginTop: 4 }}>已花 {money(spent, 0)} · 预算 {money(OVERVIEW.budget, 0)}</div>
            </div>
          </div>
        </div>

        {/* quick shortcuts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
          {shortcuts.map((c) => (
            <button key={c} onClick={() => setOpen(true)} style={{ border: 'none', cursor: 'pointer', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, fontFamily: FB }}>
              <div style={{ width: 56, height: 56, borderRadius: 20, background: CATS[c].soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 6px 14px -8px ' + CATS[c].color }}>
                <div style={{ width: 18, height: 18, borderRadius: 9, background: CATS[c].color }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 700, color: T.ink2 }}>{CATS[c].name}</span>
            </button>
          ))}
        </div>

        {/* savings jar + shared */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 12, marginBottom: 16 }}>
          {/* jar */}
          <div style={{ borderRadius: 26, background: T.card, padding: '16px 16px 18px',
            boxShadow: '0 10px 26px -16px rgba(80,50,20,0.5)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>🏝️ {OVERVIEW.goal.name}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <div style={{ width: 52, height: 64, borderRadius: '12px 12px 16px 16px', background: CATS.transit.soft,
                position: 'relative', overflow: 'hidden', border: '2.5px solid ' + CATS.transit.color }}>
                <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: m ? (goalPct * 100) + '%' : 0,
                  background: 'linear-gradient(180deg, oklch(0.78 0.12 230), oklch(0.68 0.12 235))',
                  transition: 'height 1.2s cubic-bezier(.3,.8,.3,1)' }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: CATS.transit.color, lineHeight: 1 }}>{Math.round(goalPct * 100)}%</div>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, marginTop: 5, whiteSpace: 'nowrap' }}>已存 {money(OVERVIEW.goal.saved, 0)}</div>
                <div style={{ fontSize: 11, color: T.ink3, fontWeight: 700, whiteSpace: 'nowrap' }}>还差 {money(OVERVIEW.goal.target - OVERVIEW.goal.saved, 0)}</div>
              </div>
            </div>
          </div>
          {/* shared */}
          <div style={{ borderRadius: 26, background: T.card, padding: '16px', boxShadow: '0 10px 26px -16px rgba(80,50,20,0.5)' }}>
            <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 12 }}>💑 {OVERVIEW.shared.name}</div>
            <div style={{ display: 'flex', marginBottom: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: acc, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, border: '2px solid #fff', zIndex: 2 }}>我</div>
              <div style={{ width: 34, height: 34, borderRadius: 17, background: CATS.fun.color, color: '#fff', marginLeft: -10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, border: '2px solid #fff' }}>Ta</div>
            </div>
            <div style={{ fontSize: 11.5, color: T.ink3, fontWeight: 600 }}>本月共付 {money(OVERVIEW.shared.month, 0)}</div>
            <div style={{ fontSize: 13, color: T.good, fontWeight: 800, marginTop: 3 }}>Ta 该给你 {money(OVERVIEW.shared.owed, 0)}</div>
          </div>
        </div>

        {/* recent */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2px 4px 12px' }}>
          <span style={{ fontSize: 17, fontWeight: 800 }}>最近记录</span>
          <span style={{ fontSize: 13, color: acc, fontWeight: 800 }}>全部 ›</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {txns.slice(0, 5).map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 16px',
              background: T.card, borderRadius: 20, boxShadow: '0 6px 18px -14px rgba(80,50,20,0.6)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 14, flexShrink: 0, background: CATS[tx.cat].soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 13, height: 13, borderRadius: 7, background: CATS[tx.cat].color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1, fontWeight: 600 }}>{tx.time}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>
                {tx.amt > 0 ? '+' : '-'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBarB active={active} setActive={setActive} onAdd={() => setOpen(true)} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={save} accent={acc} rounded />
    </div>
  );
}

window.HomeB = HomeB;
