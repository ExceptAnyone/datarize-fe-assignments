import { StyledContainer } from './Container.styled';
import { ReactNode } from 'react';

interface ContainerProps {
  /** 컨테이너 내용 */
  children: ReactNode;
  /** 최대 너비 */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

/**
 * 컨테이너 레이아웃 컴포넌트
 * 콘텐츠를 중앙에 배치하고 최대 너비를 제한합니다.
 */
export function Container({ children, maxWidth = 'lg' }: ContainerProps) {
  return <StyledContainer maxWidth={maxWidth}>{children}</StyledContainer>;
}
