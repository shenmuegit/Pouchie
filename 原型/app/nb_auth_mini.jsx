// nb_auth_mini.jsx — 小程序端: 品牌引导, 微信手机号授权, 登录中
// depends on nb1.jsx + nb_auth_app.jsx (AuthPaper, Brand)
const WXG = '#07c160'; // WeChat green

// mini-program nav bar with capsule (top-right ··· ⊙)
function MiniBar({ title }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 30, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {title && <span style={{ fontFamily: PF, fontSize: 16, fontWeight: 600, color: NINK }}>{title}</span>}
      <div style={{ position: 'absolute', right: 14, top: 7, width: 78, height: 30, border: '1px solid rgba(67,64,58,0.22)', borderRadius: 16, background: 'rgba(255,255,255,0.55)', display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 3 }}>
          {[0,1,2].map((i) => <span key={i} style={{ width: 4, height: 4, borderRadius: 2, background: NINK }} />)}
        </div>
        <div style={{ width: 1, height: 16, background: 'rgba(67,64,58,0.2)' }} />
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: 15, height: 15, borderRadius: 8, border: '1.6px solid ' + NINK, position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 4, borderRadius: 4, border: '1.4px solid ' + NINK }} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────── 5 · 首次欢迎 / 品牌引导 ─────────────────
function AuMiniIntro() {
  const feats = [
    ['⚡', '极速记账', '几秒记一笔，键盘随手就来', 'oklch(0.92 0.08 130)', -2],
    ['💑', '共同账本', '和 Ta 一起记，自动算分摊', 'oklch(0.92 0.07 350)', 1.5],
    ['🏝️', '攒钱目标', '为想要的生活慢慢存', 'oklch(0.9 0.1 200)', -1],
  ];
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <MiniBar title="Pouchie" />
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 28px' }}>
        <div style={{ minHeight: 786, background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '999px', margin: '44px 12px 0', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)' }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          <Tape w={104} style={{ top: -11, left: 50, transform: 'rotate(-4deg)' }} />
          <div style={{ padding: '40px 30px 0 44px', display: 'flex', flexDirection: 'column', minHeight: 746 }}>
            <Brand size={64} big />
            <div style={{ fontFamily: CN2, fontSize: 20, color: BLUE, marginTop: 16 }}>记账，也可以很温柔 ✦</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 30 }}>
              {feats.map(([e, t, d, bg, r]) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 14, background: bg, padding: '14px 16px', transform: `rotate(${r}deg)`, boxShadow: '0 4px 10px -4px rgba(0,0,0,0.18)' }}>
                  <span style={{ fontSize: 30 }}>{e}</span>
                  <div>
                    <div style={{ fontFamily: CN, fontSize: 24, lineHeight: 1 }}>{t}</div>
                    <div style={{ fontFamily: CN2, fontSize: 16, color: '#6f665a', marginTop: 3 }}>{d}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />
            {/* WeChat one-tap login */}
            <div style={{ height: 52, borderRadius: 26, background: WXG, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 28, boxShadow: '0 6px 16px -6px ' + WXG }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M8.5 4C4.36 4 1 6.86 1 10.38c0 1.96 1.06 3.7 2.72 4.88L3 18l2.6-1.36c.74.2 1.52.32 2.32.34-.1-.42-.16-.86-.16-1.3 0-3.34 3.2-5.96 7.06-5.96.26 0 .5.02.74.04C14.78 6.42 11.96 4 8.5 4zm-2.6 3.4c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9zm5.2 0c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"/><path d="M23 15.04c0-2.96-2.86-5.36-6.38-5.36s-6.38 2.4-6.38 5.36 2.86 5.36 6.38 5.36c.72 0 1.42-.1 2.06-.28L20.6 21l-.52-1.66C21.92 18.36 23 16.82 23 15.04zm-8.4-1.1c-.42 0-.76-.34-.76-.76s.34-.76.76-.76.76.34.76.76-.34.76-.76.76zm4.3 0c-.42 0-.76-.34-.76-.76s.34-.76.76-.76.76.34.76.76-.34.76-.76.76z"/></svg>
              <span style={{ fontFamily: PF, fontSize: 16, fontWeight: 600 }}>微信一键登录</span>
            </div>
            <div style={{ textAlign: 'center', fontFamily: PF, fontSize: 11.5, color: '#a89e88', marginTop: 12, lineHeight: 1.5 }}>登录即代表同意 <span style={{ color: BLUE }}>《用户协议》</span> 和 <span style={{ color: BLUE }}>《隐私政策》</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ───────────────── 6 · 微信手机号授权 ─────────────────
function AuMiniPhone() {
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <MiniBar title="Pouchie" />
      {/* dimmed page behind */}
      <div style={{ height: '100%', padding: '0 0 28px', filter: 'brightness(0.97)' }}>
        <div style={{ minHeight: 786, background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '999px', margin: '44px 12px 0', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)' }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          <div style={{ padding: '40px 30px 0 44px', opacity: 0.5 }}>
            <Brand size={60} big />
            <div style={{ fontFamily: CN2, fontSize: 20, color: BLUE, marginTop: 16 }}>记账，也可以很温柔 ✦</div>
          </div>
        </div>
      </div>
      {/* scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(30,24,16,0.4)' }} />
      {/* WeChat system auth sheet */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, background: '#fff', borderTopLeftRadius: 18, borderTopRightRadius: 18, padding: '22px 22px 28px', fontFamily: PF }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 16, borderBottom: '1px solid #eee' }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, border: '2px solid ' + NINK, background: 'oklch(0.88 0.16 92)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: HN, fontSize: 26, fontWeight: 700, color: RED }}>¥</span>
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#1a1a1a' }}>Pouchie 记账</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 2 }}>申请获取并验证你的手机号</div>
          </div>
        </div>

        {/* selected phone */}
        <div style={{ padding: '16px 0 6px' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 10 }}>选择手机号</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 14px', border: '1.5px solid ' + WXG, borderRadius: 10, background: 'rgba(7,193,96,0.04)' }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: WXG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon d="M4 12l5 5L20 6" size={13} sw={3} stroke="#fff" />
            </div>
            <span style={{ flex: 1, fontSize: 16, fontWeight: 600, color: '#1a1a1a', letterSpacing: 0.5 }}>+86 138 **** 6688</span>
            <span style={{ fontSize: 12, color: '#aaa' }}>微信绑定</span>
          </div>
          <div style={{ fontSize: 14, color: WXG, marginTop: 12, fontWeight: 500 }}>使用其他手机号</div>
        </div>

        {/* buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
          <div style={{ height: 48, borderRadius: 8, background: WXG, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 500 }}>允许</div>
          <div style={{ height: 48, borderRadius: 8, background: '#f3f3f3', color: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17 }}>拒绝</div>
        </div>
        <div style={{ textAlign: 'center', fontSize: 11.5, color: '#bbb', marginTop: 14 }}>未注册的手机号将自动创建账号</div>
      </div>
    </div>
  );
}

// ───────────────── 7 · 登录中 / 授权加载态 ─────────────────
function AuMiniLoading() {
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <MiniBar title="" />
      <div style={{ height: '100%', padding: '0 0 28px' }}>
        <div style={{ minHeight: 786, background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: '999px', margin: '44px 12px 0', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />

          {/* hand-drawn spinner: dashed ring rotating + coin */}
          <div style={{ position: 'relative', width: 96, height: 96 }}>
            <svg width="96" height="96" viewBox="0 0 96 96" style={{ animation: 'nbspin 1.4s linear infinite' }}>
              <circle cx="48" cy="48" r="40" fill="none" stroke={WXG} strokeWidth="4" strokeLinecap="round" strokeDasharray="14 12" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: '50% 47% 53% 50%', background: 'oklch(0.88 0.16 92)', border: '2.5px solid ' + NINK, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-5deg)' }}>
                <span style={{ fontFamily: HN, fontSize: 30, fontWeight: 700, color: RED }}>¥</span>
              </div>
            </div>
          </div>

          <div style={{ fontFamily: CN, fontSize: 28, marginTop: 30, whiteSpace: 'nowrap' }}>正在为你翻开账本…</div>
          <div style={{ fontFamily: CN2, fontSize: 18, color: '#8a8270', marginTop: 8 }}>微信授权成功，登录中 ✓</div>

          {/* bouncing dots */}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: 5, background: RED, animation: `nbbounce 1s ease-in-out ${i * 0.16}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WXG, MiniBar, AuMiniIntro, AuMiniPhone, AuMiniLoading });
