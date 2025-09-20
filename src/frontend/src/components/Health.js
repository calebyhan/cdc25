// Health Check component - displays system health and monitoring information
import React, { useState, useEffect, useCallback } from 'react';
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
  Progress,
  CircularProgress,
  CircularProgressLabel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  useToast,
} from '@chakra-ui/react';
import {
  FiActivity,
  FiCheck,
  FiX,
  FiCpu,
  FiDatabase,
  FiWifi,
  FiRefreshCw,
  FiClock,
  FiServer,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const Health = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const toast = useToast();

  const fetchHealth = useCallback(async (showToast = false) => {
    try {
      setLoading(!data); // Only show loading spinner on initial load
      setError(null);
      const response = await apiService.getHealth();
      setData(response);
      if (showToast) {
        toast({
          title: 'Health Check Updated',
          description: 'System status refreshed successfully',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      if (showToast) {
        toast({
          title: 'Health Check Failed',
          description: apiError.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [data, toast]);

  useEffect(() => {
    fetchHealth();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchHealth(true);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'healthy':
      case 'ok':
      case 'active':
      case 'online': return 'green';
      case 'warning':
      case 'degraded': return 'yellow';
      case 'error':
      case 'failed':
      case 'offline': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    const color = getStatusColor(status);
    return color === 'green' ? FiCheck : color === 'red' ? FiX : FiActivity;
  };

  if (loading) {
    return (
      <VStack spacing={4} align="center" py={8}>
        <Spinner size="xl" color="brand.500" thickness="4px" />
        <Text>Checking system health...</Text>
      </VStack>
    );
  }

  if (error && !data) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Health check failed</Text>
          <Text fontSize="sm">{error.message}</Text>
          <Button size="sm" onClick={() => fetchHealth()} leftIcon={<Icon as={FiRefreshCw} />}>
            Retry
          </Button>
        </VStack>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FiActivity} color="cyan.500" boxSize={6} />
              <VStack align="start" spacing={1}>
                <Heading size="md">⚡ System Health Monitor</Heading>
                <Text fontSize="sm" color="gray.600">
                  Real-time monitoring of CDC25 backend services and dependencies
                </Text>
              </VStack>
            </HStack>
            <Button
              leftIcon={<Icon as={FiRefreshCw} />}
              size="sm"
              onClick={handleRefresh}
              isLoading={refreshing}
              loadingText="Refreshing"
            >
              Refresh
            </Button>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <HStack justify="space-between">
            <Badge
              colorScheme={getStatusColor(data?.status)}
              fontSize="md"
              px={4}
              py={2}
            >
              <HStack>
                <Icon as={getStatusIcon(data?.status)} />
                <Text>System {data?.status || 'Unknown'}</Text>
              </HStack>
            </Badge>
            <Text fontSize="sm" color="gray.600">
              Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown'}
            </Text>
          </HStack>
        </CardBody>
      </Card>

      {/* System Overview */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        <Card>
          <CardBody textAlign="center">
            <VStack spacing={3}>
              <CircularProgress
                value={data?.uptime_percentage || 0}
                color={getStatusColor(data?.status) + '.500'}
                size="80px"
                thickness="8px"
              >
                <CircularProgressLabel fontSize="sm">
                  {data?.uptime_percentage || 0}%
                </CircularProgressLabel>
              </CircularProgress>
              <VStack spacing={1}>
                <Text fontSize="sm" fontWeight="bold">Uptime</Text>
                <Text fontSize="xs" color="gray.600">{data?.uptime || 'Unknown'}</Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>

        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiCpu} color="blue.500" />
              <Text>CPU Usage</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="blue.500">{data?.cpu_usage || 0}%</StatNumber>
          <StatHelpText>
            <StatArrow type={data?.cpu_usage > 80 ? 'increase' : 'decrease'} />
            {data?.cpu_usage > 80 ? 'High' : 'Normal'}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiDatabase} color="purple.500" />
              <Text>Memory</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="purple.500">{data?.memory_usage || 0}%</StatNumber>
          <StatHelpText>
            <StatArrow type={data?.memory_usage > 80 ? 'increase' : 'decrease'} />
            {data?.memory_usage > 80 ? 'High' : 'Normal'}
          </StatHelpText>
        </Stat>

        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiServer} color="green.500" />
              <Text>Response Time</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="green.500">{data?.response_time || 0}ms</StatNumber>
          <StatHelpText>
            <StatArrow type={data?.response_time > 1000 ? 'increase' : 'decrease'} />
            {data?.response_time > 1000 ? 'Slow' : 'Fast'}
          </StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Service Status */}
      <Card>
        <CardHeader>
          <Heading size="md">🔧 Service Status</Heading>
          <Text fontSize="sm" color="gray.600">
            Individual component health checks
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {data?.services ? Object.entries(data.services).map(([service, status]) => (
              <Box
                key={service}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                _hover={{ borderColor: 'brand.300', bg: 'brand.50' }}
                transition="all 0.2s"
              >
                <HStack justify="space-between">
                  <HStack>
                    <Icon
                      as={getStatusIcon(typeof status === 'object' ? status.status : status)}
                      color={getStatusColor(typeof status === 'object' ? status.status : status) + '.500'}
                    />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold" textTransform="capitalize">
                        {service.replace('_', ' ')}
                      </Text>
                      {typeof status === 'object' && status.details && (
                        <Text fontSize="xs" color="gray.600">
                          {status.details}
                        </Text>
                      )}
                    </VStack>
                  </HStack>
                  <Badge
                    colorScheme={getStatusColor(typeof status === 'object' ? status.status : status)}
                    variant="solid"
                  >
                    {typeof status === 'object' ? status.status : status}
                  </Badge>
                </HStack>
              </Box>
            )) : (
              <Text color="gray.500">No service status data available</Text>
            )}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <Heading size="md">📈 Performance Metrics</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={4}>
            {data?.metrics ? Object.entries(data.metrics).map(([metric, value]) => (
              <Box key={metric} w="100%">
                <HStack justify="space-between" mb={2}>
                  <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                    {metric.replace('_', ' ')}
                  </Text>
                  <Text fontSize="sm">{value}%</Text>
                </HStack>
                <Progress
                  value={value}
                  colorScheme={value > 80 ? 'red' : value > 60 ? 'yellow' : 'green'}
                  size="sm"
                  borderRadius="md"
                />
              </Box>
            )) : (
              <Alert status="info">
                <AlertIcon />
                <Text fontSize="sm">Performance metrics will be available when monitoring is enabled</Text>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <Heading size="md">📋 System Information</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="start" spacing={3}>
            <HStack>
              <Icon as={FiClock} color="blue.500" />
              <Text fontSize="sm">
                <strong>Last Health Check:</strong> {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'Unknown'}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiWifi} color="green.500" />
              <Text fontSize="sm">
                <strong>API Status:</strong> {data?.api_status || 'Online'}
              </Text>
            </HStack>
            <HStack>
              <Icon as={FiServer} color="purple.500" />
              <Text fontSize="sm">
                <strong>Server Version:</strong> {data?.version || 'Unknown'}
              </Text>
            </HStack>
            {data?.message && (
              <Alert status="info" size="sm">
                <AlertIcon />
                <Text fontSize="sm">{data.message}</Text>
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Health;