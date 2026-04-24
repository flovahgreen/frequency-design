// FREQUENCY — Mobile App Mode
// 데스크탑 캔버스(freq-app.jsx)와 별개로, 한 화면씩 풀스크린으로 보여주는
// 실기기 사용 시뮬용 router. iPhone Safari에서 "실제 앱처럼" 느낌.

const { useState: useMState, useEffect: useMEffect } = React;

try { window.FREQ_LANG = localStorage.getItem('FREQ_LANG') || 'kr'; } catch(e){ window.FREQ_LANG = 'kr'; }

// id alias map: 시안 코드에서 window.FREQ_NAV('feed') 처럼 친숙한 이름으로 호출
const NAV_ALIAS = {
  tune: 0, '01': 0,
  feed: 1, '02': 1,
  camera: 2, cam: 2, '03': 2,
  review: 3, '03b': 3,
  post: 4, '04': 4,
  open: 5, '05': 5,
  info: 6, members: 6, '06': 6,
  settings: 7, set: 7, '07': 7,
};

function MobileRouter() {
  const [screen, setScreen] = useMState(0);
  const [lang, setLangState] = useMState(window.FREQ_LANG || 'kr');

  const screens = [
    { id: '01',  label: 'TUNE',   Comp: Screen01TuneIn },
    { id: '02',  label: 'FEED',   Comp: Screen02Feed },
    { id: '03',  label: 'CAM',    Comp: Screen03Camera },
    { id: '03b', label: 'REVIEW', Comp: Screen03bReview },
    { id: '04',  label: 'POST',   Comp: Screen04Post },
    { id: '05',  label: 'OPEN',   Comp: Screen05Open },
    { id: '06',  label: 'INFO',   Comp: Screen06Members },
    { id: '07',  label: 'SET',    Comp: Screen07Settings },
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

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--mist-0)',
      color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      paddingTop: 'env(safe-area-inset-top, 0)',
    }}>
      {/* main screen area — 풀스크린, 각 컴포넌트가 flex:1 로 채움 */}
      <div key={screen} data-mobile-main style={{
        flex: 1, minHeight: 0,
        display: 'flex', flexDirection: 'column',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}>
        <Current />
      </div>

      {/* bottom nav bar */}
      <nav style={{
        flexShrink: 0,
        background: 'var(--mist-1)',
        borderTop: '1px solid var(--mist-3)',
        padding: '6px 4px calc(env(safe-area-inset-bottom, 6px) + 6px)',
        display: 'flex',
        gap: 2,
        overflowX: 'auto',
      }} className="no-scrollbar">
        {/* lang toggle */}
        <div style={{
          display: 'flex', gap: 2, padding: 2,
          background: 'var(--mist-2)',
          borderRadius: 3,
          flexShrink: 0, alignSelf: 'center',
          boxShadow: 'inset 0 1px 1px rgba(0,0,0,.06)',
        }}>
          {[['en','EN'],['kr','한']].map(([L, lbl]) => (
            <button key={L} onClick={() => setLang(L)} style={{
              border: 'none',
              background: lang === L ? 'var(--ink)' : 'transparent',
              color: lang === L ? 'var(--mist-0)' : 'var(--ink-55)',
              fontFamily: 'var(--mono)', fontSize: 9, fontWeight: 600,
              padding: '5px 7px', cursor: 'pointer', borderRadius: 2,
              minWidth: 22,
              letterSpacing: '0.04em',
            }}>{lbl}</button>
          ))}
        </div>
        <div style={{ width: 1, background: 'var(--mist-3)', alignSelf: 'stretch', margin: '4px 2px', flexShrink: 0 }}/>
        {/* screen tabs */}
        {screens.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setScreen(i)}
            style={{
              flex: '1 0 auto',
              padding: '6px 5px',
              border: 'none',
              background: i === screen ? 'var(--ink)' : 'transparent',
              color: i === screen ? 'var(--mist-0)' : 'var(--ink-55)',
              fontFamily: 'var(--mono)',
              letterSpacing: '0.06em', fontWeight: 600,
              borderRadius: 3, cursor: 'pointer',
              display: 'flex', flexDirection: 'column',
              gap: 1, alignItems: 'center', justifyContent: 'center',
              minWidth: 40,
            }}
          >
            <span style={{ fontSize: 8, opacity: 0.65 }}>{s.id}</span>
            <span style={{ fontSize: 9 }}>{s.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const mobileRoot = ReactDOM.createRoot(document.body.appendChild(document.createElement('div')));
mobileRoot.render(<MobileRouter/>);
