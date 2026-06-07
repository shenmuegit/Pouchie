// quickadd.jsx — fast-entry sheet (核心：几秒一笔). Slides up inside the device.
// Props: open, onClose, onSave({amt,cat}), accent, rounded (bool for cozy theme)

function QuickAdd({ open, onClose, onSave, accent = T.accent, rounded = false }) {
  const [amt, setAmt] = React.useState('0');
  const [cat, setCat] = React.useState('food');
  const [note, setNote] = React.useState('');

  React.useEffect(() => { if (open) { setAmt('0'); setCat('food'); setNote(''); } }, [open]);

  const press = (k) => {
    setAmt((a) => {
      if (k === 'del') return a.length <= 1 ? '0' : a.slice(0, -1);
      if (k === '.') return a.includes('.') ? a : a + '.';
      if (a === '0') return k;
      if (a.includes('.') && a.split('.')[1].length >= 2) return a;
      return (a + k).slice(0, 9);
    });
  };

  const cats = ['food', 'transit', 'shop', 'home', 'fun', 'other'];
  const r = rounded ? 22 : 16;
  const num = parseFloat(amt) || 0;

  const keys = ['1','2','3','4','5','6','7','8','9','.','0','del'];

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 80, pointerEvents: open ? 'auto' : 'none',
    }}>
      {/* scrim */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: 0, background: 'rgba(30,24,16,0.34)',
        backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
        opacity: open ? 1 : 0, transition: 'opacity .28s ease',
      }} />
      {/* sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: T.card, borderTopLeftRadius: 30, borderTopRightRadius: 30,
        boxShadow: '0 -10px 40px rgba(30,20,10,0.18)',
        transform: open ? 'translateY(0)' : 'translateY(102%)',
        transition: 'transform .36s cubic-bezier(.22,.9,.32,1)',
        paddingBottom: 30, overflow: 'hidden',
      }}>
        {/* grabber */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
          <div style={{ width: 40, height: 5, borderRadius: 3, background: 'rgba(43,38,32,0.16)' }} />
        </div>

        {/* amount display */}
        <div style={{ padding: '6px 26px 14px', textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: T.ink3, fontWeight: 600, letterSpacing: 0.5 }}>记一笔支出</div>
          <div style={{
            marginTop: 6, fontSize: 52, fontWeight: 700, color: T.ink,
            fontVariantNumeric: 'tabular-nums', letterSpacing: -1,
            display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 26, color: T.ink3, fontWeight: 600 }}>¥</span>
            <span style={{ color: num > 0 ? T.ink : T.ink3 }}>{amt}</span>
          </div>
        </div>

        {/* category chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '0 22px 16px' }}>
          {cats.map((c) => {
            const on = c === cat;
            return (
              <button key={c} onClick={() => setCat(c)} style={{
                flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 7,
                padding: '8px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                background: on ? CATS[c].color : CATS[c].soft,
                color: on ? '#fff' : T.ink, fontSize: 14, fontWeight: 600,
                transition: 'all .15s', fontFamily: 'inherit',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 4,
                  background: on ? '#fff' : CATS[c].color,
                }} />
                {CATS[c].name}
              </button>
            );
          })}
        </div>

        {/* keypad */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1,
          padding: '0 22px', background: 'transparent',
        }}>
          {keys.map((k) => (
            <button key={k} onClick={() => press(k)} style={{
              height: 56, border: 'none', background: 'transparent', cursor: 'pointer',
              fontSize: k === 'del' ? 20 : 26, fontWeight: 600, color: T.ink,
              fontFamily: 'inherit', borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background .12s',
            }}
              onMouseDown={(e) => e.currentTarget.style.background = T.cream2}
              onMouseUp={(e) => e.currentTarget.style.background = 'transparent'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              {k === 'del'
                ? <Icon d="M20 5H8.5L2 12l6.5 7H20a1 1 0 001-1V6a1 1 0 00-1-1zM16 9l-5 6M11 9l5 6" size={22} sw={1.6} />
                : k}
            </button>
          ))}
        </div>

        {/* save */}
        <div style={{ padding: '14px 22px 0' }}>
          <button onClick={() => { if (num > 0) onSave({ amt: -num, cat }); }} disabled={num <= 0}
            style={{
              width: '100%', height: 54, borderRadius: r, border: 'none',
              background: num > 0 ? accent : 'rgba(43,38,32,0.12)',
              color: num > 0 ? '#fff' : T.ink3, fontSize: 17, fontWeight: 700,
              cursor: num > 0 ? 'pointer' : 'default', fontFamily: 'inherit',
              boxShadow: num > 0 ? '0 8px 22px -8px ' + accent : 'none',
              transition: 'all .18s', letterSpacing: 0.3,
            }}>
            保存 · {CATS[cat].name}{num > 0 ? '  ' + money(num) : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

window.QuickAdd = QuickAdd;
