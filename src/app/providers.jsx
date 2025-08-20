import React from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

const theme = createTheme({
  fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"',
  defaultRadius: 16,
  primaryColor: 'teal',
  components: {
    Card: { defaultProps: { withBorder: true, shadow: 'sm', radius: 'lg' } },
    Paper: { defaultProps: { radius: 'lg' } },
    Button: { defaultProps: { radius: 'lg' } },
    TextInput: { defaultProps: { radius: 'lg' } },
    Tabs: { defaultProps: { radius: 'lg' } }
  }
})

const qc = new QueryClient()

export function AppProviders({ children }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <QueryClientProvider client={qc}>
        <Notifications position="top-right" />
        {children}
      </QueryClientProvider>
    </MantineProvider>
  )
}
