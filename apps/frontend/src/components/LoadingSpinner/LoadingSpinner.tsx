import { StyledSpinner, SpinnerContainer } from './LoadingSpinner.styled';

interface LoadingSpinnerProps {
  /** 스피너 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 스피너 색상 (선택사항, 기본값은 theme.colors.primary) */
  color?: string;
}

/**
 * 로딩 상태를 표시하는 스피너 컴포넌트
 */
export function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  return (
    <SpinnerContainer>
      <StyledSpinner size={size} color={color} />
    </SpinnerContainer>
  );
}
