// Shared FREQUENCY primitives — in the spirit of Dieter Rams + TE OP-1
// Greyscale base, micro-accents of green (signal) and one amber key per screen.

// Simple i18n — controlled by window.FREQ_LANG ('en' | 'kr')
const FREQ_STRINGS = {
  en: {
    tune_top: 'Frequency · Tune', step: 'ENTER', host_step: 'HOST',
    locked: 'LOCKED', scanning: 'SCANNING',
    live: 'LIVE', channel: 'CHANNEL', round: 'ROUND',
    feed_round: 'Round', feed_live: 'Live',
    shoot_title: 'Shoot · Round 08', shoot_timer: '03:12 Left',
    tap_hold: 'Tap · Photo  ·  Hold · 3s', flip: 'Flip', last: 'Last',
    retake: 'RETAKE', review: 'REVIEW · F·08',
    caption_opt: 'Caption · Optional', send_channel: 'SEND TO CHANNEL →',
    send: 'SEND', say_placeholder: 'Say',
    open_channel: 'Open Channel',
    broadcasting: 'Broadcasting · 02:41', airwaves: 'Airwaves · Open',
    you_host: 'You · Host', incoming: 'Incoming · 2 / 9',
    waiting: 'Waiting', cancel: 'CANCEL', start_round: 'START ROUND 01 →',
    roster: 'Roster · 7', host_you: 'Host · You', open_slot: 'Open slot',
    invite: 'INVITE', leave: 'LEAVE', close_ch: 'CLOSE CH',
    members: 'Members', rounds: 'Rounds', expires: 'Expires',
    settings: 'SETTINGS', signal_sec: 'Signal', capture: 'Capture',
    privacy: 'Privacy', appearance: 'Appearance', about: 'About',
    default_unit: 'DEFAULT UNIT', auto_tune: 'AUTO-TUNE',
    led_bright: 'LED BRIGHTNESS', aspect: 'ASPECT RATIO',
    shutter_sound: 'SHUTTER SOUND', haptic: 'HAPTIC', grid: 'GRID OVERLAY',
    auto_vanish: 'AUTO VANISH', receipts: 'READ RECEIPTS',
    screen_lock: 'SCREENSHOT LOCK',
    palette: 'PALETTE', accent: 'ACCENT', type_scale: 'TYPE SCALE',
    version: 'VERSION', build: 'BUILD', terms: 'TERMS · PRIVACY', view: 'View →',
    sign_out: 'SIGN OUT', delete_acct: 'DELETE ACCOUNT',
    edit: 'EDIT →', language: 'LANGUAGE', eng: 'English', kor: '한국어',
    profile_tag: '@jay · YOU',
  },
  kr: {
    tune_top: 'Frequency · Tune', step: 'ENTER', host_step: 'HOST',
    locked: '잠김', scanning: '탐색 중',
    live: '송신', channel: '채널', round: '라운드',
    feed_round: '라운드', feed_live: '송신',
    shoot_title: '촬영 · 8라운드', shoot_timer: '03:12 남음',
    tap_hold: '탭 · 사진  ·  길게 · 3초', flip: '전환', last: '최근',
    retake: '다시 찍기', review: '확인 · F·08',
    caption_opt: '한 줄 · 선택', send_channel: '채널로 보내기 →',
    send: '전송', say_placeholder: '한마디',
    open_channel: '채널 열기',
    broadcasting: '송출 중 · 02:41', airwaves: '전파 · 열림',
    you_host: '당신 · 호스트', incoming: '입장 · 2 / 9',
    waiting: '대기', cancel: '취소', start_round: '1라운드 시작 →',
    roster: '명단 · 7', host_you: '호스트 · 당신', open_slot: '빈 자리',
    invite: '초대', leave: '나가기', close_ch: '채널 닫기',
    members: '인원', rounds: '라운드', expires: '만료',
    settings: '설정', signal_sec: '신호', capture: '촬영',
    privacy: '프라이버시', appearance: '외관', about: '정보',
    default_unit: '기본 단위', auto_tune: '자동 튜닝',
    led_bright: 'LED 밝기', aspect: '화면 비율',
    shutter_sound: '셔터음', haptic: '햅틱', grid: '그리드',
    auto_vanish: '자동 소멸', receipts: '읽음 표시',
    screen_lock: '스크린샷 잠금',
    palette: '팔레트', accent: '강조', type_scale: '글자 크기',
    version: '버전', build: '빌드', terms: '약관 · 개인정보', view: '보기 →',
    sign_out: '로그아웃', delete_acct: '계정 삭제',
    edit: '편집 →', language: '언어', eng: 'English', kor: '한국어',
    profile_tag: '@jay · 나',
  },
};
function T(key){
  const lang = window.FREQ_LANG || 'en';
  return (FREQ_STRINGS[lang] && FREQ_STRINGS[lang][key]) || FREQ_STRINGS.en[key] || key;
}

