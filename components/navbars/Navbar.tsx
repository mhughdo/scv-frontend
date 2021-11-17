/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
import { isValidElement, ReactElement, FC, Children } from 'react'
import { Flex, HStack, Spacer, useColorModeValue } from '@chakra-ui/react'

export const Template: FC = function (props) {
  const children = Children.toArray(props.children).filter<ReactElement>(isValidElement)
  return (
    <Flex
      py={4}
      px={{ base: 4, md: 6, lg: 8 }}
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={useColorModeValue('md', 'none')}
      borderBottomWidth={useColorModeValue('none', '1px')}>
      {children.find((child) => child.type === Brand)?.props.children}

      <HStack spacing={{ base: 1, md: 3 }} display={{ md: 'flex' }}>
        {children.find((child) => child.type === Buttons)?.props.children}
      </HStack>
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

export const Navbar = Object.assign(Template, { Brand, Buttons })
