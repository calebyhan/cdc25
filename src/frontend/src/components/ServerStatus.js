// Server Status component - displays server info and available endpoints
import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Code,
  SimpleGrid,
  Icon,
  Spacer,
} from '@chakra-ui/react';
import { FiServer, FiClock, FiCheck } from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const ServerStatus = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServerStatus();
  }, []);

  const fetchServerStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getServerStatus();
      setData(response);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <VStack spacing={4} align="center" py={8}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text>Connecting to CDC25 server...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to connect to server</Text>
          <Text fontSize="sm">{error.message}</Text>
          <Code fontSize="xs" colorScheme="red">
            Status: {error.status} | Details: {error.details}
          </Code>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Server Status Header */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiServer} color="green.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">🚀 CDC25 Server Status</Heading>
              <Text fontSize="sm" color="gray.600">
                Backend API is online and responding
              </Text>
            </VStack>
            <Spacer />
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              <HStack spacing={1}>
                <Icon as={FiCheck} />
                <Text>Online</Text>
              </HStack>
            </Badge>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Server Information
              </Text>
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiClock} color="blue.500" />
                  <Text fontSize="sm">
                    Last updated: {new Date(data.timestamp).toLocaleString()}
                  </Text>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  {data.message}
                </Text>
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Connection Status
              </Text>
              <VStack align="start" spacing={1}>
                <Badge colorScheme="green">✓ API Responding</Badge>
                <Badge colorScheme="blue">✓ CORS Enabled</Badge>
                <Badge colorScheme="purple">✓ JSON Format</Badge>
              </VStack>
            </Box>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Available Endpoints */}
      <Card>
        <CardHeader>
          <Heading size="md">📡 Available API Endpoints</Heading>
          <Text fontSize="sm" color="gray.600">
            Interactive endpoints for the CDC25 Astronaut Risk Assessment system
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {data.test_endpoints &&
              Object.entries(data.test_endpoints).map(([endpoint, description]) => (
                <Box
                  key={endpoint}
                  p={4}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ borderColor: 'brand.300', bg: 'brand.50' }}
                  transition="all 0.2s"
                >
                  <HStack spacing={3}>
                    <Badge
                      colorScheme={endpoint.includes('GET') ? 'blue' : 'green'}
                      variant="solid"
                      fontSize="xs"
                    >
                      {endpoint.split(' ')[0]}
                    </Badge>
                    <VStack align="start" spacing={1} flex={1}>
                      <Code fontSize="sm" colorScheme="gray">
                        {endpoint.split(' ')[1]}
                      </Code>
                      <Text fontSize="sm" color="gray.600">
                        {description}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <Heading size="md">🎯 Quick Start Guide</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="start" spacing={3}>
            <Text>
              <strong>1.</strong> Check <Badge colorScheme="blue">API Info</Badge> to see the API
              version and status
            </Text>
            <Text>
              <strong>2.</strong> View <Badge colorScheme="purple">About</Badge> to learn about the
              project and team
            </Text>
            <Text>
              <strong>3.</strong> Explore <Badge colorScheme="orange">Astronauts</Badge> to see
              sample data
            </Text>
            <Text>
              <strong>4.</strong> Try <Badge colorScheme="red">Risk Prediction</Badge> to test the
              ML model
            </Text>
            <Text>
              <strong>5.</strong> View <Badge colorScheme="teal">Analytics</Badge> for data
              visualizations
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ServerStatus;