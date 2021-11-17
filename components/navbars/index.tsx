import { Box, Center, useColorModeValue as mode, useColorModeValue } from '@chakra-ui/react'
import { Logo } from './Logo'
import { Navbar } from './Navbar'

const MainNavbar = function () {
  return (
    <Box minH='2rem'>
      <Navbar color={useColorModeValue('#3178c6', 'gray.700')}>
        <Navbar.Brand>
          <Center marginEnd='10'>
            <Logo h='6' iconColor={mode('white', 'blue.300')} />
          </Center>
        </Navbar.Brand>
      </Navbar>
    </Box>
  )
}

export default MainNavbar
