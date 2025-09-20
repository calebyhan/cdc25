// Astronauts component - displays test astronauts data
import React, { useState, useEffect } from 'react';
import {
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
  Avatar,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Divider,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiCalendar,
  FiAward,
  FiGlobe,
  FiClock,
  FiTrendingUp,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const Astronauts = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAstronauts();
  }, []);

  const fetchAstronauts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAstronauts();
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
        <Text>Loading astronaut data...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to load astronaut data</Text>
          <Text fontSize="sm">{error.message}</Text>
        </VStack>
      </Alert>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'green';
      case 'retired': return 'gray';
      case 'deceased': return 'red';
      default: return 'blue';
    }
  };

  const getExperienceLevel = (missions) => {
    if (missions >= 4) return { level: 'Veteran', color: 'purple' };
    if (missions >= 2) return { level: 'Experienced', color: 'blue' };
    if (missions >= 1) return { level: 'Rookie', color: 'green' };
    return { level: 'Candidate', color: 'orange' };
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiUsers} color="orange.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">👨‍🚀 Test Astronauts Database</Heading>
              <Text fontSize="sm" color="gray.600">
                Sample astronaut profiles for testing the risk assessment system
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <Stat>
              <StatLabel>Total Astronauts</StatLabel>
              <StatNumber color="orange.500">{data.astronauts?.length || 0}</StatNumber>
              <StatHelpText>In database</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Active</StatLabel>
              <StatNumber color="green.500">
                {data.astronauts?.filter(a => a.status === 'Active').length || 0}
              </StatNumber>
              <StatHelpText>Currently serving</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Total Missions</StatLabel>
              <StatNumber color="blue.500">
                {data.astronauts?.reduce((sum, a) => sum + (a.missions || 0), 0) || 0}
              </StatNumber>
              <StatHelpText>Completed</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel>Avg Experience</StatLabel>
              <StatNumber color="purple.500">
                {data.astronauts?.length > 0
                  ? (data.astronauts.reduce((sum, a) => sum + (a.missions || 0), 0) / data.astronauts.length).toFixed(1)
                  : 0}
              </StatNumber>
              <StatHelpText>Missions per astronaut</StatHelpText>
            </Stat>
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Astronauts Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {data.astronauts?.map((astronaut, index) => {
          const experience = getExperienceLevel(astronaut.missions);
          return (
            <Card
              key={index}
              _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
              transition="all 0.2s"
            >
              <CardBody>
                <VStack spacing={4}>
                  {/* Avatar and Basic Info */}
                  <VStack spacing={3}>
                    <Avatar
                      name={astronaut.name}
                      size="lg"
                      bg={`${getStatusColor(astronaut.status)}.500`}
                    />
                    <VStack spacing={1}>
                      <Heading size="md" textAlign="center">
                        {astronaut.name}
                      </Heading>
                      <HStack spacing={2}>
                        <Badge colorScheme={getStatusColor(astronaut.status)} variant="solid">
                          {astronaut.status}
                        </Badge>
                        <Badge colorScheme={experience.color} variant="outline">
                          {experience.level}
                        </Badge>
                      </HStack>
                    </VStack>
                  </VStack>

                  <Divider />

                  {/* Details */}
                  <VStack spacing={3} w="100%">
                    <HStack justify="space-between" w="100%">
                      <HStack>
                        <Icon as={FiCalendar} color="blue.500" />
                        <Text fontSize="sm" fontWeight="medium">Age:</Text>
                      </HStack>
                      <Text fontSize="sm">{astronaut.age}</Text>
                    </HStack>

                    <HStack justify="space-between" w="100%">
                      <HStack>
                        <Icon as={FiGlobe} color="green.500" />
                        <Text fontSize="sm" fontWeight="medium">Nationality:</Text>
                      </HStack>
                      <Text fontSize="sm">{astronaut.nationality}</Text>
                    </HStack>

                    <HStack justify="space-between" w="100%">
                      <HStack>
                        <Icon as={FiAward} color="purple.500" />
                        <Text fontSize="sm" fontWeight="medium">Missions:</Text>
                      </HStack>
                      <Text fontSize="sm" fontWeight="bold" color="purple.500">
                        {astronaut.missions}
                      </Text>
                    </HStack>

                    <HStack justify="space-between" w="100%">
                      <HStack>
                        <Icon as={FiClock} color="orange.500" />
                        <Text fontSize="sm" fontWeight="medium">Space Time:</Text>
                      </HStack>
                      <Text fontSize="sm">{astronaut.space_time} days</Text>
                    </HStack>

                    {astronaut.risk_score && (
                      <HStack justify="space-between" w="100%">
                        <HStack>
                          <Icon as={FiTrendingUp} color="red.500" />
                          <Text fontSize="sm" fontWeight="medium">Risk Score:</Text>
                        </HStack>
                        <Badge
                          colorScheme={astronaut.risk_score > 0.7 ? 'red' : astronaut.risk_score > 0.4 ? 'yellow' : 'green'}
                          variant="solid"
                        >
                          {(astronaut.risk_score * 100).toFixed(1)}%
                        </Badge>
                      </HStack>
                    )}
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          );
        })}
      </SimpleGrid>

      {/* Footer Note */}
      <Card>
        <CardBody>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              💡 <strong>Note:</strong> This data represents test astronauts for demonstration purposes.
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Risk scores are calculated using our ML model based on age, missions, and space time.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Astronauts;