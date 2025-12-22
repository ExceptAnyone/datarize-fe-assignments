import styled from '@emotion/styled'
import { Input } from '../../../components/Input/Input'

interface CustomerSearchBarProps {
  /** 현재 검색어 */
  value: string
  /** 검색어 변경 핸들러 */
  onChange: (value: string) => void
  /** placeholder 텍스트 (선택사항) */
  placeholder?: string
}

/**
 * 고객 검색 바 컴포넌트
 * Input 컴포넌트를 래핑하여 검색 아이콘을 표시합니다.
 */
export function CustomerSearchBar({ value, onChange, placeholder = '고객 이름으로 검색...' }: CustomerSearchBarProps) {
  return (
    <SearchContainer>
      <SearchIcon>🔍</SearchIcon>
      <StyledInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="고객 이름 검색"
      />
    </SearchContainer>
  )
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 400px;
`

const SearchIcon = styled.span`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
  font-size: 1rem;
`

const StyledInput = styled(Input)`
  padding-left: 2.5rem;
`
