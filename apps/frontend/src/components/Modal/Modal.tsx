import { createContext, useContext, useId, ReactNode, ButtonHTMLAttributes, HTMLAttributes } from 'react'
import { createPortal } from 'react-dom'
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalTitle as StyledModalTitle,
  ModalCloseButton,
  ModalBody as StyledModalBody,
  ModalFooter as StyledModalFooter,
} from './Modal.styled'
import { useBoolean } from './hooks/useBoolean'
import { useEscapeKey } from './hooks/useEscapeKey'
import { useBodyScrollLock } from './hooks/useBodyScrollLock'
import { useOverlay } from './hooks/useOverlay'

interface ModalContextType {
  isOpen: boolean
  open: () => void
  close: () => void
  size: 'sm' | 'md' | 'lg'
}

const ModalContext = createContext<ModalContextType | null>(null)

function useModalContext() {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal 컴포넌트는 Modal.Root 내부에서 사용해야 합니다.')
  }
  return context
}

interface ModalRootProps {
  children: ReactNode
  defaultOpen?: boolean
  /** Controlled 모드: 외부에서 isOpen 상태 제어 */
  isOpen?: boolean
  /** Controlled 모드: 외부에서 onClose 콜백 제어 */
  onOpenChange?: (open: boolean) => void
  size?: 'sm' | 'md' | 'lg'
}

function ModalRoot({
  children,
  defaultOpen = false,
  isOpen: controlledOpen,
  onOpenChange,
  size = 'md',
}: ModalRootProps) {
  const { value: internalOpen, setTrue: internalSetOpen, setFalse: internalSetClose } = useBoolean(defaultOpen)

  // Controlled vs Uncontrolled 모드
  const isControlled = controlledOpen !== undefined
  const isOpen = isControlled ? controlledOpen : internalOpen

  const open = () => {
    if (isControlled) {
      onOpenChange?.(true)
    } else {
      internalSetOpen()
    }
  }

  const close = () => {
    if (isControlled) {
      onOpenChange?.(false)
    } else {
      internalSetClose()
    }
  }

  return <ModalContext.Provider value={{ isOpen, open, close, size }}>{children}</ModalContext.Provider>
}

interface ModalTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  asChild?: boolean
}

function ModalTrigger({ children, asChild, ...props }: ModalTriggerProps) {
  const { open } = useModalContext()

  if (asChild) {
    return children
  }

  return (
    <button onClick={open} {...props}>
      {children}
    </button>
  )
}

interface ModalPortalProps {
  children: ReactNode
  root?: HTMLElement
}

function ModalPortal({ children, root = document.body }: ModalPortalProps) {
  const { isOpen } = useModalContext()
  return createPortal(isOpen ? children : null, root)
}

interface ModalOverlayComponentProps extends HTMLAttributes<HTMLDivElement> {
  closeOnClick?: boolean
}

function ModalOverlayComponent({ closeOnClick = true, ...props }: ModalOverlayComponentProps) {
  const { isOpen, close } = useModalContext()
  const overlayId = useId()
  const { handleClickOverlay } = useOverlay(close)

  useEscapeKey(close, isOpen)

  useBodyScrollLock(isOpen)

  return (
    <ModalOverlay
      open={isOpen}
      id={overlayId}
      onClick={closeOnClick ? (e) => handleClickOverlay(e, overlayId) : undefined}
      role="dialog"
      aria-modal="true"
      {...props}
    />
  )
}

interface ModalContentComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function ModalContentComponent({ children, ...props }: ModalContentComponentProps) {
  const { size } = useModalContext()

  return (
    <ModalContent
      size={size}
      onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록
      {...props}
    >
      {children}
    </ModalContent>
  )
}

interface ModalHeaderComponentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function ModalHeaderComponent({ children, ...props }: ModalHeaderComponentProps) {
  return <ModalHeader {...props}>{children}</ModalHeader>
}

interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode
}

function ModalTitle({ children, ...props }: ModalTitleProps) {
  return (
    <StyledModalTitle id="modal-title" {...props}>
      {children}
    </StyledModalTitle>
  )
}

interface ModalCloseButtonComponentProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
}

function ModalCloseButtonComponent({ children = '×', ...props }: ModalCloseButtonComponentProps) {
  const { close } = useModalContext()

  return (
    <ModalCloseButton onClick={close} aria-label="모달 닫기" {...props}>
      {children}
    </ModalCloseButton>
  )
}

interface ModalBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function ModalBody({ children, ...props }: ModalBodyProps) {
  return <StyledModalBody {...props}>{children}</StyledModalBody>
}

interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

function ModalFooterComponent({ children, ...props }: ModalFooterProps) {
  return <StyledModalFooter {...props}>{children}</StyledModalFooter>
}

export const Modal = Object.assign(ModalRoot, {
  Trigger: ModalTrigger,
  Portal: ModalPortal,
  Overlay: ModalOverlayComponent,
  Content: ModalContentComponent,
  Header: ModalHeaderComponent,
  Title: ModalTitle,
  CloseButton: ModalCloseButtonComponent,
  Body: ModalBody,
  Footer: ModalFooterComponent,
})

export type { ModalRootProps as ModalProps }