// ── FREQ_ROOMS · 사용자가 참여 중인 채널 데이터 (single source of truth) ──
// nameKr/nameEn = 양 언어. members = mosaic에 표시될 chip id 배열 (YOU 포함).
// captions = 멤버별 샘플 캡션 (kr/en 키). round/totalRounds, expiresIn = 헤더/strip.
const FREQ_ROOMS = [
  {
    code:'447.1',
    nameKr:'가족',           nameEn:'Family',
    members:['YOU','KODAK','VELVIA','POLAROID','EKTA','MINT','SEPIA'],
    round:8, totalRounds:12, expiresIn:'22h 12m',
    captions:{
      kr:{ KODAK:'햇살 미쳤다', VELVIA:'여기 카페 어디?', POLAROID:'아침 산책', EKTA:'필름 다 썼어', MINT:'컵 사고 싶다', SEPIA:'오후 빛' },
      en:{ KODAK:'light is unreal', VELVIA:'where is this', POLAROID:'morning walk', EKTA:'roll finished', MINT:'i need this mug', SEPIA:'afternoon light' },
    },
  },
  {
    code:'661.4',
    nameKr:'커피 크루',       nameEn:'Coffee Crew',
    members:['YOU','EKTA','MINT','BURNT'],
    round:3, totalRounds:12, expiresIn:'22h 30m',
    captions:{
      kr:{ EKTA:'아메리카노', MINT:'오늘 신메뉴', BURNT:'시럽 한번 더' },
      en:{ EKTA:'americano', MINT:'new bean today', BURNT:'extra syrup' },
    },
  },
  {
    code:'888.2',
    nameKr:'일요 등산',       nameEn:'Sunday Hiking',
    members:['YOU','KODAK','POLAROID','SEPIA','LAVENDER'],
    round:12, totalRounds:12, expiresIn:'ENDED',
    ended:true,
    captions:{
      kr:{ KODAK:'정상 도착', POLAROID:'바람 시원', SEPIA:'내려가기 싫다', LAVENDER:'단풍' },
      en:{ KODAK:'summit', POLAROID:'breezy', SEPIA:'don’t wanna go down', LAVENDER:'autumn leaves' },
    },
  },
];

// active room helpers
function getActiveRoomIndex(){
  try {
    const v = parseInt(localStorage.getItem('FREQ_ACTIVE_ROOM') || '0', 10);
    return Math.max(0, Math.min(FREQ_ROOMS.length - 1, isNaN(v) ? 0 : v));
  } catch(_) { return 0; }
}
function setActiveRoomIndex(i){
  try { localStorage.setItem('FREQ_ACTIVE_ROOM', String(i)); } catch(_){}
  window.dispatchEvent(new CustomEvent('freq-room-change'));
}
function getActiveRoom(){ return FREQ_ROOMS[getActiveRoomIndex()]; }

const MEMBER_COLORS = {
  YOU: { name: 'YOU', color: 'var(--signal)' },
  KODAK: { name: 'KODAK', color: 'var(--m-kodak)' },
  VELVIA: { name: 'VELVIA', color: 'var(--m-velvia)' },
  POLAROID: { name: 'POLAR', color: 'var(--m-polaroid)' },
  EKTA: { name: 'EKTA', color: 'var(--m-ekta)' },
  MINT: { name: 'MINT', color: 'var(--m-mint)' },
  SEPIA: { name: 'SEPIA', color: 'var(--m-sepia)' },
  LAVENDER: { name: 'LAVEN', color: 'var(--m-lavender)' },
  BURNT: { name: 'BURNT', color: 'var(--m-burnt)' },
};

