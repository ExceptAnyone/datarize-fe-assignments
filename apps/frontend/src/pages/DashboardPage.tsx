import { Suspense } from 'react'
import styled from '@emotion/styled'
import { Container } from '../layouts/Container/Container'
import { Section } from '../layouts/Section/Section'
import { PurchaseFrequencySection } from '../domains/purchase/components/PurchaseFrequencySection'
import { CustomerListSection } from '../domains/customer/components/CustomerListSection'
import { LoadingSpinner } from '../components/LoadingSpinner/LoadingSpinner'

/**
 * 쇼핑몰 구매 데이터 대시보드 메인 페이지
 * 가격대별 구매 빈도 차트와 고객 목록을 표시합니다.
 */
export function DashboardPage() {
  return (
    <Container maxWidth="xl">
      <Header>
        <Title>쇼핑몰 구매 데이터 대시보드</Title>
        <Subtitle>2024년 7월 분석</Subtitle>
      </Header>

      <Suspense
        fallback={
          <LoadingFallback>
            <LoadingSpinner size="lg" />
          </LoadingFallback>
        }
      >
        <Section spacing="lg">
          <PurchaseFrequencySection />
        </Section>

        <Section spacing="lg">
          <CustomerListSection />
        </Section>
      </Suspense>
    </Container>
  )
}

const Header = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};
`

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
`

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`

const LoadingFallback = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`
