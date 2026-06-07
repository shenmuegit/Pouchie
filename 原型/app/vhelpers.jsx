// vhelpers.jsx — shared helpers for the 10 home-screen explorations
const { useState, useEffect } = React;

function useMount(delay = 80) {
  const [m, setM] = useState(false);
  useEffect(() => { const t = setTimeout(() => setM(true), delay); return () => clearTimeout(t); }, []);
  return m;
}

function useLedger() {
  const [txns, setTxns] = useState(seedTxns);
  const [spent, setSpent] = useState(OVERVIEW.spent);
  const save = ({ amt, cat }) => {
    setTxns((p) => [{ id: Date.now(), cat, merchant: CATS[cat].name + ' · 新记录', amt, time: '刚刚', day: '今天' }, ...p]);
    setSpent((s) => s + Math.abs(amt));
  };
  return { txns, spent, save };
}

// striped image placeholder with monospace caption
function Placeholder({ label, h = 120, dark = false, radius = 0, style }) {
  const stripe = dark ? 'rgba(255,255,255,0.06)' : 'rgba(43,38,32,0.05)';
  const base = dark ? 'rgba(255,255,255,0.03)' : 'rgba(43,38,32,0.025)';
  return (
    <div style={{ height: h, borderRadius: radius, position: 'relative', overflow: 'hidden',
      background: `repeating-linear-gradient(135deg, ${base} 0 10px, ${stripe} 10px 20px)`,
      border: '1px solid ' + (dark ? 'rgba(255,255,255,0.1)' : 'rgba(43,38,32,0.1)'),
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <span style={{ fontFamily: "'Space Mono', ui-monospace, monospace", fontSize: 11,
        letterSpacing: 0.5, color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(43,38,32,0.4)',
        background: dark ? 'rgba(20,18,14,0.6)' : 'rgba(246,239,228,0.7)', padding: '3px 8px', borderRadius: 4 }}>{label}</span>
    </div>
  );
}

// generic bottom dock — used by the more conventional variants
function Dock({ accent, dark = false, onAdd, fabRadius = 18 }) {
  const [active, setActive] = useState('home');
  const tabs = [['home', '首页'], ['list', '明细'], ['__add'], ['chart', '报表'], ['user', '我的']];
  const idle = dark ? 'rgba(255,255,255,0.4)' : T.ink3;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 40, paddingBottom: 26, paddingTop: 8,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around',
      background: dark ? 'linear-gradient(to top, rgba(21,19,15,0.96) 70%, transparent)' : 'linear-gradient(to top, rgba(246,239,228,0.96) 70%, transparent)' }}>
      {tabs.map((t) => t[0] === '__add' ? (
        <button key="add" onClick={onAdd} style={{ width: 54, height: 54, borderRadius: fabRadius, border: 'none', cursor: 'pointer',
          background: accent, color: dark ? '#1a1712' : '#fff', marginBottom: 2, transform: 'translateY(-2px)',
          boxShadow: '0 9px 22px -6px ' + accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon d={PATHS.plus} size={27} sw={2.4} />
        </button>
      ) : (
        <button key={t[0]} onClick={() => setActive(t[0])} style={{ background: 'none', border: 'none', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, width: 54, padding: '4px 0',
          color: active === t[0] ? accent : idle }}>
          <Icon d={PATHS[t[0]]} size={22} sw={active === t[0] ? 2.1 : 1.8} />
          <span style={{ fontSize: 10.5, fontWeight: active === t[0] ? 700 : 500 }}>{t[1]}</span>
        </button>
      ))}
    </div>
  );
}

Object.assign(window, { useMount, useLedger, Placeholder, Dock });
