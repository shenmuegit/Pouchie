// br2.jsx — Neo-brutalist: 报表, 共同账本, 账单详情, 攒钱目标 (depends on br1.jsx)

// ───────────────── 4 · 报表 ─────────────────
function BrReports() {
  const max = Math.max(...TREND);
  const COLORS = { food: ORANGE, shop: PINK, home: LIME, fun: SKY, transit: YEL };
  return (
    <BrShell tab="chart">
      <BrHead title="报表" right="6月 ▾" accent={YEL} />
      <div style={{ ...box(INK), padding: '16px 18px', marginBottom: 16, color: PAPER }}>
        <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase', opacity: 0.7 }}>本月支出 / TOTAL</div>
        <div style={{ fontFamily: BIG, fontSize: 50, fontWeight: 700, letterSpacing: -1, lineHeight: 1, marginTop: 2 }}>¥3,842.50</div>
        <div style={{ display: 'inline-block', marginTop: 8, background: LIME, color: INK, fontFamily: BODY, fontSize: 12, fontWeight: 900, padding: '2px 8px', textTransform: 'uppercase' }}>较上月 ↓9.2%</div>
      </div>

      {/* daily trend */}
      <SecLabel>每日支出趋势</SecLabel>
      <div style={{ ...box('#fff'), padding: '14px 14px 10px', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 88 }}>
          {TREND.map((v, i) => (
            <div key={i} style={{ flex: 1, height: '100%', display: 'flex', alignItems: 'flex-end' }}>
              <div style={{ width: '100%', height: Math.max(2, v / max * 100) + '%', background: i === TREND.length - 1 ? ORANGE : INK, border: '1.5px solid ' + INK, borderBottom: 'none' }} />
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontFamily: BODY, fontSize: 11, fontWeight: 800 }}>
          <span>6/1</span><span>6/7</span><span>今天</span>
        </div>
      </div>

      {/* category ranked blocks */}
      <SecLabel>分类构成</SecLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {BREAKDOWN.map((b, i) => (
          <div key={b.cat} style={{ ...box(COLORS[b.cat] || LIME, HARD2), padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: BIG, fontSize: 20, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')} {b.label}</span>
              <span style={{ fontFamily: BIG, fontSize: 22, fontWeight: 700 }}>¥{fmt(b.amt, 0)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8 }}>
              <div style={{ flex: 1, height: 10, background: 'rgba(23,20,15,0.15)', border: '2px solid ' + INK, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, width: (b.pct / 0.34 * 100) + '%', maxWidth: '100%', background: INK }} />
              </div>
              <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, width: 60, textAlign: 'right' }}>{Math.round(b.pct * 100)}% · {b.n}笔</span>
            </div>
          </div>
        ))}
      </div>
    </BrShell>
  );
}

// ───────────────── 5 · 共同账本 ─────────────────
function BrShared() {
  return (
    <BrShell tab={null}>
      <BrHead title="共同账本" right="设置" accent={PINK} />
      {/* owed hero */}
      <div style={{ ...box(LIME), padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 900, textTransform: 'uppercase' }}>{SHARED.name} · Ta 该转给你</div>
        <div style={{ fontFamily: BIG, fontSize: 56, fontWeight: 700, letterSpacing: -1, lineHeight: 1, marginTop: 2 }}>¥{fmt(SHARED.owed, 0)}</div>
      </div>

      {/* who paid split */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
        {[['我', SHARED.mePaid, ORANGE], ['Ta', SHARED.taPaid, SKY]].map(([n, p, c]) => (
          <div key={n} style={{ ...box(c, HARD2), flex: 1, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, ...box('#fff', 'none'), borderColor: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontWeight: 700, fontSize: 13 }}>{n}</div>
              <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>已垫付</span>
            </div>
            <div style={{ fontFamily: BIG, fontSize: 24, fontWeight: 700, marginTop: 6 }}>¥{fmt(p, 0)}</div>
          </div>
        ))}
      </div>

      {/* split ratio bar */}
      <div style={{ ...box('#fff', HARD2), padding: '12px 14px', marginBottom: 18 }}>
        <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 900, textTransform: 'uppercase', marginBottom: 8 }}>本月共付 {money(SHARED.month, 0)}</div>
        <div style={{ display: 'flex', height: 16, border: '2px solid ' + INK }}>
          <div style={{ width: (SHARED.mePaid / SHARED.month * 100) + '%', background: ORANGE, borderRight: '2px solid ' + INK }} />
          <div style={{ width: (SHARED.taPaid / SHARED.month * 100) + '%', background: SKY }} />
        </div>
      </div>

      <SecLabel>共同支出明细</SecLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SHARED.entries.map((e) => (
          <div key={e.id} style={{ ...box('#fff', HARD2), padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 14, height: 14, background: CATS[e.cat].color, border: '2px solid ' + INK, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 800 }}>{e.merchant}</div>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, color: '#7a7468' }}>{e.payer} 垫付 · {e.time}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: BIG, fontSize: 18, fontWeight: 700 }}>¥{fmt(e.amt, 0)}</div>
              <div style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 700, color: '#7a7468' }}>我担 {money(e.mine, 0)}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ ...box(ORANGE, HARD2), marginTop: 16, marginBottom: 8, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>发起结算 →</div>
    </BrShell>
  );
}

