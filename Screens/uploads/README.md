# FREQUENCY

> 같은 주파수에 맞춘 사람들만 통하는 시각적 무전기.
> 무전기 + 필름카메라 하이브리드. 채널당 최대 9인, 2시간 라운드, 24시간 자동 휘발.

## 시안 구성

- **00 Overview** — 진행 상황 + 디자인 시스템 + 로드맵 한눈에
- **01 Tune In** — 주파수 4자리 입력으로 채널 진입 (반원 게이지 + LED Lock)
- **02 Channel Feed** — 인원수별 모자이크 + 12 라운드 가로 스와이프
- **03 Camera** — 짧게 = 사진 / 길게 = 5초 영상 통합 셔터, 캡션 입력
- **04 Post Detail** — 5 스탬프 + 댓글 40자 + 멤버 컬러 칩
- **05 Open Channel** — host 채널 발급 + 닉네임/컬러 + 슬롯 머신
- **06 Members + Channel Info** — 멤버 9 + Polaroid 칩 + host 권한 + leave
- **99 Flow Prototype** — 5개 시안 실제 navigation 연결

## 디자인 시스템

- **Palette C · Ivory Paper**: paper bg `#EDE6D7` + ink `#141211` + Signal Green `#197A3E` + TE Orange `#F15A24`
- **Member Colors · Polaroid Film**: KODAK / VELVIA / POLAROID / EKTA / MINT / SEPIA / LAVENDER / BURNT + GREEN(self)
- **Aspect Ratio**: 모든 시각 컨텐츠 3:4 절대 고정
- **Typography**: JetBrains Mono (라벨/숫자) + Pretendard (본문)
- **Mood**: Teenage Engineering · Dieter Rams · iPod Nano 정밀도

## 모바일 미리보기

iPhone Safari 에서 접속하면 자동으로 page-head/notes 숨기고 iPhone frame 풀스크린으로 stretch.

## 구조

```
.
├── README.md
├── index.html                    # → Screens/00-overview.html redirect
├── shared/
│   └── mobile.css                # 공통 모바일 viewport override
├── Screens/                      # 시안 HTML
│   ├── 00-overview.html
│   ├── 01-tune-in-b-v2-hybrid.html
│   ├── 02-feed-v2-mosaic.html
│   ├── 03-camera-v1.html
│   ├── 04-post-detail-v1.html
│   ├── 05-open-channel-v1.html
│   ├── 06-members-info-v1.html
│   └── 99-flow-prototype.html
├── Design-System/
├── Plan/
└── Previous/                     # 이전 시안 버전 보존
```

---

2026.04.23
