import type { Meta, StoryObj } from '@storybook/react';
import { ErrorMessage } from './ErrorMessage';

const meta = {
  title: 'components/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'ErrorMessage component displays error or warning messages to the user.',
      },
    },
  },
} satisfies Meta<typeof ErrorMessage>;

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

const Flex = ({ children, gap = '16px' }: { children: React.ReactNode; gap?: string }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap }}>{children}</div>
);

export const Basic: Story = {
  args: {
    message: 'This is an error message',
    variant: 'error',
  },
  render: (args) => <ErrorMessage {...args} />,
};

export const Error: Story = {
  args: {
    message: 'An error occurred while processing your request. Please try again.',
    variant: 'error',
  },
  render: (args) => <ErrorMessage {...args} />,
};

export const Warning: Story = {
  args: {
    message: 'Warning: This action cannot be undone.',
    variant: 'warning',
  },
  render: (args) => <ErrorMessage {...args} />,
};

export const Variants: Story = {
  render: () => (
    <Flex>
      <ErrorMessage
        message="This is an error message with detailed information about what went wrong."
        variant="error"
      />
      <ErrorMessage
        message="This is a warning message to inform you about potential issues."
        variant="warning"
      />
    </Flex>
  ),
};

export const LongMessage: Story = {
  args: {
    message:
      'This is a very long error message that demonstrates how the component handles longer text. It should wrap properly and maintain readability even with multiple lines of content. The component should adapt to the content length while maintaining its visual consistency.',
    variant: 'error',
  },
  render: (args) => <ErrorMessage {...args} />,
};
