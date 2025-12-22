import React from 'react'
import type { Preview } from '@storybook/react'
import { ThemeProvider, Global } from '@emotion/react'
import { theme } from '../src/styles/theme'
import { globalStyles } from '../src/styles/globalStyles'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Global styles={globalStyles(theme)} />
        <Story />
      </ThemeProvider>
    ),
  ],
}

export default preview
