/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { isValidElement, ReactElement, FC, Children } from 'react'
import { Flex, HStack, useColorModeValue, Box } from '@chakra-ui/react'

export const Template: FC<{ color: string; minSizeReached?: boolean }> = function (props) {
  const children = Children.toArray(props.children).filter<ReactElement>(isValidElement)
  const { color, minSizeReached } = props

  return (
    <Box boxShadow={useColorModeValue('md', 'none')} borderBottomWidth={useColorModeValue('none', '1px')} bg={color}>
      <Flex py={2} mb={0} px={{ base: 2, md: 4 }}>
        {children.find((child) => child.type === Brand)?.props.children}

        <Flex justifyContent='space-between' w='100%'>
          <HStack spacing={{ base: 1, md: 3 }} display={{ md: 'flex' }}>
            {children.find((child) => child.type === Buttons)?.props.children}
            {!minSizeReached && <Box>{children.find((child) => child.type === Inputs)?.props.children}</Box>}
          </HStack>
          <HStack spacing={{ base: 1, md: 3 }} display={{ md: 'flex' }} height='2rem' position='relative' right='0'>
            {children.find((child) => child.type === RightButtons)?.props.children}
          </HStack>
        </Flex>
      </Flex>
      {minSizeReached && <Box pb={1}>{children.find((child) => child.type === Inputs)?.props.children}</Box>}
    </Box>
  )
}

const Brand: FC = function () {
  return null
}
const Buttons: FC = function () {
  return null
}

const Inputs: FC = function () {
  return null
}

const RightButtons: FC = function () {
  return null
}

export const Navbar = Object.assign(Template, { Brand, Buttons, Inputs, RightButtons })
