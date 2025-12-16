# 아트프렌즈 스탭 선발 의견 수렴 익명 게시판

## 프로젝트 개요
아트프렌즈 스탭 선발 방식에 대한 커뮤니티 의견을 수집하고 한눈에 볼 수 있는 모바일 중심 익명 게시판

## 기술 스택
- **Frontend**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **AI**: OpenAI API (의견 카테고리 자동 분류)

## 핵심 기능

### 1. 익명 닉네임 시스템
- 로그인 없이 자동으로 "형용사 + 예술가" 닉네임 생성
- localStorage에 저장하여 세션 유지
- 닉네임 예시: "신나는 모네", "행복한 고흐", "차분한 김환기"

**형용사 리스트**
```
신나는, 행복한, 즐거운, 차분한, 열정적인, 우아한, 따뜻한, 빛나는, 
영감받은, 창의적인, 사색하는, 몽환적인, 활기찬, 평화로운, 감성적인
```

**예술가 리스트**
```
모네, 르누아르, 드가, 피사로, 시슬리,
고흐, 세잔, 고갱,
피카소, 달리, 마티스, 칸딘스키, 몬드리안,
클림트, 샤갈, 뭉크, 마그리트,
라파엘로, 보티첼리, 카라바조, 벨라스케스,
김환기, 이우환, 천경자, 박서보, 로스코, 앤디워홀
```

### 2. 의견 작성 및 제출
- 우하단 Floating Action Button (핑크 그라데이션)
- 하단에서 슬라이드업 모달
- 최소 20자 이상 입력 필수
- 제출 시 OpenAI API로 자동 카테고리 분류
- 비속어 간단 필터링
- 동일 사용자 5분 이내 중복 제출 방지

### 3. 카테고리 자동 분류
OpenAI API를 사용하여 의견을 다음 카테고리로 자동 분류:
- 경험평가
- 시험방식
- 추천제도
- 인터뷰
- 자격요건
- 기타

### 4. 의견 목록 및 필터링
- 카테고리별 탭 필터 (가로 스크롤)
- 각 카테고리별 의견 개수 표시
- 정렬: 최신순 / 공감순
- 실시간 업데이트 (Supabase Realtime)

### 5. 공감 기능
- 하트(💗) 아이콘으로 공감 표현
- 사용자당 의견별 1회만 가능 (localStorage)
- 클릭 시 애니메이션 효과
- 공감 수 실시간 업데이트

### 6. 시간 표시
- "방금", "3분 전", "1시간 전", "어제", "n일 전" 형식
- 실시간 자동 업데이트

## 데이터베이스 스키마

### opinions 테이블
```sql
create table opinions (
  id uuid primary key default uuid_generate_v4(),
  content text not null,
  category text not null,
  nickname text not null,
  temp_user_id text not null,
  likes integer default 0,
  created_at timestamp with time zone default now()
);

create index idx_opinions_category on opinions(category);
create index idx_opinions_created_at on opinions(created_at desc);
create index idx_opinions_likes on opinions(likes desc);
```

### likes 테이블
```sql
create table likes (
  id uuid primary key default uuid_generate_v4(),
  opinion_id uuid references opinions(id) on delete cascade,
  temp_user_id text not null,
  created_at timestamp with time zone default now(),
  unique(opinion_id, temp_user_id)
);

create index idx_likes_opinion_id on likes(opinion_id);
```

## UI/UX 디자인

### 컬러 팔레트 (핑크 테마)
```css
--primary: #FF69B4        /* 메인 핑크 */
--primary-light: #FFB6D9  /* 연한 핑크 */
--primary-pale: #FFF0F7   /* 배경용 아주 연한 핑크 */
--accent: #FF1493         /* 강조용 진한 핑크 */
--text-primary: #2D2D2D
--text-secondary: #757575
```

### 레이아웃 구조
```
┌─────────────────────────┐
│  🎨 스탭 선발 의견 수렴   │  ← 헤더
│  여러분의 생각을 들려주세요│
├─────────────────────────┤
│ 📊 전체 32개 의견        │  ← 통계
├─────────────────────────┤
│ 💭 전체  경험  시험  추천│  ← 카테고리 탭
│    [32]  [12]  [8]  [7] │
├─────────────────────────┤
│ ┌─────────────────────┐ │
│ │ 💬 행복한 모네       │ │  ← 의견 카드
│ │ 3분 전 · 경험평가    │ │
│ │                     │ │
│ │ 실제 투어를 직접     │ │
│ │ 가이드해본 경험이... │ │
│ │                     │ │
│ │ 💗 12               │ │
│ └─────────────────────┘ │
│                         │
│ [더보기...]              │
└─────────────────────────┘

[✏️ 의견 남기기]  ← Floating Button
```

