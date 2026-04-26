// FREQUENCY — 6 screens, Paper Mist aesthetic (Dieter Rams × TE OP-1)
// All UI in grayscale; Signal Green reserved for LIVE; one Amber key per screen MAX.

// ─────────────────────────────────────────────────────────────
// 01 · TUNE IN — half-circle dial + 4-digit entry + LED lock
// ─────────────────────────────────────────────────────────────
function Screen01TuneIn({ initialDigits = [] }) {
  // 4-digit MHz channel entry (NNN.N) — internal state, real keypad input
  const [digits, setDigits] = React.useState(() => {
    const d = ['','','',''];
    initialDigits.slice(0,4).forEach((v,i) => { d[i] = v; });
    return d;
  });
  const filled = digits.filter(d => d !== '').length;
  const locked = filled === 4;
  const cursorAt = filled; // next empty slot
  const angle = locked ? 0 : (-90 + (filled/4)*90); // sweep from -90° to 0°

  const pressKey = (k) => {
    if (navigator.vibrate) { try { navigator.vibrate(6); } catch(e){} }
    if (k === '⌫') {
      if (filled === 0) return;
      const next = [...digits];
      next[filled - 1] = '';
      setDigits(next);
    } else if (k === '↵') {
      if (locked && window.FREQ_NAV) window.FREQ_NAV('feed');
    } else {
      if (filled >= 4) return;
      const next = [...digits];
      next[filled] = k;
      setDigits(next);
    }
  };
  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top label strip — minimal, safe-area aware */}
      <div style={{ padding:'calc(env(safe-area-inset-top, 0px) + 18px) 22px 0' }}>
        <span style={{
          fontFamily:'var(--mono)', fontSize:14, fontWeight:700,
          letterSpacing:'.2em', textTransform:'uppercase', color:'var(--ink)',
        }}>FREQUENCY</span>
      </div>

      {/* centered cluster: dial + 4-digit display */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', gap:22 }}>

      {/* DIAL */}
      <div style={{ padding:'0 22px 0', position:'relative' }}>
        <div style={{
          position:'relative', height:200, background:'var(--mist-1)',
          borderRadius:18,
          border:'1.5px solid var(--mist-3)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
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
            {/* (range labels 0000/4500/9999 removed — overlapped LED row, redundant with digit display) */}
          </svg>

          {/* LED lock row */}
          <div style={{ position:'absolute', left:18, right:18, bottom:14, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:8, height:8, borderRadius:'50%',
                background: locked ? 'var(--signal)' : 'var(--mist-3)',
                boxShadow: locked ? '0 0 8px rgba(181,255,68,.75)' : 'inset 0 1px 1px rgba(58,51,42,.2)',
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

      {/* keypad — pinned at bottom, thumb-friendly sizing */}
      <div style={{ padding:'14px 22px 8px', display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, flexShrink:0 }}>
        {['1','2','3','4','5','6','7','8','9','⌫','0','↵'].map((k,i)=>{
          const isEnter = k === '↵';
          const isBack = k === '⌫';
          const enabled = isEnter ? locked : (isBack ? filled > 0 : filled < 4);
          return (
            <button key={i}
              className={`cap ${isEnter?'cap-amber':''} ${isBack?'cap-graphite':''}`}
              onClick={() => pressKey(k)}
              disabled={!enabled}
              style={{
                border:'none', height:48,
                fontFamily:'var(--mono)', fontSize: isEnter||isBack?14:18,
                fontWeight:500, letterSpacing:'.04em',
                cursor: enabled ? 'pointer' : 'default',
                opacity: enabled ? 1 : 0.4,
                transition:'opacity 120ms ease-out',
              }}>{k}</button>
          );
        })}
      </div>

      {/* Open new channel — secondary entry */}
      <div style={{ padding:'2px 22px 16px', display:'flex', justifyContent:'center', flexShrink:0 }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('open'); }}
          style={{
            background:'transparent', border:'none', cursor:'pointer',
            fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.18em',
            color:'var(--ink-55)', textTransform:'uppercase', fontWeight:700,
            padding:'8px 12px',
          }}>
          + NEW
        </button>
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
  // YOU의 최신 캡션은 localStorage 에서 (Review SEND 시 저장됨)
  const userCap = (() => {
    try { return localStorage.getItem('FREQ_USER_POST'); } catch(_) { return null; }
  })();
  const isKr = window.FREQ_LANG === 'kr';

  // sample captions per member — YOU만 동적 (없으면 빈 상태)
  const captions = {
    KODAK:    isKr ? '햇살 미쳤다'      : 'light is unreal',
    VELVIA:   isKr ? '여기 카페 어디?'   : 'where is this',
    POLAROID: isKr ? '아침 산책'        : 'morning walk',
    EKTA:     isKr ? '필름 다 썼어'     : 'roll finished',
    MINT:     isKr ? '컵 사고 싶다'     : 'i need this mug',
    SEPIA:    isKr ? '오후 빛'          : 'afternoon light',
    LAVENDER: isKr ? '가을이네'         : 'autumn vibes',
    BURNT:    isKr ? '한 입만'          : 'one bite',
  };
  if (userCap) captions.YOU = userCap;

  const youHasPost = !!userCap;

  return (
    <div style={{
      display:'grid', gridTemplateColumns:`repeat(${cols}, 1fr)`, gridTemplateRows:`repeat(${rows}, 1fr)`,
      gap:6, width:'100%', aspectRatio: '3/4',
    }}>
      {Array.from({ length: total }).map((_,i) => {
        const filled = i < n;
        const who = members[i];
        const cap = captions[who];

        // YOU 셀 빈 상태: 캡션 안 썼으면 사진 없는 슬롯 + Tap to shoot CTA
        if (filled && who === 'YOU' && !youHasPost) {
          return (
            <div key={i}
              onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('camera'); }}
              style={{
                position:'relative',
                cursor:'pointer',
                borderRadius:8, overflow:'hidden',
                background:'var(--mist-1)',
                border:'1.5px dashed var(--mist-4)',
                display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6,
                padding:6,
              }}>
              <Chip who="YOU" style={{ fontSize:8.5, padding:'2px 5px' }}/>
              <span style={{
                fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.08em',
                color:'var(--ink-55)', textTransform:'uppercase', fontWeight:700,
                textAlign:'center', lineHeight:1.3,
              }}>
                {isKr ? '+ 촬영' : '+ Shoot'}
              </span>
            </div>
          );
        }

        const handleClick = () => {
          if (filled && window.FREQ_NAV) {
            // 클릭한 셀의 멤버 정보를 POST detail로 전달
            window.FREQ_POST_TARGET = { who, caption: cap };
            window.FREQ_NAV('post');
          }
        };
        return (
          <div
            key={i}
            onClick={handleClick}
            style={{
              position:'relative',
              background: filled ? undefined : 'var(--mist-1)',
              cursor: filled ? 'pointer' : 'default',
              borderRadius:8, overflow:'hidden',
            }}>
            {filled ? (
              <div className="film-stripe" style={{
                position:'absolute', inset:0,
                display:'flex', flexDirection:'column', justifyContent:'flex-end',
                padding:6, gap:3,
              }}>
                {/* caption above chip — 1 line ellipsis */}
                {cap && (
                  <span style={{
                    fontFamily:'var(--sans)', fontSize:9.5, lineHeight:1.2,
                    color:'#fff',
                    padding:'3px 6px', borderRadius:6,
                    background:'rgba(45,38,32,.55)',
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
                    alignSelf:'flex-start', maxWidth:'100%',
                  }}>{cap}</span>
                )}
                <Chip who={who} style={{ fontSize:8.5, padding:'2px 5px', background:'rgba(240,232,216,.88)', alignSelf:'flex-start' }}/>
              </div>
            ) : (
              <div className="slot-empty" style={{ position:'absolute', inset:0, borderRadius:8 }}/>
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
      <ScreenHeader channel="4471" timer="22h 12m" members={7}/>

      {/* scroll area — mosaic + round strip + meta */}
      <div className="no-scrollbar" style={{ flex:1, minHeight:0, overflowY:'auto', padding:'30px 18px 16px', display:'flex', flexDirection:'column', gap:14 }}>
        <Mosaic n={7}/>

        {/* round indicator strip — moved BELOW mosaic per request */}
        <div style={{ padding:'2px 0 0', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ flex:1, display:'flex', gap:3 }}>
            {Array.from({length: totalRounds}).map((_,i)=>(
              <div key={i} style={{
                flex:1, height:5, borderRadius:3,
                background: i < round-1 ? 'var(--mist-3)'
                           : i === round-1 ? 'var(--ink)'
                           : 'var(--mist-2)',
              }}/>
            ))}
          </div>
          <span className="mono" style={{ fontSize:11, letterSpacing:'.08em', fontWeight:700 }}>{round}/{totalRounds}</span>
        </div>

        {/* meta row — round timer */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'flex-end' }}>
          <span className="lbl">14:00 {(window.FREQ_LANG === 'kr') ? '남음' : 'LEFT'}</span>
        </div>
      </div>
      {/* TabBar는 라우터 레벨에서 fixed로 렌더 */}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 03 · CAMERA — tap=photo / hold=5s video + caption
// ─────────────────────────────────────────────────────────────
function Screen03Camera() {
  // tap = photo (instant), hold ≥300ms = video mode (max 5s)
  const [holding, setHolding] = React.useState(false);
  const [recT, setRecT] = React.useState(0);
  const startRef = React.useRef(0);
  const holdTimerRef = React.useRef(null);
  const recIntervalRef = React.useRef(null);
  const doneRef = React.useRef(false);

  const cleanup = () => {
    clearTimeout(holdTimerRef.current);
    clearInterval(recIntervalRef.current);
    holdTimerRef.current = null;
    recIntervalRef.current = null;
  };
  React.useEffect(() => () => cleanup(), []);

  const goReview = () => { if (window.FREQ_NAV) window.FREQ_NAV('review'); };

  const onPressStart = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (doneRef.current) return;
    startRef.current = Date.now();
    setRecT(0);
    holdTimerRef.current = setTimeout(() => {
      setHolding(true);
      if (navigator.vibrate) { try { navigator.vibrate(12); } catch(_){} }
      recIntervalRef.current = setInterval(() => {
        const t = (Date.now() - startRef.current - 300) / 1000;
        setRecT(t);
        if (t >= 3) {
          doneRef.current = true;
          cleanup();
          setHolding(false);
          goReview();
        }
      }, 50);
    }, 300);
  };

  const onPressEnd = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (doneRef.current) return;
    const dt = Date.now() - startRef.current;
    const wasHolding = holding;
    cleanup();
    if (dt < 300) {
      // tap = photo
      doneRef.current = true;
      if (navigator.vibrate) { try { navigator.vibrate(6); } catch(_){} }
      goReview();
    } else if (wasHolding) {
      // released during hold = stop video early
      doneRef.current = true;
      setHolding(false);
      goReview();
    }
  };

  const pct = Math.min(recT / 3, 1);
  const C = 2 * Math.PI * 38;

  return (
    <div style={{ flex:1, background:'var(--graphite)', display:'flex', flexDirection:'column', color:'var(--mist-0)' }}>
      {/* header — close · title · timer (safe-area aware, graphite extends to notch) */}
      <div style={{ padding:'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px', display:'flex', alignItems:'center', gap:10 }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('feed'); }}
          aria-label="Close camera"
          style={{
            width:28, height:28, padding:0,
            border:'none', background:'transparent', cursor:'pointer',
            display:'grid', placeItems:'center', marginLeft:-6,
            WebkitTapHighlightColor:'transparent',
          }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="2" y1="2" x2="12" y2="12" stroke="rgba(240,232,216,.7)" strokeWidth="1.4" strokeLinecap="round"/>
            <line x1="12" y1="2" x2="2" y2="12" stroke="rgba(240,232,216,.7)" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </button>
        <div style={{ flex:1 }}/>
        <span className="lbl-dk">{T('shoot_timer')}</span>
      </div>

      <div style={{ flex:'0 0 40px' }}/>

      {/* viewfinder 3:4 */}
      <div style={{ padding:'0 16px' }}>
        <div style={{
          position:'relative', width:'100%', aspectRatio:'3/4',
          background:'#241B12',
          borderRadius:14, overflow:'hidden',
          boxShadow:'inset 0 0 0 1px rgba(255,255,255,.06)',
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
          {/* F·08 frame indicator removed — too noisy. REC pill kept (essential during recording) */}
          {holding && (
            <div style={{ position:'absolute', top:14, left:14, display:'flex', alignItems:'center', gap:6, background:'rgba(0,0,0,.45)', padding:'4px 8px', borderRadius:8 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'var(--amber)', animation:'breathe 1s ease-in-out infinite' }}/>
              <span className="mono" style={{ fontSize:10, letterSpacing:'.14em', color:'#fff', fontWeight:700 }}>{recT.toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>

      {/* spacer */}
      <div style={{ flex:1 }}/>

      {/* controls — left: last shot (filmstrip peek), center: shutter, right: flip */}
      <div style={{ padding:'14px 22px calc(env(safe-area-inset-bottom, 0px) + 16px)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Last frame peek */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
          <div style={{
            width:48, height:60,
            background:'#241B12',
            borderRadius:10, overflow:'hidden',
            boxShadow:'inset 0 0 0 1px rgba(255,255,255,.1)',
            position:'relative',
          }}>
            <div className="film-stripe" style={{ position:'absolute', inset:0, opacity:.8 }}/>
          </div>
        </div>

        {/* Shutter — tap = photo, hold = 5s video */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'center' }}>
          <button
            onTouchStart={onPressStart}
            onTouchEnd={onPressEnd}
            onTouchCancel={onPressEnd}
            onMouseDown={onPressStart}
            onMouseUp={onPressEnd}
            onMouseLeave={(e) => { if (holdTimerRef.current || recIntervalRef.current) onPressEnd(e); }}
            style={{
              position:'relative',
              width:84, height:84, borderRadius:'50%',
              background:'#241B12', border:'none', padding:0, cursor:'pointer',
              boxShadow:'inset 0 0 0 2px #000, 0 0 0 3px rgba(255,255,255,.15)',
              display:'grid', placeItems:'center',
              WebkitTapHighlightColor:'transparent', userSelect:'none',
            }}>
            <div style={{
              width:64, height:64, borderRadius:'50%',
              background: holding ? 'var(--amber)' : 'var(--mist-0)',
              boxShadow:'inset 0 -2px 0 rgba(0,0,0,.12), inset 0 2px 0 rgba(255,255,255,.5)',
              transition:'background 150ms',
            }}/>
            {/* progress ring during video hold */}
            {holding && (
              <svg width="84" height="84" style={{ position:'absolute', inset:0, transform:'rotate(-90deg)', pointerEvents:'none' }}>
                <circle cx="42" cy="42" r="38" fill="none"
                  stroke="rgba(255,255,255,.15)" strokeWidth="2.5"/>
                <circle cx="42" cy="42" r="38" fill="none"
                  stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={(1 - pct) * C}
                  style={{ transition:'stroke-dashoffset 50ms linear' }}/>
              </svg>
            )}
          </button>
          {holding && <span className="lbl-dk" style={{ color:'var(--amber)' }}>● REC</span>}
        </div>

        {/* FLIP camera */}
        <div style={{ display:'flex', flexDirection:'column', gap:6, alignItems:'center' }}>
          <button style={{
            width:48, height:48, border:'none', cursor:'pointer',
            background:'#241B12', borderRadius:12,
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.3), 0 1px 2px rgba(0,0,0,.2)',
            display:'grid', placeItems:'center',
            WebkitTapHighlightColor:'transparent',
          }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 8 A6 6 0 0 1 15 6" stroke="rgba(240,232,216,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M13 4 L15 6 L13 8" stroke="rgba(240,232,216,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M16 12 A6 6 0 0 1 5 14" stroke="rgba(240,232,216,.85)" strokeWidth="1.3" fill="none"/>
              <path d="M7 16 L5 14 L7 12" stroke="rgba(240,232,216,.85)" strokeWidth="1.3" fill="none"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 03b · CAPTION REVIEW — after capture, review + caption
// ─────────────────────────────────────────────────────────────
function Screen03bReview() {
  const [caption, setCaption] = React.useState('');
  const onCap = (e) => setCaption(e.target.value.slice(0,40));

  // SEND → 캡션 저장 후 SendTo 화면으로 (방 선택 단계)
  const sendToChannel = () => {
    const cap = caption.trim();
    try {
      if (cap) localStorage.setItem('FREQ_USER_POST', cap);
      else localStorage.removeItem('FREQ_USER_POST');
    } catch(_){}
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch(_){} }
    setCaption('');
    if (window.FREQ_NAV) window.FREQ_NAV('sendto');
  };

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar — back chevron + review title + round timer */}
      <div style={{ padding:'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderBottom:'1px solid var(--mist-3)' }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('camera'); }}
          aria-label="Back to camera"
          style={{
            width:28, height:28, padding:0, marginLeft:-8,
            border:'none', background:'transparent', cursor:'pointer',
            display:'grid', placeItems:'center',
            WebkitTapHighlightColor:'transparent',
          }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.4"/></svg>
        </button>
        <span style={{ fontFamily:'var(--mono)', fontSize:13, fontWeight:700, letterSpacing:'.18em', textTransform:'uppercase', color:'var(--ink)' }}>REVIEW</span>
        <span style={{ width:28 }}/>{/* spacer for symmetry with back chevron */}
      </div>

      {/* preview (3:4) — 사진 + 하단에 캡션 오버레이 */}
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{ position:'relative' }}>
          <FilmPlaceholder label="Captured · Round 08">
            <div style={{ position:'absolute', top:10, left:10, background:'rgba(0,0,0,.55)', padding:'3px 7px', borderRadius:6 }}>
              <span className="mono" style={{ fontSize:9, letterSpacing:'.16em', color:'#fff' }}>F·08 · 2026.04.24</span>
            </div>
            <div style={{ position:'absolute', top:10, right:10, background:'rgba(0,0,0,.55)', padding:'3px 7px', borderRadius:6, display:'flex', alignItems:'center', gap:5 }}>
              <div style={{ width:5, height:5, borderRadius:'50%', background:'var(--amber)' }}/>
              <span className="mono" style={{ fontSize:9, letterSpacing:'.16em', color:'#fff' }}>PHOTO</span>
            </div>
          </FilmPlaceholder>
          {/* caption overlay — 사진 하단에 그라디언트 + 흰색 텍스트 입력 */}
          <div style={{
            position:'absolute', bottom:0, left:0, right:0,
            padding:'30px 16px 14px',
            background:'linear-gradient(180deg, rgba(45,38,32,0) 0%, rgba(45,38,32,.6) 50%, rgba(45,38,32,.78) 100%)',
            borderRadius:'0 0 12px 12px',
            pointerEvents:'auto',
          }}>
            <textarea
              autoFocus
              className="input-on-dark"
              value={caption}
              onChange={onCap}
              maxLength={40}
              rows={1}
              placeholder="comment"
              style={{
                width:'100%',
                border:'none', outline:'none', background:'transparent', resize:'none',
                fontFamily:'var(--sans)', fontSize:15, fontWeight:500,
                color:'#FFFFFF', textAlign:'center',
                caretColor:'var(--amber)',
                lineHeight:1.4,
                padding:0,
                textShadow:'0 1px 2px rgba(0,0,0,.4)',
              }}
            />
          </div>
        </div>
      </div>

      {/* meta row — chip + char counter + round timer */}
      <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', gap:10 }}>
        <Chip who="YOU"/>
        <div style={{ flex:1 }}/>
        <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)', letterSpacing:'.06em' }}>{caption.length}/40</span>
        <span className="lbl">14:00 {(window.FREQ_LANG === 'kr') ? '남음' : 'LEFT'}</span>
      </div>

      <div style={{ flex:1 }}/>

      {/* actions */}
      <div style={{ padding:'14px 16px 16px', display:'flex', gap:8 }}>
        <Keycap onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('camera'); }} style={{ flex:1, height:48, fontSize:11 }}>RETAKE</Keycap>
        <Keycap amber onClick={sendToChannel} style={{ flex:2, height:48, fontSize:11 }}>SEND TO CHANNEL →</Keycap>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 04 · POST DETAIL — 3:4 image + 5 stamps + 40-char comments
// ─────────────────────────────────────────────────────────────
function Screen04Post() {
  // 클릭한 셀에서 전달받은 작성자/캡션 (없으면 default)
  const target = window.FREQ_POST_TARGET || { who:'VELVIA', caption:'Coffee, finally' };
  const isPostKr = window.FREQ_LANG === 'kr';
  const authorName = ({
    YOU:'Jay', KODAK:'Mira', VELVIA:'Sung', POLAROID:'Ada',
    EKTA:'Rin', MINT:'Ben', SEPIA:'Yuna', LAVENDER:'Eun', BURNT:'Jin',
  })[target.who] || target.who;

  // stamps: each has count + whether YOU pressed it
  const [stamps, setStamps] = React.useState([
    { k:'heart', label:'♥', count:3, active:true },
    { k:'fire',  label:'🔥', count:1, active:false },
    { k:'haha',  label:'😂', count:2, active:false },
    { k:'bicep', label:'💪', count:0, active:false },
    { k:'eyes',  label:'👀', count:4, active:false },
  ]);
  const toggleStamp = (k) => {
    if (navigator.vibrate) { try { navigator.vibrate(6); } catch(e){} }
    setStamps(prev => prev.map(s => s.k === k
      ? { ...s, active: !s.active, count: s.count + (s.active ? -1 : 1) }
      : s
    ));
  };

  const [comments, setComments] = React.useState([
    { who:'KODAK', text:'light is unreal here', time:'2m' },
    { who:'EKTA', text:'drop the cafe name', time:'4m' },
    { who:'MINT', text:'i need this mug', time:'7m' },
  ]);
  const [draft, setDraft] = React.useState('');
  const sendComment = () => {
    const t = draft.trim();
    if (!t) return;
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch(e){} }
    setComments(prev => [...prev, { who:'YOU', text:t.slice(0,40), time:'now' }]);
    setDraft('');
  };
  const onDraftChange = (e) => setDraft(e.target.value.slice(0,40));
  const onDraftKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); sendComment(); } };

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar — safe-area aware */}
      <div style={{
        padding:'calc(env(safe-area-inset-top, 0px) + 12px) 16px 12px',
        display:'flex', alignItems:'center', gap:10,
        borderBottom:'1px solid var(--mist-3)',
      }}>
        <button onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('feed'); }} style={{ border:'none', background:'transparent', padding:0, cursor:'pointer' }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.4"/></svg>
        </button>
        <Chip who={target.who}/>
        <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500, color:'var(--ink)' }}>{authorName}</span>
        <span className="lbl" style={{ color:'var(--ink-35)' }}>· 03m {isPostKr ? '전' : 'ago'}</span>
        <div style={{ flex:1 }}/>
      </div>

      {/* image */}
      <div style={{ padding:'14px 16px 0' }}>
        <FilmPlaceholder label={`${target.who} · Round 08`}/>
      </div>

      {/* caption */}
      <div style={{ padding:'12px 16px 8px', display:'flex', alignItems:'flex-start', gap:8 }}>
        <span style={{ fontFamily:'var(--sans)', fontSize:14, lineHeight:1.4, color:'var(--ink)' }}>{target.caption || (isPostKr ? '한 줄 없음' : 'no caption')}</span>
        <div style={{ flex:1 }}/>
        <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)' }}>{(target.caption || '').length}/40</span>
      </div>

      {/* stamps row */}
      <div style={{ padding:'8px 16px 12px', display:'flex', gap:6 }}>
        {stamps.map(s => (
          <button key={s.k} onClick={() => toggleStamp(s.k)} style={{
            flex:1, border:'none', cursor:'pointer',
            background: s.active
              ? 'linear-gradient(180deg, #5A4F40, #3A332A)'
              : 'linear-gradient(180deg, rgba(255,255,255,.85), rgba(255,255,255,.55))',
            color: s.active ? 'var(--mist-0)' : 'var(--ink)',
            borderRadius:12,
            border: s.active ? '1.5px solid rgba(58,51,42,.5)' : '1.5px solid var(--mist-3)',
            boxShadow: s.active
              ? 'inset 0 1px 0 rgba(255,255,255,.08), 0 1px 2px rgba(0,0,0,.15)'
              : 'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
            padding:'8px 0',
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            transition: 'background 100ms ease-out',
            WebkitTapHighlightColor: 'transparent',
          }}>
            <span style={{ fontSize:14, lineHeight:1 }}>{s.label}</span>
            <span style={{ fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.08em' }}>{s.count||'·'}</span>
          </button>
        ))}
      </div>

      {/* comments */}
      <div style={{ flex:1, borderTop:'1px solid var(--mist-3)', padding:'12px 16px 0', overflowY:'auto' }}>
        <div className="lbl" style={{ marginBottom:8 }}>Comments · {comments.length}</div>
        {comments.map((c,i)=>(
          <div key={i} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
            <Chip who={c.who}/>
            <span style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink-70)', lineHeight:1.4, flex:1 }}>{c.text}</span>
            <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)' }}>{c.time}</span>
          </div>
        ))}
      </div>

      {/* comment input — flex:0이라 스크롤 영역 밖에서 고정 */}
      <div style={{
        padding:'10px 16px',
        borderTop:'1px solid var(--mist-3)', display:'flex', gap:8, alignItems:'center',
        background:'var(--mist-0)', flexShrink:0,
      }}>
        <div className="well" style={{ flex:1, padding:'6px 10px', display:'flex', alignItems:'center', gap:6 }}>
          <input
            value={draft}
            onChange={onDraftChange}
            onKeyDown={onDraftKey}
            placeholder={T('say_placeholder')}
            maxLength={40}
            style={{
              flex:1, border:'none', outline:'none', background:'transparent',
              fontFamily:'var(--sans)', fontSize:14, color:'var(--ink)',
              padding:'4px 0', minWidth:0,
              caretColor:'var(--amber)',
            }}
          />
          <span className="mono" style={{ fontSize:9.5, color:'var(--ink-35)', flexShrink:0 }}>{draft.length}/40</span>
        </div>
        <Keycap amber onClick={sendComment} style={{
          width:50, height:38, fontSize:11,
          opacity: draft.trim() ? 1 : 0.45,
          cursor: draft.trim() ? 'pointer' : 'default',
          transition:'opacity 120ms ease-out',
        }}>SEND</Keycap>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 05 · OPEN CHANNEL — SETUP → BROADCAST → READY (slot reel)
// ─────────────────────────────────────────────────────────────
function Screen05Open({ phase: initPhase = 'setup' }) {
  // phase: 'setup' | 'broadcast' | 'ready' — internal state so stepper/buttons can cycle
  const [phase, setPhase] = React.useState(initPhase);
  const phases = ['setup', 'broadcast', 'ready'];
  const idx = phases.indexOf(phase);

  // SETUP-phase state: regenerated frequency + session settings
  const [freq, setFreq] = React.useState(['4','4','7','1']);
  const [duration, setDuration] = React.useState('14');  // minutes per round
  const [rounds, setRounds] = React.useState('12');      // rounds per session
  const regenFreq = () => {
    const rand = () => String(Math.floor(Math.random()*10));
    setFreq([rand(), rand(), rand(), rand()]);
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch(e){} }
  };

  const PhaseBtn = ({ p, i }) => (
    <button onClick={() => setPhase(p)} style={{
      flex:1, display:'flex', flexDirection:'column', gap:4,
      background:'transparent', border:'none', padding:0, cursor:'pointer',
      textAlign:'left',
    }}>
      <div style={{ height:4, borderRadius:2, background: i <= idx ? 'var(--ink)' : 'var(--mist-2)' }}/>
      <span className="lbl" style={{
        color: i === idx ? 'var(--ink)' : 'var(--ink-35)',
        fontSize:9,
      }}>{`0${i+1} · ${p}`}</span>
    </button>
  );

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'calc(env(safe-area-inset-top, 0px) + 14px) 18px 8px', display:'flex', justifyContent:'space-between' }}>
        <span className="lbl">{T('open_channel')}</span>
        <span className="lbl">{T('host_step')}</span>
      </div>

      {/* Phase stepper — tappable for phase preview */}
      <div style={{ padding:'0 18px 14px', display:'flex', gap:4 }}>
        {phases.map((p,i)=> <PhaseBtn key={p} p={p} i={i}/>)}
      </div>

      {/* ─── SETUP — host configures frequency + session shape ─── */}
      {phase === 'setup' && (
        <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:16, overflowY:'auto' }}>
          {/* Frequency assignment card */}
          <div style={{
            background:'var(--mist-1)', padding:'16px 14px 14px', borderRadius:14,
            border:'1.5px solid var(--mist-3)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
          }}>
            <div className="lbl" style={{ marginBottom:12, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>Your Frequency</span>
              <button onClick={regenFreq} style={{
                background:'transparent', border:'none', cursor:'pointer',
                fontFamily:'var(--mono)', fontSize:9.5, letterSpacing:'.14em',
                color:'var(--ink-55)', textTransform:'uppercase', fontWeight:500,
                display:'flex', alignItems:'center', gap:4, padding:0,
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6 A4 4 0 0 1 9 4" stroke="var(--ink-55)" strokeWidth="1.2"/>
                  <path d="M7.5 2 L9 4 L7 4.5" stroke="var(--ink-55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 6 A4 4 0 0 1 3 8" stroke="var(--ink-55)" strokeWidth="1.2"/>
                  <path d="M4.5 10 L3 8 L5 7.5" stroke="var(--ink-55)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                REROLL
              </button>
            </div>
            <div style={{ display:'flex', justifyContent:'center', gap:6, alignItems:'flex-end' }}>
              {freq.slice(0,3).map((d,i)=>(
                <div key={i} className="well" style={{
                  width:50, height:66,
                  display:'grid', placeItems:'center',
                  fontFamily:'var(--mono)', fontSize:34, fontWeight:500, color:'var(--ink)',
                  fontVariantNumeric:'tabular-nums',
                }}>{d}</div>
              ))}
              <span style={{ fontFamily:'var(--mono)', fontSize:28, fontWeight:600, color:'var(--ink-35)', lineHeight:1, paddingBottom:10 }}>.</span>
              <div className="well" style={{
                width:50, height:66,
                display:'grid', placeItems:'center',
                fontFamily:'var(--mono)', fontSize:34, fontWeight:500, color:'var(--ink)',
                fontVariantNumeric:'tabular-nums',
              }}>{freq[3]}</div>
              <span style={{ fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.2em', color:'var(--ink-55)', paddingBottom:14 }}>MHZ</span>
            </div>
            <div className="lbl" style={{ marginTop:10, textAlign:'center', color:'var(--ink-35)' }}>
              Guests tune in with this code
            </div>
          </div>

          {/* Session shape */}
          <div>
            <div className="lbl" style={{ marginBottom:8 }}>Round Length</div>
            <div style={{ display:'flex', gap:6 }}>
              {[['14','14 MIN'],['30','30 MIN'],['60','60 MIN']].map(([v,label])=>(
                <button key={v} onClick={()=>setDuration(v)} className={`cap ${duration===v?'cap-graphite':''}`} style={{
                  flex:1, height:42, border:'none', cursor:'pointer',
                  fontFamily:'var(--mono)', fontSize:11, fontWeight:500, letterSpacing:'.08em',
                }}>{label}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="lbl" style={{ marginBottom:8 }}>Rounds Per Session</div>
            <div style={{ display:'flex', gap:6 }}>
              {[['6','06'],['12','12'],['24','24']].map(([v,label])=>(
                <button key={v} onClick={()=>setRounds(v)} className={`cap ${rounds===v?'cap-graphite':''}`} style={{
                  flex:1, height:42, border:'none', cursor:'pointer',
                  fontFamily:'var(--mono)', fontSize:13, fontWeight:500, letterSpacing:'.08em',
                }}>{label}</button>
              ))}
            </div>
          </div>

          {/* Summary line */}
          <div style={{
            padding:'10px 12px', background:'var(--mist-1)',
            boxShadow:'inset 0 0 0 1px var(--mist-3)',
            display:'flex', alignItems:'center', gap:6, flexWrap:'wrap',
          }}>
            <span className="lbl" style={{ color:'var(--ink-55)' }}>Session</span>
            <span className="mono" style={{ fontSize:11, letterSpacing:'.06em' }}>
              {rounds} rounds · {duration} min each · up to 9 people
            </span>
          </div>

          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', gap:8, paddingBottom:14 }}>
            <Keycap onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); }} style={{ flex:1, height:44, fontSize:11 }}>CANCEL</Keycap>
            <Keycap amber onClick={() => setPhase('broadcast')} style={{ flex:2, height:44, fontSize:11 }}>OPEN AIRWAVES →</Keycap>
          </div>
        </div>
      )}

      {/* ─── BROADCAST — airwaves live, guests incoming ─── */}
      {phase === 'broadcast' && (
        <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
          <div style={{
            background:'var(--graphite)', color:'var(--mist-0)',
            padding:'22px 18px 20px', borderRadius:16,
            boxShadow:'0 1px 0 #000, inset 0 1px 0 rgba(255,255,255,.08)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
              <span className="signal-dot"/>
              <span className="lbl-dk">Broadcasting · 02:41</span>
            </div>

            {/* reel */}
            <div style={{ display:'flex', justifyContent:'center', gap:8, marginBottom:14 }}>
              {freq.map((d,i)=>(
                <div key={i} style={{
                  width:56, height:76, background:'#241B12', borderRadius:10,
                  boxShadow:'inset 0 0 0 1px rgba(255,255,255,.1), inset 0 -14px 0 rgba(0,0,0,.3), inset 0 14px 0 rgba(0,0,0,.3)',
                  display:'grid', placeItems:'center',
                  fontFamily:'var(--mono)', fontSize:36, fontWeight:500, color:'var(--mist-0)',
                  fontVariantNumeric:'tabular-nums',
                }}>{d}</div>
              ))}
            </div>

            {/* Airwaves · Open + ETA 라벨 제거 — Broadcasting 카운트다운으로 충분 */}
          </div>

          {/* your identity card */}
          <div style={{
            background:'var(--mist-1)', padding:14, borderRadius:14,
            border:'1.5px solid var(--mist-3)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
          }}>
            <div className="lbl" style={{ marginBottom:10 }}>You · Host</div>
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <Chip who="YOU" size="lg"/>
              <span style={{ fontFamily:'var(--sans)', fontSize:14, fontWeight:500 }}>Jay</span>
              <div style={{ flex:1 }}/>
              <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>{freq.slice(0,3).join('')}.{freq[3]} MHZ</span>
            </div>
          </div>

          {/* waiting list */}
          <div>
            <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <span>Incoming · 2 / 9</span>
              <span>02:41 → {String(duration).padStart(2,'0')}:00</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
              {['KODAK','EKTA'].map(m => <div key={m} style={{ padding:8, background:'var(--mist-1)', borderRadius:10, border:'1px solid var(--mist-3)' }}>
                <Chip who={m}/>
              </div>)}
              {Array.from({length:7}).map((_,i)=>(
                <div key={i} className="slot-empty" style={{ padding:8, minHeight:34, borderRadius:10 }}>
                  <span className="lbl" style={{ color:'var(--ink-35)', fontSize:9 }}>Waiting</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', gap:8, paddingBottom:14 }}>
            <Keycap onClick={() => setPhase('setup')} style={{ flex:1, height:44, fontSize:11 }}>BACK</Keycap>
            <Keycap amber onClick={() => setPhase('ready')} style={{ flex:2, height:44, fontSize:11 }}>SEAL LOBBY →</Keycap>
          </div>
        </div>
      )}

      {/* ─── READY — lobby sealed, round 01 count-in ─── */}
      {phase === 'ready' && (
        <div style={{ padding:'0 18px', flex:1, display:'flex', flexDirection:'column', gap:16 }}>
          {/* sealed banner */}
          <div style={{
            background:'var(--mist-1)', padding:'12px 14px', borderRadius:14,
            border:'1.5px solid var(--mist-3)',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
            display:'flex', alignItems:'center', gap:10,
          }}>
            <div style={{
              width:10, height:10, borderRadius:'50%',
              background:'var(--signal-bright)',
              boxShadow:'0 0 8px rgba(181,255,68,.75)',
            }}/>
            <div style={{ flex:1, display:'flex', flexDirection:'column', lineHeight:1.2 }}>
              <span className="lbl">Lobby Sealed</span>
              <span className="mono" style={{ fontSize:11, letterSpacing:'.06em', color:'var(--ink-70)' }}>
                {freq.slice(0,3).join('')}.{freq[3]} MHZ · 3 tuned in
              </span>
            </div>
            <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>{rounds} × {String(duration).padStart(2,'0')}:00</span>
          </div>

          {/* count-in */}
          <div style={{
            background:'var(--graphite)', color:'var(--mist-0)',
            padding:'22px 18px', borderRadius:16,
            boxShadow:'0 1px 0 #000, inset 0 1px 0 rgba(255,255,255,.08)',
            display:'flex', flexDirection:'column', alignItems:'center', gap:10,
          }}>
            <span className="lbl-dk" style={{ letterSpacing:'.2em' }}>ROUND 01 BEGINS IN</span>
            <div style={{
              fontFamily:'var(--mono)', fontSize:56, fontWeight:500, lineHeight:1,
              color:'var(--amber)', fontVariantNumeric:'tabular-nums',
              textShadow:'0 0 16px rgba(255,119,168,.45)',
              letterSpacing:'.04em',
            }}>
              00:03<span className="crt-cursor" style={{ verticalAlign:'baseline' }}/>
            </div>
            <span className="lbl-dk" style={{ color:'rgba(240,232,216,.4)' }}>Tap START to begin now</span>
          </div>

          {/* final roster */}
          <div>
            <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
              <span>Tuned In · 3</span>
              <span>Host · You</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:6 }}>
              {[{ who:'YOU', name:'Jay', host:true },
                { who:'KODAK', name:'Mira', host:false },
                { who:'EKTA', name:'Rin', host:false },
              ].map(m => (
                <div key={m.who} style={{
                  padding:'10px 8px', background:'var(--mist-1)', borderRadius:12,
                  border:'1px solid var(--mist-3)',
                  display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start',
                }}>
                  <Chip who={m.who}/>
                  <span style={{ fontFamily:'var(--sans)', fontSize:12, fontWeight:500 }}>{m.name}</span>
                  {m.host && <span style={{
                    fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'.14em',
                    padding:'2px 5px', borderRadius:4, border:'1px solid var(--ink)', color:'var(--ink)',
                  }}>HOST</span>}
                </div>
              ))}
            </div>
          </div>

          <div style={{ flex:1 }}/>
          <div style={{ display:'flex', gap:8, paddingBottom:14 }}>
            <Keycap onClick={() => setPhase('broadcast')} style={{ flex:1, height:44, fontSize:11 }}>REOPEN</Keycap>
            <Keycap amber onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('feed'); }} style={{ flex:2, height:44, fontSize:11 }}>START ROUND 01 →</Keycap>
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
      <ScreenHeader channel="4471" timer="22h 12m"/>

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
                padding:'2px 5px', borderRadius:4, border:'1px solid var(--ink)', color:'var(--ink)',
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
      <div style={{ padding:'14px 16px 6px', borderTop:'1px solid var(--mist-3)', display:'flex', gap:8 }}>
        <Keycap style={{ flex:1, height:40, fontSize:11 }}>INVITE</Keycap>
        <Keycap onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); }} style={{ flex:1, height:40, fontSize:11 }}>LEAVE</Keycap>
        <Keycap amber onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); }} style={{ flex:1, height:40, fontSize:11 }}>CLOSE CH</Keycap>
      </div>
      {/* App settings entry */}
      <div style={{ padding:'2px 16px 14px', display:'flex', justifyContent:'center', flexShrink:0 }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('settings'); }}
          style={{
            background:'transparent', border:'none', cursor:'pointer',
            fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.16em',
            color:'var(--ink-55)', textTransform:'uppercase', fontWeight:500,
            padding:'8px 12px',
          }}>
          APP SETTINGS →
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 08 · ROOMS — channel switcher / list of joined rooms
// ─────────────────────────────────────────────────────────────
function Screen08Rooms() {
  const isKr = window.FREQ_LANG === 'kr';
  const rooms = [
    { code:'447.1', name: isKr ? '가족'        : 'Family',         members:7, active:true,  status: isKr ? '8/12 · 14:00 남음' : '8/12 · 14:00 LEFT' },
    { code:'661.4', name: isKr ? '커피 크루'    : 'Coffee Crew',     members:4, active:false, status: isKr ? '3/12 · 22h 남음'   : '3/12 · 22h LEFT' },
    { code:'888.2', name: isKr ? '일요 등산'    : 'Sunday Hiking',   members:5, active:false, status: isKr ? '종료'              : 'ENDED', ended:true },
  ];

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar — safe-area aware */}
      <div style={{
        padding:'calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid var(--mist-3)',
      }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('feed'); }}
          aria-label="Back to feed"
          style={{
            width:28, height:28, padding:0, marginLeft:-8,
            border:'none', background:'transparent', cursor:'pointer',
            display:'grid', placeItems:'center', WebkitTapHighlightColor:'transparent',
          }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.5"/>
          </svg>
        </button>
        <span style={{
          fontFamily:'var(--mono)', fontSize:15, fontWeight:700,
          letterSpacing: isKr ? '.04em' : '.18em',
          textTransform: isKr ? 'none' : 'uppercase',
          color:'var(--ink)',
        }}>{isKr ? '방 목록' : 'Rooms'}</span>
        <span style={{ width:28 }}/>
      </div>

      {/* rooms list */}
      <div style={{ flex:1, overflowY:'auto', padding:'18px 16px 24px', display:'flex', flexDirection:'column', gap:10 }}>
        {rooms.map(r => (
          <button key={r.code}
            onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('feed'); }}
            style={{
              border:'none', cursor:'pointer', textAlign:'left',
              padding:'14px 16px', borderRadius:14,
              background: r.active
                ? 'linear-gradient(180deg, rgba(255,255,255,.95), rgba(255,255,255,.7))'
                : 'linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.4))',
              border:`1.5px solid ${r.active ? 'var(--signal)' : 'var(--mist-3)'}`,
              boxShadow: r.active
                ? 'inset 0 1px 0 rgba(255,255,255,.7), 0 2px 8px rgba(101,190,63,.18)'
                : 'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
              opacity: r.ended ? 0.55 : 1,
              display:'flex', alignItems:'center', gap:14,
              WebkitTapHighlightColor:'transparent',
            }}>
            {/* active dot */}
            <div style={{
              width:10, height:10, borderRadius:'50%',
              background: r.active ? 'var(--signal-bright)' : 'var(--mist-3)',
              boxShadow: r.active ? '0 0 8px rgba(181,255,68,.7)' : 'inset 0 1px 1px rgba(0,0,0,.1)',
              flexShrink:0,
              animation: r.active ? 'breathe 1.8s ease-in-out infinite' : 'none',
            }}/>

            <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3, minWidth:0 }}>
              {/* code + name */}
              <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                <span style={{ fontFamily:'var(--mono)', fontSize:18, fontWeight:700, letterSpacing:'.06em', color:'var(--ink)' }}>{r.code}</span>
                <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500, color:'var(--ink-70)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</span>
              </div>
              {/* meta */}
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span className="lbl" style={{ color:'var(--ink-55)' }}>{r.members} {isKr ? '명' : 'MEMBERS'}</span>
                <span style={{ width:3, height:3, borderRadius:'50%', background:'var(--ink-35)' }}/>
                <span className="lbl" style={{ color: r.ended ? 'var(--ink-35)' : 'var(--ink-55)' }}>{r.status}</span>
              </div>
            </div>

            {/* chevron */}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" style={{ flexShrink:0 }}>
              <path d="M6 3 L11 8 L6 13" stroke="var(--ink-35)" strokeWidth="1.5"/>
            </svg>
          </button>
        ))}

        {/* secondary actions */}
        <div style={{ marginTop:8, display:'flex', flexDirection:'column', gap:8 }}>
          <Keycap onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('open'); }} style={{ width:'100%', height:46, fontSize:11 }}>
            + {isKr ? '새 방 만들기' : 'CREATE NEW ROOM'}
          </Keycap>
          <Keycap onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); }} style={{ width:'100%', height:46, fontSize:11 }}>
            + {isKr ? '코드로 입장' : 'JOIN WITH CODE'}
          </Keycap>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// 09 · SEND TO — choose which rooms to post into
