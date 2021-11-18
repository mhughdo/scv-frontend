import type { NextPage } from 'next'
import Navbar from 'components/navbars'
import { Box, Flex, useDisclosure, Text } from '@chakra-ui/react'
import Toolbar from 'components/Toolbar'
import monacoType from 'monaco-editor/esm/vs/editor/editor.api'

import Editor from '@monaco-editor/react'
import nightOwl from 'styles/night-owl-light.json'

const defaultEditorValue =
  'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, playground")\n}\n'

const Home: NextPage = function () {
  const { isOpen, onToggle } = useDisclosure()

  const handleEditorWillMount = (monaco: typeof monacoType) => {
    monaco.editor.defineTheme('Night-Owl-Light', nightOwl as monacoType.editor.IStandaloneThemeData)
  }

  const handleEditorDidMount = (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monaco.editor.setTheme('Night-Owl-Light')
  }

  return (
    <Box>
      <Navbar />
      <Flex>
        <Box boxShadow='xl' width='calc(100% - 360px)' flexGrow='1' fontFamliy='Dank Mono Regular'>
          <Toolbar isOpen={isOpen} onToggle={onToggle} />
          <Editor
            height='90vh'
            defaultLanguage='go'
            defaultValue={defaultEditorValue}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            options={{
              minimap: {
                enabled: false,
              },
              fontFamily: 'Dank Mono Regular',
              fontSize: 16,
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
