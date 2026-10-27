# 자산수명 시뮬레이터 — MVP 개발 계획

- 기준 문서: 자산수명 시뮬레이터 개발 기획서 (2026-10-08)
- 목표: MVP v0.5, 2027-02-15 공개
- 범위: 모바일에서 3분 안에 "몇 살에 돈이 떨어지고, 무엇을 바꾸면 몇 년 늘어나나"에 답한다
- 역할: 총책임자가 범위·계산 규칙 확정 / 개발 담당이 구현·테스트·배포. 개발 자율 범위는 UX 개선과 소규모 확장까지
- 투입: 하루 최대 3~4시간, 주 10~15시간 기준

## 1. 완료 기준 (DoD)

| 항목 | 기준 |
| --- | --- |
| 국민연금 계산 | 공단 모의계산 대비 대표 사례 30건 오차 ±3% |
| 엔진 전체 | 엑셀 독립 계산 10건과 연도별 잔액 일치 |
| 입력 시간 | 모바일 사용성 테스트 5명 중 4명 이상 3분 안에 결과 도달 |
| 접근성 | axe 위반 0건, Lighthouse 접근성 95점 이상 |
| 현장 사용 | 연구소 첫 공개 세미나에서 실사용 |

## 2. 범위

| 구분 | MVP v0.5 | 이후 |
| --- | --- | --- |
| 입력 | 4단계 마법사, 필수 7개, 예시 가구 불러오기 | 부부 단위 입력 (v0.8) |
| 계산 | 연 단위 결정론 엔진: 국민·기초·퇴직·개인·주택연금, 지출 곡선 | 유족연금 (v0.8), 몬테카를로·생명표 (1.0) |
| 결과 | 고갈연령, 지속가능 월 지출, 소득대체율, 잔액 그래프, 연도별 표 | 시나리오 비교, PDF (v0.8) |
| 행동 비교 | 퇴직 연기, 연금 연기, 주택연금, 지출 절감 + 즉시 재계산 | 정렬도 (1.0) |
| 저장 | localStorage 자동 저장 | 공유 URL (v0.8 선택) |
| 화면 | 모바일 우선 (360px~), 데스크톱 2단 | 강의 모드 (1.0) |

하지 않는 것: 금융상품 추천, 로그인, 서버 저장, 정밀 세금 계산, 네이티브 앱.

PWA: MVP 제외. 아래 중 하나가 생기면 vite-plugin-pwa로 추가한다.
- 강의 현장 오프라인 사용 요청
- 재방문 사용자가 많아 홈 화면 추가가 의미 있을 때
- 알림 등 웹만으로 안 되는 기능이 범위에 들어올 때

MVP는 서버 호출 없이 정적 자산만으로 동작하게 유지한다.

## 3. 스택

| 계층 | 선택 | 비고 |
| --- | --- | --- |
| 패키지 | pnpm workspace | Turborepo/Nx 사용 안 함, `pnpm --filter` |
| 웹 | Vite + React + TypeScript | `apps/web` |
| UI | shadcn/ui (Radix) + Tailwind, 토큰은 CSS 변수 | `components/ui`는 `npx shadcn add`로만 추가 |
| 차트 | Recharts (문제 시 ECharts) | 드래그 중 애니메이션 끔 |
| 폼·상태 | react-hook-form + zod, 결과 상태 zustand | 파생값은 state에 저장하지 않음 |
| 카탈로그 | Storybook | 도메인 컴포넌트·모듈·결과 페이지 |
| 테스트 | Vitest, fast-check, Playwright, axe | |
| 배포 | GitHub + Cloudflare Pages | PR마다 프리뷰 |
| 분석 | 쿠키 없는 익명 이벤트 (미정) | |

## 4. 레포 구조