// Square member chip — mono label, solid fill on paper
function Chip({ who, size = 'sm', dot = true, style }) {
  const m = MEMBER_COLORS[who] || MEMBER_COLORS.KODAK;
  const fontSize = size === 'lg' ? 11 : 9.5;
  const pad = size === 'lg' ? '4px 8px' : '3px 6px';
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      fontFamily:'var(--mono)', fontSize, letterSpacing:'.12em',
      textTransform:'uppercase', fontWeight:500,
      padding:pad, background:'var(--mist-1)',
      boxShadow:'inset 0 0 0 1px var(--mist-3)',
      color:'var(--ink)', lineHeight:1, ...style,
    }}>
      {dot && <span style={{ width:6, height:6, background:m.color, display:'block' }}/>}
      {m.name}
    </span>
  );
}

// Tiny status pill, e.g. "LIVE" or "CH 4471"
function StatusLabel({ children, variant = 'ink' }) {
  const fg = variant === 'signal' ? 'var(--signal)' : variant === 'amber' ? 'var(--amber)' : 'var(--ink)';
  return (
    <span style={{
      fontFamily:'var(--mono)', fontSize:10, letterSpacing:'.14em',
      textTransform:'uppercase', fontWeight:500, color:fg,
    }}>{children}</span>
  );
}

