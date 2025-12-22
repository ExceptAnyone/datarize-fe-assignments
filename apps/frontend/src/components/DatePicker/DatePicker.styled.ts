import styled from '@emotion/styled';

interface DatePickerWrapperProps {
  fullWidth: boolean;
}

export const DatePickerWrapper = styled.div<DatePickerWrapperProps>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`;

export const DatePickerLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StyledDateInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  outline: none;
  transition: border-color 0.2s ease-in-out;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.focus};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.disabled};
    color: ${({ theme }) => theme.colors.text.disabled};
    cursor: not-allowed;
  }

  /* 날짜 선택기 아이콘 스타일링 */
  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }
`;
