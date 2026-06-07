// v_receipt_dark.jsx — V3 Receipt/Thermal · V4 Dark private-bank
const { useState: uSR } = React;

// ───────────────────────── V3 · Receipt 收据 ─────────────────────────
function HomeV3() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSR(false);
  const paper = '#fbf7ec', pink = 'oklch(0.62 0.17 30)', faint = '#c3bba6';
  const Line = ({ l, r, b, c }) => (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, fontFamily: MONO, fontSize: 12.5, color: c || '#3a352c', fontWeight: b ? 700 : 400, margin: '8px 0' }}>
      <span style={{ whiteSpace: 'nowrap' }}>{l}</span>
      <span style={{ flex: 1, borderBottom: '1px dotted ' + faint, transform: 'translateY(-4px)' }} />
      <span style={{ whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{r}</span>
    </div>
  );
  const Dash = () => <div style={{ borderTop: '1.5px dashed ' + faint, margin: '12px 0' }} />;
  const zig = `linear-gradient(135deg, ${paper} 25%, transparent 25%) -8px 0/16px 16px, linear-gradient(225deg, ${paper} 25%, transparent 25%) -8px 0/16px 16px`;
  return (
    <div style={{ height: '100%', background: '#ece6d6', position: 'relative', overflow: 'hidden', color: '#3a352c' }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '52px 20px 110px' }}>
        <div style={{ background: paper, boxShadow: '0 12px 30px -12px rgba(60,40,20,0.4)', padding: '26px 22px 8px', position: 'relative' }}>
          {/* header */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: MONO, fontSize: 19, fontWeight: 700, letterSpacing: 4 }}>POUCHIE</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a8270', marginTop: 4 }}>* * 月度消费小票 * *</div>
            <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a8270', marginTop: 2 }}>2026-06 · NO.000628</div>
          </div>
          <Dash />
          <Line l="餐饮 FOOD" r={fmt(1306, 2)} />
          <Line l="购物 SHOP" r={fmt(845, 2)} />
          <Line l="居家 HOME" r={fmt(692, 2)} />
          <Line l="娱乐 FUN" r={fmt(534, 2)} />
          <Line l="交通 TRANSIT" r={fmt(465.5, 2)} />
          <Dash />
          <Line l="小计 SUBTOTAL" r={fmt(spent, 2)} b />
          <Line l="预算 BUDGET" r={fmt(OVERVIEW.budget, 2)} />
          <Line l="结余 BALANCE" r={fmt(OVERVIEW.budget - spent, 2)} b c={pink} />
          <Dash />
          {/* total emphasised */}
          <div style={{ textAlign: 'center', padding: '4px 0 10px' }}>
            <div style={{ fontFamily: MONO, fontSize: 12, color: '#8a8270', letterSpacing: 2 }}>TOTAL DUE</div>
            <div style={{ fontFamily: MONO, fontSize: 40, fontWeight: 700, letterSpacing: -1, marginTop: 4 }}>¥{fmt(spent, 2)}</div>
          </div>
          <Dash />
          {/* recent as line items */}
          <div style={{ fontFamily: MONO, fontSize: 11, color: '#8a8270', letterSpacing: 1, marginBottom: 4 }}>—— 最近交易 ——</div>
          {txns.slice(0, 4).map((tx) => (
            <Line key={tx.id} l={(tx.merchant.length > 11 ? tx.merchant.slice(0, 11) + '…' : tx.merchant)} r={(tx.amt > 0 ? '+' : '-') + fmt(Math.abs(tx.amt))} c={tx.amt > 0 ? T.good : '#3a352c'} />
          ))}
          <Dash />
          {/* barcode */}
          <div style={{ display: 'flex', gap: 1.5, justifyContent: 'center', height: 42, alignItems: 'stretch', padding: '0 6px' }}>
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} style={{ width: (i % 3 === 0 ? 3 : i % 2 ? 1 : 2), background: '#3a352c' }} />
            ))}
          </div>
          <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 10, color: '#8a8270', letterSpacing: 3, margin: '8px 0 4px' }}>谢谢惠顾 · KEEP SAVING</div>
          {/* torn bottom edge */}
          <div style={{ height: 16, background: zig, margin: '0 -22px -8px' }} />
        </div>
      </div>
      <Dock accent={pink} onAdd={() => setOpen(true)} fabRadius={27} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={pink} rounded />
    </div>
  );
}

