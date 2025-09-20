// API Info component - displays API version and technical details
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
  SimpleGrid,
  Icon,
  Code,
  Divider,
} from '@chakra-ui/react';
import { FiInfo, FiCpu, FiCheck, FiGlobe } from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const ApiInfo = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApiInfo();
  }, []);

  const fetchApiInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getApiInfo();
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
        <Text>Loading API information...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to load API information</Text>
          <Text fontSize="sm">{error.message}</Text>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* API Overview */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiInfo} color="blue.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">📡 API Information</Heading>
              <Text fontSize="sm" color="gray.600">
                Technical details about the CDC25 Astronaut Risk Assessment API
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Basic Info */}
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  API Details
                </Text>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      Name:
                    </Text>
                    <Text fontSize="sm">{data.name}</Text>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      Version:
                    </Text>
                    <Badge colorScheme="blue" variant="solid">
                      {data.version}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontSize="sm" fontWeight="medium">
                      Status:
                    </Text>
                    <Badge colorScheme="green" variant="solid">
                      <HStack spacing={1}>
                        <Icon as={FiCheck} boxSize={3} />
                        <Text>{data.status}</Text>
                      </HStack>
                    </Badge>
                  </HStack>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  Service Capabilities
                </Text>
                <VStack align="start" spacing={1}>
                  <HStack>
                    <Icon as={FiCpu} color="green.500" boxSize={4} />
                    <Text fontSize="sm">Machine Learning Risk Assessment</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiGlobe} color="blue.500" boxSize={4} />
                    <Text fontSize="sm">RESTful API Endpoints</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="purple.500" boxSize={4} />
                    <Text fontSize="sm">Real-time Predictions</Text>
                  </HStack>
                  <HStack>
                    <Icon as={FiCheck} color="orange.500" boxSize={4} />
                    <Text fontSize="sm">Data Visualization Support</Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>

            {/* Technical Specs */}
            <VStack align="start" spacing={4}>
              <Box>
                <Text fontWeight="bold" mb={2}>
                  Technical Specifications
                </Text>
                <VStack align="start" spacing={2}>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Framework:
                    </Text>
                    <Code fontSize="sm">Flask 3.0+</Code>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      ML Engine:
                    </Text>
                    <Code fontSize="sm">scikit-learn</Code>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      Data Format:
                    </Text>
                    <Code fontSize="sm">JSON</Code>
                  </Box>
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      CORS:
                    </Text>
                    <Badge colorScheme="green" size="sm">
                      Enabled
                    </Badge>
                  </Box>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Text fontWeight="bold" mb={2}>
                  API Features
                </Text>
                <VStack align="start" spacing={1}>
                  <Badge colorScheme="blue" variant="outline" size="sm">
                    ✓ Astronaut Risk Scoring
                  </Badge>
                  <Badge colorScheme="green" variant="outline" size="sm">
                    ✓ Health Status Monitoring
                  </Badge>
                  <Badge colorScheme="purple" variant="outline" size="sm">
                    ✓ Data Analytics
                  </Badge>
                  <Badge colorScheme="orange" variant="outline" size="sm">
                    ✓ Error Handling
                  </Badge>
                  <Badge colorScheme="teal" variant="outline" size="sm">
                    ✓ Real-time Responses
                  </Badge>
                </VStack>
              </Box>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <Heading size="md">🔧 API Usage</Heading>
          <Text fontSize="sm" color="gray.600">
            How to interact with the CDC25 API endpoints
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Base URL
              </Text>
              <Code p={3} borderRadius="md" display="block">
                http://localhost:8000
              </Code>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Content Type
              </Text>
              <Code p={3} borderRadius="md" display="block">
                application/json
              </Code>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Authentication
              </Text>
              <Badge colorScheme="blue" p={2}>
                No authentication required for demo
              </Badge>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Rate Limiting
              </Text>
              <Badge colorScheme="green" p={2}>
                No rate limits for development
              </Badge>
            </Box>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ApiInfo;