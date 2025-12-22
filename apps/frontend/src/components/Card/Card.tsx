import { StyledCard, CardHeader, CardBody, CardFooter } from './Card.styled';
import { ReactNode } from 'react';

interface CardProps {
  /** 카드 내용 */
  children: ReactNode;
  /** 카드 패딩 크기 */
  padding?: 'sm' | 'md' | 'lg';
  /** 카드 그림자 크기 */
  elevation?: 'sm' | 'md' | 'lg';
}

/**
 * 카드 컴포넌트
 * Header, Body, Footer를 서브 컴포넌트로 제공합니다.
 */
export function Card({ children, padding = 'md', elevation = 'md' }: CardProps) {
  return (
    <StyledCard padding={padding} elevation={elevation}>
      {children}
    </StyledCard>
  );
}

/**
 * 카드 헤더 컴포넌트
 */
Card.Header = function CardHeaderComponent({ children }: { children: ReactNode }) {
  return <CardHeader>{children}</CardHeader>;
};

/**
 * 카드 본문 컴포넌트
 */
Card.Body = function CardBodyComponent({ children }: { children: ReactNode }) {
  return <CardBody>{children}</CardBody>;
};

/**
 * 카드 푸터 컴포넌트
 */
Card.Footer = function CardFooterComponent({ children }: { children: ReactNode }) {
  return <CardFooter>{children}</CardFooter>;
};