// ───────────────────────── V4 · Dark private-bank 暗夜私行 ─────────────────────────
function HomeV4() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSR(false);
  const m = useMount();
  const bg = '#16140f', surf = 'rgba(255,255,255,0.04)', gold = 'oklch(0.78 0.11 78)';
  const txt = '#ece6da', dim = 'rgba(236,230,218,0.5)';
  const left = OVERVIEW.budget - spent;
  return (
    <div style={{ height: '100%', background: bg, position: 'relative', overflow: 'hidden', color: txt, fontFamily: SANS }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 22px 110px' }}>
        <div style={{ paddingTop: 58, display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 22 }}>
          <div>
            <div style={{ fontSize: 12, letterSpacing: 2, color: dim, fontWeight: 600 }}>晚上好</div>
            <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 2 }}>林一</div>
          </div>
          <div style={{ width: 40, height: 40, borderRadius: 20, border: '1px solid ' + gold, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SERIF, color: gold }}>林</div>
        </div>

        {/* card */}
        <div style={{ borderRadius: 20, padding: '22px 22px 20px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(145deg, #221f18, #19160f)', border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 18px 40px -16px #000' }}>
          <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: 120, background: 'radial-gradient(circle, oklch(0.78 0.11 78 / 0.12), transparent 70%)', top: -90, right: -60 }} />
          <div style={{ fontSize: 11.5, letterSpacing: 2, color: dim, fontWeight: 600 }}>本月可支配余额</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 8 }}>
            <span style={{ fontSize: 22, color: gold }}>¥</span>
            <span style={{ fontFamily: SERIF, fontSize: 46, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{fmt(left, 2)}</span>
          </div>
          {/* thin progress */}
          <div style={{ marginTop: 18, height: 3, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: m ? (Math.min(1, spent / OVERVIEW.budget) * 100) + '%' : 0, background: gold, transition: 'width 1.1s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 12, color: dim }}>
            <span>已支出 {money(spent, 0)}</span><span>预算 {money(OVERVIEW.budget, 0)}</span>
          </div>
        </div>

        {/* asset rows */}
        <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
          {[['攒钱目标', OVERVIEW.goal.name, Math.round(OVERVIEW.goal.saved / OVERVIEW.goal.target * 100) + '%', gold], ['共同账本', OVERVIEW.shared.name, 'Ta +' + money(OVERVIEW.shared.owed, 0), T.good]].map(([k, n, v, c], i) => (
            <div key={i} style={{ flex: 1, background: surf, border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '15px 16px' }}>
              <div style={{ fontSize: 11, letterSpacing: 1, color: dim, fontWeight: 600 }}>{k}</div>
              <div style={{ fontSize: 14, marginTop: 6, fontWeight: 600 }}>{n}</div>
              <div style={{ fontFamily: SERIF, fontSize: 20, marginTop: 6, color: c }}>{v}</div>
            </div>
          ))}
        </div>

        {/* recent */}
        <div style={{ marginTop: 22, fontSize: 12, letterSpacing: 1.5, color: dim, fontWeight: 600, textTransform: 'uppercase' }}>近期活动</div>
        <div style={{ marginTop: 8 }}>
          {txns.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 17, flexShrink: 0, border: '1px solid ' + CATS[tx.cat].color + '66', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: CATS[tx.cat].color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <div style={{ fontSize: 11, color: dim, marginTop: 1 }}>{tx.time}</div>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 17, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : txt }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={gold} dark onAdd={() => setOpen(true)} fabRadius={16} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={gold} />
    </div>
  );
}

window.HomeV3 = HomeV3; window.HomeV4 = HomeV4;
