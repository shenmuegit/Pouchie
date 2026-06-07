// ed1.jsx — Editorial 编辑杂志感: shell, 首页, 记一笔, 明细
const SERIF = "'Newsreader', Georgia, 'Songti SC', serif";
const SANS  = "'PingFang SC', -apple-system, system-ui, sans-serif";
const RULE = '1px solid ' + T.line;

// uppercase tracked label
function Lab({ children, s }) {
  return <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: 1.8, textTransform: 'uppercase', color: T.ink3, ...s }}>{children}</div>;
}
// serif money
function Num({ v, size = 20, dec = 2, color, sign }) {
  const s = fmt(Math.abs(v), dec);
  return <span style={{ fontFamily: SERIF, fontSize: size, fontVariantNumeric: 'tabular-nums', color: color || T.ink, letterSpacing: -0.3 }}>{sign || (v < 0 ? '−' : '')}{s}</span>;
}

// page shell with optional masthead header / back header
function EdShell({ children, header, tab }) {
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink, fontFamily: SANS }}>
      {header}
      <div style={{ height: '100%', overflowY: 'auto', padding: header ? '0 22px 100px' : '0 22px 100px', paddingTop: header ? 96 : 54 }}>
        {children}
      </div>
      {tab !== false && <EdTab active={tab} />}
    </div>
  );
}
function EdBack({ title, right }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, paddingTop: 54, paddingBottom: 12, background: T.cream, borderBottom: RULE,
      display: 'grid', gridTemplateColumns: '40px 1fr 40px', alignItems: 'center', padding: '54px 22px 12px' }}>
      <span style={{ fontFamily: SERIF, fontSize: 24, lineHeight: 0.6 }}>‹</span>
      <div style={{ textAlign: 'center' }}><Lab>{title}</Lab></div>
      <div style={{ textAlign: 'right', fontFamily: SANS, fontSize: 13, color: T.accent, fontWeight: 600 }}>{right}</div>
    </div>
  );
}
function EdTab({ active = 'home' }) {
  const tabs = [['home', '总览'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingBottom: 24, paddingTop: 12, background: T.cream, borderTop: '1px solid ' + T.ink + '22',
      display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <div key="add" style={{ width: 50, height: 50, borderRadius: 25, background: T.ink, color: T.cream, marginTop: -2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={PATHS.plus} size={24} sw={2} />
        </div>
      ) : (
        <div key={t[0]} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 56, color: active === t[0] ? T.ink : T.ink3 }}>
          <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: active === t[0] ? 700 : 500, letterSpacing: 0.5 }}>{t[1]}</span>
          <span style={{ width: 4, height: 4, borderRadius: 2, background: active === t[0] ? T.accent : 'transparent' }} />
        </div>
      ))}
    </div>
  );
}

