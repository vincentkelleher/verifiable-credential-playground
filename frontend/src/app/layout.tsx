// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '@mantine/core/styles.css'
import './globals.css'

import { ColorSchemeScript, createTheme, MantineProvider } from '@mantine/core'
import { PublicEnvScript } from 'next-runtime-env'

export const metadata = {
  title: 'My Mantine app',
  description: 'I have followed setup instructions carefully'
}

const theme = createTheme({})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Verifiable Credential Playground</title>
        <ColorSchemeScript />
        <PublicEnvScript />
      </head>
      <body>
        <MantineProvider theme={theme}>{children}</MantineProvider>
      </body>
    </html>
  )
}
