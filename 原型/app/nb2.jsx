// nb2.jsx — Notebook: 报表, 共同账本, 账单详情, 攒钱目标 (depends on nb1.jsx)

// ───────────────── 4 · 报表 ─────────────────
function NbReports() {
  const max = Math.max(...TREND);
  return (
    <NbPaper tab="chart">
      <NbHead title="本月报表" right="6月" />
      <div style={{ marginTop: 4 }}>
        <span style={{ fontFamily: CN2, fontSize: 18, color: '#a89e88' }}>这个月一共花了</span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: HN, fontSize: 52, fontWeight: 700, color: RED, lineHeight: 0.9 }}>¥3,842.50</span>
        </div>
        <span style={{ fontFamily: CN2, fontSize: 17, color: GRN }}>比上个月少花了 9% 呢，继续保持 👍</span>
      </div>

      {/* hand-drawn bar chart in a doodle box */}
      <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 22, marginBottom: 8 }}>每天花了多少 📊</div>
      <Doodle rot={-0.4} pad="14px 14px 10px">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 86 }}>
          {TREND.map((v, i) => (
            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: (v / max * 100) + '%', borderRadius: '4px 4px 0 0',
                background: i === TREND.length - 1 ? RED : 'oklch(0.55 0.13 245 / 0.7)' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: HN, fontSize: 15, color: '#a89e88' }}>
          <span>6/1</span><span>6/7</span><span>今天</span>
        </div>
      </Doodle>

      {/* category list */}
      <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 22, marginBottom: 8 }}>都花在哪了 🧐</div>
      {BREAKDOWN.map((b) => (
        <div key={b.cat} style={{ marginBottom: 13 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: CN2, fontSize: 19, whiteSpace: 'nowrap', lineHeight: 1 }}><span style={{ color: CATS[b.cat].color }}>●</span> {b.label} <span style={{ fontFamily: HN, fontSize: 16, color: '#a89e88' }}>{b.n}笔</span></span>
            <span style={{ fontFamily: HN, fontSize: 20, fontWeight: 700 }}>¥{fmt(b.amt, 0)} <span style={{ fontSize: 15, color: '#a89e88' }}>{Math.round(b.pct * 100)}%</span></span>
          </div>
          <div style={{ height: 9, marginTop: 4, border: '1.5px solid rgba(67,64,58,0.25)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: (b.pct / 0.34 * 100) + '%', maxWidth: '100%', background: CATS[b.cat].color, opacity: 0.7 }} />
          </div>
        </div>
      ))}
    </NbPaper>
  );
}

// ───────────────── 5 · 共同账本 ─────────────────
function NbShared() {
  return (
    <NbPaper tab={null}>
      <NbHead title="我们的家" right="设置" />
      {/* big owed callout in a doodle box */}
      <Doodle rot={-0.8} color={GRN} fill="oklch(0.95 0.05 150)" pad="16px 18px" style={{ marginTop: 8, textAlign: 'center' }}>
        <div style={{ fontFamily: CN2, fontSize: 18 }}>这个月 Ta 该转给你</div>
        <div style={{ fontFamily: HN, fontSize: 50, fontWeight: 700, color: GRN, lineHeight: 1 }}>¥{fmt(SHARED.owed, 0)}</div>
      </Doodle>

      {/* who paid */}
      <div style={{ display: 'flex', gap: 14, marginTop: 18 }}>
        {[['我', SHARED.mePaid, 'oklch(0.68 0.145 48)', -1.5], ['Ta', SHARED.taPaid, CATS.fun.color, 1.5]].map(([n, p, c, r]) => (
          <div key={n} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 22, background: c, color: '#fff', border: '2px solid ' + NINK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 18, transform: `rotate(${r}deg)` }}>{n}</div>
            <div>
              <div style={{ fontFamily: CN2, fontSize: 16, color: '#a89e88' }}>已垫付</div>
              <div style={{ fontFamily: HN, fontSize: 22, fontWeight: 700 }}>¥{fmt(p, 0)}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 22, marginBottom: 6 }}>一起花的账 💞</div>
      {SHARED.entries.map((e) => (
        <div key={e.id} style={{ display: 'flex', alignItems: 'baseline', gap: 9, paddingTop: 9, paddingBottom: 9, borderBottom: '1.5px dotted rgba(67,64,58,0.22)' }}>
          <span style={{ fontSize: 17, color: CATS[e.cat].color }}>✦</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: CN2, fontSize: 18, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.merchant}</div>
            <div style={{ fontFamily: HN, fontSize: 15, color: '#a89e88' }}>{e.payer} 垫付 · {e.time}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: HN, fontSize: 20, fontWeight: 700 }}>¥{fmt(e.amt, 0)}</div>
            <div style={{ fontFamily: HN, fontSize: 14, color: '#a89e88' }}>我担 ¥{fmt(e.mine, 0)}</div>
          </div>
        </div>
      ))}
      <div style={{ marginTop: 18, height: 50, background: GRN, color: '#fff', border: '2px solid ' + NINK, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22, boxShadow: '3px 3px 0 rgba(67,64,58,0.25)' }}>找 Ta 结算 →</div>
    </NbPaper>
  );
}

