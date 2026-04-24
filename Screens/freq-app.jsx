// FREQUENCY — Canvas-style presentation of refined screens
// Each artboard holds one screen. i18n via window.FREQ_LANG.

const { useState, useEffect } = React;

// Initialize language from localStorage before first render
try { window.FREQ_LANG = localStorage.getItem('FREQ_LANG') || 'en'; } catch(e){ window.FREQ_LANG = 'en'; }

function Header({ lang, setLang }) {
  return (
    <div style={{
      position:'absolute', top:0, left:0, right:0,
      padding:'22px 36px 0', zIndex:1000,
      display:'flex', alignItems:'baseline', gap:14,
    }}>
      <span style={{
        fontFamily:'var(--mono)', fontSize:12, letterSpacing:'.22em',
        fontWeight:600, color:'var(--ink)', pointerEvents:'none',
      }}>FREQUENCY</span>
      <span style={{
        fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.16em',
        color:'var(--ink-55)', textTransform:'uppercase', pointerEvents:'none',
      }}>Paper Mist · iOS</span>
      <div style={{ flex:1 }}/>

      {/* Language toggle — canvas-level, lets user flip all artboards */}
      <div style={{
        display:'flex', gap:3, padding:3,
        background:'var(--mist-2)',
        boxShadow:'inset 0 1px 2px rgba(0,0,0,.08), 0 1px 0 rgba(255,255,255,.4)',
      }}>
        {[['en','EN'],['kr','한']].map(([L,lbl])=>(
          <button key={L} onClick={()=>setLang(L)} style={{
            border:'none', cursor:'pointer',
            padding:'4px 12px', minWidth:44,
            fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.14em', fontWeight: lang===L?600:500,
            background: lang===L ? 'var(--ink)' : 'transparent',
            color: lang===L ? 'var(--mist-0)' : 'var(--ink-55)',
          }}>{lbl}</button>
        ))}
      </div>

      <span style={{
        fontFamily:'var(--mono)', fontSize:9.5, letterSpacing:'.16em',
        color:'var(--ink-35)', textTransform:'uppercase', pointerEvents:'none', marginLeft:14,
      }}>Rev 0.5 · 2026.04.24</span>
    </div>
  );
}

function App() {
  const [lang, _setLang] = useState(window.FREQ_LANG || 'en');
  const setLang = (L) => {
    window.FREQ_LANG = L;
    try { localStorage.setItem('FREQ_LANG', L); } catch(e){}
    _setLang(L);
    window.dispatchEvent(new CustomEvent('freq-lang-change'));
  };
  useEffect(() => {
    const h = () => _setLang(window.FREQ_LANG || 'en');
    window.addEventListener('freq-lang-change', h);
    return () => window.removeEventListener('freq-lang-change', h);
  }, []);

  const screens = [
    { id: '01', label: '01 · Tune In',             Comp: Screen01TuneIn },
    { id: '02', label: '02 · Channel Feed',        Comp: Screen02Feed },
    { id: '03', label: '03 · Camera',              Comp: Screen03Camera },
    { id: '03b',label: '03b · Review · Caption',   Comp: Screen03bReview },
    { id: '04', label: '04 · Post Detail',         Comp: Screen04Post },
    { id: '05', label: '05 · Open Channel',        Comp: Screen05Open },
    { id: '06', label: '06 · Members · Info',      Comp: Screen06Members },
    { id: '07', label: '07 · Settings',            Comp: Screen07Settings },
  ];

  return (
    <>
      <Header lang={lang} setLang={setLang}/>
      <DesignCanvas>
        <DCSection id="screens" title={lang==='kr' ? '화면' : 'Screens'}>
          {screens.map(s => (
            <DCArtboard key={s.id+lang} id={s.id} label={s.label} width={410} height={888} style={{ background:'var(--mist-0)' }}>
              <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', background:'var(--mist-0)' }}>
                <s.Comp/>
              </div>
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>
    </>
  );
}

const root = ReactDOM.createRoot(document.body.appendChild(document.createElement('div')));
root.render(<App/>);
