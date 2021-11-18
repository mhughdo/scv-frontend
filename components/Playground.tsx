import Navbar from 'components/navbars'
import { Box, Flex, useDisclosure, Text, useToast } from '@chakra-ui/react'
import Toolbar from 'components/Toolbar'
import monacoType from 'monaco-editor/esm/vs/editor/editor.api'
import { Language as ILanguage, File as IFile } from 'types'

import Editor from '@monaco-editor/react'
import nightOwl from 'styles/night-owl-light.json'
import superagent from 'superagent'
import { useEffect, useState, useRef } from 'react'

const defaultEditorValue =
  'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, playground")\n}\n'

const Playground = function ({ file }: { file?: IFile }) {
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()
  const [languages, setLanguages] = useState<ILanguage[]>([])
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
  const [editorValue, setEditorValue] = useState(file?.content || defaultEditorValue)
  const [language, setLanguage] = useState(file?.language.name || 'go')
  const [hash, setHash] = useState('')

  const handleEditorWillMount = (monaco: typeof monacoType) => {
    monaco.editor.defineTheme('Night-Owl-Light', nightOwl as monacoType.editor.IStandaloneThemeData)
  }

  const handleEditorDidMount = (editor: monacoType.editor.IStandaloneCodeEditor, monaco: typeof monacoType) => {
    // here is another way to get monaco instance
    // you can also store it in `useRef` for further usage
    monaco.editor.setTheme('Night-Owl-Light')
    editorRef.current = editor
  }

  const handleEditorChange = () => {
    if (window.location.href.split('/')[3] !== '') {
      window.history.replaceState(null, '', '/')
      setHash('')
    }
  }

  useEffect(() => {
    const getLanguages = async () => {
      try {
        const { body } = await superagent.get('http://localhost:4000/v1/languages')
        if (body?.length) {
          setLanguages(body as ILanguage[])
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error fetching languages',
        })
      }
    }

    getLanguages()
  }, [])

  return (
    <Box>
      <Navbar />
      <Flex>
        <Box boxShadow='xl' width='calc(100% - 360px)' flexGrow='1'>
          <Toolbar
            isOpen={isOpen}
            onToggle={onToggle}
            languages={languages}
            editorRef={editorRef}
            hash={hash}
            setHash={setHash}
          />
          <Editor
            height='90vh'
            defaultLanguage='go'
            defaultValue={defaultEditorValue}
            beforeMount={handleEditorWillMount}
            onMount={handleEditorDidMount}
            value={editorValue}
            language={language}
            onChange={handleEditorChange}
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

export default Playground
