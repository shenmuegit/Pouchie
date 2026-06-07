// v_editorial.jsx — V1 Broadsheet · V2 Swiss grid (editorial family, riffs on C)
const { useState: uSE } = React;

// ───────────────────────── V1 · Broadsheet 报纸 ─────────────────────────
function HomeV1() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSE(false);
  const m = useMount();
  const left = OVERVIEW.budget - spent;
  const rule = '1px solid ' + T.line;
  const Lab = ({ children, s }) => <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ink3, ...s }}>{children}</div>;
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 22px 110px' }}>
        <div style={{ paddingTop: 56, textAlign: 'center', borderBottom: '2px solid ' + T.ink, paddingBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            <div style={{ flex: 1, height: 1, background: T.ink, opacity: 0.3 }} />
            <div style={{ fontFamily: SERIF, fontSize: 26, fontWeight: 500, letterSpacing: 3 }}>POUCHIE</div>
            <div style={{ flex: 1, height: 1, background: T.ink, opacity: 0.3 }} />
          </div>
          <div style={{ fontFamily: SANS, fontSize: 10, letterSpacing: 1, color: T.ink2, marginTop: 4 }}>个人财务日报 · 2026 年 6 月 · 晚间版</div>
        </div>
        <div style={{ borderTop: '1px solid ' + T.ink, marginTop: 2, height: 2 }} />

        <div style={{ padding: '16px 0 14px', borderBottom: rule }}>
          <Lab>头条 · 本月支出</Lab>
          <div style={{ fontFamily: SERIF, display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
            <span style={{ fontSize: 26, color: T.ink2 }}>¥</span>
            <span style={{ fontSize: 58, fontWeight: 500, letterSpacing: -1.5, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{fmt(spent, 2).split('.')[0]}</span>
            <span style={{ fontSize: 24, color: T.ink2 }}>.{fmt(spent, 2).split('.')[1]}</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', borderBottom: rule }}>
          <div style={{ padding: '14px 14px 16px 0', borderRight: rule }}>
            <p style={{ margin: 0, fontFamily: SERIF, fontSize: 14.5, lineHeight: 1.5 }}>
              <span style={{ float: 'left', fontSize: 40, lineHeight: 0.82, fontWeight: 500, padding: '2px 6px 0 0' }}>本</span>
              月共记 28 笔。餐饮与购物合计占去六成，预算尚余 <b>{money(left, 0)}</b>，按当前节奏可平稳支撑至月末。
            </p>
          </div>
          <div style={{ padding: '14px 0 16px 14px', display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[['月度收入', money(OVERVIEW.income, 0)], ['净结余', '+' + money(OVERVIEW.income - spent, 0).slice(1), T.good], ['日均', money(spent / 6, 0)]].map(([k, v, c], i) => (
              <div key={i} style={{ borderBottom: i < 2 ? rule : 'none', paddingBottom: i < 2 ? 11 : 0 }}>
                <Lab s={{ fontSize: 9 }}>{k}</Lab>
                <div style={{ fontFamily: SERIF, fontSize: 20, marginTop: 2, color: c || T.ink }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '12px 0', borderBottom: rule, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Lab>预算执行</Lab>
          <div style={{ flex: 1, height: 8, background: T.cream2, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: m ? (Math.min(1, spent / OVERVIEW.budget) * 100) + '%' : 0, background: T.accent, transition: 'width 1s ease' }} />
          </div>
          <span style={{ fontFamily: SERIF, fontSize: 14, color: T.ink2 }}>{Math.round(spent / OVERVIEW.budget * 100)}%</span>
        </div>

        <div style={{ paddingTop: 12 }}>
          <Lab s={{ marginBottom: 4 }}>近期流水</Lab>
          {txns.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 0', borderBottom: i < 4 ? rule : 'none' }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: CATS[tx.cat].color, flexShrink: 0 }} />
              <div style={{ flex: 1, fontFamily: SANS, fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
              <span style={{ fontFamily: SANS, fontSize: 11, color: T.ink3, marginRight: 4 }}>{tx.time}</span>
              <span style={{ fontFamily: SERIF, fontSize: 17, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</span>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={T.accent} onAdd={() => setOpen(true)} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={T.accent} />
    </div>
  );
}

// ───────────────────────── V2 · Swiss grid 瑞士网格 ─────────────────────────
function HomeV2() {
  const { txns, spent, save } = useLedger();
  const [open, setOpen] = uSE(false);
  const m = useMount();
  const red = 'oklch(0.55 0.2 27)';
  const cats = [['food', 0.34], ['shop', 0.22], ['home', 0.18], ['fun', 0.14], ['transit', 0.12]];
  const KL = { fontSize: 10, fontWeight: 700, letterSpacing: 1, color: '#888', textTransform: 'uppercase' };
  return (
    <div style={{ height: '100%', background: '#f7f5f0', position: 'relative', overflow: 'hidden', color: '#1a1814', fontFamily: SWISS }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 24px 110px' }}>
        <div style={{ paddingTop: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1.5px solid #1a1814', paddingBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.5 }}>POUCHIE</span>
          <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: 1, color: '#888' }}>06 / 2026 — 总览</span>
        </div>

        <div style={{ padding: '26px 0 22px', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
          <div style={{ ...KL, letterSpacing: 1.5 }}>本月支出 / TOTAL</div>
          <div style={{ fontSize: 58, fontWeight: 700, letterSpacing: -2.5, lineHeight: 1, marginTop: 8, fontVariantNumeric: 'tabular-nums' }}>{money(spent, 0)}</div>
          <div style={{ display: 'flex', gap: 26, marginTop: 16 }}>
            <div><div style={KL}>收入</div><div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{money(OVERVIEW.income, 0)}</div></div>
            <div><div style={KL}>结余</div><div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{money(OVERVIEW.income - spent, 0)}</div></div>
            <div><div style={KL}>预算余</div><div style={{ fontSize: 16, fontWeight: 700, marginTop: 3, color: red }}>{money(OVERVIEW.budget - spent, 0)}</div></div>
          </div>
        </div>

        <div style={{ padding: '20px 0 8px' }}>
          <div style={{ ...KL, letterSpacing: 1.5, marginBottom: 14 }}>支出构成</div>
          {cats.map(([c, pct], i) => (
            <div key={c} style={{ display: 'grid', gridTemplateColumns: '52px 1fr 44px', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{CATS[c].name}</span>
              <div style={{ height: 2, background: 'rgba(0,0,0,0.1)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: -2, bottom: -2, width: m ? (pct * 100) + '%' : 0, background: i === 0 ? red : '#1a1814', transition: 'width .9s cubic-bezier(.3,.8,.3,1) ' + (i * 0.06) + 's' }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{Math.round(pct * 100)}%</span>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.12)', paddingTop: 14 }}>
          <div style={{ ...KL, letterSpacing: 1.5, marginBottom: 6 }}>明细</div>
          {txns.slice(0, 5).map((tx, i) => (
            <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, padding: '10px 0', borderBottom: i < 4 ? '1px solid rgba(0,0,0,0.08)' : 'none', alignItems: 'baseline' }}>
              <div><span style={{ fontSize: 14, fontWeight: 700 }}>{tx.merchant}</span><span style={{ fontSize: 11, color: '#999', marginLeft: 8 }}>{tx.time}</span></div>
              <span style={{ fontSize: 15, fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? red : '#1a1814' }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</span>
            </div>
          ))}
        </div>
      </div>
      <Dock accent={red} onAdd={() => setOpen(true)} fabRadius={4} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={(d) => { save(d); setOpen(false); }} accent={red} />
    </div>
  );
}

window.HomeV1 = HomeV1; window.HomeV2 = HomeV2;
