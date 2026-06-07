// nb1.jsx — Notebook 手账本: shell, 首页, 记一笔, 明细
// Chinese handwriting via Ma Shan Zheng / Zhi Mang Xing; numerals via Caveat
const CN  = "'Ma Shan Zheng', 'PingFang SC', cursive";       // headings / accents
const CN2 = "'Zhi Mang Xing', 'PingFang SC', cursive";       // body handwriting
const HN  = "'Caveat', cursive";                              // numerals
const PF  = "'PingFang SC', sans-serif";                      // tiny captions
const NINK = '#43403a', RED = 'oklch(0.58 0.19 25)', BLUE = 'oklch(0.52 0.14 245)', GRN = 'oklch(0.5 0.13 150)';
const LINES = 'repeating-linear-gradient(transparent 0 31px, rgba(90,130,165,0.14) 31px 32px)';

function Tape({ w = 92, style }) {
  return <div style={{ position: 'absolute', width: w, height: 24, background: 'oklch(0.86 0.09 75 / 0.5)', borderLeft: '1px dashed rgba(255,255,255,0.5)', borderRight: '1px dashed rgba(255,255,255,0.5)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', ...style }} />;
}

// hand-drawn rounded box (slightly wobbly via border-radius variation)
function Doodle({ children, color = NINK, fill = 'transparent', rot = 0, style, pad = '12px 14px' }) {
  return (
    <div style={{ border: '2px solid ' + color, borderRadius: '14px 12px 16px 11px / 11px 16px 12px 14px', background: fill, padding: pad, transform: `rotate(${rot}deg)`, ...style }}>{children}</div>
  );
}

function NbPaper({ children, tab = 'home', sheetPad = '24px 22px 0 44px' }) {
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 96px' }}>
        <div style={{ minHeight: '100%', background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '64px', margin: '44px 12px', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)', paddingBottom: 28 }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          <div style={{ padding: sheetPad }}>{children}</div>
        </div>
      </div>
      {tab && <NbTab active={tab} />}
    </div>
  );
}

function NbTab({ active }) {
  const tabs = [['home', '首页'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  return (
    <div style={{ position: 'absolute', left: 12, right: 12, bottom: 22, height: 56, background: '#fcf8ef', borderRadius: 14, border: '2px solid ' + NINK, boxShadow: '3px 3px 0 rgba(67,64,58,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 6px' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <div key="add" style={{ width: 48, height: 48, borderRadius: 24, background: RED, color: '#fff', border: '2px solid ' + NINK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-10px) rotate(-4deg)', boxShadow: '2px 2px 0 rgba(67,64,58,0.3)' }}>
          <Icon d={PATHS.plus} size={26} sw={2.6} />
        </div>
      ) : (
        <div key={t[0]} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: CN, fontSize: 18, color: active === t[0] ? NINK : '#b3a98f' }}>
          {t[1]}
          {active === t[0] && <svg width="34" height="7" viewBox="0 0 34 7" style={{ position: 'absolute', bottom: -7 }}><path d="M1 4 Q9 1 17 4 T33 3" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" /></svg>}
        </div>
      ))}
    </div>
  );
}

// handwritten back header (for sub screens)
function NbHead({ title, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: HN, fontSize: 30, color: NINK, lineHeight: 1 }}>←</span>
        <span style={{ fontFamily: CN, fontSize: 28, color: NINK, lineHeight: 1.1, whiteSpace: 'nowrap' }}>{title}</span>
      </div>
      {right && <span style={{ fontFamily: CN2, fontSize: 20, color: BLUE, whiteSpace: 'nowrap' }}>{right}</span>}
    </div>
  );
}