// ───────────────── 1 · 首页 ─────────────────
function EdHome() {
  const spent = OVERVIEW.spent, left = OVERVIEW.budget - spent;
  const goalPct = GOAL.saved / GOAL.target;
  const ip = fmt(spent, 2).split('.');
  return (
    <EdShell tab="home">
      <div style={{ paddingBottom: 14, borderBottom: '1.5px solid ' + T.ink, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <Lab s={{ fontSize: 11 }}>2026 年 6 月 · 总览</Lab>
        <Lab s={{ fontSize: 11 }}>林一</Lab>
      </div>
      <div style={{ padding: '22px 0 18px', borderBottom: RULE }}>
        <Lab>本月支出</Lab>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 6 }}>
          <span style={{ fontFamily: SERIF, fontSize: 30, color: T.ink2 }}>¥</span>
          <span style={{ fontFamily: SERIF, fontSize: 64, fontWeight: 500, letterSpacing: -1.5, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{ip[0]}</span>
          <span style={{ fontFamily: SERIF, fontSize: 28, color: T.ink2 }}>.{ip[1]}</span>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
          {[['收入', money(OVERVIEW.income, 0)], ['结余', '+' + money(OVERVIEW.income - spent, 0).slice(1), T.good], ['日均', money(spent / 6, 0)]].map(([k, v, c], i) => (
            <div key={i} style={{ borderLeft: i ? RULE : 'none', paddingLeft: i ? 24 : 0 }}>
              <Lab s={{ fontSize: 9.5 }}>{k}</Lab>
              <div style={{ fontFamily: SERIF, fontSize: 19, marginTop: 2, color: c || T.ink }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '16px 0', borderBottom: RULE }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <Lab>预算进度</Lab>
          <span style={{ fontFamily: SERIF, fontSize: 14, color: T.ink2, whiteSpace: 'nowrap', flexShrink: 0 }}>{money(spent, 0)} / {money(OVERVIEW.budget, 0)}</span>
        </div>
        <div style={{ height: 6, background: T.cream2, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, width: (spent / OVERVIEW.budget * 100) + '%', background: T.accent }} />
        </div>
        <div style={{ marginTop: 8, fontFamily: SANS, fontSize: 12, color: T.ink2 }}>剩余可支配 <b style={{ color: T.ink }}>{money(left, 0)}</b>，按当前节奏可支撑至月末</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: RULE }}>
        <div style={{ padding: '16px 18px 18px 0', borderRight: RULE }}>
          <Lab>攒钱目标</Lab>
          <div style={{ fontFamily: SERIF, fontSize: 15, marginTop: 6, marginBottom: 10 }}>{GOAL.name}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontFamily: SERIF, fontSize: 34, lineHeight: 0.9 }}>{Math.round(goalPct * 100)}</span>
            <span style={{ fontFamily: SERIF, fontSize: 18, color: T.ink2 }}>%</span>
          </div>
          <div style={{ height: 4, background: T.cream2, marginTop: 10 }}><div style={{ height: '100%', width: (goalPct * 100) + '%', background: T.good }} /></div>
        </div>
        <div style={{ padding: '16px 0 18px 18px' }}>
          <Lab>共同账本</Lab>
          <div style={{ fontFamily: SERIF, fontSize: 15, marginTop: 6, marginBottom: 10 }}>{SHARED.name}</div>
          <div style={{ fontFamily: SERIF, fontSize: 26, lineHeight: 0.9, color: T.good }}>{money(SHARED.owed, 0)}</div>
          <div style={{ fontFamily: SANS, fontSize: 11, color: T.ink3, marginTop: 8 }}>Ta 应转给你</div>
        </div>
      </div>
      <div style={{ paddingTop: 16 }}>
        <Lab s={{ marginBottom: 4 }}>近期流水</Lab>
        {LEDGER[0].items.concat(LEDGER[1].items).slice(0, 5).map((tx, i, a) => (
          <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < a.length - 1 ? RULE : 'none' }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: CATS[tx.cat].color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 600 }}>{tx.merchant}</div>
              <Lab s={{ fontSize: 9.5, marginTop: 3, letterSpacing: 1 }}>{CATS[tx.cat].name} · {tx.time}</Lab>
            </div>
            <Num v={tx.amt} size={18} color={tx.amt > 0 ? T.good : T.ink} sign={tx.amt > 0 ? '+' : '−'} />
          </div>
        ))}
      </div>
    </EdShell>
  );
}

