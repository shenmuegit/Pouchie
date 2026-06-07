// ed2.jsx — Editorial: 报表, 共同账本, 账单详情, 攒钱目标
// depends on ed1.jsx (EdShell, EdBack, Lab, Num, SERIF, SANS, RULE)

// ───────────────── 4 · 报表 ─────────────────
function EdReports() {
  const max = Math.max(...TREND);
  return (
    <EdShell tab="chart" header={<EdBack title="报表" right="6 月 ▾" />}>
      <div style={{ paddingBottom: 16, borderBottom: '1.5px solid ' + T.ink }}>
        <Lab>本月支出合计</Lab>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 4 }}>
          <span style={{ fontFamily: SERIF, fontSize: 26, color: T.ink2 }}>¥</span>
          <span style={{ fontFamily: SERIF, fontSize: 48, fontWeight: 500, letterSpacing: -1, lineHeight: 0.9 }}>{fmt(3842.5, 2).split('.')[0]}</span>
          <span style={{ fontFamily: SERIF, fontSize: 22, color: T.ink2 }}>.{fmt(3842.5, 2).split('.')[1]}</span>
          <span style={{ fontFamily: SANS, fontSize: 12, color: T.good, fontWeight: 600, marginLeft: 8 }}>较上月 ↓9.2%</span>
        </div>
      </div>

      {/* daily trend — hairline bars */}
      <div style={{ padding: '18px 0', borderBottom: RULE }}>
        <Lab s={{ marginBottom: 14 }}>每日支出趋势</Lab>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 90 }}>
          {TREND.map((v, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ height: (v / max * 100) + '%', background: i === TREND.length - 1 ? T.accent : T.ink, opacity: i === TREND.length - 1 ? 1 : 0.78 }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Lab s={{ fontSize: 9 }}>6/1</Lab><Lab s={{ fontSize: 9 }}>6/7</Lab><Lab s={{ fontSize: 9 }}>今天</Lab>
        </div>
      </div>

      {/* category breakdown — ranked list with bars */}
      <div style={{ paddingTop: 16 }}>
        <Lab s={{ marginBottom: 12 }}>分类构成</Lab>
        {BREAKDOWN.map((b, i) => (
          <div key={b.cat} style={{ padding: '11px 0', borderBottom: i < BREAKDOWN.length - 1 ? RULE : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 7 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: SERIF, fontSize: 14, color: T.ink3, width: 18 }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ fontFamily: SANS, fontSize: 14.5, fontWeight: 600 }}>{b.label}</span>
                <span style={{ fontFamily: SANS, fontSize: 11, color: T.ink3, whiteSpace: 'nowrap' }}>{b.n} 笔</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <Num v={b.amt} size={16} sign="" />
                <span style={{ fontFamily: SANS, fontSize: 12, color: T.ink3, width: 30, textAlign: 'right' }}>{Math.round(b.pct * 100)}%</span>
              </div>
            </div>
            <div style={{ height: 3, background: T.cream2 }}><div style={{ height: '100%', width: (b.pct * 100 / 0.34) + '%', maxWidth: '100%', background: CATS[b.cat].color }} /></div>
          </div>
        ))}
      </div>
    </EdShell>
  );
}

