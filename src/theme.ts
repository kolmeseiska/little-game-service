import { extendTheme, type ThemeConfig } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const styles = {
  global: (props: Record<string, unknown>) => ({
    body: {
      bg: mode('#242424', '#242424')(props)
    }
  })
}

const theme = extendTheme({ config, styles })

export default theme
