// v_bignum_notebook.jsx — V5 Big-number minimal · V6 Notebook hand-drawn
const { useState: uSB } = React;

// ───────────────────────── V5 · Big number 极简大数字 ─────────────────────────
function HomeV5() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSB(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink, fontFamily: SANS }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 26px 110px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ paddingTop: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.5 }}>6 月</span>
          <span style={{ fontSize: 13, color: T.ink3, fontWeight: 600 }}>林一 ›</span>
        </div>

        <div style={{ paddingTop: 48, paddingBottom: 40 }}>
          <div style={{ fontSize: 14, color: T.ink2, fontWeight: 600, marginBottom: 6 }}>这个月还能花</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
            <span style={{ fontSize: 34, fontWeight: 300, color: T.ink3 }}>¥</span>
            <span style={{ fontSize: 84, fontWeight: 700, letterSpacing: -4, lineHeight: 0.85, fontVariantNumeric: 'tabular-nums' }}>{fmt(left, 0)}</span>
          </div>
          <div style={{ display: 'flex', gap: 5, marginTop: 28 }}>
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} style={{ flex: 1, height: 5, borderRadius: 3, background: i / 20 < pct ? T.accent : T.cream2,
                transform: m ? 'scaleY(1)' : 'scaleY(0.3)', transition: 'transform .4s ' + (i * 0.02) + 's, background .3s', transformOrigin: 'bottom' }} />
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13, color: T.ink2, fontWeight: 600 }}>
            <span>已花 {money(spent, 0)}</span>
            <span>共 {money(OVERVIEW.budget, 0)}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 0, borderTop: '1px solid ' + T.line, borderBottom: '1px solid ' + T.line }}>
          {[['攒钱进度', Math.round(OVERVIEW.goal.saved / OVERVIEW.goal.target * 100) + '%', T.good], ['Ta 欠你', money(OVERVIEW.shared.owed, 0), T.accent]].map(([k, v, c], i) => (
            <div key={i} style={{ flex: 1, padding: '18px 0', borderLeft: i ? '1px solid ' + T.line : 'none', paddingLeft: i ? 20 : 0 }}>
              <div style={{ fontSize: 12, color: T.ink3, fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 30, fontWeight: 700, marginTop: 4, color: c, letterSpacing: -1 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ paddingTop: 18 }}>
          {txns.slice(0, 5).map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0' }}>
              <div style={{ width: 8, height: 8, borderRadius: 4, background: CATS[tx.cat].color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontSize: 15, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</span>
              <span style={{ fontSize: 16, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt), 0)}</span>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={T.accent} onAdd={() => setOpen(true)} fabRadius={27} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={T.accent} />
    </div>
  );
}

// ───────────────────────── V6 · Notebook 手账本 ─────────────────────────
function HomeV6() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSB(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const ink = '#43403a', red = 'oklch(0.6 0.18 25)', blue = 'oklch(0.55 0.13 245)';
  const lines = `repeating-linear-gradient(transparent 0 31px, rgba(80,120,160,0.16) 31px 32px)`;
  const tape = { position: 'absolute', height: 26, background: 'oklch(0.85 0.09 75 / 0.55)', transform: 'rotate(-3deg)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' };
  return (
    <div style={{ height: '100%', background: '#f3ead7', position: 'relative', overflow: 'hidden', color: ink }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 110px' }}>
        <div style={{ minHeight: '100%', background: '#fcf8ef', backgroundImage: lines, backgroundPositionY: '60px', margin: '44px 14px', borderRadius: 4, position: 'relative', boxShadow: '0 10px 30px -14px rgba(80,60,30,0.4)', paddingBottom: 30 }}>
          <div style={{ position: 'absolute', left: 34, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.4)' }} />
          <div style={{ ...tape, width: 92, top: -12, left: 60 }} />

          <div style={{ padding: '26px 22px 0 46px' }}>
            <div style={{ fontFamily: HAND, fontSize: 34, fontWeight: 700, color: ink, lineHeight: 1 }}>六月 · 记账本</div>
            <div style={{ fontFamily: HAND, fontSize: 20, color: blue, marginTop: 6 }}>今天也有好好记录 ✓</div>

            <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: HAND, fontSize: 22, color: ink }}>还能花</span>
              <span style={{ fontFamily: HAND, fontSize: 52, fontWeight: 700, color: red, lineHeight: 0.8 }}>¥{fmt(left, 0)}</span>
            </div>
            <div style={{ marginTop: 16, height: 16, border: '2px solid ' + ink, borderRadius: 9, position: 'relative', overflow: 'hidden', maxWidth: 240, transform: 'rotate(-0.6deg)' }}>
              <div style={{ position: 'absolute', inset: 0, width: m ? (Math.min(1, spent / OVERVIEW.budget) * 100) + '%' : 0, background: 'repeating-linear-gradient(45deg, oklch(0.7 0.16 25 / 0.5) 0 6px, oklch(0.7 0.16 25 / 0.3) 6px 12px)', transition: 'width 1s ease' }} />
            </div>
            <div style={{ fontFamily: HAND, fontSize: 17, color: ink, marginTop: 6 }}>已花 {money(spent, 0)} / {money(OVERVIEW.budget, 0)} 预算</div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <div style={{ flex: 1, background: 'oklch(0.92 0.08 130)', padding: '12px 14px', transform: 'rotate(-2deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)' }}>
                <div style={{ fontFamily: HAND, fontSize: 17, color: ink }}>🏝️ 冲绳基金</div>
                <div style={{ fontFamily: HAND, fontSize: 26, fontWeight: 700, color: 'oklch(0.45 0.12 150)', marginTop: 2 }}>{Math.round(OVERVIEW.goal.saved / OVERVIEW.goal.target * 100)}%</div>
                <div style={{ fontFamily: HAND, fontSize: 14, color: ink }}>存了 {money(OVERVIEW.goal.saved, 0)}</div>
              </div>
              <div style={{ flex: 1, background: 'oklch(0.92 0.07 350)', padding: '12px 14px', transform: 'rotate(1.5deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)' }}>
                <div style={{ fontFamily: HAND, fontSize: 17, color: ink }}>💑 我们的家</div>
                <div style={{ fontFamily: HAND, fontSize: 26, fontWeight: 700, color: red, marginTop: 2 }}>+{money(OVERVIEW.shared.owed, 0)}</div>
                <div style={{ fontFamily: HAND, fontSize: 14, color: ink }}>Ta 该给你～</div>
              </div>
            </div>

            <div style={{ fontFamily: HAND, fontSize: 20, color: blue, marginTop: 24, marginBottom: 2 }}>最近花了这些 ↓</div>
            {txns.slice(0, 5).map((tx) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, height: 32, fontFamily: HAND }}>
                <span style={{ fontSize: 19, color: CATS[tx.cat].color }}>•</span>
                <span style={{ flex: 1, fontSize: 19, color: ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: tx.amt > 0 ? 'oklch(0.45 0.12 150)' : red }}>{tx.amt > 0 ? '+' : '-'}{fmt(Math.abs(tx.amt), 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dock accent={red} onAdd={() => setOpen(true)} fabRadius={27} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={red} rounded />
    </div>
  );
}

window.HomeV5 = HomeV5; window.HomeV6 = HomeV6;
