# 자산수명 시뮬레이터

> 모바일에서 3분 안에 **"몇 살에 돈이 떨어지고, 무엇을 바꾸면 몇 년 늘어나나"** 에 답하는 웹 도구

가구의 소득·연금·자산·생활비를 입력하면 연 단위로 금융자산 잔액을 계산해 **자산고갈연령**과 **지속가능 월 지출액**을 보여주고, 퇴직 연기·국민연금 연기수령·주택연금·지출 절감 같은 행동을 바꿨을 때 결과가 어떻게 달라지는지 바로 비교합니다.

- 현재 단계: **MVP v0.5 개발 준비 중** (공개 목표 2027-02-15)
- 서버 없이 정적 파일만으로 동작하며, 입력값은 이 기기(localStorage)에만 저장됩니다.

## 주요 기능 (MVP v0.5)

| 구분 | 내용 |
| --- | --- |
| 입력 | 4단계 마법사 (나와 가족 → 소득·연금 → 자산·주택 → 생활비), 필수 7개 항목, 예시 가구 불러오기 |
| 계산 | 연 단위 결정론 엔진 — 근로소득, 국민·기초·퇴직·개인·주택연금, 연령대별 지출 곡선 |
| 결과 | 자산고갈연령(비관·낙관 범위 포함), 잔액 그래프, 지속가능 월 지출액, 소득대체율, 연도별 표 |
| 행동 비교 | 퇴직 연기, 국민연금 연기수령, 주택연금 가입, 월 지출 절감, 조합 적용 — 100ms 안에 재계산 |
| 저장 | localStorage 자동 저장, "이어서 하기" / "이 기기에서 지우기" |

하지 않는 것: 금융상품 추천, 로그인, 서버 저장, 정밀 세금 계산, 네이티브 앱.

> 이 결과는 입력하신 값과 가정에 따른 추정입니다. 투자 권유나 공식 연금 예상액이 아닙니다.

## 기술 스택

- **모노레포**: pnpm workspace
- **웹**: Vite + React + TypeScript, shadcn/ui (Radix) + Tailwind, Recharts
- **폼·상태**: react-hook-form + zod, zustand
- **테스트**: Vitest, fast-check(속성 테스트), Playwright, axe, Storybook
- **배포**: GitHub + Cloudflare Pages (PR마다 프리뷰)

## 레포 구조 (예정)

```
apps/web/              # 화면 (마법사, 결과, 행동 비교)
packages/engine/       # 순수 TS 계산 엔진 — simulate, findSustainableSpending, compareActions
packages/assumptions/  # 연도별 제도 수치·경제 가정 JSON (사람이 관리)
docs/                  # spec/, decisions/, PROGRESS.md
```

의존 방향은 `web → engine`, `web → assumptions`, `assumptions → engine(schema)`이며, 엔진은 외부 모듈을 import하지 않습니다.

## 핵심 원칙

- **제도 수치는 코드에 쓰지 않는다.** 조정률·개시연령표·기준연금액·주택연금표·수익률은 모두 `packages/assumptions`의 JSON에서 읽고, 코드 수정 없이 파일 교체로 갱신합니다. 각 값은 `value`·`unit`·`source`·`asOf`가 필수입니다.
- **엔진은 순수 함수.** `simulate(input, assumptions)`처럼 가정값을 인자로 받으며 React·DOM·`Date.now`·`Math.random`·매직넘버를 금지합니다.
- **정답 데이터로 검증.** 국민연금은 공단 모의계산 30건 대비 ±3%, 엔진 전체는 엑셀 독립 계산 10건과 연도별 잔액이 일치해야 합니다.
- **접근성과 모바일 우선.** WCAG 2.2 AA, 360px부터 전 기능 지원, 본문 18px 이상, 터치 대상 44px 이상.
- **개인정보 보호.** 입력·결과는 서버로 보내지 않고, 분석은 쿠키 없는 익명 이벤트만 수집합니다.

## v0 프로토타입 실행

한 페이지 프로토타입(입력 7개 → 자산고갈연령, 잔액 그래프, 연도별 표)이 레포 루트에 단일 앱으로 있습니다. MVP 모노레포 전환 전까지 npm을 씁니다.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 엔진·검증·표기 테스트
npm run typecheck
```

- 계산 엔진: `src/engine/simulate.ts` (순수 함수, MVP에서 `packages/engine`으로 이동)
- 가정값: `src/assumptions.json` (실질수익률 2%는 임시값)
- 스타일: `src/index.css`에 디자인 토큰, 컴포넌트별 `*.module.css` (CSS Modules)
- 배포: `main`에 push하면 GitHub Actions가 테스트·빌드 후 GitHub Pages에 올림 (`.github/workflows/deploy.yml`)

## 개발 (예정)

```bash
pnpm install
pnpm --filter web dev      # 개발 서버
pnpm test                  # 테스트
pnpm typecheck && pnpm lint
```

커밋 전 typecheck + lint + 관련 테스트 통과가 필요하며, CI(GitHub Actions)에서 같은 명령을 실행합니다.

## 문서

- [기능명세 (MVP v0.5 초안)](functional-spec.md) — 화면(SCR)·입력(IN)·계산(CAL)·출력(OUT)·행동 비교(ACT)·비기능(NFR)·예외(EX)·미확정 사항(U)
- [MVP 개발 계획](mvp-dev-plan.md) — 완료 기준, 범위, 스택, 아키텍처 규칙, 품질 하네스, 일정, 리스크
