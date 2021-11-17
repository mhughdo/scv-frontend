import type { NextPage } from 'next'
import Navbar from 'components/navbars'
import { Box } from '@chakra-ui/react'

const Home: NextPage = function () {
  return (
    <Box>
      <Navbar />
    </Box>
  )
}

export default Home