// ───────────────── 5 · 共同账本 ─────────────────
function EdShared() {
  return (
    <EdShell tab={null} header={<EdBack title="共同账本" right="设置" />}>
      <div style={{ textAlign: 'center', paddingBottom: 18, borderBottom: '1.5px solid ' + T.ink }}>
        <div style={{ fontFamily: SERIF, fontSize: 20 }}>{SHARED.name}</div>
        <Lab s={{ marginTop: 16 }}>本月结算 · Ta 应转给你</Lab>
        <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 500, letterSpacing: -1, color: T.good, marginTop: 4 }}>{money(SHARED.owed, 0)}</div>
        {/* members */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 16 }}>
          {[['我', SHARED.mePaid, T.accent], ['Ta', SHARED.taPaid, CATS.fun.color]].map(([n, p, c]) => (
            <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 15 }}>{n}</div>
              <Lab s={{ fontSize: 9 }}>已付 {money(p, 0)}</Lab>
            </div>
          ))}
        </div>
      </div>

      {/* split bar */}
      <div style={{ padding: '16px 0', borderBottom: RULE }}>
        <Lab s={{ marginBottom: 10 }}>本月共付 {money(SHARED.month, 0)}</Lab>
        <div style={{ display: 'flex', height: 8, gap: 2 }}>
          <div style={{ width: (SHARED.mePaid / SHARED.month * 100) + '%', background: T.accent }} />
          <div style={{ width: (SHARED.taPaid / SHARED.month * 100) + '%', background: CATS.fun.color }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <Lab s={{ fontSize: 9 }}>我 {Math.round(SHARED.mePaid / SHARED.month * 100)}%</Lab>
          <Lab s={{ fontSize: 9 }}>Ta {Math.round(SHARED.taPaid / SHARED.month * 100)}%</Lab>
        </div>
      </div>

      {/* entries */}
      <div style={{ paddingTop: 14 }}>
        <Lab s={{ marginBottom: 4 }}>共同支出明细</Lab>
        {SHARED.entries.map((e, i) => (
          <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < SHARED.entries.length - 1 ? RULE : 'none' }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: CATS[e.cat].color, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600 }}>{e.merchant}</div>
              <Lab s={{ fontSize: 9.5, marginTop: 3, letterSpacing: 1 }}>{e.payer} 垫付 · {e.time}</Lab>
            </div>
            <div style={{ textAlign: 'right' }}>
              <Num v={-e.amt} size={16} sign="" />
              <div style={{ fontFamily: SANS, fontSize: 10.5, color: T.ink3, marginTop: 2 }}>我承担 {money(e.mine, 0)}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 22, right: 22, bottom: 28, height: 50, background: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 15, fontWeight: 700, color: T.cream, letterSpacing: 1 }}>发起结算</div>
    </EdShell>
  );
}

