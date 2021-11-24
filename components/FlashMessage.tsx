import { Text, Box } from '@chakra-ui/react'

const FlashMessage = function () {
  return (
    <Box>
      <Text
        bg='rgba(0,0,0,.8)'
        color='white'
        borderRadius='1em'
        fontSize='lg'
        py='0.5em'
        px='1.5em'
        transform='translateZ(0)'
        transition='opacity .1s ease-in-out'>
        URL copied to clipboard
      </Text>
    </Box>
  )
}

export default FlashMessage
