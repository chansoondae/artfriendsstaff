# 아트프렌즈 스탭 선발 의견 수렴 익명 게시판

아트프렌즈 스탭 선발 방식에 대한 커뮤니티 의견을 수집하고 한눈에 볼 수 있는 모바일 중심 익명 게시판입니다.

## 주요 기능

- 🎭 **익명 닉네임 시스템**: 자동 생성되는 "형용사 + 예술가" 닉네임으로 익명 참여
- 💗 **공감 기능**: 의견에 공감 표시 및 실시간 카운트
- ⚡ **실시간 업데이트**: Supabase를 통한 실시간 의견 업데이트
- 📱 **모바일 최적화**: 모바일 우선 반응형 디자인
- 🔒 **제출 제한**: 비속어 필터링, 중복 제출 방지

## 기술 스택

- **Frontend**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS

## 시작하기

### 1. 환경 변수 설정

`.env` 파일을 생성하고 다음 환경 변수를 설정하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Supabase 데이터베이스 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다
2. SQL Editor에서 `supabase-schema.sql` 파일의 내용을 실행합니다
3. 프로젝트 URL과 anon key를 `.env` 파일에 추가합니다

### 3. 의존성 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 프로젝트 구조

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
  layout.tsx            # 레이아웃
  globals.css           # 전역 스타일
/components
  OpinionCard.tsx       # 의견 카드 컴포넌트
  OpinionList.tsx       # 의견 목록 컴포넌트
  WriteModal.tsx        # 의견 작성 모달
  FloatingWriteButton.tsx  # 플로팅 작성 버튼
/lib
  supabase.ts          # Supabase 클라이언트
  utils.ts             # 유틸리티 함수
/types
  index.ts             # 타입 정의
```

## API 엔드포인트

### GET /api/opinions
의견 목록을 조회합니다.

**Query Parameters:**
- `sortBy` (optional): 정렬 방식 (latest/popular)
- `limit` (optional): 결과 개수 제한
- `offset` (optional): 페이지네이션 오프셋

### POST /api/opinions
새 의견을 등록합니다.

**Request Body:**
```json
{
  "content": "의견 내용 (최소 20자)",
  "temp_user_id": "임시 사용자 ID"
}
```

### POST /api/opinions/[id]/like
의견에 좋아요를 토글합니다.

**Request Body:**
```json
{
  "temp_user_id": "임시 사용자 ID"
}
```

### GET /api/stats
전체 통계를 조회합니다.

**Response:**
```json
{
  "total": 32
}
```

## 주요 기능 설명

### 익명 닉네임 시스템
- 사용자가 처음 방문하면 자동으로 랜덤 닉네임이 생성됩니다
- 닉네임은 "형용사 + 예술가" 형식입니다 (예: "신나는 모네", "차분한 고흐")
- localStorage에 저장되어 세션 간 유지됩니다

### 공감 기능
- 각 의견에 공감(좋아요)을 표시할 수 있습니다
- 사용자당 의견별 1회만 가능합니다
- localStorage로 좋아요 상태를 관리합니다

### 제출 제한
- 비속어 필터링
- 최소 20자 이상 입력 필수
- 동일 사용자 5분 이내 중복 제출 방지

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

환경 변수를 Vercel 프로젝트 설정에서 추가해야 합니다.

## 라이선스

MIT

## 기여

이슈와 PR은 언제나 환영합니다!