### 주요 컴포넌트 스타일

**의견 카드**
- 흰색 배경, rounded-2xl
- 왼쪽에 핑크 보더 (4px)
- 호버/터치 시 그림자 효과
- 카테고리 태그: 핑크 배경 + 진한 핑크 텍스트

**Floating Write Button**
- 우하단 고정 (bottom-6 right-6)
- 핑크 그라데이션 배경
- 미묘한 pulse 애니메이션
- 클릭 시 scale down 효과

**작성 모달**
- 하단에서 슬라이드업
- 배경 dimmed
- textarea 자동 포커스
- 자동 생성된 닉네임 표시

## API 엔드포인트

### GET /api/opinions
- Query params: category?, sortBy? (latest/popular)
- Response: opinions 배열

### POST /api/opinions
```json
{
  "content": "의견 내용",
  "temp_user_id": "uuid"
}
```
- OpenAI API로 카테고리 자동 분류
- nickname 자동 생성 (형용사+예술가)

### POST /api/opinions/[id]/like
```json
{
  "temp_user_id": "uuid"
}
```
- 좋아요 토글
- 중복 체크

### GET /api/stats
```json
{
  "total": 32,
  "byCategory": {
    "경험평가": 12,
    "시험방식": 8,
    ...
  }
}
```

## OpenAI 프롬프트 (카테고리 분류)

```typescript
const systemPrompt = `
다음 의견을 읽고 가장 적합한 카테고리 하나만 선택해주세요.

카테고리:
- 경험평가: 실제 투어/가이드 경험을 평가하는 내용
- 시험방식: 필기/실기 시험으로 선발하는 방식
- 추천제도: 기존 멤버의 추천을 받는 방식
- 인터뷰: 면접이나 대화를 통한 선발
- 자격요건: 학력, 경력 등 기본 자격
- 기타: 위 카테고리에 해당하지 않는 경우

응답은 카테고리 이름만 정확히 반환하세요. (예: "경험평가")
`;
```

## 환경 변수
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## 폴더 구조
```
/app
  /api
    /opinions
      route.ts          # GET, POST
      /[id]
        /like
          route.ts      # POST
    /stats
      route.ts          # GET
  page.tsx              # 메인 페이지
  layout.tsx
/components
  OpinionCard.tsx
  OpinionList.tsx
  WriteModal.tsx
  CategoryTabs.tsx
  FloatingWriteButton.tsx
/lib
  supabase.ts
  openai.ts
  utils.ts              # 닉네임 생성, 시간 포맷 등
/types
  index.ts
```

## 인터랙션 및 애니메이션

### 공감 버튼
- 클릭 시: scale(1.2) → scale(1.0)
- 색상 변화: gray → 핑크
- 숫자 카운트업 애니메이션

### 카테고리 전환
- Fade in/out (duration: 200ms)
- 부드러운 전환

### 새 의견 등록
- 화면 최상단으로 스크롤
- 새 카드 bounce 애니메이션
- "의견이 등록되었어요!" 토스트 (핑크)

### 실시간 업데이트
- Supabase Realtime subscription
- 새 의견 알림 토스트
- 카운트 자동 업데이트

## 추가 기능 (선택사항)

### 운영자 대시보드 (/admin)
- 비밀번호 간단 인증
- 전체 의견 리스트
- 카테고리별 AI 요약
- CSV 다운로드

### 부적절한 의견 관리
- 신고 기능
- 비속어 자동 필터
- 관리자 삭제 기능

## 성능 최적화
- 의견 목록 무한 스크롤 (20개씩)
- 이미지 최적화 (Next.js Image)
- 카테고리별 데이터 캐싱

## 반응형 고려사항
- 모바일 우선 (375px 기준)
- 태블릿: 2단 레이아웃
- 데스크톱: 최대 너비 1200px

## 개발 우선순위
1. 기본 CRUD + 닉네임 생성
2. OpenAI 카테고리 분류
3. UI/UX 완성도
4. 공감 기능
5. 실시간 업데이트
6. 관리자 기능
