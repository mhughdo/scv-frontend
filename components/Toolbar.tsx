import { Navbar } from 'components/navbars/Navbar'
import { Box, Button, Select } from '@chakra-ui/react'

const Toolbar = function ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  const languages = ['go']
  return (
    <Box mb={2} borderBottom='1px solid #c4c4c4'>
      <Navbar color='white'>
        <Navbar.Buttons>
          <Select size='sm'>
            {languages.map((language) => (
              <option key={language} value={language}>
                {language}
              </option>
            ))}
          </Select>
          <Button disabled fontSize='sm' size='sm' px={4}>
            Run
          </Button>
          <Button fontSize='sm' size='sm' px={6}>
            Format
          </Button>
          <Button fontSize='sm' size='sm' px={6}>
            Share
          </Button>
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
