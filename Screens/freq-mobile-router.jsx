// FREQUENCY — Mobile App Mode
// 데스크탑 캔버스(freq-app.jsx)와 별개로, 한 화면씩 풀스크린으로 보여주는
// 실기기 사용 시뮬용 router. iPhone Safari에서 "실제 앱처럼" 느낌.

const { useState: useMState, useEffect: useMEffect } = React;

try { window.FREQ_LANG = localStorage.getItem('FREQ_LANG') || 'kr'; } catch(e){ window.FREQ_LANG = 'kr'; }

// ── Splash A: wordmark + signal dot ──
// pre → in (fade-in + letterspacing ease) → out (fade-out)
function Splash({ onDismiss }) {
  const [phase, setPhase] = React.useState('pre');

  React.useEffect(() => {
    const r = requestAnimationFrame(() => setPhase('in'));
    const t1 = setTimeout(() => setPhase('out'), 1100);
    const t2 = setTimeout(onDismiss, 1400);
    return () => { cancelAnimationFrame(r); clearTimeout(t1); clearTimeout(t2); };
  }, [onDismiss]);

  const visible = phase === 'in';
  const wordSpacing = phase === 'pre' ? '.55em' : '.36em';

  return (
    <div
      onClick={onDismiss}
      style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'var(--mist-0)',
        display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
        gap:18,
        opacity: visible ? 1 : 0,
        transition: 'opacity 280ms ease-out',
        cursor:'pointer',
        WebkitTapHighlightColor:'transparent',
        userSelect:'none',
      }}>
      <span style={{
        width:8, height:8, borderRadius:'50%',
        background:'var(--signal)',
        boxShadow:'0 0 10px rgba(181,255,68,.7)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms ease-out 60ms',
        animation: visible ? 'breathe 1.6s ease-in-out infinite' : 'none',
      }}/>
      <span style={{
        fontFamily:'var(--mono)', fontWeight:600,
        fontSize:18, textTransform:'uppercase',
        letterSpacing: wordSpacing,
        color:'var(--ink)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 360ms ease-out 180ms, letter-spacing 480ms ease-out 180ms',
      }}>FREQUENCY</span>
      <span style={{
        fontFamily:'var(--mono)', fontWeight:500,
        fontSize:8.5, letterSpacing:'.28em', textTransform:'uppercase',
        color:'var(--ink-35)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 320ms ease-out 460ms',
      }}>FM · 0000.0</span>
    </div>
  );
}

// id alias map: 시안 코드에서 window.FREQ_NAV('feed') 처럼 친숙한 이름으로 호출
// info/members 라우트는 Settings의 Channel 섹션으로 통합됨 → 'set'으로 리다이렉트
const NAV_ALIAS = {
  tune: 0, '01': 0,
  feed: 1, '02': 1,
  camera: 2, cam: 2, '03': 2,
  review: 3, '03b': 3,
  post: 4, '04': 4,
  open: 5, '05': 5,
  settings: 6, set: 6, '07': 6,
  info: 6, members: 6, '06': 6,
  rooms: 7, room_list: 7, '08': 7,
};

function MobileRouter() {
  const [screen, setScreen] = useMState(0);
  const [lang, setLangState] = useMState(window.FREQ_LANG || 'kr');
  const [showSplash, setShowSplash] = useMState(true);

  // INFO(Members) 화면은 Settings의 Channel 섹션으로 통합 → 라우터에서 제거
  // tab: 활성 표시할 탭 id (빈 값=어떤 탭도 활성 아님)
  // hideNav: 카메라 같은 풀스크린 모드에서 TabBar 자체 숨김
  const screens = [
    { id: '01',  label: 'TUNE',   Comp: Screen01TuneIn,    tab: '' },
    { id: '02',  label: 'FEED',   Comp: Screen02Feed,      tab: 'feed' },
    { id: '03',  label: 'CAM',    Comp: Screen03Camera,    tab: '',     hideNav: true },
    { id: '03b', label: 'REVIEW', Comp: Screen03bReview,   tab: '' },
    { id: '04',  label: 'POST',   Comp: Screen04Post,      tab: 'feed' },
    { id: '05',  label: 'OPEN',   Comp: Screen05Open,      tab: '' },
    { id: '07',  label: 'SET',    Comp: Screen07Settings,  tab: 'set' },
    { id: '08',  label: 'ROOMS',  Comp: Screen08Rooms,     tab: 'feed' },
  ];

  // 글로벌 navigate — 시안 컴포넌트에서 window.FREQ_NAV('feed') 처럼 호출
  useMEffect(() => {
    window.FREQ_NAV = (key) => {
      const idx = (typeof key === 'number') ? key : NAV_ALIAS[String(key).toLowerCase()];
      if (idx !== undefined) {
        setScreen(idx);
        // iOS 햅틱 (지원 시)
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch(e){} }
        // 스크롤 맨 위로
        setTimeout(() => {
          const main = document.querySelector('[data-mobile-main]');
          if (main) main.scrollTop = 0;
        }, 0);
      }
    };
    return () => { delete window.FREQ_NAV; };
  }, []);

  const setLang = (L) => {
    window.FREQ_LANG = L;
    try { localStorage.setItem('FREQ_LANG', L); } catch(e){}
    setLangState(L);
    window.dispatchEvent(new CustomEvent('freq-lang-change'));
  };

  // listen to external lang change (다른 탭 등)
  useMEffect(() => {
    const h = () => setLangState(window.FREQ_LANG || 'kr');
    window.addEventListener('freq-lang-change', h);
    return () => window.removeEventListener('freq-lang-change', h);
  }, []);

  // lang 변경 시 body class 토글 → CSS 110% 스케일 적용
  useMEffect(() => {
    document.body.classList.toggle('lang-kr', lang === 'kr');
    document.body.classList.toggle('lang-en', lang === 'en');
    return () => {
      document.body.classList.remove('lang-kr');
      document.body.classList.remove('lang-en');
    };
  }, [lang]);

  // swipe gesture (좌우 스와이프로 시안 이동)
  useMEffect(() => {
    let startX = 0, startY = 0, moved = false;
    const onStart = (e) => {
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY; moved = false;
    };
    const onMove = (e) => {
      if (moved) return;
      const t = e.touches ? e.touches[0] : e;
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        moved = true;
        if (dx < 0 && screen < screens.length - 1) setScreen(screen + 1);
        else if (dx > 0 && screen > 0) setScreen(screen - 1);
      }
    };
    document.addEventListener('touchstart', onStart, { passive: true });
    document.addEventListener('touchmove', onMove, { passive: true });
    return () => {
      document.removeEventListener('touchstart', onStart);
      document.removeEventListener('touchmove', onMove);
    };
  }, [screen]);

  const Current = screens[screen].Comp;
  const currentTab = screens[screen].tab;
  const hideNav = !!screens[screen].hideNav;

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--mist-0)',
      color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      paddingTop: 'env(safe-area-inset-top, 0)',
      // paddingBottom 제거 → TabBar가 자체 safe-area 처리, 화면 바닥까지 닿음
    }}>
      {/* scrollable main area — TabBar 영역만큼 줄어든 viewport */}
      <div key={screen} data-mobile-main style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <Current />
      </div>
      {/* TabBar — 스크롤과 무관하게 항상 바닥에 고정. 카메라에서만 숨김 */}
      {!hideNav && <TabBar active={currentTab}/>}
      {showSplash && <Splash onDismiss={() => setShowSplash(false)} />}
    </div>
  );
}

const mobileRoot = ReactDOM.createRoot(document.body.appendChild(document.createElement('div')));
mobileRoot.render(<MobileRouter/>);
