// DirectionC.jsx — 编辑/杂志感 (Editorial). Serif numerals, hairlines, structured grid.
const FC = "'Newsreader', Georgia, 'Songti SC', serif";
const FL = "'PingFang SC', -apple-system, system-ui, sans-serif"; // labels

function Label({ children, style }) {
  return <div style={{ fontFamily: FL, fontSize: 10.5, fontWeight: 700, letterSpacing: 1.6,
    textTransform: 'uppercase', color: T.ink3, ...style }}>{children}</div>;
}

function TabBarC({ active, setActive, onAdd }) {
  const tabs = [['home', '总览'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40,
      paddingBottom: 24, paddingTop: 12, background: T.cream, borderTop: '1px solid ' + T.line,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <button key="add" onClick={onAdd} style={{ width: 50, height: 50, borderRadius: 25, border: 'none', cursor: 'pointer',
          background: T.ink, color: T.cream, marginTop: -2,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={PATHS.plus} size={24} sw={2} />
        </button>
      ) : (
        <button key={t[0]} onClick={() => setActive(t[0])} style={{ background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 56, padding: '2px 0',
          color: active === t[0] ? T.ink : T.ink3 }}>
          <span style={{ fontFamily: FL, fontSize: 12, fontWeight: active === t[0] ? 700 : 500, letterSpacing: 0.5 }}>{t[1]}</span>
          <span style={{ width: 4, height: 4, borderRadius: 2, background: active === t[0] ? T.accent : 'transparent' }} />
        </button>
      ))}
    </div>
  );
}

