// br1.jsx — Neo-brutalist 新粗野: shell, 首页, 记一笔, 明细
const BIG  = "'Oswald', 'PingFang SC', sans-serif";   // condensed display
const BODY = "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', sans-serif";
const INK  = '#17140f';
const LIME = 'oklch(0.86 0.19 116)', ORANGE = 'oklch(0.72 0.18 48)', SKY = 'oklch(0.83 0.12 230)',
      PINK = 'oklch(0.8 0.12 350)', YEL = 'oklch(0.88 0.16 92)', PAPER = '#f4eddc';
const HARD = '3.5px 3.5px 0 ' + INK, HARD2 = '2.5px 2.5px 0 ' + INK;
const box = (bg, sh = HARD) => ({ background: bg, border: '2.5px solid ' + INK, boxShadow: sh, borderRadius: 0 });

function BrTab({ active = 'home' }) {
  const tabs = [['home', '首页'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, background: PAPER, borderTop: '2.5px solid ' + INK,
      paddingBottom: 24, paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <div key="add" style={{ ...box(ORANGE, HARD2), width: 50, height: 50, marginTop: -2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={PATHS.plus} size={26} sw={2.8} stroke={INK} />
        </div>
      ) : (
        <div key={t[0]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: INK }}>
          <Icon d={PATHS[t[0]]} size={21} sw={active === t[0] ? 2.6 : 2} stroke={INK} style={{ opacity: active === t[0] ? 1 : 0.4 }} />
          <span style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: active === t[0] ? 800 : 600, opacity: active === t[0] ? 1 : 0.5, textTransform: 'uppercase', letterSpacing: 0.3 }}>{t[1]}</span>
        </div>
      ))}
    </div>
  );
}

function BrShell({ children, tab = 'home', bg = PAPER }) {
  return (
    <div style={{ height: '100%', background: bg, position: 'relative', overflow: 'hidden', color: INK, fontFamily: BODY }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 16px 100px', paddingTop: 54 }}>{children}</div>
      {tab && <BrTab active={tab} />}
    </div>
  );
}

function BrHead({ title, right, accent }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ ...box(accent || LIME, HARD2), width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontSize: 24, lineHeight: 1 }}>‹</div>
        <span style={{ fontFamily: BIG, fontSize: 26, fontWeight: 700, textTransform: 'uppercase', letterSpacing: -0.3 }}>{title}</span>
      </div>
      {right && <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 800, textTransform: 'uppercase', textDecoration: 'underline', textUnderlineOffset: 3 }}>{right}</span>}
    </div>
  );
}
function SecLabel({ children, s }) {
  return <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 10px', ...s }}>{children}</div>;
}

