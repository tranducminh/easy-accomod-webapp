/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Box,
  Flex,
  Spacer,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useToast
} from '@chakra-ui/react'
import axios from 'utils/axios'
import { auth } from 'firebase-config'
import useRedux from 'hooks/useRedux'
import actions from 'store/actions'

import { HamburgerIcon, ChevronDownIcon } from '@chakra-ui/icons'
import Logo from 'assets/logo2.png'
import Search from 'components/filter/Search'

export default function AdminHeader() {
  const toast = useToast()
  const history = useHistory()
  const { dispatch } = useRedux()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [name, setName] = useState('')

  useEffect(() => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const result = await axios.get('/profile')
          const { data } = result.data
          setName(data.name)
          debugger
        } catch (error) {
          if (error.response.status === 403) {
            signOut()
            toast({
              title: 'Có sự cố xảy ra',
              description: 'Bạn không đủ quyền để truy cập trang này',
              status: 'error',
              duration: 3000,
              isClosable: true,
              position: 'top',
            })
            debugger
          }
        }
      } else {
        history.push('/login')
        toast({
          title: 'Có sự cố xảy ra',
          description: 'Bạn cần đăng nhập tài khoản admin để tiếp tục',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      }
    })
  }, [])

  const signOut = async () => {
    await auth.signOut()
    setName('')
    dispatch(
      actions.signOut()
    )
    localStorage.clear()
    history.push('/login')
  }

  return (
    <div>
      <Box
        display={{
          md: 'block',
          lg: 'none',
          xl: 'none',
        }}
        mt={2}
        pb={2}
        borderBottom='1px solid #E2E8F0'
        alignItems='center'>
        <Flex
          d='flex'
          paddingRight='2.5rem'
          paddingLeft='2.5rem'
          alignItems='center'>
          <Box />
          <Spacer />
          <Button onClick={onOpen}>
            <HamburgerIcon />
          </Button>
        </Flex>
      </Box>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose}>
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>
            <DrawerBody>
              <Button variant='ghost'>
                <Link to='/login'>Đăng nhập</Link>
              </Button>
              <Button variant='ghost'>
                <Link to='/signup'>Đăng ký</Link>
              </Button>

            </DrawerBody>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>
      <Box
        height='80px'
        w='100%'
        display={{ sm: 'none', md: 'none', lg: 'block' }}
        borderBottom='1px solid rgb(226 232 240)'>
        <Flex
          d='flex'
          w='75%'
          height='100%'
          m='0 auto'
          backgroundColor='blue'
          alignItems='center'>
          <Link to='/'>
            <Image src={Logo} width='60px' height='60px' />
          </Link>
          <Search />
          <Spacer />
          {name !== '' ? (
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                {name}
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <Button onClick={signOut} variant='link'>
                    Đăng xuất
                  </Button>
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
              <Flex d='flex' alignItems='center'>
                <Button variant='ghost'>
                  <Link to='/login'>Đăng nhập</Link>
                </Button>
              </Flex>
            )}
        </Flex>
      </Box>
    </div>
  )
}
