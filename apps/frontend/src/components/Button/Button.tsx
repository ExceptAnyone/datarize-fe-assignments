import { StyledButton } from './Button.styled';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 스타일 변형 */
  variant?: 'primary' | 'secondary' | 'danger';
  /** 버튼 크기 */
  size?: 'sm' | 'md' | 'lg';
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
  /** 버튼 내용 */
  children: ReactNode;
}

/**
 * 기본 버튼 컴포넌트
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...rest}>
      {children}
    </StyledButton>
  );
}