// Screen header — graphite bar. Layout: [signal] ··· [center: channel ⌄] ··· [timer]
// 채널 코드 버튼이 가운데로 가서 방 목록 진입점이 명확
function ScreenHeader({ channel = '4471', timer = '01:47:33', members = 7, onMenu, title }) {
  return (
    <div style={{
      background:'var(--graphite)', color:'var(--mist-0)',
      paddingTop:'calc(env(safe-area-inset-top, 0px) + 12px)',
      paddingBottom:12, paddingLeft:16, paddingRight:16,
      position:'relative',
      display:'flex', alignItems:'center',
      boxShadow:'inset 0 -1px 0 rgba(0,0,0,.4)',
    }}>
      {/* signal pulse — left */}
      <span className="signal-dot"/>
      <div style={{ flex:1 }}/>
      {/* expiry timer — right · 작은 모래시계 아이콘 + 듀레이션 형식으로 "잔여 시간" 명확 */}
      <div style={{ display:'flex', alignItems:'center', gap:5 }}>
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path d="M3 1.5 H9 L7 5 L9 8.5 V10.5 H3 V8.5 L5 5 L3 1.5 Z"
            stroke="rgba(240,232,216,.65)" strokeWidth="1.1" strokeLinejoin="round" fill="none"/>
          <path d="M4.5 9.5 H7.5" stroke="rgba(240,232,216,.65)" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>
        <span style={{ fontFamily:'var(--mono)', fontSize:12, letterSpacing:'.06em', fontVariantNumeric:'tabular-nums', color:'rgba(240,232,216,.85)', fontWeight:600 }}>{timer}</span>
      </div>

      {/* Channel code button — absolutely centered, tappable to open Rooms */}
      <button
        onClick={() => { if (window.FREQ_NAV) window.FREQ_NAV('rooms'); }}
        style={{
          position:'absolute', left:'50%', top:'calc(env(safe-area-inset-top, 0px) + 12px)',
          transform:'translateX(-50%)',
          background:'transparent', border:'none', padding:0, cursor:'pointer',
          display:'flex', alignItems:'center', gap:6,
          WebkitTapHighlightColor:'transparent',
        }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:17, letterSpacing:'.16em', fontWeight:700, color:'var(--mist-0)' }}>{channel}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 3.5 L5 6.5 L8 3.5" stroke="rgba(240,232,216,.7)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// iPhone-size device wrapper — simplified
function Phone({ children, style }) {
  return (
    <div style={{
      width: 390, height: 844,
      background:'var(--mist-0)',
      borderRadius: 44,
      boxShadow:
        '0 0 0 10px #0a0908, 0 0 0 11px #2a2826, 0 24px 60px rgba(0,0,0,.18), 0 4px 12px rgba(0,0,0,.08)',
      position:'relative', overflow:'hidden',
      ...style,
    }}>
      {/* Dynamic Island */}
      <div style={{
        position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
        width:112, height:34, background:'#0a0908', borderRadius:20, zIndex:30,
      }}/>
      {/* iOS status bar */}
      <div style={{
        position:'absolute', top:0, left:0, right:0, height:54,
        padding:'16px 28px 0 28px',
        display:'flex', alignItems:'center', justifyContent:'space-between',
        fontFamily:'-apple-system, SF Pro Text, system-ui', fontWeight:600, fontSize:15, color:'var(--ink)',
        zIndex:31,
      }}>
        <span style={{ marginTop: 6 }}>9:41</span>
        <span style={{ marginTop: 6, display:'flex', alignItems:'center', gap:6 }}>
          <svg width="17" height="10" viewBox="0 0 17 10" fill="var(--ink)"><rect x="0" y="6" width="3" height="4" rx="0.6"/><rect x="4.5" y="4" width="3" height="6" rx="0.6"/><rect x="9" y="2" width="3" height="8" rx="0.6"/><rect x="13.5" y="0" width="3" height="10" rx="0.6"/></svg>
          <svg width="24" height="11" viewBox="0 0 24 11" fill="none"><rect x="0.5" y="0.5" width="20" height="10" rx="3" stroke="var(--ink)" strokeOpacity=".5"/><rect x="2" y="2" width="17" height="7" rx="1.5" fill="var(--ink)"/><rect x="21.5" y="3.5" width="1.5" height="4" rx="0.5" fill="var(--ink)" fillOpacity=".5"/></svg>
        </span>
      </div>
      {/* Home indicator */}
      <div style={{
        position:'absolute', bottom:8, left:'50%', transform:'translateX(-50%)',
        width:134, height:5, background:'var(--ink)', opacity:.55, borderRadius:3, zIndex:31,
      }}/>
      <div style={{ position:'absolute', inset:0, paddingTop:54, paddingBottom:24, display:'flex', flexDirection:'column' }}>
        {children}
      </div>
    </div>
  );
}

// Tab bar at bottom — 4 items
function TabBar({ active = 'feed' }) {
  // 3-tab nav: FEED(mint) / SHOOT(pink) / SET(blue) — each tab has its own polycarbonate accent color
  const NAV_MAP = { feed: 'feed', cam: 'camera', set: 'settings' };
  const Tab = ({ id, label, icon, color, glowColor }) => {
    const on = active === id;
    const handleClick = () => {
      if (window.FREQ_NAV) window.FREQ_NAV(NAV_MAP[id] || id);
    };
    return (
      <button onClick={handleClick} style={{
        flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:5,
        padding:'10px 0 8px',
        background: 'transparent', border: 'none', cursor: 'pointer',
        WebkitTapHighlightColor:'transparent',
      }}>
        <div style={{
          width:42, height:30, borderRadius:14,
          display:'grid', placeItems:'center',
          background: on
            ? `linear-gradient(180deg, ${color}, ${color})`
            : 'transparent',
          boxShadow: on
            ? `0 2px 8px ${glowColor}, inset 0 1px 0 rgba(255,255,255,.35)`
            : 'none',
          color: on ? '#FFFFFF' : 'var(--ink-35)',
          transition: 'background 150ms, box-shadow 150ms',
        }}>{icon}</div>
        <span style={{
          fontFamily:'var(--mono)', fontSize:8.5, letterSpacing:'.16em', textTransform:'uppercase',
          fontWeight: on ? 700 : 500,
          color: on ? 'var(--ink)' : 'var(--ink-35)',
        }}>{label}</span>
      </button>
    );
  };
  return (
    <div style={{
      borderTop:'1px solid var(--mist-3)',
      background:'var(--mist-0)',
      display:'flex',
      paddingBottom:'min(env(safe-area-inset-bottom, 0px), 10px)',
    }}>
      <Tab id="feed" label="Feed"
        color="var(--m-mint)" glowColor="rgba(93,221,167,.45)"
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            {[0,1,2].flatMap(r => [0,1,2].map(c => (
              <rect key={`${r}-${c}`} x={1 + c*6} y={1 + r*6} width="4" height="4" rx="1" ry="1" fill="currentColor"/>
            )))}
          </svg>
        }/>
      <Tab id="cam" label="Shoot"
        color="var(--amber)" glowColor="rgba(255,119,168,.5)"
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <circle cx="9" cy="9" r="4.6" stroke="currentColor" strokeWidth="1.2" fill="none"/>
            <circle cx="9" cy="9" r="1.8" fill="currentColor"/>
          </svg>
        }/>
      <Tab id="set" label="Set"
        color="var(--m-ekta)" glowColor="rgba(74,120,214,.45)"
        icon={
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <line x1="13.2" y1="4.8" x2="11.4" y2="6.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        }/>
    </div>
  );
}

