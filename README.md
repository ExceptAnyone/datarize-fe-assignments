# 쇼핑몰 구매 데이터 대시보드

> 데이터라이즈 Frontend Developer 채용 과제  
> 과제 요구사항은 [REQUIREMENTS.md](./REQUIREMENTS.md)를 참고해주세요.

## 📑 목차

- [프로젝트 실행 방법](#-프로젝트-실행-방법)
- [기술 스택 및 선택 이유](#-기술-스택-및-선택-이유)
- [아키텍처 및 설계 결정](#-아키텍처-및-설계-결정)
- [주요 구현 사항](#-주요-구현-사항)
- [성능 최적화 및 사용자 경험](#-성능-최적화-및-사용자-경험)
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

| 기술 | 버전 | 선택이유 |
| ---- | ---- | -------- |

|  
 **TanStack Query** | v5.90.12 | 최신 서버 상태 관리 표준 (useSuspenseQuery) |
| **Emotion** | 11.14.0 | CSS-in-JS, 타입 안전한 스타일링 |
| **Recharts** | 3.6.0 | 선언적 차트 라이브러리, 커스터마이징 용이 |
|

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

## ⚡ 성능 최적화 및 사용자 경험

### 1. 로딩 상태 관리 전략

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

### 2. 에러 복원력

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

### 3. 사용자 피드백

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

## 📂 프로젝트 구조

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
│   │   │   ├── useCustomers.ts      # 목록 조회
│   │   │   ├── useCustomerPurchases.ts  # 상세 조회
│   │   │   ├── useCustomerSearch.ts  # 디바운스 검색
│   │   │   └── useCustomerSort.ts    # 정렬 로직
│   │   ├── components/
│   │   │   ├── CustomerSearchBar.tsx
│   │   │   ├── CustomerSortControls.tsx
│   │   │   ├── CustomerTable.tsx
│   │   │   ├── CustomerTableRow.tsx
│   │   │   ├── CustomerDetailModal.tsx
│   │   │   └── CustomerListSection.tsx  # 통합 컴포넌트
│   │   └── types/
│   │       └── index.ts
│   │
│   └── purchase/
│       ├── api/
│       │   ├── purchaseFrequency.ts  # API + ISO 8601 변환
│       │   └── queryKeys.ts
│       ├── hooks/
│       │   ├── usePurchaseFrequency.ts
│       │   └── useDateRangeFilter.ts  # 날짜 상태 관리
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
│   └── react-query/
│       ├── queryClient.ts  # TanStack Query 설정
│       └── queryKeys.ts
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

### 배운 점

- **useSuspenseQuery의 한계**: 조건부 쿼리에는 useQuery + enabled가 더 적합
- **404를 에러가 아닌 빈 상태로**: 사용자 경험 향상
- **하이브리드 정렬**: 서버와 클라이언트의 책임 분리
- **TypeScript 타입 자동 포함 메커니즘**: Stub 패키지 문제 해결 경험
