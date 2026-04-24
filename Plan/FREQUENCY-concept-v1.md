# FREQUENCY - Product Concept Document v1.0

**Date:** 2026-04-22
**Status:** Concept Confirmed

---

## 1. Product Identity

**App Name:** FREQUENCY
**Icon Abbreviation:** FQ
**Korean Reading:** 프리퀀시

**One-line Identity:**
> "같은 주파수에 맞춘 사람들만 통하는 시각적 무전기"

**What This Is:**
앱이 아니라 "기기"다. 유저는 앱을 "여는" 것이 아니라 기기를 "켜는" 것이고, 게시물을 "올리는" 것이 아니라 신호를 "송신하는" 것이다.

**What This Is NOT:**
- SNS의 비공개 버전이 아니다
- Setlog의 카피가 아니다
- 아카이빙/기록 앱이 아니다
- 메타포를 과시하는 테마 앱이 아니다

**Core Value:**
의무 없이, 내가 원할 때 지금 이 순간을 가장 가까운 사람들과 나누는 곳.

---

## 2. Concept Foundation

### Dual-Soul Hybrid

| Soul | Domain | Role |
|------|--------|------|
| Walkie-Talkie (무전기) | App structure, social system | "누구와 어떻게 연결되는가" 정의 |
| Film Camera (필름 카메라) | Capture experience | "어떻게 찍고 보내는가" 정의 |

### Metaphor Rule (Critical)
메타포는 **시스템 설계**와 **용어 체계**의 보이지 않는 뼈대로만 존재한다.
UI 표면에서 무전기/카메라를 시각적으로 표현하지 않는다.
"무전기처럼 생긴 앱"이 아니라 "쓰는 방식이 무전기적인 앱"이다.

TE가 TP-7을 만든 방식과 같다:
겉은 현대적 알루미늄 블록이지만, 작동 원리가 테이프 레코더다.

### UX Sensitivity Standard: iPod Nano
눈에 띄는 테마가 아니라 손끝으로 느끼는 미세한 디테일.
클릭휠의 무게감, 스크롤 관성, 전환 타이밍 같은 보이지 않는 정밀함.
기기 자체가 테마를 주장하지 않지만, 만지는 순간 품질이 느껴지는 레벨.

---

## 3. Differentiation from Setlog

| | Setlog | FREQUENCY |
|---|---|---|
| User mental model | "비공개 SNS를 연다" | "통신 기기를 켠다" |
| Posting | "게시물을 올린다" | "신호를 송신한다" |
| Time limit feel | "1시간마다 올려야 한다" (의무) | "다음 송신까지 대기 중" (기기 상태) |
| Inactive user | "공백, 빈칸" (부담) | "Standby / 수신 대기" (자연스러움) |
| Notification | 매 시간 정각 알림 (피로) | 수신 시에만, 조용하게 |
| Video length | 3초 | 5-10초 |
| Interval | 1시간 | 2시간 |
| Overall feel | Casual social | Precision instrument |

**Design principles derived from Setlog pain points:**

| Setlog Pain | FREQUENCY Principle |
|---|---|
| 매 시간 알림이 피곤 | 알림은 부드럽고 선택적 |
| 자주 올려야 해서 부담 | 2시간 간격으로 여유 |
| 바쁜 친구 공백이 신경쓰임 | 공백이 자연스러운 구조 (Standby) |
| 3초 영상은 너무 짧음 | 5-10초 |
| UI 오류 많음 | iPod Nano급 정밀 UI |

---

## 4. Language System

### Structure Terms (from Walkie-Talkie)

| Generic | FREQUENCY | Description |
|---------|-----------|-------------|
| Room | **Channel** | 같은 주파수를 공유하는 공간 |
| Invite code | **Frequency** | 채널 고유 주파수 번호 (예: 107.4) |
| Join room | **Tune In** | 주파수를 맞춰 채널에 연결 |
| Leave room | **Sign Off** | 채널에서 연결 해제 |
| Create room | **Open Channel** | 새 주파수 개설 |
| Member | **Crew** | 같은 채널에 연결된 사람들 |
| Online/Active | **On Air** | 송수신 가능 상태 |
| Offline/Inactive | **Standby** | 대기 중 |
| Notification | **Signal** | 신호 수신 알림 |
| Username | **Callsign** | 호출 부호 |

### Content Terms (Walkie-Talkie + Film Camera)

| Generic | FREQUENCY | Description |
|---------|-----------|-------------|
| Post/Upload | **Transmit** | 신호 송신 |
| View | **Receive** | 수신된 신호 확인 |
| Feed/Timeline | **Log** | 수신 기록 (시간순) |
| Comment | **Copy** | "Copy that"에서. 짧은 응답 |
| Emoji reaction | **Signal Back** | 수신 확인 신호 |
| Take photo | **Shoot** | 필름 카메라 셔터 |
| Record video | **Roll** | 필름이 돌아간다 |
| Cooldown | **Recharge** | 송신기 충전 중 |

