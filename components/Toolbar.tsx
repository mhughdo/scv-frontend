import { Navbar } from 'components/navbars/Navbar'
import { Box, Button, Select, Input, useToast } from '@chakra-ui/react'
import { Language as ILanguage } from 'types'
import { MutableRefObject, SetStateAction, useRef, Dispatch } from 'react'
import monacoType from 'monaco-editor/esm/vs/editor/editor.api'
import superagent from 'superagent'

const Toolbar = function ({
  isOpen,
  onToggle,
  languages,
  editorRef,
  hash,
  setHash,
}: {
  isOpen: boolean
  onToggle: () => void
  setHash: Dispatch<SetStateAction<string>>
  hash: string
  languages: ILanguage[]
  editorRef: MutableRefObject<monacoType.editor.IStandaloneCodeEditor | null>
}) {
  const selectRef = useRef<HTMLSelectElement | null>(null)
  const toast = useToast()

  const getURL = (hash: string) =>
    `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}/${hash}` : `/${hash}`
    }`

  const shareCode = async () => {
    try {
      const value = editorRef.current!.getValue()
      const languageID = languages.find((l) => l.name === selectRef.current!.value)?.id
      if (!languageID) {
        toast({
          title: 'Error getting language id',
          status: 'error',
          position: 'top',
        })
      }

      const { text }: { text: string } = await superagent.post('http://localhost:4000/v1/share').send({
        language_id: languageID,
        content: value,
      })

      setHash(text)
      window.history.replaceState(null, '', `/${text}`)
      // router.push(`/${text}`, undefined, { shallow: true })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error sharing the file',
        status: 'error',
        position: 'top',
      })
    }
  }

  return (
    <Box mb={2} borderBottom='1px solid #c4c4c4'>
      <Navbar color='white'>
        <Navbar.Buttons>
          <Select size='sm' ref={selectRef}>
            {languages.map((language) => (
              <option key={language.code} value={language.name}>
                {language.name}
              </option>
            ))}
          </Select>
          <Button disabled fontSize='sm' size='sm' px={4}>
            Run
          </Button>
          <Button fontSize='sm' size='sm' px={6}>
            Format
          </Button>
          <Button fontSize='sm' size='sm' px={6} onClick={shareCode}>
            Share
          </Button>
          {hash && <Input size='sm' variant='filled' isReadOnly value={getURL(hash)} minW='350px' />}
        </Navbar.Buttons>
        <Navbar.RightButtons>
          <Button variant='ghost' p={2} fontSize='2xl' fontWeight='normal' onClick={onToggle}>
            {isOpen ? '⇥' : '⇤'}
          </Button>
        </Navbar.RightButtons>
      </Navbar>
    </Box>
  )
}

export default Toolbar
