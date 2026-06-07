// v_pastel_mag.jsx — V9 Aurora pastel · V10 Magazine cover
const { useState: uSP } = React;

// ───────────────────────── V9 · Aurora pastel 极光柔光 ─────────────────────────
function HomeV9() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSP(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = OVERVIEW.goal.saved / OVERVIEW.goal.target;
  const lilac = 'oklch(0.62 0.16 300)';
  const glass = { background: 'rgba(255,255,255,0.55)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '1px solid rgba(255,255,255,0.7)', boxShadow: '0 10px 30px -16px rgba(120,80,120,0.4)' };
  const ring = 66, rad = 28, circ = 2 * Math.PI * rad;
  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', color: '#2c2533', fontFamily: SANS,
      background: 'linear-gradient(160deg, #faf3ec 0%, #f3ecf5 50%, #ece9f6 100%)' }}>
      {/* aurora blobs */}
      <div style={{ position: 'absolute', width: 260, height: 260, borderRadius: 160, background: 'radial-gradient(circle, oklch(0.85 0.12 60 / 0.6), transparent 70%)', top: -60, left: -60, filter: 'blur(20px)' }} />
      <div style={{ position: 'absolute', width: 240, height: 240, borderRadius: 160, background: 'radial-gradient(circle, oklch(0.82 0.13 320 / 0.55), transparent 70%)', top: 120, right: -70, filter: 'blur(24px)' }} />
      <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: 160, background: 'radial-gradient(circle, oklch(0.85 0.12 230 / 0.5), transparent 70%)', bottom: 40, left: -50, filter: 'blur(24px)' }} />

      <div style={{ position: 'relative', height: '100%', overflowY: 'auto', padding: '0 18px 110px' }}>
        <div style={{ paddingTop: 58, paddingBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#6b5f72' }}>晚上好，林一 🌙</div>
          <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>六月财务概览</div>
        </div>

        {/* hero glass card */}
        <div style={{ ...glass, borderRadius: 28, padding: '22px 22px 20px', marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#6b5f72' }}>本月还能花</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 6 }}>
            <span style={{ fontSize: 24, color: lilac, fontWeight: 700 }}>¥</span>
            <span style={{ fontSize: 46, fontWeight: 800, letterSpacing: -1.5, fontVariantNumeric: 'tabular-nums' }}>{fmt(left, 0)}</span>
          </div>
          <div style={{ marginTop: 16, height: 9, background: 'rgba(255,255,255,0.7)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: m ? (pct * 100) + '%' : 0, borderRadius: 6, background: 'linear-gradient(90deg, oklch(0.78 0.14 60), oklch(0.68 0.16 330))', transition: 'width 1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9, fontSize: 12, color: '#6b5f72', fontWeight: 600 }}>
            <span>已花 {money(spent, 0)}</span><span>预算 {money(OVERVIEW.budget, 0)}</span>
          </div>
        </div>

        {/* two glass cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div style={{ ...glass, borderRadius: 24, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: ring, height: ring }}>
              <svg width={ring} height={ring} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="7" />
                <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke={lilac} strokeWidth="7" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={m ? circ * (1 - goalPct) : circ} style={{ transition: 'stroke-dashoffset 1.1s ease' }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, color: lilac }}>{Math.round(goalPct * 100)}%</div>
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 700, marginTop: 10 }}>🏝️ 冲绳基金</div>
          </div>
          <div style={{ ...glass, borderRadius: 24, padding: 16 }}>
            <div style={{ fontSize: 12.5, fontWeight: 700, color: '#6b5f72' }}>💑 共同账本</div>
            <div style={{ display: 'flex', marginTop: 10, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: lilac, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, border: '2px solid #fff', zIndex: 2 }}>我</div>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: 'oklch(0.72 0.15 50)', color: '#fff', marginLeft: -9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, border: '2px solid #fff' }}>Ta</div>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'oklch(0.6 0.13 160)' }}>+{money(OVERVIEW.shared.owed, 0)}</div>
            <div style={{ fontSize: 11, color: '#6b5f72', fontWeight: 600 }}>Ta 该给你</div>
          </div>
        </div>

        {/* recent glass list */}
        <div style={{ ...glass, borderRadius: 24, padding: '6px 6px' }}>
          {txns.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 12px', borderBottom: i < 4 ? '1px solid rgba(120,80,120,0.1)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 12, flexShrink: 0, background: CATS[tx.cat].soft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: CATS[tx.cat].color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <div style={{ fontSize: 11, color: '#9a8fa0' }}>{tx.time}</div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? 'oklch(0.6 0.13 160)' : '#2c2533' }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={lilac} onAdd={() => setOpen(true)} fabRadius={27} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={lilac} rounded />
    </div>
  );
}

// ───────────────────────── V10 · Magazine cover 杂志封面 ─────────────────────────
function HomeV10() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSP(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink }}>
      <div style={{ height: '100%', overflowY: 'auto', paddingBottom: 110 }}>
        {/* full-bleed cover image */}
        <div style={{ position: 'relative', height: 340 }}>
          <Placeholder label="封面照 · 冲绳的海" h={340} radius={0} style={{ border: 'none' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(30,22,12,0.45) 0%, transparent 30%, transparent 55%, rgba(30,22,12,0.6) 100%)' }} />
          {/* masthead over image */}
          <div style={{ position: 'absolute', top: 56, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', color: '#fff' }}>
            <div style={{ fontFamily: DISP, fontSize: 30, fontWeight: 600, letterSpacing: 1, textShadow: '0 2px 12px rgba(0,0,0,0.3)' }}>POUCHIE</div>
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, letterSpacing: 1, textAlign: 'right', textShadow: '0 1px 6px rgba(0,0,0,0.4)' }}>06 · 2026<br/>财务特辑</div>
          </div>
          {/* cover line */}
          <div style={{ position: 'absolute', bottom: 22, left: 22, right: 22, color: '#fff' }}>
            <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 700, letterSpacing: 2, opacity: 0.9, textTransform: 'uppercase' }}>本期封面 · 本月还能花</div>
            <div style={{ fontFamily: DISP, fontSize: 56, fontWeight: 600, letterSpacing: -1, lineHeight: 0.95, marginTop: 4, textShadow: '0 2px 16px rgba(0,0,0,0.35)', fontVariantNumeric: 'tabular-nums' }}>¥{fmt(left, 0)}</div>
          </div>
        </div>

        {/* content */}
        <div style={{ padding: '20px 22px 0' }}>
          {/* budget line */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid ' + T.line }}>
            <div style={{ flex: 1, height: 6, background: T.cream2, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: m ? (Math.min(1, spent / OVERVIEW.budget) * 100) + '%' : 0, background: T.accent, transition: 'width 1s ease', borderRadius: 4 }} />
            </div>
            <span style={{ fontFamily: SANS, fontSize: 12.5, color: T.ink2, fontWeight: 600, whiteSpace: 'nowrap' }}>{money(spent, 0)} / {money(OVERVIEW.budget, 0)}</span>
          </div>

          {/* feature articles — goal + shared as headlines w/ thumbs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[['专题', '冲绳旅行基金', '已完成 ' + Math.round(OVERVIEW.goal.saved / OVERVIEW.goal.target * 100) + '%，再存 ' + money(OVERVIEW.goal.target - OVERVIEW.goal.saved, 0) + '就出发', '存钱罐'],
              ['共同', '我们的家 · 本月分摊', 'Ta 该转给你 ' + money(OVERVIEW.shared.owed, 0) + '，本月共付 ' + money(OVERVIEW.shared.month, 0), '合照']].map(([tag, title, body, ph], i) => (
              <div key={i} style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: '1px solid ' + T.line }}>
                <Placeholder label={ph} h={72} radius={4} style={{ width: 72, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: T.accent, textTransform: 'uppercase' }}>{tag}</div>
                  <div style={{ fontFamily: DISP, fontSize: 18, fontWeight: 600, marginTop: 3, letterSpacing: -0.3 }}>{title}</div>
                  <div style={{ fontFamily: SANS, fontSize: 12.5, color: T.ink2, marginTop: 4, lineHeight: 1.45 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* index — recent */}
          <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: T.ink3, textTransform: 'uppercase', margin: '18px 0 6px' }}>本月目录 · 近期流水</div>
          {txns.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '10px 0', borderBottom: i < 4 ? '1px solid ' + T.line : 'none' }}>
              <span style={{ fontFamily: DISP, fontSize: 15, color: T.ink3, width: 22 }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: CATS[tx.cat].color, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: SANS, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</span>
              <span style={{ fontFamily: DISP, fontSize: 16, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</span>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={T.accent} onAdd={() => setOpen(true)} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={T.accent} />
    </div>
  );
}

window.HomeV9 = HomeV9; window.HomeV10 = HomeV10;
