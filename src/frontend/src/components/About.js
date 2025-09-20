// About component - displays project information and team details
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
  Avatar,
  Wrap,
  WrapItem,
  Divider,
} from '@chakra-ui/react';
import {
  FiUsers,
  FiAward,
  FiCode,
  FiDatabase,
  FiMonitor,
  FiCloud,
  FiCpu,
  FiLayers,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const About = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAbout();
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
        <Text>Loading project information...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to load project information</Text>
          <Text fontSize="sm">{error.message}</Text>
        </VStack>
      </Alert>
    );
  }

  const techIcons = {
    backend: FiDatabase,
    frontend: FiMonitor,
    deployment: FiCloud,
  };

  const techColors = {
    backend: 'blue',
    frontend: 'green',
    deployment: 'purple',
  };

  return (
    <VStack spacing={6} align="stretch">
      {/* Project Overview */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiAward} color="purple.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">🏆 {data.title}</Heading>
              <Badge colorScheme="purple" fontSize="sm" px={3} py={1}>
                {data.hackathon}
              </Badge>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                Project Description
              </Text>
              <Text color="gray.600" lineHeight="tall">
                {data.description}
              </Text>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                Project Goals
              </Text>
              <VStack align="start" spacing={1}>
                <HStack>
                  <Icon as={FiCpu} color="blue.500" />
                  <Text fontSize="sm">
                    Develop ML models for astronaut mission risk assessment
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiLayers} color="green.500" />
                  <Text fontSize="sm">
                    Create interactive web interface for data visualization
                  </Text>
                </HStack>
                <HStack>
                  <Icon as={FiCode} color="purple.500" />
                  <Text fontSize="sm">
                    Build production-ready API for real-time predictions
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </CardBody>
      </Card>

      {/* Team Information */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiUsers} color="blue.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">👥 Team {data.team.name}</Heading>
              <Text fontSize="sm" color="gray.600">
                Meet the developers behind CDC25
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {data.team.members.map((member, index) => (
              <Box
                key={index}
                p={4}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                _hover={{ borderColor: 'brand.300', bg: 'brand.50' }}
                transition="all 0.2s"
              >
                <HStack spacing={3}>
                  <Avatar
                    name={member.name}
                    size="md"
                    bg={`${['blue', 'green', 'purple', 'orange'][index % 4]}.500`}
                  />
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="bold">{member.name}</Text>
                    <Badge
                      colorScheme={['blue', 'green', 'purple', 'orange'][index % 4]}
                      variant="subtle"
                    >
                      {member.role}
                    </Badge>
                  </VStack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Technology Stack */}
      <Card>
        <CardHeader>
          <Heading size="md">🛠️ Technology Stack</Heading>
          <Text fontSize="sm" color="gray.600">
            Technologies and frameworks used in CDC25
          </Text>
        </CardHeader>
        <CardBody pt={0}>
          <VStack spacing={6}>
            {data.technologies &&
              Object.entries(data.technologies).map(([category, techs]) => (
                <Box key={category} w="100%">
                  <HStack mb={3}>
                    <Icon as={techIcons[category]} color={`${techColors[category]}.500`} />
                    <Text fontWeight="bold" textTransform="capitalize">
                      {category}
                    </Text>
                  </HStack>
                  <Wrap spacing={2}>
                    {techs.map((tech, index) => (
                      <WrapItem key={index}>
                        <Badge
                          colorScheme={techColors[category]}
                          variant="outline"
                          px={3}
                          py={1}
                        >
                          {tech}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                  {category !== 'deployment' && <Divider mt={4} />}
                </Box>
              ))}
          </VStack>
        </CardBody>
      </Card>

      {/* Project Stats */}
      <Card>
        <CardHeader>
          <Heading size="md">📊 Project Statistics</Heading>
        </CardHeader>
        <CardBody pt={0}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                1,270
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Astronaut Records Analyzed
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.500">
                97.1%
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                Model Accuracy
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                9
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                API Endpoints
              </Text>
            </VStack>
            <VStack>
              <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                6
              </Text>
              <Text fontSize="sm" textAlign="center" color="gray.600">
                ML Models Trained
              </Text>
            </VStack>
          </SimpleGrid>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default About;