// Error Test component - demonstrates error handling capabilities
import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Alert,
  AlertIcon,
  SimpleGrid,
  Icon,
  Badge,
  Code,
  Divider,
  useToast,
  Collapse,
} from '@chakra-ui/react';
import {
  FiAlertTriangle,
  FiXCircle,
  FiWifi,
  FiServer,
  FiClock,
  FiShield,
  FiRefreshCw,
  FiCheckCircle,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const ErrorTest = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});
  const [showDetails, setShowDetails] = useState({});
  const toast = useToast();

  const errorTests = [
    {
      id: 'api_error',
      name: 'API Error Response',
      description: 'Test server-side error handling and response formatting',
      icon: FiServer,
      color: 'red',
      action: () => apiService.testError(),
    },
    {
      id: 'network_error',
      name: 'Network Timeout',
      description: 'Simulate network connectivity issues and timeout handling',
      icon: FiWifi,
      color: 'orange',
      action: () => {
        // Simulate network error by making request to non-existent endpoint
        return fetch('http://localhost:8000/non-existent-endpoint', {
          method: 'GET',
          signal: AbortSignal.timeout(2000), // 2 second timeout
        });
      },
    },
    {
      id: 'validation_error',
      name: 'Validation Error',
      description: 'Test input validation and error message display',
      icon: FiShield,
      color: 'yellow',
      action: () => apiService.makePrediction({}), // Empty payload should cause validation error
    },
    {
      id: 'rate_limit',
      name: 'Rate Limiting',
      description: 'Test API rate limiting and throttling responses',
      icon: FiClock,
      color: 'purple',
      action: async () => {
        // Make multiple rapid requests to test rate limiting
        const promises = Array(5).fill().map(() => apiService.getServerStatus());
        return Promise.all(promises);
      },
    },
  ];

  const runTest = async (test) => {
    const testId = test.id;
    setLoading(prev => ({ ...prev, [testId]: true }));
    setTestResults(prev => ({ ...prev, [testId]: null }));

    try {
      const startTime = Date.now();
      const result = await test.action();
      const endTime = Date.now();

      // If we get here, the test "failed" (didn't produce an error as expected)
      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: false,
          type: 'unexpected_success',
          message: 'Expected an error but request succeeded',
          details: result,
          responseTime: endTime - startTime,
          timestamp: new Date().toISOString(),
        }
      }));

      toast({
        title: 'Test Completed',
        description: `${test.name}: Unexpected success (no error occurred)`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });

    } catch (error) {
      const endTime = Date.now();
      const handledError = handleApiError(error);

      setTestResults(prev => ({
        ...prev,
        [testId]: {
          success: true,
          type: 'expected_error',
          message: handledError.message,
          status: handledError.status,
          details: handledError.details,
          responseTime: endTime - Date.now(),
          timestamp: new Date().toISOString(),
          rawError: error.toString(),
        }
      }));

      toast({
        title: 'Test Completed',
        description: `${test.name}: Error handling working correctly`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  const runAllTests = async () => {
    toast({
      title: 'Running All Tests',
      description: 'Testing error handling across all scenarios',
      status: 'info',
      duration: 2000,
      isClosable: true,
    });

    for (const test of errorTests) {
      await runTest(test);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    toast({
      title: 'All Tests Complete',
      description: 'Error handling test suite finished',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const toggleDetails = (testId) => {
    setShowDetails(prev => ({
      ...prev,
      [testId]: !prev[testId]
    }));
  };

  const getStatusIcon = (result) => {
    if (!result) return FiAlertTriangle;
    return result.success ? FiCheckCircle : FiXCircle;
  };

  const getStatusColor = (result) => {
    if (!result) return 'gray';
    return result.success ? 'green' : 'red';
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FiAlertTriangle} color="yellow.500" boxSize={6} />
              <VStack align="start" spacing={1}>
                <Heading size="md">🧪 Error Handling Test Suite</Heading>
                <Text fontSize="sm" color="gray.600">
                  Test error handling, validation, and resilience across different failure scenarios
                </Text>
              </VStack>
            </HStack>
            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              colorScheme="blue"
              onClick={runAllTests}
              isLoading={Object.values(loading).some(Boolean)}
              loadingText="Testing..."
            >
              Run All Tests
            </Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <VStack align="start" spacing={1}>
              <Text fontSize="sm">
                <strong>Purpose:</strong> These tests verify that our error handling system correctly catches,
                processes, and displays different types of errors that users might encounter.
              </Text>
              <Text fontSize="xs" color="gray.600">
                A "successful" test is one that properly handles an expected error condition.
              </Text>
            </VStack>
          </Alert>
        </CardBody>
      </Card>

      {/* Test Grid */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        {errorTests.map((test) => {
          const result = testResults[test.id];
          const isLoading = loading[test.id];
          const showDetail = showDetails[test.id];

          return (
            <Card
              key={test.id}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <CardHeader>
                <HStack justify="space-between">
                  <HStack>
                    <Icon as={test.icon} color={`${test.color}.500`} boxSize={5} />
                    <VStack align="start" spacing={0}>
                      <Heading size="sm">{test.name}</Heading>
                      <Text fontSize="xs" color="gray.600">
                        {test.description}
                      </Text>
                    </VStack>
                  </HStack>
                  {result && (
                    <Icon
                      as={getStatusIcon(result)}
                      color={`${getStatusColor(result)}.500`}
                      boxSize={5}
                    />
                  )}
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <VStack spacing={3}>
                  <Button
                    colorScheme={test.color}
                    size="sm"
                    onClick={() => runTest(test)}
                    isLoading={isLoading}
                    loadingText="Testing..."
                    w="100%"
                  >
                    Run Test
                  </Button>

                  {result && (
                    <VStack spacing={3} w="100%">
                      <Badge
                        colorScheme={getStatusColor(result)}
                        fontSize="sm"
                        px={3}
                        py={1}
                        w="100%"
                        textAlign="center"
                      >
                        {result.success ? '✓ Error Handled Correctly' : '✗ Unexpected Result'}
                      </Badge>

                      <Box w="100%">
                        <Text fontSize="sm" fontWeight="medium" mb={1}>
                          Result:
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {result.message}
                        </Text>
                      </Box>

                      {result.status !== undefined && (
                        <HStack justify="space-between" w="100%">
                          <Text fontSize="sm" fontWeight="medium">Status Code:</Text>
                          <Badge colorScheme={result.status === 0 ? 'red' : 'orange'}>
                            {result.status}
                          </Badge>
                        </HStack>
                      )}

                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => toggleDetails(test.id)}
                        w="100%"
                      >
                        {showDetail ? 'Hide Details' : 'Show Details'}
                      </Button>

                      <Collapse in={showDetail} animateOpacity>
                        <VStack spacing={2} w="100%">
                          <Divider />
                          <Box w="100%">
                            <Text fontSize="xs" fontWeight="medium" mb={1}>
                              Error Type:
                            </Text>
                            <Code fontSize="xs">{result.type}</Code>
                          </Box>
                          <Box w="100%">
                            <Text fontSize="xs" fontWeight="medium" mb={1}>
                              Timestamp:
                            </Text>
                            <Code fontSize="xs">{new Date(result.timestamp).toLocaleString()}</Code>
                          </Box>
                          {result.details && (
                            <Box w="100%">
                              <Text fontSize="xs" fontWeight="medium" mb={1}>
                                Details:
                              </Text>
                              <Code fontSize="xs" p={2} borderRadius="md" display="block" whiteSpace="pre-wrap">
                                {typeof result.details === 'object'
                                  ? JSON.stringify(result.details, null, 2)
                                  : result.details
                                }
                              </Code>
                            </Box>
                          )}
                        </VStack>
                      </Collapse>
                    </VStack>
                  )}
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Summary */}
      <Card>
        <CardHeader>
          <Heading size="md">📋 Test Summary</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                {errorTests.length}
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Total Tests
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                {Object.values(testResults).filter(r => r?.success).length}
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Passed
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="red.500">
                {Object.values(testResults).filter(r => r && !r.success).length}
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Failed
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="yellow.500">
                {errorTests.length - Object.keys(testResults).length}
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Not Run
              </Text>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Info */}
      <Card>
        <CardBody>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              🛡️ <strong>Error Handling Best Practices:</strong> Our system implements comprehensive error handling
              with user-friendly messages, proper HTTP status codes, and graceful degradation.
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              These tests ensure robust error handling across network failures, API errors, validation issues, and rate limiting.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default ErrorTest;