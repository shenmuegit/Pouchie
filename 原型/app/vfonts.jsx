// vfonts.jsx — font stacks shared by all 10 variants
const SERIF = "'Newsreader', Georgia, 'Songti SC', serif";
const SWISS = "'Helvetica Neue', Helvetica, Arial, 'PingFang SC', sans-serif";
const MONO  = "'Space Mono', ui-monospace, Menlo, monospace";
const SANS  = "'PingFang SC', -apple-system, system-ui, sans-serif";
const COND  = "'Oswald', 'PingFang SC', sans-serif";
const HAND  = "'Caveat', 'PingFang SC', cursive";
const DISP  = "'Fraunces', 'Songti SC', serif";
Object.assign(window, { SERIF, SWISS, MONO, SANS, COND, HAND, DISP });