function HomeC() {
  const [txns, setTxns] = React.useState(seedTxns);
  const [spent, setSpent] = React.useState(OVERVIEW.spent);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState('home');
  const [m, setM] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setM(true), 80); return () => clearTimeout(t); }, []);

  const left = OVERVIEW.budget - spent;
  const pct = Math.min(1, spent / OVERVIEW.budget);
  const goalPct = OVERVIEW.goal.saved / OVERVIEW.goal.target;

  const save = ({ amt, cat }) => {
    setTxns((p) => [{ id: Date.now(), cat, merchant: CATS[cat].name + ' · 新记录', amt, time: '刚刚', day: '今天' }, ...p]);
    setSpent((s) => s + Math.abs(amt));
    setOpen(false);
  };

  const rule = '1px solid ' + T.line;
  const intPart = fmt(spent, 2).split('.')[0];
  const decPart = fmt(spent, 2).split('.')[1];

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', color: T.ink, background: T.cream }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 22px 110px' }}>
        {/* masthead */}
        <div style={{ paddingTop: 60, paddingBottom: 14, borderBottom: '1.5px solid ' + T.ink,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <Label style={{ fontSize: 11 }}>2026 年 6 月 · 总览</Label>
          <Label style={{ fontSize: 11 }}>林一</Label>
        </div>

        {/* hero — 本月支出 */}
        <div style={{ padding: '22px 0 18px', borderBottom: rule }}>
          <Label>本月支出</Label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 6, fontFamily: FC }}>
            <span style={{ fontSize: 30, fontWeight: 500, color: T.ink2 }}>¥</span>
            <span style={{ fontSize: 64, fontWeight: 500, letterSpacing: -1.5, lineHeight: 0.9, fontVariantNumeric: 'tabular-nums' }}>{intPart}</span>
            <span style={{ fontSize: 28, fontWeight: 500, color: T.ink2 }}>.{decPart}</span>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            <div><Label style={{ fontSize: 9.5 }}>收入</Label><div style={{ fontFamily: FC, fontSize: 19, marginTop: 2 }}>{money(OVERVIEW.income, 0)}</div></div>
            <div style={{ borderLeft: rule, paddingLeft: 24 }}><Label style={{ fontSize: 9.5 }}>结余</Label><div style={{ fontFamily: FC, fontSize: 19, marginTop: 2, color: T.good }}>+{money(OVERVIEW.income - spent, 0).slice(1)}</div></div>
            <div style={{ borderLeft: rule, paddingLeft: 24 }}><Label style={{ fontSize: 9.5 }}>日均</Label><div style={{ fontFamily: FC, fontSize: 19, marginTop: 2 }}>{money(spent / 6, 0)}</div></div>
          </div>
        </div>

        {/* budget bar */}
        <div style={{ padding: '16px 0', borderBottom: rule }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <Label>预算进度</Label>
            <span style={{ fontFamily: FC, fontSize: 14, color: T.ink2, whiteSpace: 'nowrap', flexShrink: 0 }}>{money(spent, 0)} / {money(OVERVIEW.budget, 0)}</span>
          </div>
          <div style={{ height: 6, background: T.cream2, position: 'relative', borderRadius: 1 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: m ? (pct * 100) + '%' : 0,
              background: T.accent, transition: 'width 1s cubic-bezier(.3,.8,.3,1)' }} />
            {[0.25, 0.5, 0.75].map((t) => (
              <div key={t} style={{ position: 'absolute', left: (t * 100) + '%', top: -2, bottom: -2, width: 1, background: T.cream }} />
            ))}
          </div>
          <div style={{ marginTop: 8, fontFamily: FL, fontSize: 12, color: T.ink2 }}>剩余可支配 <b style={{ color: T.ink }}>{money(left, 0)}</b>，按当前节奏可支撑到月末</div>
        </div>

        {/* savings + shared, two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: rule }}>
          <div style={{ padding: '16px 18px 18px 0', borderRight: rule }}>
            <Label>攒钱目标</Label>
            <div style={{ fontFamily: FC, fontSize: 15, marginTop: 6, marginBottom: 10 }}>{OVERVIEW.goal.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FC, fontSize: 34, lineHeight: 0.9 }}>{Math.round(goalPct * 100)}</span>
              <span style={{ fontFamily: FC, fontSize: 18, color: T.ink2 }}>%</span>
            </div>
            <div style={{ height: 4, background: T.cream2, marginTop: 10 }}>
              <div style={{ height: '100%', width: m ? (goalPct * 100) + '%' : 0, background: T.good, transition: 'width 1.1s ease .1s' }} />
            </div>
            <div style={{ fontFamily: FL, fontSize: 11, color: T.ink3, marginTop: 7 }}>{money(OVERVIEW.goal.saved, 0)} / {money(OVERVIEW.goal.target, 0)}</div>
          </div>
          <div style={{ padding: '16px 0 18px 18px' }}>
            <Label>共同账本</Label>
            <div style={{ fontFamily: FC, fontSize: 15, marginTop: 6, marginBottom: 10 }}>{OVERVIEW.shared.name}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
              <span style={{ fontFamily: FC, fontSize: 34, lineHeight: 0.9, color: T.good }}>{money(OVERVIEW.shared.owed, 0)}</span>
            </div>
            <div style={{ fontFamily: FL, fontSize: 11, color: T.ink3, marginTop: 10 }}>Ta 应转给你 · 本月共付 {money(OVERVIEW.shared.month, 0)}</div>
            <div style={{ display: 'flex', marginTop: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: T.ink, color: T.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FL, fontWeight: 700, fontSize: 11, border: '1.5px solid ' + T.cream, zIndex: 2 }}>我</div>
              <div style={{ width: 26, height: 26, borderRadius: 13, background: T.accent, color: '#fff', marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FL, fontWeight: 700, fontSize: 11, border: '1.5px solid ' + T.cream }}>Ta</div>
            </div>
          </div>
        </div>

        {/* ledger */}
        <div style={{ paddingTop: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <Label>近期流水</Label>
            <span style={{ fontFamily: FL, fontSize: 12, color: T.accent, fontWeight: 600 }}>查看全部</span>
          </div>
          {txns.slice(0, 6).map((tx, i) => (
            <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: i < Math.min(6, txns.length) - 1 ? rule : 'none' }}>
              <span style={{ width: 7, height: 7, borderRadius: 4, background: CATS[tx.cat].color, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: FL, fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{tx.merchant}</div>
                <Label style={{ fontSize: 9.5, marginTop: 3, letterSpacing: 1 }}>{CATS[tx.cat].name} · {tx.time}</Label>
              </div>
              <div style={{ fontFamily: FC, fontSize: 18, fontVariantNumeric: 'tabular-nums', color: tx.amt > 0 ? T.good : T.ink }}>
                {tx.amt > 0 ? '+' : '−'}{fmt(Math.abs(tx.amt))}</div>
            </div>
          ))}
        </div>
      </div>

      <TabBarC active={active} setActive={setActive} onAdd={() => setOpen(true)} />
      <QuickAdd open={open} onClose={() => setOpen(false)} onSave={save} accent={T.accent} />
    </div>
  );
}

window.HomeC = HomeC;