// ───────────────── 6 · 账单详情 ─────────────────
function EdDetail() {
  const d = DETAIL;
  return (
    <EdShell tab={null} header={<EdBack title="账单详情" right="编辑" />}>
      <div style={{ textAlign: 'center', paddingBottom: 20, borderBottom: '1.5px solid ' + T.ink }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '4px 12px', border: '1px solid ' + CATS[d.cat].color, borderRadius: 999, marginBottom: 14 }}>
          <span style={{ width: 8, height: 8, borderRadius: 4, background: CATS[d.cat].color }} />
          <span style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600 }}>{CATS[d.cat].name}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 2 }}>
          <span style={{ fontFamily: SERIF, fontSize: 30, color: T.ink2 }}>−¥</span>
          <span style={{ fontFamily: SERIF, fontSize: 58, fontWeight: 500, letterSpacing: -1, lineHeight: 0.9 }}>{fmt(Math.abs(d.amt), 2)}</span>
        </div>
        <div style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, marginTop: 12 }}>{d.merchant}</div>
        <div style={{ fontFamily: SANS, fontSize: 12.5, color: T.ink3, marginTop: 3 }}>{d.note}</div>
      </div>

      {/* meta rows */}
      <div>
        {[['日期', d.date], ['时间', d.time], ['账户', d.account], ['方式', d.method]].map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: RULE }}>
            <Lab>{k}</Lab>
            <span style={{ fontFamily: SERIF, fontSize: 15, whiteSpace: 'nowrap' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* split */}
      <div style={{ padding: '16px 0', borderBottom: RULE }}>
        <Lab s={{ marginBottom: 12 }}>与 {d.split.with} 平摊</Lab>
        <div style={{ display: 'flex', gap: 12 }}>
          {[['我', d.split.mine, T.accent], [d.split.with, d.split.theirs, CATS.fun.color]].map(([n, v, c]) => (
            <div key={n} style={{ flex: 1, border: RULE, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 24, height: 24, borderRadius: 12, background: c, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 11 }}>{n}</div>
                <Lab s={{ fontSize: 9 }}>承担</Lab>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 22, marginTop: 8 }}>{money(v, 2)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* receipt + tags */}
      <div style={{ padding: '16px 0 0' }}>
        <Lab s={{ marginBottom: 10 }}>凭证 · 标签</Lab>
        <div style={{ display: 'flex', gap: 12 }}>
          <Placeholder label="小票照" h={88} radius={2} style={{ width: 88, flexShrink: 0 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start', paddingTop: 2 }}>
            {d.tags.map((t) => (
              <span key={t} style={{ fontFamily: SANS, fontSize: 12, fontWeight: 600, color: T.ink2, border: RULE, borderRadius: 999, padding: '5px 12px' }}>#{t}</span>
            ))}
          </div>
        </div>
      </div>
    </EdShell>
  );
}

// ───────────────── 7 · 攒钱目标 ─────────────────
function EdGoal() {
  const pct = GOAL.saved / GOAL.target;
  const ring = 168, rad = 74, circ = 2 * Math.PI * rad;
  return (
    <EdShell tab={null} header={<EdBack title="攒钱目标" right="编辑" />}>
      {/* cover */}
      <Placeholder label="目标封面 · 冲绳的海" h={120} radius={2} style={{ marginBottom: 4 }} />
      <div style={{ textAlign: 'center', padding: '20px 0 18px', borderBottom: '1.5px solid ' + T.ink }}>
        <div style={{ fontFamily: SERIF, fontSize: 22 }}>{GOAL.emoji} {GOAL.name}</div>
        <div style={{ position: 'relative', width: ring, height: ring, margin: '18px auto 0' }}>
          <svg width={ring} height={ring} style={{ transform: 'rotate(-90deg)' }}>
            <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke={T.cream2} strokeWidth="10" />
            <circle cx={ring/2} cy={ring/2} r={rad} fill="none" stroke={T.good} strokeWidth="10" strokeLinecap="butt" strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: SERIF, fontSize: 44, fontWeight: 500, lineHeight: 0.9 }}>{Math.round(pct * 100)}<span style={{ fontSize: 22, color: T.ink2 }}>%</span></span>
            <Lab s={{ fontSize: 9, marginTop: 6 }}>已完成</Lab>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 16 }}>
          <div><Lab s={{ fontSize: 9 }}>已存</Lab><div style={{ fontFamily: SERIF, fontSize: 19, marginTop: 2, color: T.good }}>{money(GOAL.saved, 0)}</div></div>
          <div style={{ borderLeft: RULE, paddingLeft: 28 }}><Lab s={{ fontSize: 9 }}>目标</Lab><div style={{ fontFamily: SERIF, fontSize: 19, marginTop: 2 }}>{money(GOAL.target, 0)}</div></div>
        </div>
      </div>

      <div style={{ padding: '14px 0', borderBottom: RULE, fontFamily: SANS, fontSize: 13, color: T.ink2, lineHeight: 1.5 }}>
        按每月定存 <b style={{ color: T.ink }}>{money(GOAL.monthly, 0)}</b> 计算，预计 <b style={{ color: T.ink }}>{GOAL.etaMonths} 个月</b>后达成 · 还差 {money(GOAL.target - GOAL.saved, 0)}
      </div>

      {/* deposit history */}
      <div style={{ paddingTop: 14 }}>
        <Lab s={{ marginBottom: 4 }}>存入记录</Lab>
        {GOAL.deposits.map((dp, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < GOAL.deposits.length - 1 ? RULE : 'none' }}>
            <span style={{ fontFamily: SERIF, fontSize: 14, color: T.ink3, width: 22 }}>{String(GOAL.deposits.length - i).padStart(2, '0')}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600 }}>{dp.note}</div>
              <Lab s={{ fontSize: 9.5, marginTop: 3 }}>{dp.d}</Lab>
            </div>
            <Num v={dp.amt} size={16} color={T.good} sign="+" />
          </div>
        ))}
      </div>
      <div style={{ height: 60 }} />
      <div style={{ position: 'absolute', left: 22, right: 22, bottom: 28, height: 50, background: T.good, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontSize: 15, fontWeight: 700, color: '#fff', letterSpacing: 1 }}>+ 存入一笔</div>
    </EdShell>
  );
}

window.EdReports = EdReports; window.EdShared = EdShared; window.EdDetail = EdDetail; window.EdGoal = EdGoal;
