/* eslint-disable react/no-children-prop */
import { Navbar } from 'components/navbars/Navbar'
import { Box, Button, Select, Input, useToast, InputGroup, InputRightElement, useDisclosure } from '@chakra-ui/react'
import { Language as ILanguage } from 'types'
import { MutableRefObject, SetStateAction, useRef, Dispatch } from 'react'
import monacoType from 'monaco-editor/esm/vs/editor/editor.api'
import superagent from 'superagent'
import FlashMessage from 'components/FlashMessage'
import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import superagentPrefix from 'superagent-prefix'

const prefix = superagentPrefix(
  process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://scv.hughdo.dev'
)

interface IEvent {
  message: string
  kind: string
  delay: number
}

interface CompileRes {
  errors: string
  events: IEvent[]
  status: number
  isTest: boolean
  testsFailed: number
}

const Toolbar = function ({
  isOpen,
  onToggle,
  languages,
  editorRef,
  hash,
  setHash,
  minSizeReached,
  setLogs,
  setCompileLoading,
}: {
  isOpen: boolean
  onToggle: () => void
  setHash: Dispatch<SetStateAction<string>>
  setLogs: Dispatch<SetStateAction<Array<{ kind: string; message: string }>>>
  hash: string
  languages: ILanguage[]
  editorRef: MutableRefObject<monacoType.editor.IStandaloneCodeEditor | null>
  setCompileLoading: Dispatch<SetStateAction<boolean>>
  minSizeReached: boolean
}) {
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const toast = useToast()
  const { isOpen: isCopied, onOpen, onClose } = useDisclosure()

  const getURL = (hash: string) =>
    `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}/${hash || ''}` : `/${hash || ''}`
    }`

  const toastID = 'flash-message'

  const shareCode = async () => {
    try {
      const value = editorRef.current!.getValue()
      if (!value) {
        toast({
          title: 'File content must not be empty',
          status: 'error',
          position: 'top',
        })
        return
      }
      const languageID = languages.find((l) => l.name === selectRef.current!.value)?.id
      if (!languageID) {
        toast({
          title: 'Error getting language id',
          status: 'error',
          position: 'top',
        })
        return
      }

      const baseUrl = superagentPrefix(
        process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://scv.hughdo.dev'
      )
      const response = await fetch(`${baseUrl}/v1/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        referrerPolicy: 'no-referrer-when-downgrade', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify({
          language_id: languageID,
          content: value,
        }),
      })

      if (!response.ok) {
        toast({
          title: 'Error sharing the file',
          status: 'error',
          position: 'top',
        })
        return
      }

      const text = await response.text()

      // const { text }: { text: string } = await superagent
      //   .post('http://localhost:4000/v1/share')
      //   .send({
      //     language_id: languageID,
      //     content: value,
      //   })
      //   .set('Referrer-Policy', 'no-referrer-when-downgrade')

      // if (!text) return

      setHash(text)
      window.history.replaceState(null, '', `/${text}`)
      window.navigator.clipboard.writeText(getURL(text))
      if (!toast.isActive(toastID)) {
        toast({
          id: 'flash-message',
          duration: 2000,
          render: () => <FlashMessage />,
        })
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error sharing the file',
        status: 'error',
        position: 'top',
      })
    }
  }

  const formatCode = async () => {
    try {
      const value = editorRef.current!.getValue()
      const languageID = languages.find((l) => l.name === selectRef.current!.value)?.id
      if (!languageID) {
        toast({
          title: 'Error getting language id',
          status: 'error',
          position: 'top',
        })
        return
      }

      const { body } = await superagent
        .post('/v1/format')
        .send({
          language_id: languageID,
          content: value,
        })
        .use(prefix)

      if (!body?.content && body?.message) {
        setLogs((logs) => [...logs, { kind: 'ERR', message: body.message }])
        return
      }
      if (body?.content) {
        editorRef.current!.setValue(body.content as string)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error sharing the file',
        status: 'error',
        position: 'top',
      })
    }
  }

  const compileAndRun = async () => {
    try {
      setLogs([])
      setCompileLoading(true)
      const value = editorRef.current!.getValue()
      const languageID = languages.find((l) => l.name === selectRef.current!.value)?.id
      if (!languageID) {
        toast({
          title: 'Error getting language id',
          status: 'error',
          position: 'top',
        })
        setCompileLoading(false)
        return
      }

      const { body }: { body: CompileRes } = await superagent
        .post('/v1/compile')
        .send({
          language_id: languageID,
          content: value,
        })
        .use(prefix)

      if (body?.errors) {
        setLogs([{ kind: 'ERR', message: body.errors }])
        setCompileLoading(false)
        return
      }

      if (body?.events?.length > 0) {
        const newLogs: Array<{ kind: string; message: string }> = body.events.map((event: IEvent) => ({
          kind: 'LOG',
          message: event.message,
        }))
        setLogs(newLogs)
        setCompileLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error running the file',
        status: 'error',
        position: 'top',
      })
    }
    setCompileLoading(false)
  }

  return (
    <Box mb={2} borderBottom='1px solid #c4c4c4'>
      <Navbar color='white' minSizeReached={minSizeReached}>
        <Navbar.Buttons>
          <Select size='sm' ref={selectRef}>
            {languages.map((language) => (
              <option key={language.code} value={language.name}>
                {language.name}
              </option>
            ))}
          </Select>
          <Button fontSize='sm' size='sm' px={4} onClick={compileAndRun}>
            Run
          </Button>
          <Button fontSize='sm' size='sm' px={6} onClick={formatCode}>
            Format
          </Button>
          <Button fontSize='sm' size='sm' px={6} onClick={shareCode}>
            Share
          </Button>
        </Navbar.Buttons>
        <Navbar.Inputs>
          {hash && (
            <InputGroup width='fit-content'>
              <Input mt={{ base: 1, md: 0 }} size='sm' variant='filled' isReadOnly value={getURL(hash)} minW='350px' />
              {isCopied ? (
                <InputRightElement height='100%' children={<CheckIcon color='green.500' />} />
              ) : (
                <CopyToClipboard
                  text={getURL(hash)}
                  onCopy={() => {
                    onOpen()
                    toast({
                      id: 'flash-message',
                      duration: 2000,
                      render: () => <FlashMessage />,
                    })
                    setTimeout(() => {
                      onClose()
                    }, 2000)
                  }}>
                  <InputRightElement
                    _hover={{
                      cursor: 'pointer',
                    }}
                    height='100%'
                    children={<CopyIcon />}
                  />
                </CopyToClipboard>
              )}
            </InputGroup>
          )}
        </Navbar.Inputs>

        <Navbar.RightButtons>
          <Button variant='ghost' p={2} fontSize='2xl' fontWeight='normal' onClick={onToggle}>
            {isOpen ? '⇥' : '⇤'}
          </Button>
        </Navbar.RightButtons>
      </Navbar>

      <style global jsx>{`
        ul#chakra-toast-manager-bottom {
          bottom: 0 !important;
          left: 0 !important;
          right: 0 !important;
          top: 0 !important;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Box>
  )
}

export default Toolbar
