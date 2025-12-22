# 쇼핑몰 구매 데이터 대시보드

> 데이터라이즈 Frontend Developer 채용 과제  
> 과제 요구사항은 [REQUIREMENTS.md](./REQUIREMENTS.md)를 참고해주세요.

## 📑 목차

- [프로젝트 실행 방법](#-프로젝트-실행-방법)
- [기술 스택 및 선택 이유](#-기술-스택-및-선택-이유)
- [아키텍처 및 설계 결정](#-아키텍처-및-설계-결정)
- [주요 구현 사항](#-주요-구현-사항)
- [테스트 전략](#-테스트-전략)
- [성능 최적화 및 사용자 경험](#-성능-최적화-및-사용자-경험)
- [URL 상태 관리 전략](#-url-상태-관리-전략)
- [에러 처리 전략](#-에러-처리-전략)
- [타입 안정성](#-타입-안정성)
- [프로젝트 구조](#-프로젝트-구조)

---

## 🚀 프로젝트 실행 방법

### 환경 요구사항

- Node.js: `20.13.1`
- Yarn: `1.22.22`

### 설치 및 실행

```bash
# 의존성 설치
cd apps
yarn install

# 개발 서버 실행 (2개의 터미널 필요)
# 터미널 1: 백엔드 서버 (포트 4000)
yarn start-server

# 터미널 2: 프론트엔드 개발 서버 (포트 5173)
yarn start-client
```

---

## 🛠 기술 스택 및 선택 이유

### 핵심 기술

| 기술               | 버전     | 선택이유                                    |
| ------------------ | -------- | ------------------------------------------- |
| **TanStack Query** | v5.90.12 | 최신 서버 상태 관리 표준 (useSuspenseQuery) |
| **Emotion**        | 11.14.0  | CSS-in-JS, 타입 안전한 스타일링             |
| **Recharts**       | 3.6.0    | 선언적 차트 라이브러리, 커스터마이징 용이   |

### 주요 선택 근거

#### 1. **TanStack Query v5**

- **useSuspenseQuery**: React 18 Suspense와 완벽한 통합
- **자동 재시도 및 캐싱**: 네트워크 최적화
- **enabled 옵션**: 조건부 쿼리 실행으로 불필요한 API 호출 방지
- **queryKeys 패턴**: 캐시 무효화 및 재사용성 향상

```typescript
// 날짜 범위가 완전할 때만 API 호출
const { data, isLoading } = useQuery({
  ...purchaseQueryKeys.frequency(params),
  enabled: (hasFrom && hasTo) || (!hasFrom && !hasTo),
});
```

#### 2. **Emotion (CSS-in-JS)**

- **타입 안전성**: Theme 타입 자동 완성
- **동적 스타일링**: props 기반 스타일 변경
- **번들 최적화**: 사용된 스타일만 포함
- **컴포넌트 스코핑**: 스타일 충돌 방지

#### 3. **폴더 구조**

```
src/
├── domains/           # 도메인별 모듈화
│   ├── customer/      # 고객 관련 모든 로직
│   │   ├── api/       # API 레이어
│   │   ├── hooks/     # React Query 훅
│   │   ├── components/# UI 컴포넌트
│   │   └── types/     # 타입 정의
│   └── purchase/      # 구매 관련 모든 로직
├── components/        # 공통 컴포넌트
├── layouts/           # 레이아웃 컴포넌트
└── pages/             # 페이지 컴포넌트
```

---

## 🏗 아키텍처 및 설계 결정

### 1. **Compound Component 패턴**

재사용 가능하고 확장 가능한 컴포넌트 설계를 위해 적용했습니다.

```typescript
// Modal 컴포넌트 사용 예시
<Modal>
  <Modal.Portal>
    <Modal.Overlay>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>고객 상세 정보</Modal.Title>
          <Modal.CloseButton />
        </Modal.Header>
        <Modal.Body>{/* 내용 */}</Modal.Body>
      </Modal.Content>
    </Modal.Overlay>
  </Modal.Portal>
</Modal>
```

**장점:**

- 명확한 계층 구조
- 높은 재사용성
- 유연한 커스터마이징
- 타입 안전성 보장

### 2. **레이어 분리 아키텍처**

```
UI Layer (Components)
    ↓
Business Logic Layer (Hooks)
    ↓
API Layer (queryKeys + fetch functions)
    ↓
Backend API
```

**각 레이어의 역할:**

- **UI Layer**: 순수 프레젠테이션, 비즈니스 로직 없음
- **Hooks Layer**: 상태 관리 및 비즈니스 로직
- **API Layer**: 데이터 fetching 및 변환

### 3. **Query Keys 패턴**

```typescript
// 중앙화된 쿼리 키 관리
export const customerQueryKeys = {
  all: ["customers"] as const,
  lists: () => [...customerQueryKeys.all, "list"] as const,
  list: (params?: CustomersParams) =>
    [...customerQueryKeys.lists(), params] as const,
  purchases: (id: string) =>
    [...customerQueryKeys.all, "purchases", id] as const,
};
```

**이점:**

- 타입 안전한 키 관리
- 캐시 무효화 용이
- 중복 요청 방지

---

## 🎯 주요 구현 사항

### 1. 가격대별 구매 빈도 차트

#### 핵심 구현 내용

**날짜 필터링 로직**

```typescript
// 부분 입력 시 API 호출 방지
const isValidRange = (hasFrom && hasTo) || (!hasFrom && !hasTo);
return useQuery({
  ...purchaseQueryKeys.frequency(params),
  enabled: isValidRange, // from만 입력된 경우 대기
});
```

**동적 날짜 범위 텍스트**

```typescript
// "2024년 7월 분석" → "2025년 7월 ~ 9월 분석"
function formatDateRangeText(from?: string, to?: string): string {
  if (!from || !to) return "2024년 7월 분석";

  const fromYear = new Date(from).getFullYear();
  const fromMonth = new Date(from).getMonth() + 1;
  const toYear = new Date(to).getFullYear();
  const toMonth = new Date(to).getMonth() + 1;

  if (fromYear === toYear && fromMonth === toMonth) {
    return `${fromYear}년 ${fromMonth}월 분석`;
  }
  if (fromYear === toYear) {
    return `${fromYear}년 ${fromMonth}월 ~ ${toMonth}월 분석`;
  }
  return `${fromYear}년 ${fromMonth}월 ~ ${toYear}년 ${toMonth}월 분석`;
}
```

**사용자 친화적 가격 레이블**

```typescript
// "0 - 20000" → "2만원 이하"
function formatPriceRange(range: string): string {
  const [min, max] = range.split(" - ").map((s) => parseInt(s, 10));

  if (min === 0 && max <= 20000) return "2만원 이하";
  if (max >= 100001) return "10만원 이상";

  const rangeInManWon = Math.floor(min / 10000);
  return `${rangeInManWon}만원대`;
}
```

### 2. 고객 목록 및 검색 기능

#### 하이브리드 정렬 전략

**서버 정렬 + 클라이언트 정렬**

```typescript
// API는 totalAmount만 정렬 지원
// ID와 count는 클라이언트에서 정렬
const sortedCustomers = useMemo(() => {
  if (sortBy === "totalAmount") {
    return customers; // 서버에서 정렬됨
  }

  // 클라이언트 정렬
  return [...customers].sort((a, b) => {
    const comparison = sortBy === "id" ? a.id - b.id : a.count - b.count;
    return sortOrder === "asc" ? comparison : -comparison;
  });
}, [customers, sortBy, sortOrder]);
```

**디바운스 검색 (300ms)**

```typescript
// 타이핑 중 불필요한 API 호출 방지
export function useCustomerSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return { searchTerm, debouncedTerm, setSearchTerm };
}
```

**페이지네이션 (10명 단위)**

```typescript
// 클라이언트 사이드 페이지네이션
const pagination = useCustomerPagination({
  totalItems: sortedCustomers.length,
  itemsPerPage: 10,
});

// 검색/정렬 변경 시 첫 페이지로 자동 리셋
useEffect(() => {
  pagination.resetPage();
}, [debouncedTerm, sortBy, sortOrder]);

// 현재 페이지 데이터만 렌더링
const paginatedCustomers = useMemo(() => {
  return sortedCustomers.slice(pagination.startIndex, pagination.endIndex);
}, [sortedCustomers, pagination.startIndex, pagination.endIndex]);
```

### 3. 고객 상세 모달

#### 조건부 쿼리 실행

```typescript
// 모달이 닫혀있을 때는 API 호출하지 않음
export function useCustomerPurchases(customerId: string, enabled = true) {
  return useQuery({
    ...customerQueryKeys.purchases(customerId),
    enabled: enabled && !!customerId,
  });
}

// 사용
const { data: purchases } = useCustomerPurchases(
  selectedCustomerId || "",
  !!selectedCustomerId // 모달 열릴 때만 true
);
```

---

## 🧪 테스트 전략

### 테스트 프레임워크

- **Vitest**: 빠른 테스트 실행, Vite와 완벽한 통합
- **@testing-library/react**: React 컴포넌트 테스트
- **@testing-library/jest-dom**: DOM assertion 확장

### 테스트 실행

```bash
# 유닛 테스트 실행
yarn test

# Watch 모드
yarn test

# UI 모드 (인터랙티브)
yarn test:ui

# 커버리지 리포트
yarn test:coverage
```

### P0 우선순위 테스트

#### 1. **formatPriceRange**

백엔드 가격 범위를 사용자 친화적 레이블로 변환하는 핵심 함수

```typescript
// 정상 케이스 (9개)
✓ "0 - 20000" → "2만원 이하"
✓ "20001 - 30000" → "2만원대"
✓ "100001 - 200000" → "10만원 이상"

// 경계값 케이스 (5개)
✓ 정확히 20000원일 때 "2만원 이하"
✓ 20001원은 "2만원대" (경계값 + 1)
✓ 정확히 100001원일 때 "10만원 이상"

// 엣지 케이스 (7개)
✓ 공백이 많은 경우: "0   -   20000"
✓ 공백이 없는 경우: "0-20000"
✓ 탭 문자 포함: "0\t-\t20000"
✓ 매우 큰 숫자: "100001 - 99999999"

// 숫자 파싱 정확성 (6개)
✓ 선행 0 처리: "00000 - 20000"
✓ floor 처리: 25555 → 2만원대
```

**테스트 커버리지**: 100% (모든 분기 포함)

#### 2. **formatDateRangeText**

동적 날짜 범위 텍스트 생성 함수

```typescript
// 정상 케이스 (3개)
✓ 같은 연도, 같은 월 → "2025년 7월 분석"
✓ 같은 연도, 다른 월 → "2025년 7월 ~ 9월 분석"
✓ 다른 연도 → "2024년 12월 ~ 2025년 2월 분석"

// 기본값 케이스 (6개)
✓ from, to 모두 없음 → "2024년 7월 분석"
✓ from만 있음 → 기본값
✓ to만 있음 → 기본값
✓ 빈 문자열 → 기본값

// 월별 경계값 (5개)
✓ 1월 → "1월", 12월 → "12월"
✓ 1월 ~ 12월 전체 범위

// 윤년 처리 (3개)
✓ 윤년 2024년 2월 29일
✓ 평년 2025년 2월 28일

// 실제 사용 시나리오 (7개)
✓ 분기별 분석 (Q1-Q4)
✓ 반기별 분석
✓ 연간 분석

// 월 번호 정확성 (12개)
✓ getMonth() 0-based 보정 확인
✓ 모든 월(1-12) 올바른 숫자 표시
```

**테스트 커버리지**: 100%

#### 3. **fetchCustomers**

404 에러 복원력 검증 (앱 크래시 방지)

```typescript
// 정상 응답 (5개)
✓ 파라미터 없이 호출
✓ sortBy 파라미터 (asc/desc)
✓ name 파라미터 (한글 인코딩)
✓ 복합 파라미터
✓ 빈 배열 응답

// 404 에러 처리 - CRITICAL (3개)
✓ 404 응답 시 빈 배열 반환 (에러 throw 안 함)
✓ 검색 결과 없을 때 404 처리
✓ 앱 전체 다운 방지 확인

// 다른 에러 (4개)
✓ 400, 500, 401, 403 → 에러 throw

// 네트워크 에러 (2개)
✓ 연결 실패, 타임아웃

// URL 인코딩 (3개)
✓ 한글 이름 URL 인코딩
✓ 특수문자, 공백 처리

// 데이터 타입 검증 (6개)
✓ Customer 타입 배열 반환
✓ 필수 속성 검증 (id, name, count, totalAmount)
```

**테스트 커버리지**: 100%  
**중요도**: ⭐⭐⭐⭐⭐ (앱 안정성 핵심)

#### 4. **fetchPurchaseFrequency** (27 테스트)

ISO 8601 날짜 변환 로직 검증

```typescript
// 정상 응답 (2개)
✓ 파라미터 없이 호출
✓ 빈 배열 응답

// ISO 8601 변환 - CRITICAL (6개)
✓ from → 00:00:00.000 (자정)
✓ to → 23:59:59.999 (하루 끝)
✓ from & to 모두 변환
✓ YYYY-MM-DD 형식 정확히 파싱
✓ UTC 시간대 처리 (KST → UTC)

// 날짜 경계값 (6개)
✓ 월의 첫날 (1일)
✓ 월의 마지막날 (31일)
✓ 윤년 2월 29일, 평년 2월 28일
✓ 연초 1월 1일, 연말 12월 31일

// 시간 설정 정확성 (2개)
✓ from: 00:00:00.000 (KST) → 15:00:00.000 (UTC)
✓ to: 23:59:59.999 (KST) → 14:59:59.999 (UTC)

// 에러 처리 (4개)
✓ 400, 404, 500 → 에러 throw
✓ 네트워크 에러

// 실제 사용 시나리오 (3개)
✓ 분기별 조회 (3개월)
✓ 월별 조회
✓ 연간 조회

// URL 파라미터 (4개)
✓ 파라미터 없음 → 쿼리스트링 없음
✓ from만, to만, 둘 다 포함
```

**테스트 커버리지**: 100%  
**중요도**: ⭐⭐⭐⭐⭐ (백엔드 API 스펙 준수)

### 테스트 결과

```
 ✓ formatPriceRange.test.ts (27 tests) 4ms
 ✓ formatDateRangeText.test.ts (36 tests) 5ms
 ✓ customers.test.ts (23 tests) 9ms
 ✓ purchaseFrequency.test.ts (27 tests) 9ms
 ✓ useCustomerPagination.test.ts (24 tests) 21ms

 Test Files  5 passed (5)
      Tests  137 passed (137)
   Duration  1.13s
```

### 테스트 전략 철학

1. **P0 우선**: 앱 안정성에 직접적 영향을 주는 로직 먼저 테스트
2. **엣지 케이스 중심**: 경계값, 특수문자, 빈 값 등 꼼꼼히 검증
3. **실제 사용 시나리오**: 분기별, 월별 조회 등 실제 사용 패턴 반영
4. **에러 복원력**: 404를 빈 배열로 처리하여 앱 크래시 방지

---

## ⚡ 성능 최적화 및 사용자 경험

### 1. 페이지네이션 구현

#### 서버사이드 vs 클라이언트사이드 비교

| 항목                | 서버사이드 페이지네이션              | 클라이언트사이드 페이지네이션 ⭐ (현재) |
| ------------------- | ------------------------------------ | --------------------------------------- |
| **데이터 로딩**     | 필요한 페이지만 요청                 | 전체 데이터 한 번에 로딩                |
| **네트워크 트래픽** | 각 페이지마다 API 호출               | 초기 1회만 호출                         |
| **응답 속도**       | 네트워크 지연 발생                   | 즉각적 페이지 전환 (캐싱)               |
| **대용량 데이터**   | ✅ 효율적 (수천~수만 건)             | ❌ 메모리 부담 (수백 건 제한)           |
| **검색/필터링**     | 서버 부하, 복잡한 쿼리               | ✅ 빠른 응답 (클라이언트 메모리)        |
| **백엔드 요구사항** | `offset`, `limit` 파라미터 구현 필요 | 전체 목록 API만 필요                    |
| **구현 복잡도**     | 백엔드/프론트엔드 동시 수정          | ✅ 프론트엔드만 수정                    |

#### 현재 프로젝트 선택: 클라이언트사이드

**이유:**

1. **백엔드 코드 수정 불가 제약**: 과제 요구사항
2. **데이터 규모 적절**: 메모리 부담 낮음
3. **빠른 UX**: 검색/정렬 시 즉각 반응
4. **TanStack Query 캐싱**: 네트워크 호출 최소화

### 2. 로딩 상태 관리 전략

**초기 계획: useSuspenseQuery 전면 사용**

- React 18 Suspense로 선언적 로딩 처리

**현실적 문제 발견:**

- 부분 입력 시 400 에러로 앱 크래시
- 검색 결과 없을 때 404로 앱 다운

**최종 해결책: 하이브리드 접근**

```typescript
// 항상 실행되는 쿼리: useQuery + enabled
usePurchaseFrequency(params) {
  return useQuery({
    enabled: (hasFrom && hasTo) || (!hasFrom && !hasTo)
  })
}

// 조건부 쿼리: useQuery + enabled
useCustomerPurchases(id, enabled) {
  return useQuery({
    enabled: enabled && !!customerId
  })
}
```

### 3. 에러 복원력

### 3. 에러 복원력

**404 에러를 빈 배열로 처리**

```typescript
// 검색 결과 없음을 에러가 아닌 정상 상태로 처리
export async function fetchCustomers(params?: CustomersParams) {
  const response = await fetch(`${ENDPOINT}?${queryString}`);

  if (response.status === 404) {
    return []; // 에러 대신 빈 배열 반환
  }

  if (!response.ok) {
    throw new Error(`고객 목록을 불러오는데 실패했습니다`);
  }

  return await response.json();
}
```

### 4. 사용자 피드백

**빈 상태 처리**

```typescript
// 검색 결과 없음
if (customers.length === 0) {
  return (
    <EmptyState>
      <EmptyIcon>🔍</EmptyIcon>
      <EmptyText>검색 결과가 없습니다</EmptyText>
    </EmptyState>
  );
}

// 데이터 없음
if (data.length === 0) {
  return (
    <EmptyState>
      <p>선택한 기간에 구매 데이터가 없습니다.</p>
    </EmptyState>
  );
}
```

---

## 🛡 에러 처리 전략

### 현재 방식: 인라인 에러 메시지

**선택 이유:**

1. **독립적 섹션 운영**: 한 섹션 실패해도 다른 섹션 정상 작동
2. **부분 정보 제공**: 일부 데이터라도 사용자에게 표시
3. **명확한 에러 위치**: 문제 발생 지점 즉시 파악

```typescript
export function CustomerTable({ customers, isLoading, error }) {
  if (isLoading) return <LoadingSpinner size="lg" />;
  if (error) return <ErrorMessage message={error.message} />;
  if (customers.length === 0) return <EmptyState />;

  return <Table>{/* 정상 렌더링 */}</Table>;
}
```

### Error Boundary vs 인라인 비교

| 항목        | Error Boundary     | 인라인 처리 (현재) |
| ----------- | ------------------ | ------------------ |
| 범위        | 전체 섹션 fallback | 컴포넌트별 처리    |
| 부분 실패   | ❌ 전체 대체       | ✅ 다른 섹션 정상  |
| 디버깅      | 복잡               | ✅ 명확            |
| 사용자 경험 | 정보 손실          | ✅ 최대 정보 제공  |

---

## 📐 타입 안정성

### 1. API 응답 타입 정의

```typescript
// 백엔드 응답 구조와 정확히 일치
export interface Customer {
  id: number; // 백엔드: number
  name: string;
  count: number; // 백엔드: "count" (totalPurchases 아님)
  totalAmount: number;
}

export interface CustomerPurchase {
  date: string; // ISO 8601
  product: string;
  price: number;
  imgSrc: string; // 백엔드: flat structure
}
```

### 2. TypeScript 설정 최적화

**minimatch 에러 해결**

```jsonc
// tsconfig.app.json
{
  "compilerOptions": {
    "types": [],  // 자동 @types 포함 방지
    // Storybook의 deprecated @types/minimatch stub 무시
  }
}

// tsconfig.node.json (Vite 설정용)
{
  "compilerOptions": {
    "types": ["node"]  // Node.js 타입만 명시적 포함
  }
}
```

**근본 원인:**

- Storybook v7.6.0의 간접 의존성이 deprecated `@types/minimatch` stub 설치
- TypeScript가 자동으로 모든 `@types/*` 포함 시도
- Stub 패키지라 타입 정의 없어 에러 발생

---

## 🔗 URL 상태 관리 전략

### 문제 정의

**기존 상태 관리의 한계:**

- 내부 상태(useState)로 관리되는 필터, 정렬, 페이지 등이 **새로고침 시 초기화**
- 예: 2015년 데이터를 보다가 실수로 새로고침 → 다시 2015년까지 날짜 조정 필요
- 특정 고객 상세 모달을 보다가 새로고침 → 다시 해당 고객 찾아야 함
- URL 공유 불가능 (특정 필터/정렬 상태를 다른 사람과 공유할 수 없음)

### 해결 방법: URL Query Parameters 활용

모든 주요 상태를 URL에 저장하여 **새로고침에도 유지**되고 **공유 가능**하도록 구현했습니다.

#### 구현된 URL 파라미터

| 파라미터     | 설명           | 예시                  |
| ------------ | -------------- | --------------------- |
| `from`       | 차트 시작 날짜 | `?from=2015-01-01`    |
| `to`         | 차트 종료 날짜 | `?to=2015-12-31`      |
| `search`     | 고객 검색어    | `?search=김철수`      |
| `sortBy`     | 정렬 필드      | `?sortBy=totalAmount` |
| `sortOrder`  | 정렬 순서      | `?sortOrder=desc`     |
| `page`       | 현재 페이지    | `?page=3`             |
| `customerId` | 선택된 고객 ID | `?customerId=42`      |

#### 실제 사용 예시

```
# 2015년 데이터 + "김" 검색 + 구매액 내림차순 + 3페이지 + 42번 고객 상세 모달
http://localhost:5173/?from=2015-01-01&to=2015-12-31&search=김&sortBy=totalAmount&sortOrder=desc&page=3&customerId=42
```

### 핵심 구현 - useUrlState 훅

**기본 사용법 (useState와 동일한 인터페이스)**

```typescript
// lib/url-state/useUrlState.ts
export function useUrlState(
  key: string,
  defaultValue: string = ""
): [string, (value: string) => void] {
  const [state, setState] = useState<string>(() =>
    getUrlParam(key, defaultValue)
  );

  const setUrlState = useCallback(
    (value: string) => {
      setState(value);
      setUrlParam(key, value || null); // URL 동기화
    },
    [key]
  );

  // popstate 이벤트 리스너 (뒤로가기/앞으로가기 대응)
  useEffect(() => {
    const handlePopState = () => {
      const newValue = getUrlParam(key, defaultValue);
      setState(newValue);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [key, defaultValue]);

  return [state, setUrlState];
}
```

### 장점

1. **사용자 경험 향상**

   - 새로고침해도 작업 중이던 상태 유지
   - 뒤로가기/앞으로가기 버튼으로 상태 이동 가능

2. **URL 공유 가능**

   - 특정 필터/정렬 상태를 동료와 공유
   - 예: "이 링크 확인해보세요" → 정확히 같은 화면 표시

3. **북마크 지원**

   - 자주 사용하는 필터 조합을 브라우저 북마크에 저장

4. **SEO 친화적** (필요 시)

   - 서버 사이드 렌더링 시 URL 파라미터로 초기 상태 구성 가능

5. **디버깅 용이**
   - 버그 리포트 시 URL만 공유하면 정확한 재현 가능

### 주의사항

- **민감한 정보는 URL에 저장하지 않음** (토큰, 비밀번호 등)
- **URL 길이 제한** (일반적으로 2048자, 복잡한 필터는 서버 상태로 관리)
- **브라우저 히스토리 관리** (replaceState vs pushState 적절히 선택)

---

## �📂 프로젝트 구조

```
apps/frontend/src/
├── components/              # 공통 UI 컴포넌트
│   ├── Button/
│   ├── Card/               # Compound Component
│   ├── Chart/              # BarChart wrapper (Recharts)
│   ├── DatePicker/
│   ├── ErrorMessage/
│   ├── Input/
│   ├── LoadingSpinner/
│   ├── Modal/              # Compound Component (Portal 포함)
│   └── Table/              # Compound Component
│
├── domains/                # 도메인 중심 설계
│   ├── customer/
│   │   ├── api/
│   │   │   ├── customers.ts         # fetch 함수
│   │   │   └── queryKeys.ts         # 쿼리 키 정의
│   │   ├── hooks/
│   │   │   ├── useCustomers.ts          # 목록 조회
│   │   │   ├── useCustomerPurchases.ts  # 상세 조회
│   │   │   ├── useCustomerSearch.ts     # 디바운스 검색 (URL 동기화)
│   │   │   ├── useCustomerSort.ts       # 정렬 로직 (URL 동기화)
│   │   │   ├── useCustomerPagination.ts # 페이지네이션 (URL 동기화)
│   │   │   ├── useCustomerModal.ts      # 모달 상태 (URL 동기화)
│   │   │   ├── useSortedCustomers.ts    # 클라이언트 정렬
│   │   │   ├── usePaginatedCustomers.ts # 데이터 슬라이싱
│   │   │   └── usePaginationReset.ts    # 페이지 리셋 로직
│   │   ├── components/
│   │   │   ├── CustomerSearchBar.tsx
│   │   │   ├── CustomerSortControls.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── CustomerTableRow.tsx
│   │   │   ├── CustomerDetailModal.tsx
│   │   │   ├── CustomerPagination.tsx
│   │   │   └── CustomerListSection.tsx  # 통합 컴포넌트
│   │   ├── utils/
│   │   │   └── pagination.ts            # 페이지 번호 계산 유틸
│   │   └── types/
│   │       └── index.ts
│   │
│   └── purchase/
│       ├── api/
│       │   ├── purchaseFrequency.ts  # API + ISO 8601 변환
│       │   └── queryKeys.ts
│       ├── hooks/
│       │   ├── usePurchaseFrequency.ts
│       │   └── useDateRangeFilter.ts  # 날짜 상태 관리 (URL 동기화)
│       └── components/
│           ├── DateRangeFilter.tsx
│           ├── PurchaseFrequencyChart.tsx
│           └── PurchaseFrequencySection.tsx
│
├── layouts/                # 레이아웃 컴포넌트
│   ├── Container/
│   ├── Grid/
│   └── Section/
│
├── lib/                    # 외부 라이브러리 설정
│   ├── react-query/
│   │   ├── queryClient.ts  # TanStack Query 설정
│   │   └── queryKeys.ts
│   └── url-state/          # URL 상태 관리 유틸리티
│       ├── urlState.ts     # URL 파라미터 유틸 함수
│       └── useUrlState.ts  # URL 상태 훅 (string, number, boolean)
│
├── pages/
│   └── DashboardPage.tsx   # 메인 페이지
│
├── styles/
│   ├── globalStyles.ts     # 전역 스타일
│   └── theme.ts            # 디자인 토큰
│
└── App.tsx                 # 앱 진입점
```

---

## 🎨 디자인 시스템

### Theme 기반 일관성

```typescript
export const theme = {
  colors: {
    primary: "#3b82f6",
    success: "#10b981",
    danger: "#ef4444",
    // ...
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    // ...
  },
  typography: {
    fontSize: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      // ...
    },
  },
};
```

---

## 🔍 코드 품질

### JSDoc 주석

모든 공개 함수 및 컴포넌트에 JSDoc 주석 작성

```typescript
/**
 * 고객 목록을 가져오는 React Query 훅
 * @param params - 정렬 및 검색 파라미터 (선택사항)
 * @returns 고객 목록 쿼리 결과
 */
export function useCustomers(params?: CustomersParams) {
  return useQuery(customerQueryKeys.list(params));
}
```

---

## 📝 회고

### 잘한 점

- ✅ 도메인 중심 설계로 높은 응집도 달성
- ✅ TanStack Query로 서버 상태 효율적 관리
- ✅ 타입 안정성 확보 (minimatch 에러 해결 포함)
- ✅ 실용적인 에러 처리 전략 수립
- ✅ 사용자 경험 중심 설계 (디바운스, 빈 상태, 에러 복원력)
- ✅ **137개 유닛 테스트로 핵심 로직 검증 (P0 우선순위)**
- ✅ **엣지 케이스까지 고려한 철저한 테스트 커버리지**
- ✅ **클라이언트사이드 페이지네이션으로 빠른 페이지 전환 구현**
- ✅ **URL 상태 관리로 새로고침에도 작업 상태 유지 및 공유 가능**

### 배운 점

- **useSuspenseQuery의 한계**: 조건부 쿼리에는 useQuery + enabled가 더 적합
- **404를 에러가 아닌 빈 상태로**: 사용자 경험 향상
- **하이브리드 정렬**: 서버와 클라이언트의 책임 분리
- **TypeScript 타입 자동 포함 메커니즘**: Stub 패키지 문제 해결 경험
- **Vitest의 장점**: Vite와의 완벽한 통합, 빠른 테스트 실행
- **엣지 케이스의 중요성**: 공백 없는 문자열, 시간대 처리, 윤년 등 실제 발생 가능한 케이스 검증
- **테스트 우선순위 전략**: P0 (앱 안정성) → P1 (비즈니스 로직) → P2 (복잡한 로직) 순으로 테스트
- **클라이언트사이드 페이지네이션 선택**: 백엔드 수정 불가 제약 + 데이터 규모 적절 → 빠른 UX 제공 가능
- **URL 상태 관리의 중요성**:
  - useState만으로는 새로고침 시 상태 손실
  - URL 파라미터로 영구 보존 + 공유 가능
  - 브라우저 히스토리(뒤로가기/앞으로가기) 통합
  - 디버깅 시 URL만 공유하면 정확한 재현 가능
- **테스트 우선순위 전략**: P0 (앱 안정성) → P1 (비즈니스 로직) → P2 (복잡한 로직) 순으로 테스트- **클라이언트사이드 페이지네이션 선택**: 백엔드 수정 불가 제약 + 데이터 규모 적절 → 빠른 UX 제공 가능

### 개선할 점

- **서버사이드 페이지네이션 전환 필요성**:
  - 현재는 백엔드 코드 수정 불가 제약으로 클라이언트사이드 구현
  - 향후 고객 수 증가 시 (1만 명 이상) 서버사이드로 전환 권장
- **무한 스크롤 고려**: 모바일 UX 개선을 위해 페이지 버튼 대신 무한 스크롤 검토
- **가상화 (Virtualization)**: 대용량 테이블 렌더링 성능 향상 (react-window 등)
