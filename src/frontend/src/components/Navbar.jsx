import React from 'react';
import {
  Box,
  Flex,
  HStack,
  Button,
  Icon,
  useDisclosure,
  Collapse,
  VStack,
} from '@chakra-ui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiShield, FiBarChart2, FiMenu } from 'react-icons/fi';

const items = [
  { path: '/', label: 'Mission Overview', icon: FiHome },
  { path: '/predict', label: 'Risk Assessment', icon: FiShield },
  { path: '/analytics', label: 'Analytics', icon: FiBarChart2 },
];

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const NavButton = ({ item, isActive }) => (
    <Button
      onClick={() => navigate(item.path)}
      leftIcon={<Icon as={item.icon} />}
      variant="ghost"
      color={isActive ? 'white' : 'gray.400'}
      _hover={{ color: 'white', bg: 'whiteAlpha.100' }}
      _active={{ bg: 'whiteAlpha.200' }}
      fontWeight="medium"
      size="sm"
      px={4}
      py={2}
      position="relative"
    >
      {item.label}
      <Box
        position="absolute"
        left="10px"
        right="10px"
        bottom="2px"
        h="2px"
        rounded="full"
        bgGradient={
          isActive
            ? 'linear(to-r, cyan.400, purple.400)'
            : 'linear(to-r, transparent, transparent)'
        }
      />
    </Button>
  );

  return (
    <Box
      position="sticky"
      top="64px"
      zIndex="30"
      bg="blackAlpha.500"
      backdropFilter="blur(8px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.100"
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
        <Flex h="12" align="center" justify="space-between">
          <HStack spacing={1} display={{ base: 'none', md: 'flex' }}>
            {items.map(i => (
              <NavButton key={i.path} item={i} isActive={pathname === i.path} />
            ))}
          </HStack>
          <Button
            onClick={onToggle}
            display={{ base: 'inline-flex', md: 'none' }}
            variant="ghost"
            color="gray.300"
            leftIcon={<Icon as={FiMenu} />}
            _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
            size="sm"
          >
            Menu
          </Button>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <VStack align="stretch" spacing={1} pb={3} display={{ md: 'none' }}>
            {items.map(i => (
              <Button
                key={i.path}
                onClick={() => {
                  navigate(i.path);
                  onToggle();
                }}
                leftIcon={<Icon as={i.icon} />}
                justifyContent="flex-start"
                variant="ghost"
                color={pathname === i.path ? 'white' : 'gray.300'}
                _hover={{ bg: 'whiteAlpha.100', color: 'white' }}
                size="sm"
              >
                {i.label}
              </Button>
            ))}
          </VStack>
        </Collapse>
      </Box>
    </Box>
  );
}
