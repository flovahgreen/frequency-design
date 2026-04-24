// FREQUENCY — 6 screens, Paper Mist aesthetic (Dieter Rams × TE OP-1)
// All UI in grayscale; Signal Green reserved for LIVE; one Amber key per screen MAX.

// ─────────────────────────────────────────────────────────────
// 01 · TUNE IN — half-circle dial + 4-digit entry + LED lock
// ─────────────────────────────────────────────────────────────
function Screen01TuneIn({ digits = ['4','4','7','1'], cursorAt = 4 }) {
  // digits: 4 slots, display as AAA.D (3 int + 1 decimal, e.g. 447.1 MHz)
  // digits fully entered → indicator at 0°, LED locked
  const filled = digits.filter(d => d !== '').length;
  const locked = filled === 4;
  const angle = locked ? 0 : (-90 + (filled/4)*90); // sweep from -90° to 0°
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top label strip */}
      <div style={{ padding:'18px 22px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span className="lbl">{T('tune_top')}</span>
        <span className="lbl">{T('step')}</span>
      </div>

      {/* centered cluster: dial + 4-digit display */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:22 }}>

      {/* DIAL */}
      <div style={{ padding:'0 22px 0', position:'relative' }}>
        <div style={{
          position:'relative', height:200, background:'var(--mist-1)',
          borderRadius:8,
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1.5px 0 rgba(0,0,0,.05), 0 1px 0 var(--mist-3)',
          padding:'18px 18px 0', overflow:'hidden',
        }}>
          {/* tick marks */}
          <svg viewBox="0 0 300 170" width="100%" height="170" style={{ display:'block' }}>
            {/* outer arc */}
            <path d="M 20,150 A 130,130 0 0 1 280,150" fill="none" stroke="var(--ink-15)" strokeWidth="1"/>
            {/* ticks */}
            {Array.from({length:21}).map((_,i)=>{
              const t = i/20;
              const a = Math.PI * (1 - t); // pi..0
              const cx = 150 + Math.cos(a)*130;
              const cy = 150 - Math.sin(a)*130;
              const cx2 = 150 + Math.cos(a)*(i%5===0?116:122);
              const cy2 = 150 - Math.sin(a)*(i%5===0?116:122);
              return <line key={i} x1={cx} y1={cy} x2={cx2} y2={cy2} stroke="var(--ink-55)" strokeWidth={i%5===0?1.4:.8}/>;
            })}
            {/* center indicator */}
            {(() => {
              const a = Math.PI * (1 - (angle+90)/180);
              const x2 = 150 + Math.cos(a)*128;
              const y2 = 150 - Math.sin(a)*128;
              return <line x1="150" y1="150" x2={x2} y2={y2}
                stroke={locked?'var(--signal)':'var(--ink)'} strokeWidth={locked?2.5:1.5} strokeLinecap="round"/>;
            })()}
            {/* hub */}
            <circle cx="150" cy="150" r="7" fill="var(--graphite)"/>
            <circle cx="150" cy="150" r="2.5" fill={locked?'var(--signal)':'var(--mist-3)'}/>
            {/* labels */}
            <text x="20" y="165" fontFamily="var(--mono)" fontSize="8" fill="var(--ink-55)" letterSpacing="1.5">0000</text>
            <text x="138" y="28" fontFamily="var(--mono)" fontSize="8" fill="var(--ink-55)" letterSpacing="1.5">4500</text>
            <text x="262" y="165" fontFamily="var(--mono)" fontSize="8" fill="var(--ink-55)" letterSpacing="1.5">9999</text>
          </svg>

          {/* LED lock row */}
          <div style={{ position:'absolute', left:18, right:18, bottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:8, height:8, borderRadius:'50%',
                background: locked ? 'var(--signal)' : 'var(--mist-3)',
                boxShadow: locked ? '0 0 6px rgba(25,122,62,.6)' : 'inset 0 1px 1px rgba(0,0,0,.2)',
                animation: locked ? 'breathe 1.8s ease-in-out infinite' : 'none',
              }}/>
              <span className="lbl" style={{ color: locked?'var(--signal)':'var(--ink-35)' }}>{locked?T('locked'):T('scanning')}</span>
            </div>
            <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)', letterSpacing:'.16em' }}>±0.00</span>
          </div>
        </div>
      </div>

      {/* 4-digit display — format as NNN.N MHz */}
      <div style={{ padding:'0 22px', display:'flex', justifyContent:'center', gap:8, alignItems:'center' }}>
        {digits.slice(0,3).map((d,i)=>(
          <div key={i} className="well" style={{
            width:56, height:76,
            display:'grid', placeItems:'center',
            fontFamily:'var(--mono)', fontSize:42, fontWeight:500, color:'var(--ink)',
            fontVariantNumeric:'tabular-nums', position:'relative',
          }}>
            {d || <span style={{ color:'var(--ink-15)' }}>0</span>}
            {cursorAt === i && !d && <span className="crt-cursor" style={{ position:'absolute' }}/>}
          </div>
        ))}
        <span style={{ fontFamily:'var(--mono)', fontSize:36, fontWeight:600, color:'var(--ink-35)', lineHeight:1, alignSelf:'flex-end', paddingBottom:10 }}>.</span>
        <div className="well" style={{
          width:56, height:76,
          display:'grid', placeItems:'center',
          fontFamily:'var(--mono)', fontSize:42, fontWeight:500, color:'var(--ink)',
          fontVariantNumeric:'tabular-nums', position:'relative',
        }}>
          {digits[3] || <span style={{ color:'var(--ink-15)' }}>0</span>}
          {cursorAt === 3 && !digits[3] && <span className="crt-cursor" style={{ position:'absolute' }}/>}
        </div>
        <span style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.2em', color:'var(--ink-55)', marginLeft:4, alignSelf:'flex-end', paddingBottom:16 }}>MHZ</span>
      </div>

      </div>{/* /centered cluster */}

      {/* keypad — pinned at bottom */}
      <div style={{ padding:'14px 22px 28px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:8, flexShrink:0 }}>
        {['1','2','3','4','5','6','7','8','9','⌫','0','↵'].map((k,i)=>{
          const isEnter = k === '↵';
          const isBack = k === '⌫';
          return (
            <button key={i} className={`cap ${isEnter?'cap-amber':''} ${isBack?'cap-graphite':''}`}
              style={{
                border:'none', height:46,
                fontFamily:'var(--mono)', fontSize: isEnter||isBack?14:18,
                fontWeight:500, letterSpacing:'.04em',
                cursor:'pointer',
              }}>{k}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 02 · CHANNEL FEED — mosaic grid + round swipe
// ─────────────────────────────────────────────────────────────
function Mosaic({ n = 7 }) {
  // Layout: 1→1x1; 2→2x1; 3,4→2x2; 5,6→3x2; 7,8,9→3x3
  let cols = 3, rows = 3;
  if (n === 1) { cols = 1; rows = 1; }
  else if (n === 2) { cols = 2; rows = 1; }
  else if (n <= 4) { cols = 2; rows = 2; }
  else if (n <= 6) { cols = 3; rows = 2; }
  const total = cols * rows;
  const members = ['YOU','KODAK','VELVIA','POLAROID','EKTA','MINT','SEPIA','LAVENDER','BURNT'];
  return (
    <div style={{
      display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`, gridTemplateRows:`repeat(${rows}, 1fr)`,
      gap:3, width:'100%', aspectRatio: '3/4',
      background:'var(--mist-3)', padding:3,
    }}>
      {Array.from({ length: total }).map((_,i) => {
        const filled = i < n;
        const who = members[i];
        return (
          <div key={i} style={{ position:'relative', background: filled ? undefined : 'var(--mist-1)' }}>
            {filled ? (
              <div className="film-stripe" style={{
                position:'absolute', inset:0,
                display:'grid', placeItems:'end stretch', padding:6,
              }}>
                <Chip who={who} style={{ fontSize:8.5, padding:'2px 4px', background:'rgba(242,241,238,.88)' }}/>
              </div>
            ) : (
              <div className="slot-empty" style={{ position:'absolute', inset:0 }}/>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Screen02Feed() {
  const round = 8;
  const totalRounds = 12;
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      <ScreenHeader channel="4471" timer="01:47:33" members={7}/>

      {/* round indicator strip */}
      <div style={{ padding:'12px 18px 8px', display:'flex', alignItems:'center', gap:10 }}>
        <span className="lbl">{T('feed_round')}</span>
        <div style={{ flex:1, display:'flex', gap:3 }}>
          {Array.from({length: totalRounds}).map((_,i)=>(
            <div key={i} style={{
              flex:1, height:4,
              background: i < round-1 ? 'var(--mist-3)'
                         : i === round-1 ? 'var(--ink)'
                         : 'var(--mist-2)',
            }}/>
          ))}
        </div>
        <span className="mono" style={{ fontSize:11, letterSpacing:'.08em', fontWeight:500 }}>{round}/{totalRounds}</span>
      </div>

      {/* scroll area — mosaic + meta + member strip */}
      <div className="no-scrollbar" style={{ flex:1, minHeight:0, overflowY:'auto', padding:'18px 18px 16px', display:'flex', flexDirection:'column', gap:14 }}>
        <div style={{ position:'relative' }}>
          <Mosaic n={7}/>
          {/* peek next round */}
          <div style={{
            position:'absolute', right:-26, top:18, bottom:18, width:20,
            background:'var(--mist-2)', borderLeft:'1px solid var(--mist-3)',
          }}/>
        </div>

        {/* meta row */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <span className="lbl">Round 08 · 14:00</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <span className="signal-dot"/>
            <span className="lbl" style={{ color:'var(--signal)' }}>{T('feed_live')}</span>
          </div>
        </div>

        {/* member strip */}
        <div className="no-scrollbar" style={{ display:'flex', gap:6, overflowX:'auto', paddingBottom:4, flexShrink:0 }}>
          {['YOU','KODAK','VELVIA','POLAROID','EKTA','MINT','SEPIA'].map(m=> <Chip key={m} who={m}/>)}
        </div>
      </div>

      <TabBar active="feed"/>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 03 · CAMERA — tap=photo / hold=5s video + caption
// ─────────────────────────────────────────────────────────────
function Screen03Camera({ holding = false }) {
  return (
    <div style={{ flex:1, background:'var(--graphite)', display:'flex', flexDirection:'column', color:'var(--mist-0)' }}>
      {/* header */}
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="lbl-dk">{T('shoot_title')}</span>
        <span className="lbl-dk">{T('shoot_timer')}</span>
      </div>

      <div style={{ flex:'0 0 40px' }}/>

      {/* viewfinder 3:4 */}
      <div style={{ padding:'0 16px' }}>
        <div style={{
          position:'relative', width:'100%', aspectRatio:'3/4',
          background:'#1a1917',
          boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)',
          overflow:'hidden',
        }}>
          <div className="film-stripe" style={{ position:'absolute', inset:0, opacity:.6 }}/>
          {[[0,0],[1,0],[0,1],[1,1]].map(([x,y],i)=>(
            <div key={i} style={{
              position:'absolute',
              top: y? 'auto':12, bottom: y?12:'auto', left: x?'auto':12, right: x?12:'auto',
              width:14, height:14,
              borderTop: y?'none':'1.5px solid rgba(255,255,255,.6)',
              borderBottom: y?'1.5px solid rgba(255,255,255,.6)':'none',
              borderLeft: x?'none':'1.5px solid rgba(255,255,255,.6)',
              borderRight: x?'1.5px solid rgba(255,255,255,.6)':'none',
            }}/>
          ))}
          <svg width="24" height="24" viewBox="0 0 24 24" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }} fill="none">
            <line x1="12" y1="6" x2="12" y2="10" stroke="rgba(255,255,255,.7)" strokeWidth="1"/>
            <line x1="12" y1="14" x2="12" y2="18" stroke="rgba(255,255,255,.7)" strokeWidth="1"/>
            <line x1="6" y1="12" x2="10" y2="12" stroke="rgba(255,255,255,.7)" strokeWidth="1"/>
            <line x1="14" y1="12" x2="18" y2="12" stroke="rgba(255,255,255,.7)" strokeWidth="1"/>
          </svg>
          <div style={{ position:'absolute', top:14, right:14, background:'rgba(0,0,0,.4)', padding:'3px 6px' }}>
            <span className="mono" style={{ fontSize:9, letterSpacing:'.14em', color:'rgba(255,255,255,.85)' }}>F·08</span>
          </div>
          {holding && (
            <div style={{ position:'absolute', top:14, left:14, display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,.4)', padding:'3px 6px' }}>
              <div style={{ width:6, height:6, background:'var(--amber)', animation:'breathe 1s ease-in-out infinite' }}/>
              <span className="mono" style={{ fontSize:9, letterSpacing:'.14em', color:'#fff' }}>REC 2.3</span>
            </div>
          )}
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex:1 }}/>

      {/* controls — left: last shot (filmstrip peek), center: shutter, right: flip */}
      <div style={{ padding:'14px 22px 22px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Last frame peek */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
          <div style={{
            width:46, height:58,
            background:'#1a1917',
            boxShadow:'inset 0 0 0 1px rgba(255,255,255,.1)',
            position:'relative', overflow:'hidden',
          }}>
            <div className="film-stripe" style={{ position:'absolute', inset:0, opacity:.8 }}/>
          </div>
          <span className="lbl-dk">Last</span>
        </div>

        {/* Shutter */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
          <div style={{
            width:84, height:84, borderRadius:'50%',
            background:'#1a1917',
            boxShadow:'inset 0 0 0 2px #000, 0 0 0 3px rgba(255,255,255,.15)',
            display:'grid', placeItems:'center',
          }}>
            <div style={{
              width:64, height:64, borderRadius:'50%',
              background: holding ? 'var(--amber)' : 'var(--mist-0)',
              boxShadow:'inset 0 -2px 0 rgba(0,0,0,.12), inset 0 2px 0 rgba(255,255,255,.5)',
              transition:'background 150ms',
            }}/>
          </div>
          <span className="lbl-dk">Tap · Photo  ·  Hold · 5s</span>
        </div>

        {/* FLIP camera */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
          <button style={{
            width:46, height:46, border:'none', cursor:'pointer',
            background:'#1a1917',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.3), 0 1px 0 #000',
            display:'grid', placeItems:'center',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 8 A6 6 0 0 1 15 6" stroke="rgba(242,241,238,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M13 4 L15 6 L13 8" stroke="rgba(242,241,238,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M16 12 A6 6 0 0 1 5 14" stroke="rgba(242,241,238,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M7 16 L5 14 L7 12" stroke="rgba(242,241,238,.85)" strokeWidth="1.3" fill="none"/>
            </svg>
          </button>
          <span className="lbl-dk">Flip</span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 03b · CAPTION REVIEW — after capture, review + caption
// ─────────────────────────────────────────────────────────────
function Screen03bReview() {
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar */}
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--mist-3)' }}>
        <button style={{ border:'none', background:'transparent', padding:0, cursor:'pointer', display:'flex', alignItems:'center', gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.4"/></svg>
          <span className="lbl">RETAKE</span>
        </button>
        <span className="lbl" style={{ color:'var(--ink)' }}>REVIEW · F·08</span>
        <span className="lbl">03:09</span>
      </div>

      {/* preview (3:4) */}
      <div style={{ padding:'14px 16px 0' }}>
        <FilmPlaceholder label="Captured · Round 08">
          <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,0,0,.55)', padding:'3px 7px' }}>
            <span className="mono" style={{ fontSize:9, letterSpacing:'.16em', color:'#fff' }}>F·08 · 2026.04.24</span>
          </div>
          <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,.55)', padding:'3px 7px', display:'flex', alignItems:'center', gap:5 }}>
            <div style={{ width:5, height:5, background:'var(--amber)' }}/>
            <span className="mono" style={{ fontSize:9, letterSpacing:'.16em', color:'#fff' }}>PHOTO</span>
          </div>
        </FilmPlaceholder>
      </div>

      {/* caption input with CRT cursor */}
      <div style={{ padding:'16px 16px 0' }}>
        <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
          <span>Caption · Optional</span>
          <span>12 / 40</span>
        </div>
        <div className="well" style={{
          padding:'12px 14px', minHeight:66,
          display:'flex', alignItems:'flex-start',
        }}>
          <span style={{ fontFamily:'var(--sans)', fontSize:15, color:'var(--ink)', lineHeight:1.4 }}>
            Coffee, finally<span className="crt-cursor"/>
          </span>
        </div>
      </div>

      {/* meta row */}
      <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', gap:10 }}>
        <Chip who="YOU"/>
        <span className="lbl">Round 08 · 14:00</span>
        <div style={{ flex:1 }}/>
        <span className="lbl">24H Expires</span>
      </div>

      <div style={{ flex:1 }}/>

      {/* actions */}
      <div style={{ padding:'14px 16px 16px', display:'flex', gap:8 }}>
        <Keycap style={{ flex:1, height:48, fontSize:11 }}>RETAKE</Keycap>
        <Keycap amber style={{ flex:2, height:48, fontSize:11 }}>SEND TO CHANNEL →</Keycap>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 04 · POST DETAIL — 3:4 image + 5 stamps + 40-char comments
// ─────────────────────────────────────────────────────────────
function Screen04Post() {
  const stamps = [
    { k:'heart', label:'♥', count:3, active:true },
    { k:'fire',  label:'🔥', count:1 },
    { k:'haha',  label:'😂', count:2 },
    { k:'bicep', label:'💪', count:0 },
    { k:'eyes',  label:'👀', count:4 },
  ];
  const comments = [
    { who:'KODAK', text:'light is unreal here', time:'2m' },
    { who:'EKTA', text:'drop the cafe name', time:'4m' },
    { who:'MINT', text:'i need this mug', time:'7m' },
  ];
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar */}
      <div style={{
        padding:'12px 16px', display:'flex', alignItems:'center', gap:10,
        borderBottom:'1px solid var(--mist-3)',
      }}>
        <button style={{ border:'none', background:'transparent', padding:0, cursor:'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.4"/></svg>
        </button>
        <Chip who="VELVIA"/>
        <span className="lbl" style={{ color:'var(--ink-35)' }}>· 03m ago</span>
        <div style={{ flex:1 }}/>
        <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>F·08</span>
      </div>

      {/* image */}
      <div style={{ padding:'14px 16px 0' }}>
        <FilmPlaceholder label="Velvia · Round 08"/>
      </div>

      {/* caption */}
      <div style={{ padding:'12px 16px 8px', display:'flex', alignItems:'flex-start', gap:8 }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:14, lineHeight:1.4, color:'var(--ink)' }}>Coffee, finally</span>
        <div style={{ flex:1 }}/>
        <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)' }}>12/40</span>
      </div>

      {/* stamps row */}
      <div style={{ padding:'8px 16px 12px', display:'flex', gap:6 }}>
        {stamps.map(s => (
          <button key={s.k} style={{
            flex:1, border:'none', cursor:'pointer',
            background: s.active ? 'var(--ink)' : 'var(--mist-1)',
            color: s.active ? 'var(--mist-0)' : 'var(--ink)',
            boxShadow: s.active ? 'inset 0 1px 0 rgba(255,255,255,.1)'
              : 'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1.5px 0 rgba(0,0,0,.05), 0 1px 0 var(--mist-3)',
            padding:'7px 0',
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
          }}>
            <span style={{ fontSize:14, lineHeight:1 }}>{s.label}</span>
            <span style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.08em' }}>{s.count||'·'}</span>
          </button>
        ))}
      </div>      {/* comments */}
      <div style={{ flex:1, borderTop:'1px solid var(--mist-3)', padding:'12px 16px 0', overflowY:'auto' }}>
        <div className="lbl" style={{ marginBottom:8 }}>Comments · 3</div>
        {comments.map((c,i)=>(
          <div key={i} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
            <Chip who={c.who}/>
            <span style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink-70)', lineHeight:1.4, flex:1 }}>{c.text}</span>
            <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)' }}>{c.time}</span>
          </div>
        ))}
      </div>

      {/* comment input */}
      <div style={{ padding:'10px 16px', borderTop:'1px solid var(--mist-3)', display:'flex', gap:8, alignItems:'center' }}>
        <div className="well" style={{ flex:1, padding:'8px 10px', display:'flex', alignItems:'center' }}>
          <span style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink)', flex:1 }}>
            <span style={{ color:'var(--ink-35)' }}>Say</span><span className="crt-cursor crt-cursor-sm"/>
          </span>
          <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)' }}>3/40</span>
        </div>
        <Keycap amber style={{ width:44, height:36, fontSize:11 }}>SEND</Keycap>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 05 · OPEN CHANNEL — SETUP → BROADCAST → READY (slot reel)
// ─────────────────────────────────────────────────────────────
function Screen05Open({ phase = 'broadcast' }) {
  // phase: 'setup' | 'broadcast' | 'ready'
  const phases = ['setup', 'broadcast', 'ready'];
  const idx = phases.indexOf(phase);

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'16px 18px 8px', display:'flex', justifyContent:'space-between' }}>
        <span className="lbl">Open Channel</span>
        <span className="lbl">05 / 06</span>
      </div>

      {/* Phase stepper */}
      <div style={{ padding:'0 18px 14px', display:'flex', gap:4 }}>
        {phases.map((p,i)=>(
          <div key={p} style={{ flex:1, display:'flex', flexDirection:'column', gap:4 }}>
            <div style={{ height:3, background: i <= idx ? 'var(--ink)' : 'var(--mist-2)' }}/>
            <span className="lbl" style={{
              color: i === idx ? 'var(--ink)' : 'var(--ink-35)',
              fontSize:9,
            }}>{`0${i+1} · ${p}`}</span>
          </div>
        ))}
      </div>

      {/* Broadcast — slot reel in session */}
      {phase === 'broadcast' && (
        <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{
            background:'var(--graphite)', color:'var(--mist-0)',
            padding:'22px 18px 20px', borderRadius:8,
            boxShadow:'0 1px 0 #000, inset 0 1px 0 rgba(255,255,255,.08)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="signal-dot"/>
              <span className="lbl-dk">Broadcasting · 02:41</span>
            </div>

            {/* reel */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:14 }}>
              {['4','4','7','1'].map((d,i)=>(
                <div key={i} style={{
                  width:56, height:76, background:'#1a1917',
                  boxShadow:'inset 0 0 0 1px rgba(255,255,255,.1), inset 0 -14px 0 rgba(0,0,0,.3), inset 0 14px 0 rgba(0,0,0,.3)',
                  display:'grid', placeItems:'center',
                  fontFamily:'var(--mono)', fontSize:36, fontWeight:500, color:'var(--mist-0)',
                  fontVariantNumeric:'tabular-nums',
                }}>{d}</div>
              ))}
            </div>

            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span className="lbl-dk">Airwaves · Open</span>
              <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'rgba(242,241,238,.4)' }}>ETA 00:12</span>
            </div>
          </div>

          {/* your identity card */}
          <div style={{
            background:'var(--mist-1)', padding:14,
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1.5px 0 rgba(0,0,0,.05), 0 1px 0 var(--mist-3)',
          }}>
            <div className="lbl" style={{ marginBottom:10 }}>You · Host</div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <Chip who="YOU" size="lg"/>
              <span style={{ fontFamily:'var(--sans)', fontSize:14, fontWeight:500 }}>Jay</span>
              <div style={{ flex:1 }}/>
              <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>9999 MHZ</span>
            </div>
          </div>

          {/* waiting list */}
          <div>
            <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <span>Incoming · 2 / 9</span>
              <span>02:41 → 14:00</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
              {['KODAK','EKTA'].map(m => <div key={m} style={{ padding:8, background:'var(--mist-1)', boxShadow:'inset 0 0 0 1px var(--mist-3)' }}>
                <Chip who={m}/>
              </div>)}
              {Array.from({length:7}).map((_,i)=>(
                <div key={i} className="slot-empty" style={{ padding:8, minHeight:34 }}>
                  <span className="lbl" style={{ color:'var(--ink-35)', fontSize:9 }}>Waiting</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', gap:8, paddingBottom:14 }}>
            <Keycap style={{ flex:1, height:44, fontSize:11 }}>CANCEL</Keycap>
            <Keycap amber style={{ flex:2, height:44, fontSize:11 }}>START ROUND 01 →</Keycap>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 06 · MEMBERS + INFO
// ─────────────────────────────────────────────────────────────
function Screen06Members() {
  const roster = [
    { who:'YOU', name:'Jay', host:true, last:'just now' },
    { who:'KODAK', name:'Mira', host:false, last:'2m' },
    { who:'VELVIA', name:'Sung', host:false, last:'5m' },
    { who:'POLAROID', name:'Ada', host:false, last:'12m' },
    { who:'EKTA', name:'Rin', host:false, last:'18m' },
    { who:'MINT', name:'Ben', host:false, last:'24m' },
    { who:'SEPIA', name:'Yuna', host:false, last:'31m' },
  ];
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      <ScreenHeader channel="4471" timer="01:47:33"/>

      {/* Channel info card */}
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{
          background:'var(--mist-1)', padding:'14px 14px 12px',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), inset 0 -1.5px 0 rgba(0,0,0,.05), 0 1px 0 var(--mist-3)',
        }}>
          <div className="lbl" style={{ marginBottom:10 }}>Channel</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:4 }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:28, fontWeight:600, letterSpacing:'.08em' }}>4471</span>
            <span className="mono" style={{ fontSize:10, color:'var(--ink-35)', letterSpacing:'.14em' }}>· MHZ</span>
          </div>
          <div style={{ display:'flex', gap:16, marginTop:8 }}>
            {[
              ['Members', '7 / 9'],
              ['Rounds', '8 / 12'],
              ['Expires', '22H 12M'],
            ].map(([k,v])=>(
              <div key={k}>
                <div className="lbl" style={{ fontSize:8.5 }}>{k}</div>
                <div className="mono" style={{ fontSize:12, letterSpacing:'.08em', fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roster */}
      <div style={{ padding:'16px 16px 0', flex:1, overflowY:'auto' }}>
        <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
          <span>Roster · 7</span>
          <span>Host · You</span>
        </div>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {roster.map((r,i)=>(
            <div key={r.who} style={{
              display:'flex', alignItems:'center', gap:10,
              padding:'10px 0',
              borderTop: i === 0 ? '1px solid var(--mist-3)' : 'none',
              borderBottom:'1px solid var(--mist-3)',
            }}>
              <Chip who={r.who}/>
              <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500 }}>{r.name}</span>
              {r.host && <span style={{
                fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.14em', textTransform:'uppercase',
                padding:'2px 5px', border:'1px solid var(--ink)', color:'var(--ink)',
              }}>HOST</span>}
              <div style={{ flex:1 }}/>
              <span className="mono" style={{ fontSize:9.5, letterSpacing:'.1em', color:'var(--ink-35)' }}>{r.last}</span>
            </div>
          ))}
          {Array.from({length:2}).map((_,i)=>(
            <div key={i} className="slot-empty" style={{
              padding:'10px 12px', borderBottom:'1px solid var(--mist-3)',
              display:'flex', alignItems:'center', gap:10,
            }}>
              <span className="lbl" style={{ color:'var(--ink-35)' }}>Open slot</span>
            </div>
          ))}
        </div>
      </div>

      {/* actions */}
      <div style={{ padding:'14px 16px', borderTop:'1px solid var(--mist-3)', display:'flex', gap:8 }}>
        <Keycap style={{ flex:1, height:40, fontSize:11 }}>INVITE</Keycap>
        <Keycap style={{ flex:1, height:40, fontSize:11 }}>LEAVE</Keycap>
        <Keycap amber style={{ flex:1, height:40, fontSize:11 }}>CLOSE CH</Keycap>
      </div>
    </div>
  );
}

Object.assign(window, {
  Screen01TuneIn, Screen02Feed, Screen03Camera, Screen03bReview, Screen04Post, Screen05Open, Screen06Members, Screen07Settings,
});

// ─────────────────────────────────────────────────────────────
// 07 · APP SETTINGS
// ─────────────────────────────────────────────────────────────
function Screen07Settings() {
  const [, force] = React.useReducer(x => x+1, 0);
  const lang = window.FREQ_LANG || 'en';
  const setLang = (L) => { window.FREQ_LANG = L; try { localStorage.setItem('FREQ_LANG', L); } catch(e){} force(); window.dispatchEvent(new CustomEvent('freq-lang-change')); };
  const Row = ({ label, value, right, first }) => (
    <div style={{
      padding:'13px 16px', display:'flex', alignItems:'center', gap:10,
      borderTop: first ? '1px solid var(--mist-3)' : 'none',
      borderBottom:'1px solid var(--mist-3)',
      background:'var(--mist-0)',
    }}>
      <span className="lbl" style={{ color:'var(--ink-55)', minWidth:110 }}>{label}</span>
      <span style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)', letterSpacing:'.04em', flex:1 }}>{value}</span>
      {right}
    </div>
  );
  const Toggle = ({ on }) => (
    <div style={{
      width:34, height:20,
      background: on ? 'var(--signal)' : 'var(--mist-3)',
      boxShadow:'inset 0 1px 2px rgba(0,0,0,.15)',
      position:'relative', transition:'background 150ms',
    }}>
      <div style={{
        position:'absolute', top:2, left: on ? 16 : 2, width:16, height:16,
        background:'var(--mist-0)',
        boxShadow:'0 1px 2px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.6)',
        transition:'left 150ms',
      }}/>
    </div>
  );
  const Section = ({ title, children }) => (
    <div style={{ marginTop:18 }}>
      <div className="lbl" style={{ padding:'0 16px 8px' }}>{title}</div>
      {children}
    </div>
  );
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar */}
      <div style={{ padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--mist-3)' }}>
        <button style={{ border:'none', background:'transparent', padding:0, cursor:'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.4"/></svg>
        </button>
        <span className="lbl" style={{ color:'var(--ink)' }}>{T('settings')}</span>
        <span style={{ width:16 }}/>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 0 0' }}>
        {/* Profile */}
        <div style={{ padding:'6px 16px 14px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:44, height:44, background:'var(--signal)',
            display:'grid', placeItems:'center',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.2)',
          }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:18, fontWeight:600, color:'var(--mist-0)' }}>J</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:15, fontWeight:600 }}>Jay<span className="crt-cursor crt-cursor-sm crt-cursor-green"/></span>
            <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>{T('profile_tag')}</span>
          </div>
          <div style={{ flex:1 }}/>
          <span className="lbl">{T('edit')}</span>
        </div>

        <Section title={T('language')}>
          <div style={{
            padding:'10px 16px', display:'flex', gap:6, alignItems:'center',
            borderTop:'1px solid var(--mist-3)', borderBottom:'1px solid var(--mist-3)',
            background:'var(--mist-0)',
          }}>
            <span className="lbl" style={{ color:'var(--ink-55)', minWidth:110 }}>{T('language')}</span>
            <div style={{ flex:1 }}/>
            <div style={{ display:'flex', gap:4, padding:3, background:'var(--mist-2)', boxShadow:'inset 0 1px 2px rgba(0,0,0,.08)' }}>
              {[['en', T('eng')], ['kr', T('kor')]].map(([L, lbl]) => (
                <button key={L} onClick={()=>setLang(L)} style={{
                  border:'none', cursor:'pointer',
                  padding:'5px 12px', minWidth:68,
                  fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.12em',
                  background: lang===L ? 'var(--ink)' : 'transparent',
                  color: lang===L ? 'var(--mist-0)' : 'var(--ink-55)',
                  fontWeight: lang===L ? 600 : 500,
                }}>{lbl}</button>
              ))}
            </div>
          </div>
        </Section>

        <Section title={T('signal_sec')}>
          <Row first label={T('default_unit')} value="MHZ · 3+1 DECIMAL"/>
          <Row label={T('auto_tune')} value="Last used · 447.1"/>
          <Row label={T('led_bright')} value="04 / 08" right={
            <div style={{ display:'flex', gap:3 }}>
              {Array.from({length:8}).map((_,i)=>(
                <div key={i} style={{ width:3, height:14, background: i<4 ? 'var(--signal)' : 'var(--mist-3)' }}/>
              ))}
            </div>
          }/>
        </Section>

        <Section title={T('capture')}>
          <Row first label={T('aspect')} value="3 : 4 · Locked"/>
          <Row label={T('shutter_sound')} value="ON" right={<Toggle on/>}/>
          <Row label={T('haptic')} value="MEDIUM" right={<Toggle on/>}/>
          <Row label={T('grid')} value="3 × 3" right={<Toggle/>}/>
        </Section>

        <Section title={T('privacy')}>
          <Row first label={T('auto_vanish')} value="24H · Non-negotiable"/>
          <Row label={T('receipts')} value="OFF" right={<Toggle/>}/>
          <Row label={T('screen_lock')} value="ON" right={<Toggle on/>}/>
        </Section>

        <Section title={T('appearance')}>
          <Row first label="PALETTE" value="Paper Mist" right={
            <div style={{ display:'flex', gap:4 }}>
              <div style={{ width:14, height:14, background:'var(--mist-0)', boxShadow:'0 0 0 1.5px var(--ink)' }}/>
              <div style={{ width:14, height:14, background:'var(--graphite)', boxShadow:'inset 0 0 0 1px rgba(255,255,255,.1)' }}/>
              <div style={{ width:14, height:14, background:'#EDE6D7', boxShadow:'inset 0 0 0 1px var(--mist-3)' }}/>
            </div>
          }/>
          <Row label={T('accent')} value="Amber · #E96A2A" right={<div style={{ width:14, height:14, background:'var(--amber)' }}/>}/>
          <Row label={T('type_scale')} value="STANDARD"/>
        </Section>

        <Section title={T('about')}>
          <Row first label={T('version')} value="0.4 · Rev 2026.04.24"/>
          <Row label={T('build')} value="FREQ-IOS-0421"/>
          <Row label={T('terms')} value={T('view')}/>
        </Section>

        <div style={{ padding:'22px 16px 20px', display:'flex', flexDirection:'column', gap:8 }}>
          <Keycap style={{ width:'100%', height:42, fontSize:11 }}>{T('sign_out')}</Keycap>
          <Keycap amber style={{ width:'100%', height:42, fontSize:11 }}>{T('delete_acct')}</Keycap>
        </div>
      </div>
    </div>
  );
}
