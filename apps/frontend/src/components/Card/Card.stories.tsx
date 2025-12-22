import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';
import { Button } from '../Button/Button';

const meta = {
  title: 'components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Card component is a container with optional header, body, and footer sections.',
      },
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

const Flex = ({ children, gap = '20px' }: { children: React.ReactNode; gap?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

export const Basic: Story = {
  args: {
    padding: 'md',
    elevation: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <p>This is a basic card with some content inside.</p>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <h3>Card Header</h3>
      </Card.Header>
      <Card.Body>
        <p>This is the card body with some content.</p>
      </Card.Body>
      <Card.Footer>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="sm">
            Cancel
          </Button>
          <Button variant="primary" size="sm">
            Confirm
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};

export const Elevations: Story = {
  render: () => (
    <Flex>
      <Card elevation="sm" padding="lg">
        <h4>Small Elevation</h4>
        <p>Card with small shadow</p>
      </Card>
      <Card elevation="md" padding="lg">
        <h4>Medium Elevation</h4>
        <p>Card with medium shadow</p>
      </Card>
      <Card elevation="lg" padding="lg">
        <h4>Large Elevation</h4>
        <p>Card with large shadow</p>
      </Card>
    </Flex>
  ),
};

export const Paddings: Story = {
  render: () => (
    <Flex>
      <Card padding="sm" elevation="md">
        <p>Small Padding</p>
      </Card>
      <Card padding="md" elevation="md">
        <p>Medium Padding</p>
      </Card>
      <Card padding="lg" elevation="md">
        <p>Large Padding</p>
      </Card>
    </Flex>
  ),
};

export const ComplexExample: Story = {
  render: () => (
    <Card elevation="lg" padding="lg">
      <Card.Header>
        <h2>User Profile</h2>
      </Card.Header>
      <Card.Body>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <strong>Name:</strong> John Doe
          </div>
          <div>
            <strong>Email:</strong> john.doe@example.com
          </div>
          <div>
            <strong>Role:</strong> Developer
          </div>
        </div>
      </Card.Body>
      <Card.Footer>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
          <Button variant="secondary" size="md">
            Edit
          </Button>
          <Button variant="danger" size="md">
            Delete
          </Button>
        </div>
      </Card.Footer>
    </Card>
  ),
};
