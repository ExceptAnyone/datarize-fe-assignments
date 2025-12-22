import {
  StyledInput,
  InputWrapper,
  InputLabel,
  InputError,
} from './Input.styled';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 입력 필드 라벨 */
  label?: string;
  /** 에러 메시지 */
  error?: string;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}

/**
 * 기본 입력 필드 컴포넌트
 * forwardRef를 사용하여 ref 전달을 지원합니다.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, ...rest }, ref) => {
    const hasError = Boolean(error);

    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <StyledInput ref={ref} hasError={hasError} {...rest} />
        {error && <InputError>{error}</InputError>}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';