// ───────────────── 6 · 账单详情 ─────────────────
function BrDetail() {
  const d = DETAIL;
  return (
    <BrShell tab={null}>
      <BrHead title="账单详情" right="编辑" accent={ORANGE} />
      {/* amount hero */}
      <div style={{ ...box(ORANGE), padding: '18px 18px', marginBottom: 16, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: INK, color: PAPER, fontFamily: BODY, fontSize: 12, fontWeight: 900, padding: '3px 10px', textTransform: 'uppercase', marginBottom: 10 }}>{CATS[d.cat].name}</div>
        <div style={{ fontFamily: BIG, fontSize: 60, fontWeight: 700, letterSpacing: -1, lineHeight: 0.95 }}>−¥{fmt(Math.abs(d.amt), 2)}</div>
        <div style={{ fontFamily: BIG, fontSize: 22, fontWeight: 700, marginTop: 8, textTransform: 'uppercase' }}>{d.merchant}</div>
        <div style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 700, marginTop: 2 }}>{d.note}</div>
      </div>

      {/* meta as a hard table */}
      <div style={{ ...box('#fff'), marginBottom: 16 }}>
        {[['日期', d.date], ['时间', d.time], ['账户', d.account], ['方式', d.method]].map(([k, v], i) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 14px', borderBottom: i < 3 ? '2px solid ' + INK : 'none' }}>
            <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 900, textTransform: 'uppercase' }}>{k}</span>
            <span style={{ fontFamily: BIG, fontSize: 16, fontWeight: 600, whiteSpace: 'nowrap' }}>{v}</span>
          </div>
        ))}
      </div>

      {/* split */}
      <SecLabel>与 {d.split.with} 平摊</SecLabel>
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        {[['我', d.split.mine, ORANGE], [d.split.with, d.split.theirs, SKY]].map(([n, v, c]) => (
          <div key={n} style={{ ...box(c, HARD2), flex: 1, padding: '12px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 24, height: 24, ...box('#fff', 'none'), borderColor: INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontWeight: 700, fontSize: 12 }}>{n}</div>
              <span style={{ fontFamily: BODY, fontSize: 11, fontWeight: 900, textTransform: 'uppercase' }}>承担</span>
            </div>
            <div style={{ fontFamily: BIG, fontSize: 22, fontWeight: 700, marginTop: 6 }}>¥{fmt(v, 2)}</div>
          </div>
        ))}
      </div>

      {/* receipt + tags */}
      <SecLabel>凭证 · 标签</SecLabel>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ ...box('#fff', HARD2), width: 86, height: 90, flexShrink: 0, padding: 0, overflow: 'hidden' }}>
          <Placeholder label="小票照" h={86} radius={0} dark={false} style={{ border: 'none' }} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start' }}>
          {d.tags.map((t) => (
            <span key={t} style={{ ...box(YEL, 'none'), borderColor: INK, fontFamily: BODY, fontSize: 12, fontWeight: 800, padding: '6px 12px' }}>#{t}</span>
          ))}
        </div>
      </div>
    </BrShell>
  );
}

// ───────────────── 7 · 攒钱目标 ─────────────────
function BrGoal() {
  const pct = GOAL.saved / GOAL.target;
  return (
    <BrShell tab={null}>
      <BrHead title="攒钱目标" right="编辑" accent={LIME} />
      {/* big % hero with chunky bar */}
      <div style={{ ...box(SKY), padding: '18px 18px', marginBottom: 16 }}>
        <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 900, textTransform: 'uppercase' }}>{GOAL.emoji} {GOAL.name}</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
          <span style={{ fontFamily: BIG, fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 0.9 }}>{Math.round(pct * 100)}</span>
          <span style={{ fontFamily: BIG, fontSize: 32, fontWeight: 700 }}>%</span>
        </div>
        {/* segmented chunky bar */}
        <div style={{ display: 'flex', gap: 3, marginTop: 12 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ flex: 1, height: 20, border: '2px solid ' + INK, background: i / 12 < pct ? INK : '#fff' }} />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: BODY, fontSize: 12, fontWeight: 800 }}>
          <span>已存 {money(GOAL.saved, 0)}</span><span>目标 {money(GOAL.target, 0)}</span>
        </div>
      </div>

      <div style={{ ...box(YEL, HARD2), padding: '12px 14px', marginBottom: 18, fontFamily: BODY, fontSize: 13, fontWeight: 700, lineHeight: 1.4 }}>
        每月定存 <b>{money(GOAL.monthly, 0)}</b> → 预计 <b>{GOAL.etaMonths} 个月</b>后达成 · 还差 {money(GOAL.target - GOAL.saved, 0)} ✈️
      </div>

      <SecLabel>存入记录</SecLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {GOAL.deposits.map((dp, i) => (
          <div key={i} style={{ ...box('#fff', HARD2), padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 26, height: 26, background: LIME, border: '2px solid ' + INK, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{GOAL.deposits.length - i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 800 }}>{dp.note}</div>
              <div style={{ fontFamily: BODY, fontSize: 11, fontWeight: 600, color: '#7a7468' }}>{dp.d}</div>
            </div>
            <div style={{ fontFamily: BIG, fontSize: 19, fontWeight: 700, color: 'oklch(0.55 0.16 150)' }}>+{fmt(dp.amt, 0)}</div>
          </div>
        ))}
      </div>
      <div style={{ ...box(LIME, HARD2), marginTop: 16, marginBottom: 8, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: BIG, fontSize: 22, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>+ 存入一笔</div>
    </BrShell>
  );
}

Object.assign(window, { BrReports, BrShared, BrDetail, BrGoal });
