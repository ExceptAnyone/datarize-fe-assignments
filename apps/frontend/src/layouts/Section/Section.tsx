import { StyledSection } from './Section.styled';
import { ReactNode } from 'react';

interface SectionProps {
  /** 섹션 내용 */
  children: ReactNode;
  /** 섹션 상하 간격 */
  spacing?: 'sm' | 'md' | 'lg';
}

/**
 * 섹션 레이아웃 컴포넌트
 * 페이지 내 섹션을 구분하고 일정한 간격을 제공합니다.
 */
export function Section({ children, spacing = 'md' }: SectionProps) {
  return <StyledSection spacing={spacing}>{children}</StyledSection>;
}
