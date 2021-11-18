import type { NextPage } from 'next'
import { Box } from '@chakra-ui/react'
import Playground from 'components/Playground'

const Home: NextPage = function () {
  return (
    <Box>
      <Playground />
    </Box>
  )
}

export default Home