// ───────────────── 1 · 首页 ─────────────────
function BrHome() {
  const spent = OVERVIEW.spent, left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  return (
    <BrShell tab="home">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 }}>
        <div style={{ fontFamily: BIG, fontSize: 30, fontWeight: 700, letterSpacing: -1, textTransform: 'uppercase' }}>POUCHIE</div>
        <div style={{ ...box(LIME, HARD2), width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontWeight: 700 }}>林</div>
      </div>

      {/* hero */}
      <div style={{ ...box(ORANGE), padding: '18px 18px 16px', marginBottom: 14 }}>
        <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 0.5 }}>本月还能花 →</div>
        <div style={{ fontFamily: BIG, fontSize: 60, fontWeight: 700, letterSpacing: -1, marginTop: 2, lineHeight: 0.95 }}>¥{fmt(left, 0)}</div>
        <div style={{ marginTop: 12, height: 16, border: '2.5px solid ' + INK, background: '#fff', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: (pct * 100) + '%', background: INK }} />
        </div>
        <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, marginTop: 8 }}>已花 {money(spent, 0)} / 预算 {money(OVERVIEW.budget, 0)}</div>
      </div>

      {/* two blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div style={{ ...box(LIME), padding: '14px 14px' }}>
          <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>攒钱 🏝️</div>
          <div style={{ fontFamily: BIG, fontSize: 36, fontWeight: 700, marginTop: 4, letterSpacing: -1, lineHeight: 1 }}>{Math.round(GOAL.saved / GOAL.target * 100)}%</div>
          <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, marginTop: 2 }}>{money(GOAL.saved, 0)} 已存</div>
        </div>
        <div style={{ ...box(SKY), padding: '14px 14px' }}>
          <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>共账 💑</div>
          <div style={{ fontFamily: BIG, fontSize: 36, fontWeight: 700, marginTop: 4, letterSpacing: -1, lineHeight: 1 }}>+{fmt(SHARED.owed, 0)}</div>
          <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 700, marginTop: 2 }}>Ta 该给你</div>
        </div>
      </div>

      <SecLabel>最近 ▾</SecLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LEDGER[0].items.concat(LEDGER[1].items).slice(0, 5).map((tx) => (
          <div key={tx.id} style={{ ...box('#fff', HARD2), padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 14, height: 14, background: CATS[tx.cat].color, border: '2px solid ' + INK, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, color: '#7a7468' }}>{tx.note} · {tx.time}</div>
            </div>
            <div style={{ fontFamily: BIG, fontSize: 20, fontWeight: 700, color: tx.amt > 0 ? 'oklch(0.55 0.16 150)' : INK }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
          </div>
        ))}
      </div>
    </BrShell>
  );
}

// ───────────────── 2 · 记一笔 ─────────────────
function BrAdd() {
  const cats = ['food', 'transit', 'shop', 'home', 'fun', 'other'];
  const sel = 'food';
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];
  return (
    <div style={{ height: '100%', background: PAPER, position: 'relative', overflow: 'hidden', color: INK, fontFamily: BODY, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '54px 16px 8px' }}>
        <BrHead title="记一笔" right="取消" accent={PINK} />
        {/* type toggle */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 16 }}>
          {['支出', '收入', '转账'].map((t, i) => (
            <div key={t} style={{ ...box(i === 0 ? INK : '#fff', i === 0 ? HARD2 : 'none'), marginLeft: i ? 10 : 0, padding: '8px 16px',
              fontFamily: BODY, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: i === 0 ? PAPER : INK, borderColor: INK }}>{t}</div>
          ))}
        </div>
        {/* amount block */}
        <div style={{ ...box(YEL), padding: '16px 18px', marginBottom: 18 }}>
          <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>金额 / AMOUNT</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            <span style={{ fontFamily: BIG, fontSize: 34, fontWeight: 700 }}>¥</span>
            <span style={{ fontFamily: BIG, fontSize: 64, fontWeight: 700, letterSpacing: -1, lineHeight: 0.9 }}>38.00</span>
            <span style={{ width: 3, height: 48, background: INK, marginLeft: 2 }} />
          </div>
        </div>
        {/* categories */}
        <SecLabel>分类 / CATEGORY</SecLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {cats.map((c) => (
            <div key={c} style={{ ...box(c === sel ? CATS[c].color : '#fff', c === sel ? HARD2 : 'none'), borderColor: INK,
              padding: '12px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 16, height: 16, background: c === sel ? '#fff' : CATS[c].color, border: '2px solid ' + INK }} />
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 800 }}>{CATS[c].name}</span>
            </div>
          ))}
        </div>
        <div style={{ ...box('#fff', 'none'), borderColor: INK, marginTop: 16, padding: '12px 14px', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700 }}>备注 · 拿铁 ×1</span>
          <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 800 }}>微信支付 ›</span>
        </div>
      </div>
      {/* keypad */}
      <div style={{ background: PAPER, borderTop: '2.5px solid ' + INK, padding: '10px 12px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
          {keys.map((k) => (
            <div key={k} style={{ ...box('#fff', HARD2), height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontSize: 24, fontWeight: 700 }}>{k}</div>
          ))}
        </div>
        <div style={{ ...box(LIME, HARD2), marginTop: 8, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>保存 SAVE</div>
      </div>
    </div>
  );
}

// ───────────────── 3 · 明细 ─────────────────
function BrLedger() {
  return (
    <BrShell tab="list">
      <BrHead title="明细" right="筛选" accent={SKY} />
      {/* summary blocks */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
        <div style={{ ...box(ORANGE, HARD2), flex: 1, padding: '10px 14px' }}>
          <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>支出</div>
          <div style={{ fontFamily: BIG, fontSize: 24, fontWeight: 700 }}>{money(3842.5, 0)}</div>
        </div>
        <div style={{ ...box(LIME, HARD2), flex: 1, padding: '10px 14px' }}>
          <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>收入</div>
          <div style={{ fontFamily: BIG, fontSize: 24, fontWeight: 700 }}>{money(18000, 0)}</div>
        </div>
      </div>
      {LEDGER.map((g) => (
        <div key={g.day} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', background: INK, color: PAPER, padding: '3px 8px' }}>{g.day}</span>
            <span style={{ fontFamily: BIG, fontSize: 16, fontWeight: 700 }}>{g.sum > 0 ? '+' : '−'}{fmt(Math.abs(g.sum), 0)}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {g.items.map((tx) => (
              <div key={tx.id} style={{ ...box('#fff', HARD2), padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 14, height: 14, background: CATS[tx.cat].color, border: '2px solid ' + INK, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 800 }}>{tx.merchant} {tx.split && <span style={{ fontSize: 9.5, fontWeight: 900, background: PINK, border: '1.5px solid ' + INK, padding: '0 5px', marginLeft: 4, textTransform: 'uppercase' }}>分摊</span>}</div>
                  <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, color: '#7a7468' }}>{tx.note} · {tx.time}</div>
                </div>
                <div style={{ fontFamily: BIG, fontSize: 19, fontWeight: 700, color: tx.amt > 0 ? 'oklch(0.55 0.16 150)' : INK }}>{tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </BrShell>
  );
}

Object.assign(window, { BIG, BODY, INK, LIME, ORANGE, SKY, PINK, YEL, PAPER, HARD, HARD2, box, BrTab, BrShell, BrHead, SecLabel, BrHome, BrAdd, BrLedger });
