/* eslint-disable no-nested-ternary */
import Navbar from 'components/navbars'
import { Box, Flex, useDisclosure, Text, useToast, Divider } from '@chakra-ui/react'
import Toolbar from 'components/Toolbar'
import monacoType from 'monaco-editor/esm/vs/editor/editor.api'
import { Language as ILanguage, File as IFile } from 'types'
import { Resizable } from 're-resizable'

import Editor from '@monaco-editor/react'
import nightOwl from 'styles/night-owl-light.json'
import superagent from 'superagent'
import { useEffect, useState, useRef } from 'react'

import superagentPrefix from 'superagent-prefix'

const defaultEditorValue =
  'package main\n\nimport (\n\t"fmt"\n)\n\nfunc main() {\n\tfmt.Println("Hello, playgrounddd")\n}\n'

const prefix = superagentPrefix(process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : '')

const Playground = function ({ file }: { file?: IFile }) {
  const { isOpen, onToggle } = useDisclosure()
  const toast = useToast()
  const [languages, setLanguages] = useState<ILanguage[]>([])
  const editorRef = useRef<monacoType.editor.IStandaloneCodeEditor | null>(null)
  const [editorValue, setEditorValue] = useState(file?.content || defaultEditorValue)
  const [language, setLanguage] = useState(file?.language.name || 'go')
  const [minSizeReached, setMinSizeReached] = useState(false)
  const divRef = useRef<HTMLDivElement | null>(null)
  const [hash, setHash] = useState('')
  const [logs, setLogs] = useState<Array<{ kind: string; message: string }>>([])
  const [compileLoading, setCompileLoading] = useState(false)

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
        const { body } = await superagent.get('/v1/languages').use(prefix)
        if (body?.length) {
          setLanguages(body as ILanguage[])
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error fetching languages',
          position: 'top',
          status: 'error',
        })
      }
    }

    getLanguages()
  }, [])

  return (
    <Box>
      <Navbar />
      <Flex width='100%' boxShadow='xl'>
        <Box
          w='100%'
          d='flex'
          sx={{
            'div ': {
              flexShrink: '1 !important',
            },
          }}>
          <Resizable
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: 'calc(100%-280x)',
              ...(!isOpen && { flexGrow: 1 }),
            }}
            handleComponent={{
              right: <Box backgroundColor='gray.50' height='100%' borderLeft='1px solid #c4c4c4' ml={1} p={1} />,
            }}
            enable={{
              top: false,
              right: true,
              bottom: false,
              left: false,
              topRight: false,
              bottomRight: false,
              bottomLeft: false,
              topLeft: false,
            }}
            // defaultSize={{
            //   width: 'calc(100%-280px)',
            //   height: '100%',
            // }}
            onResize={() => {
              if (divRef?.current?.clientWidth && divRef?.current?.clientWidth < 766) {
                setMinSizeReached(true)
              } else if (divRef?.current?.clientWidth && divRef?.current?.clientWidth > 766) {
                setMinSizeReached(false)
              }
            }}
            maxWidth='100%'
            minWidth='420px'>
            <Box ref={divRef}>
              <Toolbar
                isOpen={isOpen}
                onToggle={onToggle}
                languages={languages}
                editorRef={editorRef}
                hash={hash}
                setHash={setHash}
                setLogs={setLogs}
                setCompileLoading={setCompileLoading}
                minSizeReached={minSizeReached}
              />
              <Box />
              <Editor
                height='87vh'
                width='auto'
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
                  automaticLayout: true,
                }}
              />
            </Box>
          </Resizable>
          {isOpen && (
            <Box
              // maxW='280px'
              flexGrow={1}
              flexBasis='280px'
              zIndex='1'
              pr={4}
              pl={2}
              flexDirection='column'
              overflow='scroll'
              d='block'>
              <Box mt={4} textAlign='center' height='100%'>
                <Text fontSize='sm' fontWeight='600'>
                  Logs
                </Text>
                <Box mt={4} d='flex' flexDirection='column'>
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <Box key={index}>
                        <Box d='flex'>
                          [
                          <Text fontSize='sm' color={log?.kind === 'ERR' ? 'red' : 'silver'}>
                            {log.kind === 'ERR' ? 'ERR' : 'LOG'}
                          </Text>
                          ]: <Text fontSize='sm'>{log.message}</Text>
                        </Box>
                        <Divider my={2} borderBottom='1px dashed #ccc !important' />
                      </Box>
                    ))
                  ) : compileLoading ? (
                    <Text fontSize='sm'>Waiting for remote server</Text>
                  ) : (
                    <Text fontSize='sm'>No logs</Text>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  )
}

export default Playground
