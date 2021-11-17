import { Box, Button, Center, useColorModeValue as mode } from '@chakra-ui/react'
import { Logo } from './Logo'
import { Navbar } from './Navbar'

const App = function () {
  return (
    <Box minH='3rem' bg={mode('gray.50', 'gray.700')}>
      <Navbar>
        <Navbar.Brand>
          <Center marginEnd='10'>
            <Logo h='6' iconColor={mode('blue.600', 'blue.300')} />
          </Center>
        </Navbar.Brand>
        <Navbar.Buttons>
          <Button disabled>Run</Button>
          <Button>Format</Button>
          <Button>Share</Button>
        </Navbar.Buttons>
      </Navbar>
    </Box>
  )
}

export default App
