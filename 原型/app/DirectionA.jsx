// DirectionA.jsx — 温暖极简 (Warm Minimal). Calm, generous whitespace, single accent.

function TabBarA({ active, setActive, onAdd, accent }) {
  const tabs = [['home', '首页'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 26, paddingTop: 8,
      background: 'linear-gradient(to top, rgba(246,239,228,0.96) 70%, rgba(246,239,228,0))',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
    }}>
      {tabs.map((t, i) => t[0] === '__add' ? (
        <button key="add" onClick={onAdd} style={{
          width: 56, height: 56, borderRadius: 20, border: 'none', cursor: 'pointer',
          background: accent, color: '#fff', marginBottom: 4,
          boxShadow: '0 10px 24px -6px ' + accent + ', 0 2px 6px rgba(0,0,0,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: 'translateY(-2px)',
        }}>
          <Icon d={PATHS.plus} size={28} sw={2.4} />
        </button>
      ) : (
        <button key={t[0]} onClick={() => setActive(t[0])} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          color: active === t[0] ? accent : T.ink3, width: 56, padding: '4px 0',
        }}>
          <Icon d={PATHS[t[0]]} size={23} sw={active === t[0] ? 2.1 : 1.8} />
          <span style={{ fontSize: 10.5, fontWeight: active === t[0] ? 700 : 500 }}>{t[1]}</span>
        </button>
      ))}
    </div>
  );
}

function HomeA() {
  const [txns, setTxns] = React.useState(seedTxns);
  const [spent, setSpent] = React.useState(OVERVIEW.spent);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('home');
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = OVERVIEW.goal.saved / OVERVIEW.goal.target;

  const save = ({ amt, cat }) => {
    setTxns((p) => [{ id: Date.now(), cat, merchant: CATS[cat].name + ' · 新记录', amt, time: '刚刚', day: '今天' }, ...p]);
    setSpent((s) => s + Math.abs(amt));
    setOpen(false);
  };

  const card = { background: T.card, borderRadius: 22, boxShadow: '0 1px 2px rgba(43,38,32,0.04), 0 8px 24px -16px rgba(43,38,32,0.3)' };

  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 20px 120px' }}>
        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 64, paddingBottom: 18 }}>
          <div>
            <div style={{ fontSize: 14, color: T.ink2, fontWeight: 500 }}>晚上好，林一 🌙</div>
            <div style={{ fontSize: 23, fontWeight: 700, letterSpacing: -0.4, marginTop: 2 }}>6 月总览</div>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: 21, background: T.accentSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 700, color: T.accent }}>林</div>
        </div>

        {/* hero — 本月还能花 */}
        <div style={{ ...card, padding: '24px 22px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 13.5, color: T.ink2, fontWeight: 600 }}>本月还能花</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6 }}>
            <span style={{ fontSize: 26, fontWeight: 700, color: T.ink3 }}>¥</span>
            <span style={{ fontSize: 46, fontWeight: 700, letterSpacing: -1.5, fontVariantNumeric: 'tabular-nums' }}>{fmt(Math.floor(left), 0)}</span>
            <span style={{ fontSize: 17, fontWeight: 600, color: T.ink3 }}>.{String(Math.round((left - Math.floor(left)) * 100)).padStart(2, '0')}</span>
          </div>
          {/* progress */}
          <div style={{ marginTop: 18, height: 9, borderRadius: 6, background: T.cream2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: mounted ? (pct * 100) + '%' : '0%', borderRadius: 6,
              background: 'linear-gradient(90deg, ' + T.accent + ', oklch(0.74 0.13 60))',
              transition: 'width 1s cubic-bezier(.3,.8,.3,1)' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12.5, color: T.ink2, fontWeight: 500 }}>
            <span>已支出 <b style={{ color: T.ink }}>{money(spent, 0)}</b></span>
            <span>预算 {money(OVERVIEW.budget, 0)}</span>
          </div>
        </div>

        {/* two cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          {/* savings goal */}
          <div style={{ ...card, padding: '16px 16px 18px' }}>
            <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 600, marginBottom: 12 }}>攒钱目标</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
              <div style={{ width: 76, height: 76, borderRadius: 40, position: 'relative',
                background: `conic-gradient(${T.good} ${goalPct * 360}deg, ${T.cream2} 0)` }}>
                <div style={{ position: 'absolute', inset: 8, borderRadius: 34, background: T.card,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 19, fontWeight: 700, color: T.good }}>{Math.round(goalPct * 100)}%</span>
                </div>
              </div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{OVERVIEW.goal.name}</div>
            <div style={{ fontSize: 11.5, color: T.ink3, textAlign: 'center', marginTop: 2 }}>已存 {money(OVERVIEW.goal.saved, 0)} / {money(OVERVIEW.goal.target, 0)}</div>
          </div>
          {/* shared ledger */}
          <div style={{ ...card, padding: '16px 16px 18px' }}>
            <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 600, marginBottom: 12 }}>共同账本</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 12, justifyContent: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: T.accent, color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, zIndex: 2, border: '2px solid ' + T.card }}>我</div>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: CATS.fun.color, color: '#fff', marginLeft: -10,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, border: '2px solid ' + T.card }}>Ta</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{OVERVIEW.shared.name}</div>
            <div style={{ fontSize: 11.5, color: T.good, textAlign: 'center', marginTop: 2, fontWeight: 600 }}>Ta 该给你 {money(OVERVIEW.shared.owed, 0)}</div>
          </div>
        </div>

        {/* recent */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px 10px' }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>最近</span>
          <span style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>全部 ›</span>
        </div>
        <div style={{ ...card, padding: '4px 4px', overflow: 'hidden' }}>
          {txns.slice(0, 6).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '12px 14px',
              borderBottom: i < Math.min(6, txns.length) - 1 ? '1px solid ' + T.line : 'none' }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, flexShrink: 0, background: CATS[tx.cat].soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 11, height: 11, borderRadius: 6, background: CATS[tx.cat].color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{tx.time}</div>
              </div>
              <div style={{ fontSize: 15.5, fontWeight: 700, fontVariantNumeric: 'tabular-nums',
                color: tx.amt > 0 ? T.good : T.ink }}>{tx.amt > 0 ? '+' : '-'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBarA active={active} setActive={setActive} onAdd={() => setOpen(true)} accent={T.accent} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={save} accent={T.accent} />
    </div>
  );
}

window.HomeA = HomeA;