```
asset-lifespan/
├─ pnpm-workspace.yaml
├─ package.json            # test / typecheck / lint
├─ CLAUDE.md
├─ apps/web/               # Vite + React + shadcn + Storybook
│  ├─ CLAUDE.md
│  └─ src/
│     ├─ components/ui/       # shadcn 원본
│     ├─ components/domain/   # 헤드라인, 행동 카드, 그래프
│     └─ features/wizard/  features/result/
├─ packages/
│  ├─ engine/              # 순수 TS (의존성: zod 정도)
│  │  ├─ CLAUDE.md
│  │  ├─ src/rules/        # nps, basic, private, housing
│  │  ├─ src/simulate.ts
│  │  ├─ src/schema.ts     # 가정값 스키마
│  │  └─ test/golden/  test/property/
│  └─ assumptions/         # 사람이 관리 (AI 편집 금지)
│     ├─ 2027.json
│     ├─ tables/
│     └─ CHANGELOG.md
├─ tools/batch/            # 1.0: 12유형 일괄계산
└─ docs/  spec/ decisions/ PROGRESS.md
```

내부 패키지는 빌드하지 않는다: `"exports": { ".": "./src/index.ts" }`, `moduleResolution: "bundler"`.

## 5. 아키텍처 규칙

- 의존 방향: `web → engine`, `web → assumptions`, `assumptions → engine(schema)`. engine은 아무것도 import하지 않는다.
- 엔진은 가정값을 인자로 받는다: `simulate(input, assumptions)`.
- 공개 API(안): `simulate`, `findSustainableSpending`, `compareActions`.
- 입력은 react-hook-form이 관리하고, 결과는 렌더 중 계산한다. 계산 결과를 `useState`로 복사하지 않는다.
- 결정론 계산은 슬라이더 값이 바뀔 때마다 즉시 수행. 1.0 확률 계산은 `onValueCommit` 시에만 Worker로.
- 저장은 입력값 + 스키마 버전 + 가정값 연도만. 서버 전송 없음.
- 1.0 사용처(Web Worker, tools/batch)도 같은 엔진 함수를 그대로 쓴다.

## 6. 접근성·모바일 기준

| 항목 | 기준 | 확인 |
| --- | --- | --- |
| 기준 화면 | 360px부터, 768/1024px 전환 | Playwright 뷰포트 |
| 글자 | 본문 18px+, 핵심 수치 28px+, 200% 확대 시 깨지지 않음 | 수동 |
| 대비 | 텍스트 4.5:1, 큰 텍스트·그래프 3:1 | axe |
| 터치 대상 | 44×44px+ | 수동 |
| 금액 입력 | `inputmode="numeric"`, 쉼표, 한글 단위 보조 표기 | 컴포넌트 테스트 |
| 슬라이더 | −/+ 버튼과 직접 입력 병행 | Storybook |
| 색 | 색만으로 의미 전달 금지 | 리뷰 |
| 그래프 | 요약 문장 + 연도별 표로 대체 정보 | axe, 스크린리더 1회 |
| 키보드 | 전 기능 조작, 포커스 표시 | Playwright |
| 모션 | `prefers-reduced-motion` 시 애니메이션 끔 | 수동 |
| 브라우저 | Chrome·Safari·삼성 인터넷 최신 2개 버전 | 실기기 |

기준: WCAG 2.2 AA (KWCAG 2.2 대응).

## 7. 품질·하네스

| 층 | 내용 | 도구 |
| --- | --- | --- |
| 골든 케이스 | 공단 30건 (±3%), 엑셀 10건 (연도별 잔액 일치) | Vitest |
| 속성 테스트 | 지출↑ → 고갈연령 늦어지지 않음, 퇴직 연기 → 빨라지지 않음 등 | fast-check |
| 단위 테스트 | 규칙 모듈 경계값 (조기·연기 5년, 개시연령 경계 출생연도) | Vitest |
| 회귀 스냅샷 | 예시 가구 결과, 가정값 갱신 시 변화량 리뷰 | Vitest snapshot |
| 컴포넌트 | 상태별 스토리, a11y 애드온 | Storybook, axe |
| E2E | 마법사 → 결과, 모바일·데스크톱 각 1개 | Playwright |

