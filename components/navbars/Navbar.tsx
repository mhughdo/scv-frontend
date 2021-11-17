/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { isValidElement, ReactElement, FC, Children } from 'react'
import { Flex, HStack, Spacer, useColorModeValue } from '@chakra-ui/react'

export const Template: FC<{ color: string }> = function (props) {
  const children = Children.toArray(props.children).filter<ReactElement>(isValidElement)
  const { color } = props

  return (
    <Flex
      py={2}
      mb={0}
      px={{ base: 2, md: 4 }}
      bg={color}
      boxShadow={useColorModeValue('md', 'none')}
      borderBottomWidth={useColorModeValue('none', '1px')}>
      {children.find((child) => child.type === Brand)?.props.children}

      <Flex justifyContent='space-between' w='100%'>
        <HStack spacing={{ base: 1, md: 3 }} display={{ md: 'flex' }}>
          {children.find((child) => child.type === Buttons)?.props.children}
        </HStack>
        <HStack spacing={{ base: 1, md: 3 }} display={{ md: 'flex' }} height='2rem'>
          {children.find((child) => child.type === RightButtons)?.props.children}
        </HStack>
      </Flex>

      <Spacer />
    </Flex>
  )
}

const Brand: FC = function () {
  return null
}
const Buttons: FC = function () {
  return null
}

const RightButtons: FC = function () {
  return null
}

export const Navbar = Object.assign(Template, { Brand, Buttons, RightButtons })
