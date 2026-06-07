// v_bento_brutal.jsx — V7 Bento grid · V8 Neo-brutalist
const { useState: uSG } = React;

// ───────────────────────── V7 · Bento 便当格 ─────────────────────────
function HomeV7() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSG(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = OVERVIEW.goal.saved / OVERVIEW.goal.target;
  const cell = { background: T.card, borderRadius: 22, padding: 16, boxShadow: '0 1px 2px rgba(43,38,32,0.04), 0 10px 24px -18px rgba(43,38,32,0.5)' };
  const ring = 64, rad = 27, circ = 2 * Math.PI * rad;
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink, fontFamily: SANS }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px 110px' }}>
        <div style={{ paddingTop: 58, paddingBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>6 月总览</div>
          <div style={{ width: 38, height: 38, borderRadius: 19, background: T.accentSoft, color: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>林</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {/* big balance — spans 2 cols */}
          <div style={{ ...cell, gridColumn: 'span 2', padding: '20px 20px', background: 'linear-gradient(140deg, oklch(0.75 0.14 58), oklch(0.69 0.15 42))', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', width: 140, height: 140, borderRadius: 80, background: 'rgba(255,255,255,0.12)', top: -50, right: -30 }} />
            <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>本月还能花</div>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1.5, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>¥{fmt(left, 0)}</div>
            <div style={{ marginTop: 14, height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: m ? (pct * 100) + '%' : 0, background: '#fff', transition: 'width 1s ease', borderRadius: 4 }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.85, marginTop: 8 }}>已花 {money(spent, 0)} · 预算 {money(OVERVIEW.budget, 0)}</div>
          </div>

          {/* savings ring */}
          <div style={{ ...cell, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{ position: 'relative', width: ring, height: ring }}>
              <svg width={ring} height={ring} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke={T.cream2} strokeWidth="7" />
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke={T.good} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={m ? circ * (1 - goalPct) : circ} style={{ transition: 'stroke-dashoffset 1.1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: T.good }}>{Math.round(goalPct * 100)}%</div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>🏝️ 冲绳基金</div>
          </div>

          {/* shared */}
          <div style={cell}>
            <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 700 }}>💑 共同账本</div>
            <div style={{ display: 'flex', marginTop: 10, marginBottom: 8 }}>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: T.accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, border: '2px solid ' + T.card, zIndex: 2 }}>我</div>
              <div style={{ width: 30, height: 30, borderRadius: 15, background: CATS.fun.color, color: '#fff', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, border: '2px solid ' + T.card }}>Ta</div>
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, color: T.good }}>+{money(OVERVIEW.shared.owed, 0)}</div>
            <div style={{ fontSize: 11, color: T.ink3, fontWeight: 600 }}>Ta 该给你</div>
          </div>

          {/* mini category chips — span 2 */}
          <div style={{ ...cell, gridColumn: 'span 2' }}>
            <div style={{ fontSize: 12.5, color: T.ink2, fontWeight: 700, marginBottom: 12 }}>支出 TOP 类别</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[['food', 34], ['shop', 22], ['home', 18], ['fun', 14]].map(([c, p]) => (
                <div key={c} style={{ flex: 1 }}>
                  <div style={{ height: 60, borderRadius: 10, background: CATS[c].soft, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
                    <div style={{ width: '100%', height: m ? p * 1.6 + '%' : 0, background: CATS[c].color, transition: 'height .9s ease', opacity: 0.85 }} />
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, textAlign: 'center', marginTop: 6 }}>{CATS[c].name}</div>
                  <div style={{ fontSize: 10.5, color: T.ink3, textAlign: 'center' }}>{p}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* recent — span 2 */}
          <div style={{ ...cell, gridColumn: 'span 2', padding: '6px 6px' }}>
            {txns.slice(0, 4).map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderBottom: i < 3 ? '1px solid ' + T.line : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, flexShrink: 0, background: CATS[tx.cat].soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 10, height: 10, borderRadius: 5, background: CATS[tx.cat].color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                  <div style={{ fontSize: 11, color: T.ink3 }}>{tx.time}</div>
                </div>
                <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Dock accent={T.accent} onAdd={() => setOpen(true)} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={T.accent} />
    </div>
  );
}

// ───────────────────────── V8 · Neo-brutalist 新粗野 ─────────────────────────
function HomeV8() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSG(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const ink = '#1a1714', lime = 'oklch(0.85 0.18 110)', orange = 'oklch(0.72 0.18 48)', sky = 'oklch(0.82 0.12 230)';
  const hard = '3px 3px 0 ' + ink;
  const box = (bg) => ({ background: bg, border: '2.5px solid ' + ink, boxShadow: hard, borderRadius: 0 });
  return (
    <div style={{ height: '100%', background: '#f5efdf', position: 'relative', overflow: 'hidden', color: ink, fontFamily: SWISS }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 18px 110px' }}>
        <div style={{ paddingTop: 58, paddingBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: -1, textTransform: 'uppercase' }}>POUCHIE</div>
          <div style={{ ...box(lime), width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>林</div>
        </div>

        {/* hero block */}
        <div style={{ ...box(orange), padding: '18px 18px 16px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>本月还能花 →</div>
          <div style={{ fontSize: 52, fontWeight: 900, letterSpacing: -2.5, marginTop: 2, lineHeight: 0.95, fontVariantNumeric: 'tabular-nums' }}>¥{fmt(left, 0)}</div>
          <div style={{ marginTop: 12, height: 16, border: '2.5px solid ' + ink, background: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, width: m ? (Math.min(1, spent / OVERVIEW.budget) * 100) + '%' : 0, background: ink, transition: 'width 1s steps(12)' }} />
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 8 }}>已花 {money(spent, 0)} / 预算 {money(OVERVIEW.budget, 0)}</div>
        </div>

        {/* two blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
          <div style={{ ...box(lime), padding: '14px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>攒钱 🏝️</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6, letterSpacing: -1 }}>{Math.round(OVERVIEW.goal.saved / OVERVIEW.goal.target * 100)}%</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{money(OVERVIEW.goal.saved, 0)} 已存</div>
          </div>
          <div style={{ ...box(sky), padding: '14px 14px' }}>
            <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>共账 💑</div>
            <div style={{ fontSize: 34, fontWeight: 900, marginTop: 6, letterSpacing: -1 }}>+{fmt(OVERVIEW.shared.owed, 0)}</div>
            <div style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>Ta 该给你</div>
          </div>
        </div>

        {/* recent list — each a hard box */}
        <div style={{ fontSize: 13, fontWeight: 900, textTransform: 'uppercase', marginBottom: 10, letterSpacing: 0.5 }}>最近 ▾</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {txns.slice(0, 5).map((tx) => (
            <div key={tx.id} style={{ ...box('#fff'), padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 14, height: 14, background: CATS[tx.cat].color, border: '2px solid ' + ink, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#7a7468' }}>{tx.time}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 900, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? 'oklch(0.55 0.16 150)' : ink }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={orange} onAdd={() => setOpen(true)} fabRadius={0} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={orange} />
    </div>
  );
}

window.HomeV7 = HomeV7; window.HomeV8 = HomeV8;