// Key-cap style pressable button
function Keycap({ children, amber, graphite, onClick, style }) {
  const cls = ['cap'];
  if (amber) cls.push('cap-amber');
  if (graphite) cls.push('cap-graphite');
  return (
    <button onClick={onClick} className={cls.join(' ')} style={{
      border:'none', cursor:'pointer',
      fontFamily:'var(--mono)', fontWeight:500, letterSpacing:'.04em',
      ...style,
    }}>{children}</button>
  );
}

// Film-stripe placeholder (3:4 content) — rounded polycarbonate frame
function FilmPlaceholder({ label, style, children }) {
  return (
    <div className="film-stripe" style={{
      position:'relative', width:'100%', aspectRatio:'3/4',
      display:'grid', placeItems:'center',
      borderRadius:12, overflow:'hidden',
      boxShadow:'inset 0 0 0 1px rgba(58,51,42,.1)',
      ...style,
    }}>
      <span className="lbl" style={{ color:'rgba(45,38,32,.35)' }}>{label || 'FRAME'}</span>
      {children}
    </div>
  );
}

// BottomSheet — generic backdrop + slide-up shell. children rendered inside.
// Props: open, onClose (백드롭 클릭), children
function BottomSheet({ open, onClose, children }) {
  const [phase, setPhase] = React.useState('closed');

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setPhase('open'));
    } else if (phase !== 'closed') {
      setPhase('closing');
      const t = setTimeout(() => setPhase('closed'), 220);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open && phase === 'closed') return null;
  const visible = phase === 'open';

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:9000,
        background: visible ? 'rgba(45,38,32,.45)' : 'rgba(45,38,32,0)',
        transition:'background 220ms ease-out',
        display:'flex', alignItems:'flex-end',
      }}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width:'100%', background:'var(--mist-0)',
          padding:'20px 18px calc(env(safe-area-inset-bottom, 18px) + 18px)',
          borderRadius:'20px 20px 0 0',
          boxShadow:'0 -4px 20px rgba(58,51,42,.18)',
          transform: visible ? 'translateY(0)' : 'translateY(110%)',
          transition:'transform 240ms cubic-bezier(0.2,0,0,1)',
          display:'flex', flexDirection:'column', gap:14,
        }}>
        {/* drag handle indicator */}
        <div style={{
          width:36, height:4, borderRadius:2,
          background:'var(--mist-3)',
          margin:'-8px auto 4px',
        }}/>
        {children}
      </div>
    </div>
  );
}

// ConfirmSheet — bottom sheet for destructive / irreversible actions.
function ConfirmSheet({ open, title, body, confirmLabel = 'CONFIRM', cancelLabel = 'CANCEL', onConfirm, onCancel }) {
  return (
    <BottomSheet open={open} onClose={onCancel}>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <span className="lbl" style={{ color:'var(--ink)' }}>{title}</span>
        {body && (
          <span style={{ fontFamily:'var(--sans)', fontSize:14, lineHeight:1.5, color:'var(--ink-70)' }}>
            {body}
          </span>
        )}
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <Keycap onClick={onCancel} style={{ flex:1, height:44, fontSize:11 }}>{cancelLabel}</Keycap>
        <Keycap amber onClick={onConfirm} style={{ flex:1, height:44, fontSize:11 }}>{confirmLabel}</Keycap>
      </div>
    </BottomSheet>
  );
}