### Status Display

| State | Text | Meaning |
|-------|------|---------|
| Can transmit | **READY** | 송신 가능 |
| Cooldown | **RECHARGING** | 다음 송신까지 대기 |
| New content | **INCOMING** | 수신 대기 중인 콘텐츠 |
| No activity | **SILENT** | 조용한 상태 (부담 없이) |

---

## 5. Core Systems

### 5-1. Channel System

**Creation:** Open Channel → 고유 주파수 자동 생성 (포맷: 3자리.1자리, 예: 107.4)

**Entry (Tune In):** 주파수 다이얼을 돌려 숫자를 맞추는 인터랙션. 정확히 맞으면 잠금 해제 피드백, 틀리면 정적(static) 피드백.

| Rule | Value |
|------|-------|
| Max crew per channel | 8 |
| Max channels per user | 4 |
| Host privileges | Channel delete, member remove |
| Channel lifespan | Unlimited (until host deletes) |

### 5-2. Transmit System

**Flow:** PTT button → Camera opens → Shoot/Roll → Preview → Transmit → Recharge starts

| Rule | Value |
|------|-------|
| Source | In-app camera only (no gallery) |
| Photo | 1 per transmission |
| Video | 5-10 seconds |
| Camera | Front + rear, flip during capture |
| Filter/Edit | None. Raw signal only. |

No filters by design: 무전기로 보내는 신호는 가공하지 않는다. Authenticity.

### 5-3. Recharge System (Cooldown)

- 송신 후 2시간 동안 해당 채널에서 재송신 불가
- **채널별 독립 적용** (Channel A 송신 → Channel B는 바로 가능)
- 아날로그 게이지처럼 충전 상태가 차오르는 시각 표현
- 완충 시 가벼운 햅틱 + 사운드로 READY 전환

### 5-4. Notification Design

| Type | Behavior | Default |
|------|----------|---------|
| Signal received (누가 송신) | 조용한 진동 1회 | ON |
| Recharge complete | 없음 | **OFF** |
| Channel invite | 진동 + 배지 | ON |
| Hourly reminder | **기능 자체 없음** | N/A |

Recharge 알림 기본 OFF가 핵심. 켜면 Setlog와 같은 의무감 발생.

### 5-5. Reaction System

**Signal Back (Emoji Stamps):**
- 앱 전용 스탬프 세트 (6-8개), 일반 이모지 키보드 아님
- 수신 확인 신호를 보내는 행위로 포지셔닝

**Copy (Short Response):**
- 텍스트 댓글, 40자 제한
- 채팅이 아니라 무전으로 한마디 건네는 무게감
- 대화 방지, 반응 허용

---

## 6. UX Flow

### 6-1. First Launch (Boot Sequence)

**Step 1 - Boot Screen (2-3s):**
검은 화면, 모노스페이스 텍스트 부팅 로그.
```
SYSTEM BOOT...
FREQUENCY MODULE [OK]
CAMERA MODULE [OK]
SIGNAL READY
```

**Step 2 - Callsign Setup:**
영문 + 숫자 조합의 짧은 호출 부호. 프로필 사진 없음.
콜사인 첫 글자가 TE LCD 스타일로 표시.

**Step 3 - First Channel:**
"OPEN NEW CHANNEL" 또는 "TUNE IN" 선택.

### 6-2. Daily Use

**App open:** 짧은 부팅 (0.5s) → Main panel

**Main screen:**
- Top: 현재 채널 주파수 + 채널 전환
- Middle: 수신 로그 (한 장씩 넘기며 감상)
- Bottom: PTT button (READY / RECHARGING)
- Crew 상태 표시등: 점(dot)으로 각 멤버 상태 (On Air / Standby)

**Transmit flow:**
PTT tap → Camera finder → Shoot (shutter + winding) → Preview → TRANSMIT confirm → 삐 소리 → RECHARGING

**Receive flow:**
INCOMING → 한 장씩 넘기며 감상 → Signal Back or Copy → Next

---

## 7. Design Tone & Interaction System

### 7-1. Emotional Tone
"정밀한 기기를 다루는 차분한 설렘"
시끄럽지 않고, 귀엽지 않고, 과하지 않다.

### 7-2. Visual Keywords
Matte, Mono, Grid, Module, Indicator, Precision

### 7-3. Tactile/Material
알루미늄 다이얼의 무게감. 기계식 셔터의 저항감. 스위치의 클릭감. 차갑지만 손에 익는 금속.

### 7-4. Typography
- System/Status: 모노스페이스 대문자 (READY, RECHARGING, INCOMING)
- User content (Copy): 산세리프

