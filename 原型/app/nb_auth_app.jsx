// nb_auth_app.jsx — App 端登录注册: 欢迎, 邮箱注册, 邮箱登录, 验证码
// depends on nb1.jsx (CN, CN2, HN, PF, NINK, RED, BLUE, GRN, LINES, Tape, Doodle)

// shared paper wrapper without bottom tab bar
function AuthPaper({ children, posY = '64px' }) {
  return (
    <div style={{ height: '100%', background: '#efe3cc', position: 'relative', overflow: 'hidden', color: NINK }}>
      <div style={{ height: '100%', overflowY: 'auto', padding: '0 0 28px' }}>
        <div style={{ minHeight: 'calc(100% - 0px)', background: '#fcf8ef', backgroundImage: LINES, backgroundPositionY: posY, margin: '44px 12px 0', borderRadius: 4, position: 'relative', boxShadow: '0 12px 32px -14px rgba(80,60,30,0.45)', paddingBottom: 28, minHeight: 786 }}>
          <div style={{ position: 'absolute', left: 32, top: 0, bottom: 0, width: 1.5, background: 'oklch(0.7 0.16 25 / 0.35)' }} />
          {children}
        </div>
      </div>
    </div>
  );
}

// brand mark: wobbly coin with ¥
function Brand({ size = 64, big }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: size, height: size, border: '2.5px solid ' + NINK, borderRadius: '50% 47% 53% 50% / 50% 50% 50% 50%', background: 'oklch(0.88 0.16 92)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'rotate(-5deg)', boxShadow: '2px 3px 0 rgba(67,64,58,0.2)', flexShrink: 0 }}>
        <span style={{ fontFamily: HN, fontSize: size * 0.55, fontWeight: 700, color: RED }}>¥</span>
      </div>
      {big && <span style={{ fontFamily: CN, fontSize: 44, color: NINK, lineHeight: 1 }}>Pouchie</span>}
    </div>
  );
}