// ───────────────── 1 · 首页 ─────────────────
function NbHome() {
  const spent = OVERVIEW.spent, left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = GOAL.saved / GOAL.target;
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 96px' }}>
        <div style={{ minHeight: '100%', background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '70px', margin: '44px 12px', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)', paddingBottom: 28 }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          <Tape w={100} style={{ top: -11, left: 54, transform: 'rotate(-3deg)' }} />
          <div style={{ padding: '26px 22px 0 44px' }}>
            <div style={{ fontFamily: CN, fontSize: 38, lineHeight: 1 }}>六月 · 记账本</div>
            <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 8 }}>今天也有好好记录哦 ✓</div>

            <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: CN, fontSize: 22, whiteSpace: 'nowrap', flexShrink: 0 }}>还能花</span>
              <span style={{ fontFamily: HN, fontSize: 56, fontWeight: 700, color: RED, lineHeight: 0.7 }}>¥{fmt(left, 0)}</span>
            </div>
            <Doodle rot={-0.6} pad="0" style={{ marginTop: 14, height: 18, maxWidth: 250, overflow: 'hidden', borderWidth: 2 }}>
              <div style={{ height: '100%', width: (pct * 100) + '%', background: 'repeating-linear-gradient(45deg, oklch(0.7 0.16 25 / 0.5) 0 6px, oklch(0.7 0.16 25 / 0.25) 6px 12px)' }} />
            </Doodle>
            <div style={{ fontFamily: CN2, fontSize: 17, marginTop: 7 }}>已花 ¥{fmt(spent, 0)} / 预算 ¥{fmt(OVERVIEW.budget, 0)}</div>

            {/* sticky notes */}
            <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
              <div style={{ flex: 1, background: 'oklch(0.92 0.08 130)', padding: '12px 14px', transform: 'rotate(-2deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.22)' }}>
                <div style={{ fontFamily: CN2, fontSize: 17 }}>🏝️ 冲绳基金</div>
                <div style={{ fontFamily: HN, fontSize: 30, fontWeight: 700, color: GRN, lineHeight: 1, marginTop: 2 }}>{Math.round(goalPct * 100)}%</div>
                <div style={{ fontFamily: CN2, fontSize: 15 }}>存了 ¥{fmt(GOAL.saved, 0)}</div>
              </div>
              <div style={{ flex: 1, background: 'oklch(0.92 0.07 350)', padding: '12px 14px', transform: 'rotate(1.6deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.22)' }}>
                <div style={{ fontFamily: CN2, fontSize: 17 }}>💑 我们的家</div>
                <div style={{ fontFamily: HN, fontSize: 30, fontWeight: 700, color: RED, lineHeight: 1, marginTop: 2 }}>+¥{fmt(SHARED.owed, 0)}</div>
                <div style={{ fontFamily: CN2, fontSize: 15 }}>Ta 该给你～</div>
              </div>
            </div>

            <div style={{ fontFamily: CN2, fontSize: 20, color: BLUE, marginTop: 26, marginBottom: 4 }}>最近花了这些 ↓</div>
            {LEDGER[0].items.concat(LEDGER[1].items).slice(0, 5).map((tx) => (
              <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 9, height: 32 }}>
                <span style={{ fontSize: 20, color: CATS[tx.cat].color, lineHeight: 1 }}>✦</span>
                <span style={{ flex: 1, fontFamily: CN2, fontSize: 19, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant} <span style={{ color: '#a89e88' }}>· {tx.note}</span></span>
                <span style={{ fontFamily: HN, fontSize: 22, fontWeight: 700, color: tx.amt > 0 ? GRN : RED }}>{tx.amt > 0 ? '+' : '-'}{fmt(Math.abs(tx.amt), 0)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <NbTab active="home" />
    </div>
  );
}

// ───────────────── 2 · 记一笔 ─────────────────
function NbAdd() {
  const cats = ['food', 'transit', 'shop', 'home', 'fun', 'other'];
  const sel = 'food';
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 8px' }}>
        <div style={{ minHeight: '100%', background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '90px', margin: '44px 12px 0', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)', paddingBottom: 16 }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          <div style={{ padding: '22px 22px 0 44px' }}>
            <NbHead title="记一笔" right="取消" />
            {/* type tabs */}
            <div style={{ display: 'flex', gap: 20, marginTop: 14 }}>
              {['支出', '收入', '转账'].map((t, i) => (
                <span key={t} style={{ position: 'relative', fontFamily: CN, fontSize: 22, lineHeight: 1.1, whiteSpace: 'nowrap', color: i === 0 ? NINK : '#b3a98f' }}>{t}
                  {i === 0 && <svg width="40" height="8" viewBox="0 0 40 8" style={{ position: 'absolute', left: 0, bottom: -8 }}><path d="M1 4 Q10 1 20 4 T39 3" fill="none" stroke={RED} strokeWidth="2" strokeLinecap="round" /></svg>}
                </span>
              ))}
            </div>
            {/* amount */}
            <div style={{ fontFamily: CN2, fontSize: 17, color: '#a89e88', marginTop: 26 }}>金额</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, borderBottom: '2px dashed ' + 'rgba(67,64,58,0.25)', paddingBottom: 10 }}>
              <span style={{ fontFamily: HN, fontSize: 40, color: NINK }}>¥</span>
              <span style={{ fontFamily: HN, fontSize: 64, fontWeight: 700, color: RED, lineHeight: 0.9 }}>38.00</span>
              <span style={{ width: 2.5, height: 46, background: RED, marginLeft: 2 }} />
            </div>
            {/* categories */}
            <div style={{ fontFamily: CN2, fontSize: 17, color: '#a89e88', marginTop: 18, marginBottom: 12 }}>选个分类</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {cats.map((c) => (
                <Doodle key={c} color={c === sel ? CATS[c].color : 'rgba(67,64,58,0.25)'} fill={c === sel ? CATS[c].soft : 'transparent'} rot={c === sel ? -1.5 : 0} pad="9px 0">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                    <span style={{ width: 11, height: 11, borderRadius: 6, background: CATS[c].color, flexShrink: 0 }} />
                    <span style={{ fontFamily: CN2, fontSize: 18, whiteSpace: 'nowrap', lineHeight: 1 }}>{CATS[c].name}</span>
                  </div>
                </Doodle>
              ))}
            </div>
            <div style={{ fontFamily: CN2, fontSize: 18, marginTop: 18, display: 'flex', justifyContent: 'space-between', gap: 12 }}>
              <span style={{ color: '#a89e88', whiteSpace: 'nowrap' }}>📝 备注 · 拿铁 ×1</span>
              <span style={{ color: BLUE, whiteSpace: 'nowrap' }}>微信支付 ›</span>
            </div>
          </div>
        </div>
      </div>
      {/* keypad on a torn paper strip */}
      <div style={{ background: '#efe3cc', padding: '10px 14px 26px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 7 }}>
          {keys.map((k) => (
            <div key={k} style={{ height: 48, background: '#fcf8ef', border: '2px solid ' + NINK, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HN, fontSize: 26, fontWeight: 700, boxShadow: '2px 2px 0 rgba(67,64,58,0.15)' }}>{k}</div>
          ))}
        </div>
        <div style={{ marginTop: 8, height: 50, background: RED, color: '#fff', border: '2px solid ' + NINK, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22, whiteSpace: 'nowrap', boxShadow: '2px 2px 0 rgba(67,64,58,0.3)' }}>记好啦！</div>
      </div>
    </div>
  );
}

// ───────────────── 3 · 明细 ─────────────────
function NbLedger() {
  return (
    <NbPaper tab="list">
      <NbHead title="流水明细" right="筛选" />
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: CN, fontSize: 26 }}>6 月</span>
        <span style={{ fontFamily: HN, fontSize: 20, color: '#a89e88' }}>支出 ¥3,843 · 收入 ¥18,000</span>
      </div>
      {LEDGER.map((g) => (
        <div key={g.day} style={{ marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: CN2, fontSize: 19, color: BLUE }}>{g.day}</span>
            <span style={{ fontFamily: HN, fontSize: 19, color: '#a89e88' }}>{g.sum > 0 ? '+' : '-'}{fmt(Math.abs(g.sum), 0)}</span>
          </div>
          <div style={{ borderBottom: '1.5px dotted rgba(67,64,58,0.25)', marginTop: 4, marginBottom: 4 }} />
          {g.items.map((tx) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'baseline', gap: 9, height: 33 }}>
              <span style={{ fontSize: 18, color: CATS[tx.cat].color }}>✦</span>
              <span style={{ flex: 1, fontFamily: CN2, fontSize: 19, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tx.merchant}{tx.split && <span style={{ fontFamily: PF, fontSize: 11, color: RED, border: '1.5px solid ' + RED, borderRadius: 8, padding: '1px 6px', marginLeft: 6 }}>分摊</span>}
                <span style={{ color: '#a89e88' }}> · {tx.note}</span>
              </span>
              <span style={{ fontFamily: HN, fontSize: 22, fontWeight: 700, color: tx.amt > 0 ? GRN : NINK }}>{tx.amt > 0 ? '+' : '-'}{fmt(Math.abs(tx.amt), 0)}</span>
            </div>
          ))}
        </div>
      ))}
    </NbPaper>
  );
}

Object.assign(window, { CN, CN2, HN, PF, NINK, RED, BLUE, GRN, LINES, Tape, Doodle, NbPaper, NbTab, NbHead, NbHome, NbAdd, NbLedger });
