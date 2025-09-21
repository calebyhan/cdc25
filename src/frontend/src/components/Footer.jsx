import React from 'react';
import { Box, Text, HStack, Link } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box
      mt={20}
      borderTop="1px solid"
      borderColor="whiteAlpha.200"
      bg="blackAlpha.600"
      backdropFilter="blur(10px)"
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={6}>
        <HStack spacing={6} justify="center" wrap="wrap">
          <Link href="/" color="gray.200" _hover={{ color: 'white', textDecoration: 'underline' }} fontWeight="medium">
            Mission Overview
          </Link>
          <Link href="/predict" color="gray.200" _hover={{ color: 'white', textDecoration: 'underline' }} fontWeight="medium">
            Risk Assessment
          </Link>
          <Link href="/analytics" color="gray.200" _hover={{ color: 'white', textDecoration: 'underline' }} fontWeight="medium">
            Analytics
          </Link>
        </HStack>
        <Text mt={3} textAlign="center" fontSize="sm" color="gray.300" fontWeight="medium">
          Carolina Data Challenge 2025 • Team: Caleb Han, Ethan Tran, Erae Ko, Jeffery Liu
        </Text>
      </Box>
    </Box>
  );
}