// social auth button (Apple / Google)
function AuthBtn({ kind, label }) {
  const apple = kind === 'apple';
  return (
    <div style={{ height: 52, border: '2px solid ' + NINK, borderRadius: '14px 12px 15px 12px', background: apple ? NINK : '#fff',
      boxShadow: '2px 2px 0 rgba(67,64,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
      {apple ? (
        <svg width="19" height="19" viewBox="0 0 24 24" fill="#fff"><path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.49-.12-1.03.42-2.18 1.05-2.87.74-.81 2.05-1.42 3.114-1.7zM18.96 9.16c-1.74-.1-3.21.99-4.04.99-.83 0-2.1-.94-3.46-.91-1.78.03-3.42 1.03-4.34 2.62-1.85 3.21-.48 7.96 1.32 10.57.87 1.27 1.91 2.7 3.27 2.65 1.31-.05 1.81-.85 3.39-.85 1.58 0 2.03.85 3.42.82 1.41-.03 2.31-1.3 3.18-2.58.5-.74.69-1.12 1.08-1.96-2.84-1.08-3.29-5.12-.48-6.67-.86-1.08-2.07-1.7-3.21-1.74z"/></svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
      )}
      <span style={{ fontFamily: PF, fontSize: 15, fontWeight: 600, color: apple ? '#fff' : NINK }}>{label}</span>
    </div>
  );
}

// labelled hand-drawn field
function Field({ label, value, placeholder, icon, secure, focus }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ fontFamily: CN2, fontSize: 17, color: '#8a8270', marginBottom: 6 }}>{label}</div>
      <div style={{ height: 50, border: focus ? '2.5px solid ' + RED : '2px solid rgba(67,64,58,0.3)', borderRadius: '13px 11px 14px 12px', background: '#fffdf7',
        display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px' }}>
        {icon && <span style={{ fontSize: 17 }}>{icon}</span>}
        <span style={{ flex: 1, fontFamily: value ? HN : PF, fontSize: value ? 22 : 14, fontWeight: value ? 700 : 400, color: value ? NINK : '#b3a98f' }}>{secure && value ? '••••••••' : (value || placeholder)}</span>
        {focus && <span style={{ width: 2.5, height: 24, background: RED }} />}
      </div>
    </div>
  );
}

// ───────────────── 1 · 欢迎页 ─────────────────
function AuAppWelcome() {
  return (
    <AuthPaper posY="999px">
      <Tape w={104} style={{ top: -11, left: 50, transform: 'rotate(-4deg)' }} />
      <div style={{ padding: '40px 30px 0 44px', display: 'flex', flexDirection: 'column', minHeight: 760 }}>
        <Brand size={66} />
        <div style={{ fontFamily: CN, fontSize: 46, color: NINK, marginTop: 22, lineHeight: 1.05 }}>记账，<br/>也可以很温柔</div>
        <div style={{ fontFamily: CN2, fontSize: 20, color: BLUE, marginTop: 14 }}>每一笔，都是好好生活的样子 ✦</div>

        {/* doodle illustration sticky notes */}
        <div style={{ position: 'relative', height: 150, marginTop: 24 }}>
          <div style={{ position: 'absolute', left: 4, top: 10, background: 'oklch(0.92 0.08 130)', padding: '10px 14px', transform: 'rotate(-4deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)', fontFamily: CN2, fontSize: 17, whiteSpace: 'nowrap' }}>☕ 拿铁 ¥38</div>
          <div style={{ position: 'absolute', right: 8, top: 0, background: 'oklch(0.92 0.07 350)', padding: '10px 14px', transform: 'rotate(3deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)', fontFamily: CN2, fontSize: 17, whiteSpace: 'nowrap' }}>🏝️ 冲绳基金 62%</div>
          <div style={{ position: 'absolute', left: 30, bottom: 0, background: 'oklch(0.9 0.1 200)', padding: '10px 14px', transform: 'rotate(2deg)', boxShadow: '0 4px 10px -4px rgba(0,0,0,0.2)', fontFamily: CN2, fontSize: 17, whiteSpace: 'nowrap' }}>💑 和 Ta 一起记</div>
        </div>

        <div style={{ flex: 1 }} />
        {/* auth options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20, paddingRight: 0 }}>
          <AuthBtn kind="apple" label="使用 Apple 账号继续" />
          <AuthBtn kind="google" label="使用 Google 账号继续" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(67,64,58,0.3)' }} />
            <span style={{ fontFamily: CN2, fontSize: 16, color: '#a89e88' }}>或</span>
            <div style={{ flex: 1, borderTop: '1.5px dashed rgba(67,64,58,0.3)' }} />
          </div>
          <div style={{ height: 52, border: '2px solid ' + RED, borderRadius: '14px 12px 15px 12px', background: RED, color: '#fff', boxShadow: '2px 2px 0 rgba(67,64,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22 }}>用邮箱注册</div>
          <div style={{ textAlign: 'center', fontFamily: CN2, fontSize: 17, color: '#8a8270', marginTop: 4 }}>已经有账号啦？<span style={{ color: BLUE }}>去登录 →</span></div>
        </div>
      </div>
    </AuthPaper>
  );
}

// ───────────────── 2 · 邮箱注册 ─────────────────
function AuAppRegister() {
  return (
    <AuthPaper posY="999px">
      <div style={{ padding: '30px 30px 0 44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span style={{ fontFamily: HN, fontSize: 30, lineHeight: 1 }}>←</span>
          <span style={{ fontFamily: CN, fontSize: 30, whiteSpace: 'nowrap' }}>注册</span>
        </div>
        <div style={{ fontFamily: CN, fontSize: 34, lineHeight: 1.1 }}>创建你的小账本 🐷</div>
        <div style={{ fontFamily: CN2, fontSize: 18, color: '#8a8270', marginTop: 6, marginBottom: 22 }}>三步就好，马上开始记录～</div>

        <Field label="昵称" value="林一" icon="✍️" />
        <Field label="邮箱" value="lin@email.com" icon="✉️" />
        <Field label="设置密码" value="lin12345" icon="🔒" secure focus />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 6, marginBottom: 18 }}>
          <div style={{ width: 20, height: 20, border: '2px solid ' + NINK, borderRadius: 5, background: GRN, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
            <Icon d="M4 12l5 5L20 6" size={14} sw={3} stroke="#fff" />
          </div>
          <span style={{ fontFamily: CN2, fontSize: 16, color: '#8a8270', lineHeight: 1.3 }}>我已阅读并同意 <span style={{ color: BLUE }}>《用户协议》</span> 和 <span style={{ color: BLUE }}>《隐私政策》</span></span>
        </div>

        <div style={{ height: 52, border: '2px solid ' + RED, borderRadius: '14px 12px 15px 12px', background: RED, color: '#fff', boxShadow: '2px 2px 0 rgba(67,64,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22 }}>注册，开启账本 ✦</div>
        <div style={{ textAlign: 'center', fontFamily: CN2, fontSize: 17, color: '#8a8270', marginTop: 16 }}>已经有账号啦？<span style={{ color: BLUE }}>去登录 →</span></div>
      </div>
    </AuthPaper>
  );
}

// ───────────────── 3 · 邮箱登录 ─────────────────
function AuAppLogin() {
  return (
    <AuthPaper posY="999px">
      <div style={{ padding: '30px 30px 0 44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <span style={{ fontFamily: HN, fontSize: 30, lineHeight: 1 }}>←</span>
          <span style={{ fontFamily: CN, fontSize: 30, whiteSpace: 'nowrap' }}>登录</span>
        </div>
        <Brand size={58} />
        <div style={{ fontFamily: CN, fontSize: 40, marginTop: 18 }}>欢迎回来 👋</div>
        <div style={{ fontFamily: CN2, fontSize: 18, color: '#8a8270', marginTop: 4, marginBottom: 26 }}>你的账本一直在等你呢</div>

        <Field label="邮箱" value="lin@email.com" icon="✉️" />
        <Field label="密码" value="lin12345" icon="🔒" secure focus />
        <div style={{ textAlign: 'right', fontFamily: CN2, fontSize: 16, color: BLUE, marginTop: -6, marginBottom: 22 }}>忘记密码？</div>

        <div style={{ height: 52, border: '2px solid ' + RED, borderRadius: '14px 12px 15px 12px', background: RED, color: '#fff', boxShadow: '2px 2px 0 rgba(67,64,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22 }}>登录</div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, borderTop: '1.5px dashed rgba(67,64,58,0.3)' }} />
          <span style={{ fontFamily: CN2, fontSize: 16, color: '#a89e88' }}>或用第三方账号</span>
          <div style={{ flex: 1, borderTop: '1.5px dashed rgba(67,64,58,0.3)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1 }}><AuthBtn kind="apple" label="Apple" /></div>
          <div style={{ flex: 1 }}><AuthBtn kind="google" label="Google" /></div>
        </div>
      </div>
    </AuthPaper>
  );
}

// ───────────────── 4 · 验证码 ─────────────────
function AuAppVerify() {
  const code = ['5', '2', '8', '3', '', ''];
  return (
    <AuthPaper posY="999px">
      <div style={{ padding: '30px 30px 0 44px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 30 }}>
          <span style={{ fontFamily: HN, fontSize: 30, lineHeight: 1 }}>←</span>
          <span style={{ fontFamily: CN, fontSize: 30, whiteSpace: 'nowrap' }}>验证一下</span>
        </div>
        <div style={{ fontFamily: CN, fontSize: 38, lineHeight: 1.1 }}>确认是你本人 ✓</div>
        <div style={{ fontFamily: CN2, fontSize: 18, color: '#8a8270', marginTop: 10, lineHeight: 1.4 }}>验证码已发送至<br/><span style={{ color: NINK }}>lin@email.com</span></div>

        {/* 6 digit boxes */}
        <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
          {code.map((d, i) => (
            <div key={i} style={{ flex: 1, aspectRatio: '1 / 1.15', border: (i === 4 ? '2.5px solid ' + RED : '2px solid rgba(67,64,58,0.3)'), borderRadius: '12px 10px 13px 11px', background: '#fffdf7', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontFamily: HN, fontSize: 38, fontWeight: 700, color: NINK }}>{d}</span>
              {i === 4 && <span style={{ position: 'absolute', width: 2.5, height: 30, background: RED }} />}
            </div>
          ))}
        </div>

        <div style={{ fontFamily: CN2, fontSize: 17, color: '#8a8270', marginTop: 26, textAlign: 'center' }}>没收到？<span style={{ color: '#b3a98f' }}>重新发送 (45s)</span></div>

        {/* little doodle envelope */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30 }}>
          <div style={{ fontSize: 56, transform: 'rotate(-6deg)' }}>📬</div>
        </div>

        <div style={{ position: 'absolute', left: 44, right: 30, bottom: 34 }}>
          <div style={{ height: 52, border: '2px solid ' + GRN, borderRadius: '14px 12px 15px 12px', background: GRN, color: '#fff', boxShadow: '2px 2px 0 rgba(67,64,58,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: CN, fontSize: 22 }}>确认，进入账本 →</div>
        </div>
      </div>
    </AuthPaper>
  );
}

Object.assign(window, { AuthPaper, Brand, AuthBtn, Field, AuAppWelcome, AuAppRegister, AuAppLogin, AuAppVerify });