// InviteSheet — share channel code with friends.
// Big mono code display + COPY + SHARE actions.
function InviteSheet({ open, onClose, channel = '447.1' }) {
  const isKr = (window.FREQ_LANG || 'en') === 'kr';
  const [copyState, setCopyState] = React.useState('idle'); // 'idle' | 'copied'
  const code = channel;
  const shareText = isKr
    ? `FREQUENCY 채널 ${code} MHZ로 들어와줘`
    : `Tune in to my FREQUENCY channel: ${code} MHZ`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      if (navigator.vibrate) { try { navigator.vibrate(8); } catch(_){} }
      setTimeout(() => setCopyState('idle'), 1500);
    } catch(_) {
      // older browsers — fallback
      try {
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select(); document.execCommand('copy');
        document.body.removeChild(ta);
        setCopyState('copied');
        setTimeout(() => setCopyState('idle'), 1500);
      } catch(__) {}
    }
  };

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'FREQUENCY', text: shareText }); }
      catch(_) { /* user cancelled */ }
    } else {
      try { await navigator.clipboard.writeText(shareText); setCopyState('copied'); setTimeout(() => setCopyState('idle'), 1500); }
      catch(_) {}
    }
  };

  // reset copy state when sheet closes
  React.useEffect(() => { if (!open) setCopyState('idle'); }, [open]);

  // split channel into NNN + N for display formatting
  const parts = code.split('.');
  const intPart = parts[0] || code;
  const decPart = parts[1] || '';

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
        <span className="lbl" style={{ color:'var(--ink)' }}>{isKr ? '채널 초대' : 'INVITE TO CHANNEL'}</span>
        <span style={{ fontFamily:'var(--sans)', fontSize:13, color:'var(--ink-70)', lineHeight:1.5 }}>
          {isKr ? '아래 주파수 코드를 친구에게 공유하세요. TUNE 화면에서 입력하면 들어옵니다.' : 'Share this code with friends. They tune in from the TUNE screen.'}
        </span>
      </div>

      {/* big mono channel code */}
      <div style={{
        margin:'4px 0 6px',
        padding:'18px 14px', borderRadius:14,
        background:'var(--mist-1)',
        border:'1.5px solid var(--mist-3)',
        boxShadow:'inset 0 1px 0 rgba(255,255,255,.7), 0 1px 2px rgba(58,51,42,.06)',
        display:'flex', alignItems:'baseline', justifyContent:'center', gap:6,
      }}>
        <span style={{ fontFamily:'var(--mono)', fontSize:42, fontWeight:600, letterSpacing:'.06em', color:'var(--ink)', fontVariantNumeric:'tabular-nums' }}>{intPart}</span>
        {decPart && (<>
          <span style={{ fontFamily:'var(--mono)', fontSize:36, fontWeight:600, color:'var(--ink-35)', lineHeight:1 }}>.</span>
          <span style={{ fontFamily:'var(--mono)', fontSize:42, fontWeight:600, letterSpacing:'.06em', color:'var(--ink)', fontVariantNumeric:'tabular-nums' }}>{decPart}</span>
        </>)}
        <span style={{ fontFamily:'var(--mono)', fontSize:11, letterSpacing:'.2em', color:'var(--ink-55)', alignSelf:'flex-end', paddingBottom:6, marginLeft:4 }}>MHZ</span>
      </div>

      {/* actions */}
      <div style={{ display:'flex', gap:8 }}>
        <Keycap onClick={copyCode} style={{ flex:1, height:44, fontSize:11 }}>
          {copyState === 'copied' ? (isKr ? '복사됨' : 'COPIED') : (isKr ? '코드 복사' : 'COPY CODE')}
        </Keycap>
        <Keycap amber onClick={share} style={{ flex:1, height:44, fontSize:11 }}>
          {isKr ? '공유하기' : 'SHARE'}
        </Keycap>
      </div>
    </BottomSheet>
  );
}

Object.assign(window, {
  MEMBER_COLORS, Chip, StatusLabel, ScreenHeader, Phone, TabBar, Keycap, FilmPlaceholder,
  BottomSheet, ConfirmSheet, InviteSheet, T, FREQ_STRINGS,
  FREQ_ROOMS, getActiveRoomIndex, setActiveRoomIndex, getActiveRoom,
});
