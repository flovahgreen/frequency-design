# FREQUENCY

> 같은 주파수에 맞춘 사람들만 통하는 시각적 무전기.
> 무전기 + 필름카메라 하이브리드. 채널당 최대 9인, 2시간 라운드, 24시간 자동 휘발.

## 현재 디자인 · Paper Mist v1

**Screens/frequency.html** 이 메인 entry. React (UMD) + Babel inline 으로 5개 시안을 한 캔버스에 배치.

### 시안 구성 (Screens/freq-screens.jsx)

- **Screen 01 · Tune In** — 반원 게이지 다이얼, 4자리 입력 → 정중앙 0° 정렬
- **Screen 02 · Channel Feed** — 인원수별 모자이크 (n=7 기본), 멤버 컬러 칩
- **Screen 03 · Camera** — 통합 셔터 (짧게 사진 / 길게 영상)
- **Screen 03b · Review** — 촬영 후 캡션 입력 + USE/RETAKE
- **Screen 04 · Post Detail** — 5 스탬프 + 댓글 40자
- **Screen 05 · Open Channel** — 3 phase (SETUP → BROADCASTING → READY)

### Paper Mist 디자인 시스템

**컬러 (grayscale base + 액센트 2색)**
- `--mist-0`: `#F2F1EE` (lightest)
- `--mist-1`: `#E8E6E1`
- `--mist-2`: `#DCDAD4`
- `--mist-3`: `#C4C1BA`
- `--mist-4`: `#A4A19A`
- `--graphite`: `#2A2826` (dark surface)
- `--ink`: `#141211` (text)
- `--signal`: `#197A3E` (LIVE / OK)
- `--amber`: `#E96A2A` (CTA / cursor)

**멤버 컬러 (Polaroid Film, muted)**
- `--m-kodak`: `#C9A044`
- `--m-velvia`: `#A94A3E`
- `--m-polaroid`: `#BE7E80`
- `--m-ekta`: `#516E94`
- `--m-mint`: `#6E9883`
- `--m-sepia`: `#7D6143`
- `--m-lavender`: `#8F779E`
- `--m-burnt`: `#A95C34`

**디자인 모티프**
- **Mechanical key cap** (`.cap`): 인셋 하이라이트 + 베이스 섀도우, 누르면 1px 내려감
- **Recessed well** (`.well`): 함몰부 (input 영역 등)
- **CRT cursor** (`.crt-cursor`): amber 굵은 깜빡임 (레트로 터미널)
- **Film stripe** (`.film-stripe`): 사진 영역 placeholder (135° diagonal stripe)
- **Member chip** (`.chip`): 사각 (라운드 0), 모노, swatch dot 포함

**타이포**
- 모노: JetBrains Mono (`.mono`, `.lbl`, `.lbl-dk`)
- 산세리프: Inter (본문, Pretendard 폴백)

**핵심 규칙 (불변)**
- 모든 시각 컨텐츠 3:4 비율 절대 고정
- 인앱 카메라만 (갤러리 import 없음)
- 채널 9인 / 2H 라운드 / 24H 자동 휘발

## 폴더 구조

```
.
├── README.md
├── index.html                          # → Screens/frequency.html redirect
├── Screens/                            # 현재 메인 디자인 (Paper Mist v1)
│   ├── frequency.html                  # entry · React + Babel inline
│   ├── freq-app.jsx                    # 앱 root
│   ├── freq-screens.jsx                # 5개 시안 컴포넌트
│   ├── freq-shared.jsx                 # 공통 컴포넌트
│   ├── ios-frame.jsx                   # iPhone frame
│   ├── design-canvas.jsx               # canvas 레이아웃
│   ├── tweaks-panel.jsx                # 조정 패널
│   ├── screenshots/                    # 시안 캡처
│   └── uploads/                        # 참고 이미지
├── Previous_Screens_v1/                # 이전 HTML 시안 (백업, 2026.04.23)
│   ├── 00-overview.html
│   ├── 01-tune-in-b-v2-hybrid.html
│   ├── 02-feed-v2-mosaic.html
│   ├── 03-camera-v1.html
│   ├── 04-post-detail-v1.html
│   ├── 05-open-channel-v1.html
│   ├── 06-members-info-v1.html
│   └── 99-flow-prototype.html
├── shared/                             # 공통 리소스 (사용 보류)
│   └── mobile.css
├── Design-System/                      # 디자인 토큰 정의
├── Plan/                               # 컨셉 문서
└── Previous/                           # 더 이전 시안들
```

---

2026.04.24
