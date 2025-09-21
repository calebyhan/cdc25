import React from 'react';
import { Box, Flex, HStack, Text, Heading, Icon, Tag } from '@chakra-ui/react';
import { FiShield } from 'react-icons/fi';

export default function TopBar() {
  return (
    <Box
      position="sticky"
      top="0"
      zIndex="40"
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
      borderBottom="1px solid"
      borderColor="whiteAlpha.200"
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }}>
        <Flex h="16" align="center" justify="space-between">
          <HStack spacing={3}>
            <Flex
              w="36px"
              h="36px"
              align="center"
              justify="center"
              rounded="full"
              bgGradient="linear(to-r, cyan.500, purple.500)"
              color="white"
              boxShadow="0 0 18px rgba(56,189,248,0.45)"
            >
              <Icon as={FiShield} />
            </Flex>
            <Box>
              <Heading size="md" color="white">
                CDC25 Mission Control
              </Heading>
              <Text fontSize="xs" color="cyan.300">
                Astronaut Risk Assessment System
              </Text>
            </Box>
          </HStack>
          <HStack spacing={2}>
            <Box position="relative" w="12px" h="12px">
              <Box
                as="span"
                position="absolute"
                inset="0"
                rounded="full"
                bg="green.400"
                opacity={0.75}
                animation="ping 1.2s cubic-bezier(0,0,0.2,1) infinite"
              />
              <Box as="span" position="absolute" inset="0" rounded="full" bg="green.500" />
            </Box>
            <Tag size="sm" colorScheme="green" variant="subtle">
              LIVE
            </Tag>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
}
