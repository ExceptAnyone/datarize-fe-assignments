import { StyledGrid } from './Grid.styled';
import { ReactNode } from 'react';

interface GridProps {
  /** 그리드 내용 */
  children: ReactNode;
  /** 그리드 컬럼 수 */
  columns?: 1 | 2 | 3 | 4;
  /** 그리드 아이템 간격 */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * 그리드 레이아웃 컴포넌트
 * CSS Grid를 사용하여 반응형 레이아웃을 제공합니다.
 */
export function Grid({ children, columns = 1, gap = 'md' }: GridProps) {
  return (
    <StyledGrid columns={columns} gap={gap}>
      {children}
    </StyledGrid>
  );
}
