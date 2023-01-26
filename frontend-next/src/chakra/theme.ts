import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme(
  { config },
  {
    styles: 
    {
      global: 
      {
        body: 
        {
          bg: "#171923"
        }
      }
    }
  }  
)

export default theme