// ───────────────── 6 · 账单详情 ─────────────────
function NbDetail() {
  const d = DETAIL;
  return (
    <NbPaper tab={null}>
      <NbHead title="这笔账" right="编辑" />
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <span style={{ fontFamily: CN2, fontSize: 19, color: CATS[d.cat].color }}>● {CATS[d.cat].name}</span>
        <div style={{ fontFamily: HN, fontSize: 64, fontWeight: 700, color: RED, lineHeight: 1, marginTop: 4 }}>-¥{fmt(Math.abs(d.amt), 2)}</div>
        <div style={{ fontFamily: CN, fontSize: 26, marginTop: 6 }}>{d.merchant}</div>
        <div style={{ fontFamily: CN2, fontSize: 17, color: '#a89e88', marginTop: 2 }}>{d.note}</div>
      </div>

      <div style={{ borderTop: '1.5px dashed rgba(67,64,58,0.25)', marginTop: 16, paddingTop: 6 }} />
      {[['🗓️ 日期', d.date], ['⏰ 时间', d.time], ['💳 账户', d.account], ['📱 方式', d.method]].map(([k, v]) => (
        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', height: 33 }}>
          <span style={{ fontFamily: CN2, fontSize: 18, color: '#a89e88', whiteSpace: 'nowrap', lineHeight: 1 }}>{k}</span>
          <span style={{ fontFamily: HN, fontSize: 19, whiteSpace: 'nowrap' }}>{v}</span>
        </div>
      ))}

      {/* split */}
      <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 16, marginBottom: 8 }}>和 {d.split.with} 平摊 🤝</div>
      <div style={{ display: 'flex', gap: 12 }}>
        {[['我', d.split.mine, 'oklch(0.68 0.145 48)', -1], [d.split.with, d.split.theirs, CATS.fun.color, 1]].map(([n, v, c, r]) => (
          <Doodle key={n} color={c} rot={r} pad="11px 14px" style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 14, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 14 }}>{n}</div>
              <span style={{ fontFamily: CN2, fontSize: 16, color: '#a89e88' }}>承担</span>
            </div>
            <div style={{ fontFamily: HN, fontSize: 24, fontWeight: 700, marginTop: 6 }}>¥{fmt(v, 2)}</div>
          </Doodle>
        ))}
      </div>

      {/* receipt + tags */}
      <div style={{ display: 'flex', gap: 12, marginTop: 18, alignItems: 'flex-start' }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Tape w={42} style={{ top: -8, left: 18, transform: 'rotate(6deg)', height: 18 }} />
          <Placeholder label="小票" h={86} radius={2} style={{ width: 76, transform: 'rotate(-2deg)' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
          {d.tags.map((t, i) => (
            <Doodle key={t} color="rgba(67,64,58,0.3)" rot={i ? 1.5 : -1.5} pad="4px 12px"><span style={{ fontFamily: CN2, fontSize: 16 }}>#{t}</span></Doodle>
          ))}
        </div>
      </div>
    </NbPaper>
  );
}

// ───────────────── 7 · 攒钱目标 ─────────────────
function NbGoal() {
  const pct = GOAL.saved / GOAL.target;
  // hand-drawn jar
  const jarH = 150, fillH = jarH * pct;
  return (
    <NbPaper tab={null}>
      <NbHead title="攒钱目标" right="编辑" />
      <div style={{ textAlign: 'center', marginTop: 6 }}>
        <div style={{ fontFamily: CN, fontSize: 30 }}>{GOAL.emoji} {GOAL.name}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 22, marginTop: 14, justifyContent: 'center' }}>
        {/* jar */}
        <div style={{ position: 'relative', width: 104, height: jarH + 14 }}>
          <div style={{ position: 'absolute', top: 0, left: 30, width: 44, height: 10, border: '2.5px solid ' + NINK, borderRadius: '4px 4px 0 0', background: '#fcf8ef' }} />
          <div style={{ position: 'absolute', top: 12, left: 8, right: 8, bottom: 0, border: '2.5px solid ' + NINK, borderRadius: '8px 8px 26px 26px', overflow: 'hidden', background: '#fcf8ef' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: fillH, background: 'repeating-linear-gradient(45deg, oklch(0.7 0.13 230 / 0.55) 0 7px, oklch(0.7 0.13 230 / 0.3) 7px 14px)' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, top: jarH - fillH, height: 4, background: 'oklch(0.6 0.13 235)' }} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily: HN, fontSize: 56, fontWeight: 700, color: GRN, lineHeight: 0.9 }}>{Math.round(pct * 100)}%</div>
          <div style={{ fontFamily: CN2, fontSize: 18, lineHeight: 1.5, marginTop: 10, whiteSpace: 'nowrap' }}>已存 ¥{fmt(GOAL.saved, 0)}</div>
          <div style={{ fontFamily: CN2, fontSize: 18, lineHeight: 1.5, color: '#a89e88', whiteSpace: 'nowrap' }}>目标 ¥{fmt(GOAL.target, 0)}</div>
        </div>
      </div>

      <Doodle rot={-0.5} color={BLUE} fill="oklch(0.95 0.03 245)" pad="12px 14px" style={{ marginTop: 18 }}>
        <span style={{ fontFamily: CN2, fontSize: 17 }}>每月存 ¥{fmt(GOAL.monthly, 0)}，再过 <b style={{ color: BLUE }}>{GOAL.etaMonths} 个月</b>就能出发啦！还差 ¥{fmt(GOAL.target - GOAL.saved, 0)} ✈️</span>
      </Doodle>

      <div style={{ fontFamily: CN2, fontSize: 19, color: BLUE, marginTop: 20, marginBottom: 4 }}>存钱记录 🪙</div>
      {GOAL.deposits.map((dp, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 9, height: 33, borderBottom: '1.5px dotted rgba(67,64,58,0.2)' }}>
          <span style={{ fontSize: 16 }}>🪙</span>
          <span style={{ flex: 1, fontFamily: CN2, fontSize: 18 }}>{dp.note}</span>
          <span style={{ fontFamily: HN, fontSize: 16, color: '#a89e88' }}>{dp.d}</span>
          <span style={{ fontFamily: HN, fontSize: 20, fontWeight: 700, color: GRN, width: 64, textAlign: 'right' }}>+{fmt(dp.amt, 0)}</span>
        </div>
      ))}
      <div style={{ marginTop: 18, height: 50, background: GRN, color: '#fff', border: '2px solid ' + NINK, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22, boxShadow: '3px 3px 0 rgba(67,64,58,0.25)' }}>+ 再存一笔</div>
    </NbPaper>
  );
}

Object.assign(window, { NbReports, NbShared, NbDetail, NbGoal });
