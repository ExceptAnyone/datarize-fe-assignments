import { StyledErrorMessage } from './ErrorMessage.styled';

interface ErrorMessageProps {
  /** 에러 메시지 내용 */
  message: string;
  /** 메시지 유형 */
  variant?: 'error' | 'warning';
}

/**
 * 에러 또는 경고 메시지를 표시하는 컴포넌트
 */
export function ErrorMessage({ message, variant = 'error' }: ErrorMessageProps) {
  return <StyledErrorMessage variant={variant}>{message}</StyledErrorMessage>;
}
