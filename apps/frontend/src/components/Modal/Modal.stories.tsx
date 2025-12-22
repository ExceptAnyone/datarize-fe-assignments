import type { Meta, StoryObj } from '@storybook/react';
import { Modal } from './Modal';
import { Button } from '../Button/Button';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Modal (합성 컴포넌트 패턴)
 */
export const Basic: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger>
        <Button>모달 열기</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>기본 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>모달의 기본 내용입니다.</p>
              <p>배경을 클릭하거나 ESC 키를 눌러 닫을 수 있습니다.</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 제목 없는 Modal
 */
export const WithoutTitle: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger>
        <Button>제목 없는 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Body>
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <h3>커스텀 컨텐츠</h3>
                <p>제목 영역이 없는 모달입니다.</p>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * Footer가 있는 Modal
 */
export const WithFooter: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger>
        <Button>푸터 있는 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>확인이 필요합니다</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>이 작업을 계속하시겠습니까?</p>
              <p>확인 버튼을 클릭하면 작업이 진행됩니다.</p>
            </Modal.Body>

            <Modal.Footer>
              <Modal.Trigger asChild>
                <Button variant="secondary">취소</Button>
              </Modal.Trigger>
              <Button
                variant="primary"
                onClick={() => alert('확인되었습니다!')}
              >
                확인
              </Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 작은 크기 Modal
 */
export const SmallSize: Story = {
  render: () => (
    <Modal size="sm">
      <Modal.Trigger>
        <Button size="sm">작은 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>작은 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>작은 크기의 모달입니다 (400px)</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 중간 크기 Modal (기본값)
 */
export const MediumSize: Story = {
  render: () => (
    <Modal size="md">
      <Modal.Trigger>
        <Button>중간 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>중간 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>중간 크기의 모달입니다 (600px, 기본값)</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 큰 크기 Modal
 */
export const LargeSize: Story = {
  render: () => (
    <Modal size="lg">
      <Modal.Trigger>
        <Button size="lg">큰 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>큰 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>큰 크기의 모달입니다 (800px)</p>
              <p>더 많은 콘텐츠를 표시할 수 있습니다.</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 긴 내용을 가진 Modal (스크롤)
 */
export const LongContent: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger>
        <Button>긴 내용 모달</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>긴 내용을 가진 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              {Array.from({ length: 20 }, (_, i) => (
                <p key={i}>
                  {i + 1}. 이것은 긴 내용을 테스트하기 위한 단락입니다. 모달의
                  최대 높이는 90vh이며, 내용이 많으면 스크롤이 생성됩니다.
                </p>
              ))}
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 배경 클릭으로 닫히지 않는 Modal
 */
export const NoCloseOnOverlayClick: Story = {
  render: () => (
    <Modal>
      <Modal.Trigger>
        <Button>배경 클릭 무시</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay closeOnClick={false}>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>중요한 확인</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>배경을 클릭해도 닫히지 않습니다.</p>
              <p>닫기 버튼이나 ESC 키를 사용해야 합니다.</p>
            </Modal.Body>

            <Modal.Footer>
              <Modal.Trigger asChild>
                <Button variant="secondary">취소</Button>
              </Modal.Trigger>
              <Button variant="primary">확인</Button>
            </Modal.Footer>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 기본적으로 열려있는 Modal
 */
export const DefaultOpen: Story = {
  render: () => (
    <Modal defaultOpen>
      <Modal.Trigger>
        <Button>모달 다시 열기</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>기본적으로 열려있는 모달</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <p>이 모달은 기본적으로 열려있습니다.</p>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};

/**
 * 고객 상세 정보 예시
 */
export const CustomerDetailExample: Story = {
  render: () => (
    <Modal size="lg">
      <Modal.Trigger>
        <Button>고객 상세 보기</Button>
      </Modal.Trigger>

      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content>
            <Modal.Header>
              <Modal.Title>김철수님의 구매 내역</Modal.Title>
              <Modal.CloseButton />
            </Modal.Header>

            <Modal.Body>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 구매 내역 1 */}
                <div
                  style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#475569',
                    }}
                  >
                    2024-07-15
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: '#3b82f6',
                        borderRadius: '0.25rem',
                      }}
                    />
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: '#8b5cf6',
                        borderRadius: '0.25rem',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    무선 이어폰, 노트북 파우치
                  </div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>
                    121,000원
                  </div>
                </div>

                {/* 구매 내역 2 */}
                <div
                  style={{
                    padding: '1rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.5rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: '0.5rem',
                      color: '#475569',
                    }}
                  >
                    2024-07-08
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div
                      style={{
                        width: 60,
                        height: 60,
                        background: '#10b981',
                        borderRadius: '0.25rem',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    USB 충전기
                  </div>
                  <div style={{ marginTop: '0.5rem', fontWeight: 600 }}>
                    29,000원
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal>
  ),
};
