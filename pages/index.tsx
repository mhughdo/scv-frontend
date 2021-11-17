import type { NextPage } from 'next'
import Navbar from 'components/navbars'
import { Box, Flex, useDisclosure, Text } from '@chakra-ui/react'
import Toolbar from 'components/Toolbar'

import Editor from '@monaco-editor/react'

const defaultEditorValue =
  'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, playground")\n}\n'

const Home: NextPage = function () {
  const { isOpen, onToggle } = useDisclosure()
  return (
    <Box>
      <Navbar />
      <Flex>
        <Box boxShadow='xl' width='calc(100% - 360px)' flexGrow='1'>
          <Toolbar isOpen={isOpen} onToggle={onToggle} />
          <Editor
            height='90vh'
            defaultLanguage='go'
            defaultValue={defaultEditorValue}
            options={{
              minimap: false,
            }}
          />
        </Box>
        {isOpen && (
          <Box maxW='320px' flexBasis='320px' zIndex='1' pr={4} pl={2} flexDirection='column' overflow='hidden'>
            <Box mt={4} textAlign='center'>
              <Text fontSize='sm' fontWeight='600'>
                Logs
              </Text>
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default Home