// ───────────────── 2 · 记一笔 ─────────────────
function EdAdd() {
  const cats = ['food', 'transit', 'shop', 'home', 'fun', 'other'];
  const sel = 'food', amt = '38.00';
  const keys = ['1','2','3','4','5','6','7','8','9','.','0','⌫'];
  return (
    <div style={{ height: '100%', background: T.cream, position: 'relative', overflow: 'hidden', color: T.ink, fontFamily: SANS, display: 'flex', flexDirection: 'column' }}>
      <div style={{ paddingTop: 54 }}>
        <EdBack title="记一笔" right="取消" />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '108px 22px 0' }}>
        {/* segmented 支出/收入 */}
        <div style={{ display: 'flex', borderBottom: '1.5px solid ' + T.ink, marginBottom: 18 }}>
          {['支出', '收入', '转账'].map((t, i) => (
            <div key={t} style={{ paddingBottom: 10, marginRight: 22, borderBottom: i === 0 ? '2px solid ' + T.ink : 'none', marginBottom: -1.5,
              fontFamily: SANS, fontSize: 14, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? T.ink : T.ink3 }}>{t}</div>
          ))}
        </div>
        {/* amount */}
        <Lab>金额</Lab>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 6, paddingBottom: 16, borderBottom: RULE }}>
          <span style={{ fontFamily: SERIF, fontSize: 30, color: T.ink2 }}>¥</span>
          <span style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 500, letterSpacing: -1, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{amt}</span>
          <span style={{ width: 2, height: 44, background: T.accent, marginLeft: 2, animation: 'none' }} />
        </div>
        {/* category */}
        <Lab s={{ marginTop: 18, marginBottom: 12 }}>分类</Lab>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 0 }}>
          {cats.map((c) => (
            <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, border: c === sel ? '1.5px solid ' + T.ink : '1px solid ' + T.line,
                background: c === sel ? T.ink : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: c === sel ? CATS[c].color : CATS[c].color }} />
              </div>
              <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: c === sel ? 700 : 500, color: c === sel ? T.ink : T.ink3 }}>{CATS[c].name}</span>
            </div>
          ))}
        </div>
        {/* note */}
        <div style={{ marginTop: 20, paddingBottom: 14, borderBottom: RULE, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink3 }}>备注 · 拿铁 ×1</span>
          <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink3 }}>›</span>
        </div>
        <div style={{ marginTop: 14, paddingBottom: 14, borderBottom: RULE, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink2 }}>账户 · 微信支付</span>
          <span style={{ fontFamily: SANS, fontSize: 14, color: T.ink3 }}>›</span>
        </div>
      </div>
      {/* keypad */}
      <div style={{ background: '#efe6d8', borderTop: '1px solid ' + T.ink + '22', padding: '8px 10px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
          {keys.map((k) => (
            <div key={k} style={{ height: 50, background: T.card, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: SERIF, fontSize: 24, color: T.ink, boxShadow: '0 1px 0 rgba(0,0,0,0.08)' }}>{k}</div>
          ))}
        </div>
        <div style={{ marginTop: 8, height: 50, background: T.ink, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: SANS, fontSize: 16, fontWeight: 700, color: T.cream, letterSpacing: 1 }}>保存</div>
      </div>
    </div>
  );
}

// ───────────────── 3 · 明细 ─────────────────
function EdLedger() {
  return (
    <EdShell tab="list" header={<EdBack title="明细" right="筛选" />}>
      {/* month switch + summary */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '4px 0 14px', borderBottom: '1.5px solid ' + T.ink }}>
        <span style={{ fontFamily: SERIF, fontSize: 22 }}>6 月</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ textAlign: 'right' }}><Lab s={{ fontSize: 9 }}>支出</Lab><div style={{ fontFamily: SERIF, fontSize: 17 }}>{money(3842.5, 0)}</div></div>
          <div style={{ textAlign: 'right' }}><Lab s={{ fontSize: 9 }}>收入</Lab><div style={{ fontFamily: SERIF, fontSize: 17, color: T.good }}>{money(18000, 0)}</div></div>
        </div>
      </div>
      {LEDGER.map((g) => (
        <div key={g.day}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0 6px' }}>
            <Lab>{g.day}</Lab>
            <span style={{ fontFamily: SERIF, fontSize: 13, color: T.ink2 }}>{g.sum > 0 ? '+' : '−'}{fmt(Math.abs(g.sum), 0)}</span>
          </div>
          {g.items.map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: RULE }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: CATS[tx.cat].color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 600 }}>{tx.merchant} {tx.split && <span style={{ fontSize: 10, fontWeight: 700, color: T.accent, border: '1px solid ' + T.accent, borderRadius: 3, padding: '0 4px', marginLeft: 4 }}>分摊</span>}</div>
                <Lab s={{ fontSize: 9.5, marginTop: 3, letterSpacing: 1 }}>{tx.note} · {tx.time}</Lab>
              </div>
              <Num v={tx.amt} size={18} color={tx.amt > 0 ? T.good : T.ink} sign={tx.amt > 0 ? '+' : '−'} />
            </div>
          ))}
        </div>
      ))}
    </EdShell>
  );
}

window.EdHome = EdHome; window.EdAdd = EdAdd; window.EdLedger = EdLedger;
window.SERIF = SERIF; window.SANS = SANS; window.RULE = RULE;
window.EdShell = EdShell; window.EdBack = EdBack; window.EdTab = EdTab; window.Lab = Lab; window.Num = Num;