// ─────────────────────────────────────────────────────────────
function Screen09SendTo() {
  const isKr = window.FREQ_LANG === 'kr';
  const rooms = [
    { code:'447.1', name: isKr ? '가족'        : 'Family',         members:7, default:true },
    { code:'661.4', name: isKr ? '커피 크루'    : 'Coffee Crew',     members:4, default:false },
    { code:'888.2', name: isKr ? '일요 등산'    : 'Sunday Hiking',   members:5, default:false, ended:true },
  ];
  // multi-select state — default 현재 방
  const [selected, setSelected] = React.useState(() => {
    const s = new Set();
    rooms.forEach(r => { if (r.default) s.add(r.code); });
    return s;
  });
  const toggle = (code) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });
    if (navigator.vibrate) { try { navigator.vibrate(6); } catch(_){} }
  };
  const send = () => {
    if (selected.size === 0) return;
    if (navigator.vibrate) { try { navigator.vibrate(10); } catch(_){} }
    if (window.FREQ_NAV) window.FREQ_NAV('feed');
  };

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar */}
      <div style={{
        padding:'calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        borderBottom:'1px solid var(--mist-3)',
      }}>
        <button
          onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('review'); }}
          aria-label="Back to review"
          style={{
            width:28, height:28, padding:0, marginLeft:-8,
            border:'none', background:'transparent', cursor:'pointer',
            display:'grid', placeItems:'center', WebkitTapHighlightColor:'transparent',
          }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M10 3 L5 8 L10 13" stroke="var(--ink)" strokeWidth="1.5"/>
          </svg>
        </button>
        <span style={{
          fontFamily:'var(--mono)', fontSize:15, fontWeight:700,
          letterSpacing: isKr ? '.04em' : '.18em',
          textTransform: isKr ? 'none' : 'uppercase',
          color:'var(--ink)',
        }}>{isKr ? '보낼 곳' : 'Send to'}</span>
        <span style={{ width:28 }}/>
      </div>

      {/* rooms list with checkboxes */}
      <div style={{ flex:1, overflowY:'auto', padding:'18px 16px 24px', display:'flex', flexDirection:'column', gap:10 }}>
        {rooms.map(r => {
          const checked = selected.has(r.code);
          return (
            <button key={r.code}
              onClick={() => !r.ended && toggle(r.code)}
              disabled={r.ended}
              style={{
                border:'none', cursor: r.ended ? 'default' : 'pointer', textAlign:'left',
                padding:'14px 14px', borderRadius:14,
                background: checked
                  ? 'linear-gradient(180deg, rgba(255,119,168,.18), rgba(255,119,168,.10))'
                  : 'linear-gradient(180deg, rgba(255,255,255,.7), rgba(255,255,255,.4))',
                border: `1.5px solid ${checked ? 'var(--amber)' : 'var(--mist-3)'}`,
                boxShadow: checked
                  ? 'inset 0 1px 0 rgba(255,255,255,.6), 0 2px 8px rgba(255,119,168,.2)'
                  : 'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
                opacity: r.ended ? 0.4 : 1,
                display:'flex', alignItems:'center', gap:14,
                WebkitTapHighlightColor:'transparent',
                transition:'background 120ms, border-color 120ms',
              }}>
              {/* checkbox */}
              <div style={{
                width:22, height:22, borderRadius:7,
                border:`2px solid ${checked ? 'var(--amber)' : 'var(--mist-4)'}`,
                background: checked ? 'var(--amber)' : 'transparent',
                display:'grid', placeItems:'center', flexShrink:0,
                transition:'all 120ms',
              }}>
                {checked && (
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.5 L6 10 L11 4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>

              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:3, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
                  <span style={{ fontFamily:'var(--mono)', fontSize:17, fontWeight:700, letterSpacing:'.06em', color:'var(--ink)' }}>{r.code}</span>
                  <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500, color:'var(--ink-70)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.name}</span>
                </div>
                <span className="lbl" style={{ color:'var(--ink-55)' }}>{r.members} {isKr ? '명' : 'MEMBERS'}{r.ended ? (isKr ? ' · 종료' : ' · ENDED') : ''}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* bottom send action — sticky */}
      <div style={{
        padding:'14px 16px 16px',
        borderTop:'1px solid var(--mist-3)',
        background:'var(--mist-0)',
        flexShrink:0,
      }}>
        <Keycap amber onClick={send} style={{
          width:'100%', height:48, fontSize:12,
          opacity: selected.size > 0 ? 1 : 0.4,
          cursor: selected.size > 0 ? 'pointer' : 'default',
        }}>
          {isKr
            ? `${selected.size}개 방으로 보내기 →`
            : `SEND TO ${selected.size} ROOM${selected.size === 1 ? '' : 'S'} →`}
        </Keycap>
      </div>
    </div>
  );
}

Object.assign(window, {
  Screen01TuneIn, Screen02Feed, Screen03Camera, Screen03bReview, Screen04Post, Screen05Open, Screen06Members, Screen07Settings, Screen08Rooms, Screen09SendTo,
});

// ─────────────────────────────────────────────────────────────
// 07 · APP SETTINGS
// ─────────────────────────────────────────────────────────────
function Screen07Settings() {
  const [, force] = React.useReducer(x => x+1, 0);
  const lang = window.FREQ_LANG || 'en';
  const setLang = (L) => { window.FREQ_LANG = L; try { localStorage.setItem('FREQ_LANG', L); } catch(e){} force(); window.dispatchEvent(new CustomEvent('freq-lang-change')); };

  // Toggle states (persisted in localStorage)
  const loadBool = (k, def) => {
    try { const v = localStorage.getItem('FREQ_SET_' + k); return v === null ? def : v === '1'; }
    catch(e) { return def; }
  };
  const saveBool = (k, v) => { try { localStorage.setItem('FREQ_SET_' + k, v ? '1' : '0'); } catch(e){} };

  const [shutter, setShutter] = React.useState(() => loadBool('shutter', true));
  const [grid, setGrid]       = React.useState(() => loadBool('grid', false));
  const [autoTune, setAutoTune] = React.useState(() => loadBool('autoTune', true));

  const flip = (key, val, setter) => {
    setter(val);
    saveBool(key, val);
    if (navigator.vibrate) { try { navigator.vibrate(6); } catch(e){} }
  };

  const Row = ({ label, value, right }) => (
    <div style={{
      padding:'12px 16px', display:'flex', alignItems:'center', gap:10,
      background:'var(--mist-0)',
    }}>
      <span className="lbl" style={{ color:'var(--ink-55)', minWidth:110 }}>{label}</span>
      <span style={{ fontFamily:'var(--mono)', fontSize:12, color:'var(--ink)', letterSpacing:'.04em', flex:1 }}>{value}</span>
      {right}
    </div>
  );
  const Toggle = ({ on, onToggle }) => (
    <button onClick={() => onToggle && onToggle(!on)} style={{
      width:36, height:22, padding:0, border:'none', cursor: onToggle ? 'pointer' : 'default',
      borderRadius:11,
      background: on ? 'var(--signal)' : 'var(--mist-3)',
      boxShadow:'inset 0 1px 2px rgba(0,0,0,.15)',
      position:'relative', transition:'background 150ms',
      WebkitTapHighlightColor:'transparent',
    }}>
      <div style={{
        position:'absolute', top:2, left: on ? 16 : 2, width:18, height:18,
        borderRadius:'50%',
        background:'var(--mist-0)',
        boxShadow:'0 1px 2px rgba(58,51,42,.25), inset 0 1px 0 rgba(255,255,255,.7)',
        transition:'left 150ms',
      }}/>
    </button>
  );
  // Section · 카테고리 사이에 짧은 구분선 (양옆 16px 마진)
  const Section = ({ title, children }) => (
    <div style={{ marginTop:8 }}>
      <div style={{ height:1, background:'var(--mist-3)', margin:'12px 16px 16px' }}/>
      <div style={{
        padding:'0 16px 8px',
        fontFamily:'var(--mono)',
        fontSize:12,
        fontWeight:700,
        letterSpacing:'.18em',
        textTransform:'uppercase',
        color:'var(--ink)',
      }}>{title}</div>
      {children}
    </div>
  );
  // roster for the embedded Channel section
  const roster = [
    { who:'YOU', name:'Jay', host:true, last:'just now' },
    { who:'KODAK', name:'Mira', host:false, last:'2m' },
    { who:'VELVIA', name:'Sung', host:false, last:'5m' },
    { who:'POLAROID', name:'Ada', host:false, last:'12m' },
    { who:'EKTA', name:'Rin', host:false, last:'18m' },
    { who:'MINT', name:'Ben', host:false, last:'24m' },
    { who:'SEPIA', name:'Yuna', host:false, last:'31m' },
  ];

  // top-level segment: room (channel info) | general (device + account)
  const [section, setSection] = React.useState('room');

  // invite sheet
  const [inviteOpen, setInviteOpen] = React.useState(false);

  // confirm sheet state for destructive actions
  const [confirm, setConfirm] = React.useState(null); // null | 'leave' | 'close' | 'delete'
  const isKr = lang === 'kr';
  const confirmConfigs = {
    leave: {
      title: isKr ? '채널을 나갈까요?' : 'Leave channel?',
      body:  isKr ? '오늘 라운드 진행과 보낸 사진에서 빠집니다. 다른 사람은 채널에 그대로 남아요.'
                  : "You'll exit this round. Other members stay in the channel.",
      yes:   isKr ? '나가기' : 'LEAVE',
      run:   () => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); },
    },
    close: {
      title: isKr ? '채널을 닫을까요?' : 'Close channel?',
      body:  isKr ? '모든 멤버가 접근을 잃고 24시간 규칙대로 사진이 사라집니다. 되돌릴 수 없어요.'
                  : "All members lose access and photos vanish per the 24h rule. Can't be undone.",
      yes:   isKr ? '채널 닫기' : 'CLOSE CHANNEL',
      run:   () => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); },
    },
    delete: {
      title: isKr ? '계정을 삭제할까요?' : 'Delete account?',
      body:  isKr ? '프로필, 기록, 호스팅한 채널이 영구 삭제됩니다. 되돌릴 수 없어요.'
                  : "Your profile, history, and hosted channels are permanently erased. Can't be undone.",
      yes:   isKr ? '계정 삭제' : 'DELETE ACCOUNT',
      run:   () => { if (window.FREQ_NAV) window.FREQ_NAV('tune'); },
    },
  };
  const cfg = confirm ? confirmConfigs[confirm] : null;

  return (
    <div style={{ flex:1, background:'var(--mist-0)', display:'flex', flexDirection:'column' }}>
      {/* top bar — tab mode, screen title (larger), safe-area aware */}
      <div style={{ padding:'calc(env(safe-area-inset-top, 0px) + 14px) 16px 14px', display:'flex', alignItems:'center', justifyContent:'center', borderBottom:'1px solid var(--mist-3)' }}>
        <span style={{
          fontFamily:'var(--mono)', fontSize:15, fontWeight:700,
          letterSpacing: isKr ? '.04em' : '.18em',
          textTransform: isKr ? 'none' : 'uppercase',
          color:'var(--ink)',
        }}>{T('settings')}</span>
      </div>

      {/* ROOM ↔ GENERAL segmented switch */}
      <div style={{ padding:'14px 16px 0' }}>
        <div style={{
          display:'flex', gap:4, padding:3, borderRadius:12,
          background:'var(--mist-2)',
          boxShadow:'inset 0 1px 2px rgba(0,0,0,.08)',
        }}>
          {[['room', isKr ? '방' : 'ROOM'], ['general', isKr ? '일반' : 'GENERAL']].map(([k, lbl]) => (
            <button key={k} onClick={() => setSection(k)} style={{
              flex:1, border:'none', cursor:'pointer',
              padding:'10px 0', borderRadius:9,
              fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.18em', textTransform:'uppercase',
              background: section === k ? 'var(--ink)' : 'transparent',
              color: section === k ? 'var(--mist-0)' : 'var(--ink-55)',
              fontWeight: section === k ? 600 : 500,
              WebkitTapHighlightColor:'transparent',
              transition:'background 120ms ease-out, color 120ms ease-out',
            }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'14px 0 0' }}>
        {section === 'room' && (<>
        {/* ─── CHANNEL section (room info) ─── */}

        {/* Channel code card */}
        <div style={{
          margin:'0 16px',
          background:'var(--mist-1)', padding:'14px 14px 12px', borderRadius:14,
          border:'1.5px solid var(--mist-3)',
          boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
        }}>
          <div className="lbl" style={{ marginBottom:6, color:'var(--ink-55)' }}>Code</div>
          <div style={{ display:'flex', alignItems:'baseline', gap:8, marginBottom:10 }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:26, fontWeight:600, letterSpacing:'.08em' }}>447.1</span>
            <span className="mono" style={{ fontSize:10, color:'var(--ink-35)', letterSpacing:'.14em' }}>· MHZ</span>
          </div>
          <div style={{ display:'flex', gap:18 }}>
            {[
              ['Members', '7 / 9'],
              ['Rounds', '8 / 12'],
              ['Expires', '22H 12M'],
            ].map(([k,v])=>(
              <div key={k}>
                <div className="lbl" style={{ fontSize:8.5 }}>{k}</div>
                <div className="mono" style={{ fontSize:11, letterSpacing:'.06em', fontWeight:500 }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Roster */}
        <div style={{ padding:'14px 16px 4px' }}>
          <div className="lbl" style={{ marginBottom:8, display:'flex', justifyContent:'space-between' }}>
            <span>Roster · {roster.length}</span>
            <span>Host · You</span>
          </div>
          <div>
            {roster.map((r)=>(
              <div key={r.who} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'10px 0',
              }}>
                <Chip who={r.who}/>
                <span style={{ fontFamily:'var(--sans)', fontSize:13, fontWeight:500 }}>{r.name}</span>
                {r.host && <span style={{
                  fontFamily:'var(--mono)', fontSize:9, letterSpacing:'.14em', textTransform:'uppercase',
                  padding:'2px 5px', borderRadius:4, border:'1px solid var(--ink)', color:'var(--ink)',
                }}>HOST</span>}
                <div style={{ flex:1 }}/>
                <span className="mono" style={{ fontSize:9.5, letterSpacing:'.1em', color:'var(--ink-35)' }}>{r.last}</span>
              </div>
            ))}
            {Array.from({length:9 - roster.length}).map((_,i)=>(
              <div key={i} className="slot-empty" style={{
                padding:'10px 12px', marginTop:6, borderRadius:8,
                display:'flex', alignItems:'center', gap:10,
              }}>
                <span className="lbl" style={{ color:'var(--ink-35)' }}>Open slot</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel actions — destructive ones go through confirm sheet */}
        <div style={{ padding:'12px 16px 22px', display:'flex', gap:8 }}>
          <Keycap onClick={() => setInviteOpen(true)} style={{ flex:1, height:40, fontSize:11 }}>INVITE</Keycap>
          <Keycap graphite onClick={() => setConfirm('leave')} style={{ flex:1, height:40, fontSize:11 }}>LEAVE</Keycap>
          <Keycap graphite onClick={() => setConfirm('close')} style={{ flex:1, height:40, fontSize:11 }}>CLOSE CH</Keycap>
        </div>
        </>)}

        {section === 'general' && (<>
        {/* Profile */}
        <div style={{ padding:'14px 16px 6px', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{
            width:44, height:44, background:'var(--signal)',
            borderRadius:14,
            display:'grid', placeItems:'center',
            boxShadow:'inset 0 1px 0 rgba(255,255,255,.3), inset 0 -1px 0 rgba(0,0,0,.2), 0 1px 2px rgba(58,51,42,.1)',
          }}>
            <span style={{ fontFamily:'var(--mono)', fontSize:18, fontWeight:600, color:'var(--mist-0)' }}>J</span>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            <span style={{ fontFamily:'var(--sans)', fontSize:15, fontWeight:600 }}>Jay<span className="crt-cursor crt-cursor-sm crt-cursor-green"/></span>
            <span className="mono" style={{ fontSize:10, letterSpacing:'.12em', color:'var(--ink-35)' }}>{T('profile_tag')}</span>
          </div>
          <div style={{ flex:1 }}/>
          {/* EDIT 액션 미구현 — opacity 0.35로 비활성 표시, → 화살표 제거 */}
          <span className="lbl" style={{ opacity:0.35, cursor:'default' }}>{isKr ? '편집' : 'EDIT'}</span>
        </div>

        <Section title={T('language')}>
          <div style={{
            padding:'10px 16px', display:'flex', gap:6, alignItems:'center',
            background:'var(--mist-0)',
          }}>
            <span className="lbl" style={{ color:'var(--ink-55)', minWidth:110 }}>{T('language')}</span>
            <div style={{ flex:1 }}/>
            <div style={{ display:'flex', gap:4, padding:3, borderRadius:10, background:'var(--mist-2)', boxShadow:'inset 0 1px 2px rgba(0,0,0,.08)' }}>
              {[['en', T('eng')], ['kr', T('kor')]].map(([L, lbl]) => (
                <button key={L} onClick={()=>setLang(L)} style={{
                  border:'none', cursor:'pointer',
                  padding:'6px 12px', minWidth:68, borderRadius:7,
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
          <Row first label={T('auto_tune')}
            value={<span style={{ opacity: autoTune ? 1 : 0.4 }}>Last used · 447.1</span>}
            right={<Toggle on={autoTune} onToggle={(v)=>flip('autoTune', v, setAutoTune)}/>}
          />
        </Section>

        <Section title={T('capture')}>
          <Row first label={T('aspect')} value="3 : 4 · Locked"/>
          <Row label={T('shutter_sound')} value="" right={<Toggle on={shutter} onToggle={(v)=>flip('shutter', v, setShutter)}/>}/>
          <Row label={T('grid')} value={<span style={{ opacity: grid ? 1 : 0.4 }}>3 × 3</span>} right={<Toggle on={grid} onToggle={(v)=>flip('grid', v, setGrid)}/>}/>
        </Section>

        <Section title={T('privacy')}>
          <Row first label={T('auto_vanish')} value="24H · Non-negotiable"/>
        </Section>

        <Section title={T('about')}>
          <Row first label={T('version')} value="0.4 · Rev 2026.04.24"/>
          {/* TERMS 액션 미구현 — '→' 화살표 제거하고 그냥 'View'만, dim 처리 */}
          <Row label={T('terms')} value={<span style={{ opacity:0.4 }}>{isKr ? '보기' : 'View'}</span>}/>
        </Section>

        <div style={{ padding:'22px 16px 20px', display:'flex', flexDirection:'column', gap:8 }}>
          {/* SIGN OUT 미구현 — disabled 비주얼, no onClick */}
          <Keycap style={{ width:'100%', height:42, fontSize:11, opacity:0.4, cursor:'default' }}>{T('sign_out')}</Keycap>
          <Keycap graphite onClick={() => setConfirm('delete')} style={{ width:'100%', height:42, fontSize:11 }}>{T('delete_acct')}</Keycap>
        </div>
        </>)}
      </div>

      {/* TabBar는 라우터 레벨에서 fixed로 렌더 */}

      <ConfirmSheet
        open={!!confirm}
        title={cfg?.title || ''}
        body={cfg?.body || ''}
        confirmLabel={cfg?.yes || 'CONFIRM'}
        cancelLabel={isKr ? '취소' : 'CANCEL'}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          const fn = cfg?.run;
          setConfirm(null);
          if (fn) fn();
        }}
      />

      <InviteSheet
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        channel="447.1"
      />
    </div>
  );
}