구조적 장치:
- `packages/assumptions`, `test/golden`은 AI 편집 금지 (권한 deny 또는 훅)
- 가정값은 `value`·`unit`·`source`·`asOf` 필수, zod 검증 통과해야 로드
- `engine`에서 react·DOM·`Date.now`·`Math.random`·매직넘버 린트 금지
- 금액·나이·연도는 branded type (`MonthlyWon`, `AnnualWon`, `Age`, `Year`)

커밋 조건: typecheck + lint + 관련 테스트 통과. CI(GitHub Actions)에서 동일 명령, PR마다 Cloudflare Pages 프리뷰.

AI 코딩 운영:
- 작업 1개 = 세션 1개. 끝나면 커밋 후 컨텍스트 비우기
- 하루 마무리에 `docs/PROGRESS.md` 5줄 갱신
- 기획서 원본 대신 `docs/spec/` 모듈별 명세만 참조, 결정은 `docs/decisions/`
- 테스트 실패 시 구현을 고친다. 기대값이 틀렸다고 판단되면 멈추고 보고
- 같은 실패 3회 반복 시 중단하고 사람이 원인 확인

## 8. 일정

| 작업 | 트랙 | 기간 |
| --- | --- | --- |
| 레포·하네스 셋업 | 준비 | 2026-10-19 ~ 10-30 |
| 가정값 스키마·규약 확정 | 준비 | 10-26 ~ 11-06 |
| 국민·기초연금 모듈 | 엔진 | 11-02 ~ 11-22 |
| 토큰·Figma 목업 | 화면 | 11-16 ~ 11-30 |
| 퇴직·개인·주택연금 | 엔진 | 11-23 ~ 12-06 |
| 도메인 컴포넌트·마법사 | 화면 | 12-01 ~ 2027-01-08 |
| 통합 루프·행동 4종 | 엔진 | 12-07 ~ 12-25 |
| 결과 화면·접근성 점검 | 화면 | 2027-01-04 ~ 02-05 |
| 공단·엑셀 대조 | 검증 | 01-11 ~ 02-12 |
| MVP 공개 | 마일스톤 | 2027-02-15 |

가정값 스키마와 계산 규약은 11-06까지 확정해야 엔진 일정이 지켜진다. 화면은 엔진 API가 정해지는 12월 초부터 병행.

## 9. 리스크·확정 필요

엔진 착수(11-02) 전 총책임자와 확정:
- [ ] 계산 기준: 실질 vs 명목 (제안: 내부 실질)
- [ ] 시점 규약: 현금흐름·수익률 반영 시점
- [ ] 나이 산정: 만 나이, 수급 개시 월의 연 단위 근사
- [ ] MVP 비관·낙관 시나리오 정의
- [ ] 배우자 입력의 MVP 반영 범위
- [ ] 정답 데이터(공단 30건·엑셀 10건) 작성 담당과 일정
- [ ] 가정값 원문 확인·JSON 입력 담당
- [ ] 개발 담당 자율 범위 합의

| 리스크 | 영향 | 대응 |
| --- | --- | --- |
| 정답 데이터 확보 지연 | 검증·공개 지연 | 11월 안에 엑셀 케이스 3건 먼저 확보 |
| AI의 제도 규칙 환각 | 개혁 전 값이 코드에 유입 | 수치는 가정값 파일에서만, 매직넘버 금지 |
| 파트타임 투입 편차 | 화면 작업 지연 | 범위 고정, shadcn + 코드 조립으로 단축 |
| 제도 변경 | 결과 오류 | 규칙을 가정값으로 분리, 기준일 표시 |
| 모바일 입력 이탈 | 완료율 저하 | 필수 7개, 기본값, 자동 저장 |
