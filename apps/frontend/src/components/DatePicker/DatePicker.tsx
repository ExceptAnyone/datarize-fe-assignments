import { forwardRef, InputHTMLAttributes } from 'react'
import { DatePickerWrapper, DatePickerLabel, StyledDateInput } from './DatePicker.styled'

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** 라벨 텍스트 */
  label?: string
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, fullWidth = false, ...props }, ref) => {
    return (
      <DatePickerWrapper fullWidth={fullWidth}>
        {label && <DatePickerLabel>{label}</DatePickerLabel>}
        <StyledDateInput ref={ref} type="date" {...props} />
      </DatePickerWrapper>
    )
  },
)

DatePicker.displayName = 'DatePicker'