### 7-5. Color

| Use | Color | Reason |
|-----|-------|--------|
| Background | Very dark gray (#1A1A1A) | 기기 표면, 무광 금속 |
| Text/UI | Light gray ~ white | 계기판 텍스트 |
| Accent | TE orange or signal green | 상태 표시등, 액티브 |
| Sub-accent | Amber | 경고, 리차지 |
| Inactive | Dark gray | 꺼진 표시등 |

거의 모노크롬. 포인트 컬러 하나가 "켜진 LED"처럼 작동.

### 7-6. Icon & Control
- 기기 패널의 인디케이터/심볼 스타일
- 직선적, 기하학적
- 둥근 귀여운 아이콘 절대 금지
- 버튼: 원형 또는 정사각, 눌림 시각 피드백

### 7-7. Motion

| Interaction | Motion | Duration |
|-------------|--------|----------|
| Dial turning | 회전 + 단계별 걸림(detent) | per step |
| Shutter press | 스케일다운 → 복귀 | 0.15s |
| Film winding | 오른쪽→왼쪽 감기기 | 0.3s |
| Transmit complete | 위로 "발사" 모션 | 0.25s |
| Channel switch | 짧은 정적 → 새 채널 | 0.3s |
| Status change | LED 깜빡 → 켜짐 | 0.2s |

All motion: 0.15-0.4s. 기계적으로 정확. 느긋하지 않음.

### 7-8. Sound Cues

| Moment | Sound |
|--------|-------|
| App boot | 기기 전원 "틱" + 낮은 톤 |
| Dial step | "틱틱틱" (로터리 인코더) |
| Frequency match | "찰칵" 잠금 해제음 |
| Frequency mismatch | "지직" 정적 |
| Shutter | 기계식 셔터 "찰칵" |
| Film winding | "치치칙" |
| Transmit complete | 짧은 "삐" (무전기 송신음) |
| Signal Back | 가볍게 "톡" |
| Recharge complete | 부드러운 톤 1회 |

### 7-9. Haptic Feedback

| Moment | Haptic | iOS API |
|--------|--------|---------|
| Dial step | 가벼운 틱 | Light Impact |
| Frequency match | 강한 단발 | Medium Impact |
| Shutter | 짧고 선명한 탭 | Rigid Impact |
| Transmit complete | 이중 탭 | Double Tap (Success) |
| Stamp | 부드러운 탭 | Soft Impact |
| Error/Mismatch | 짧은 진동 3회 | Error Notification |

### 7-10. Retro vs. Kitsch Boundary

**DO (메타포의 작동 원리를 빌려옴):**
- 다이얼, 셔터, LED 같은 인터랙션 패턴을 모바일로 번역
- 계기판 타이포그래피, 그리드 레이아웃 참조
- 인터랙션 무게감/타이밍/피드백의 정밀도

**DON'T (실물을 시각적으로 흉내냄):**
- 안테나 그림, 가죽 텍스처 등 스큐어모픽
- 세피아 톤, 빛바랜 색상
- 필름 그레인, 먼지 효과
- "빈티지"를 장식으로 쓰는 모든 것

---

## 8. Technical Direction (Summary)

| Decision | Value |
|----------|-------|
| Platform (Phase 1) | iOS (iPhone) |
| Platform (Phase 2) | Android |
| Language (Phase 1) | Korean primary, EN for brand/CTA/status labels |
| i18n | Built from start, EN expansion later |
| Framework | To be decided |
| Max users/channel | 8 |
| Max channels/user | 4 |
| Upload interval | 2 hours per channel |
| Video length | 5-10 seconds |
| Photo per transmit | 1 |
| Gallery access | None |
| Chat feature | None |
| Filter/Edit | None |

---

## 9. Open Questions (Next Decisions)

1. **Tech stack:** React Native vs. Swift(iOS) + Kotlin(Android) native
2. **Backend:** Firebase, Supabase, or custom
3. **주파수 포맷 최종 확정:** 3자리.1자리 (107.4) vs. 다른 포맷
4. **Signal Back 스탬프 디자인:** 어떤 6-8개를 넣을 것인가
5. **Callsign 규칙:** 글자 수 제한, 중복 허용 여부
6. **콘텐츠 보관 기간:** 영구 보관 vs. 일정 기간 후 삭제
7. **호스트 외 권한:** 일반 Crew도 멤버 초대 가능한지
8. **앱 아이콘 디자인 방향:** FQ 타입, 주파수 심볼, 기타
9. **수익 모델:** 무료/유료/프리미엄
10. **앱스토어 네이밍:** "FREQUENCY" 단독 vs. "FREQUENCY - ..." 서브타이틀

---

*This document is the single source of truth for all FREQUENCY design and development decisions.*
