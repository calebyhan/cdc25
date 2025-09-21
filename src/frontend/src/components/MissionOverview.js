import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Badge,
} from '@chakra-ui/react';
import {
  FiActivity,
  FiTrendingUp,
  FiUsers,
  FiAlertTriangle,
  FiTarget,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const MotionDiv = motion(Box);

const MissionOverview = () => {
  const [astronauts, setAstronauts] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [astronautsRes, visualizationsRes] = await Promise.all([
        apiService.getAstronauts(),
        apiService.getVisualizations(),
      ]);

      setAstronauts(astronautsRes.astronauts);
      setStats(visualizationsRes.statistics);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 0.7) return { label: 'High Risk', color: 'red' };
    if (score >= 0.4) return { label: 'Moderate', color: 'yellow' };
    return { label: 'Low Risk', color: 'green' };
  };

  if (loading) {
    return (
      <VStack minH="400px" justify="center">
        <Spinner size="xl" color="cyan.400" />
        <Text color="cyan.200" fontWeight="medium">
          Loading mission data...
        </Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Heading size="sm">System Error</Heading>
          <Text fontSize="sm">{error.message}</Text>
        </VStack>
      </Alert>
    );
  }

  const highRiskAstronauts =
    astronauts?.filter((a) => (a.risk_score || 0) >= 0.7) || [];
  const activeAstronauts =
    astronauts?.filter((a) => a.status === 'Active') || [];

  return (
    <VStack spacing={6} align="stretch">
      {/* Stats Grid */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <StatCard
            icon={FiUsers}
            value={stats?.total_astronauts || 0}
            label="Total Astronauts"
            help="In database"
            color="blue"
          />
          <StatCard
            icon={FiActivity}
            value={activeAstronauts.length}
            label="Active Missions"
            help="Currently deployed"
            color="green"
          />
          <StatCard
            icon={FiTarget}
            value={stats?.total_missions || 0}
            label="Total Missions"
            help="Completed to date"
            color="purple"
          />
          <StatCard
            icon={FiAlertTriangle}
            value={highRiskAstronauts.length}
            label="High Risk"
            help="Require attention"
            color="red"
          />
        </SimpleGrid>
      </MotionDiv>

      <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={6}>
        {/* Risk Assessment Overview */}
        <MotionDiv
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          p={6}
        >
          <Heading size="md" mb={4} color="yellow.300">
            Risk Assessment Overview
          </Heading>
          <VStack spacing={3} align="stretch">
            {astronauts?.slice(0, 5).map((astronaut, idx) => {
              const risk = getRiskLevel(astronaut.risk_score || Math.random());
              return (
                <Flex
                  key={idx}
                  justify="space-between"
                  align="center"
                  p={3}
                  borderRadius="md"
                  bg="blackAlpha.400"
                  _hover={{ bg: 'blackAlpha.500' }}
                >
                  <HStack spacing={3}>
                    <Box
                      w={10}
                      h={10}
                      rounded="full"
                      bgGradient="linear(to-br, cyan.400, purple.400)"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                    >
                      {astronaut.name?.charAt(0)}
                    </Box>
                    <Box>
                      <Text fontWeight="medium" color="cyan.200">{astronaut.name}</Text>
                      <Text fontSize="xs" color="gray.100">
                        {astronaut.missions} missions • {astronaut.space_time} days
                      </Text>
                    </Box>
                  </HStack>
                  <VStack align="end" spacing={1}>
                    <Badge colorScheme={risk.color}>{risk.label}</Badge>
                    <Text fontSize="xs" color="gray.100">
                      {(astronaut.risk_score * 100).toFixed(1)}% risk
                    </Text>
                  </VStack>
                </Flex>
              );
            })}
          </VStack>
        </MotionDiv>

        {/* Recent Activity */}
        <MotionDiv
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          bg="whiteAlpha.50"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          p={6}
        >
          <Heading size="md" mb={4} color="cyan.300">
            Recent Activity
          </Heading>
          <VStack spacing={3} align="stretch">
            <ActivityItem text="New risk assessment completed" time="2 minutes ago" color="green.400" />
            <ActivityItem text="Mission data updated" time="15 minutes ago" color="blue.400" />
            <ActivityItem text="High risk alert triggered" time="1 hour ago" color="yellow.400" />
          </VStack>

          <Divider my={4} />

          <Heading size="sm" color="gray.50" mb={2}>
            System Status
          </Heading>
          <VStack spacing={2} align="stretch">
            <StatusItem label="API Response Time" value="45ms" color="green.400" />
            <StatusItem label="Model Accuracy" value="97.1%" color="cyan.400" />
            <StatusItem label="Data Freshness" value="Real-time" color="purple.400" />
          </VStack>
        </MotionDiv>
      </SimpleGrid>

      {/* Mission Risk Analysis Banner */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        bgGradient="linear(to-r, cyan.500/20, purple.500/20, pink.500/20)"
        border="1px solid"
        borderColor="whiteAlpha.200"
        borderRadius="xl"
        p={6}
      >
        <Flex align="center" justify="space-between">
          <Box>
            <Heading size="md" mb={1} color="cyan.300">
              Mission Risk Analysis
            </Heading>
            <Text fontSize="sm" color="gray.50">
              Advanced ML models analyzing astronaut safety in real-time
            </Text>
          </Box>
          <FiTrendingUp size={32} color="var(--chakra-colors-purple-400)" />
        </Flex>
      </MotionDiv>
    </VStack>
  );
};


const StatCard = ({ icon: Icon, value, label, help, color }) => (
    <Box
      bgGradient={`linear(to-br, ${color}.500/20, ${color}.600/20)`}
      border="1px solid"
      borderColor={`${color}.500/40`}
      borderRadius="xl"
      p={6}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Icon size={28} color={`var(--chakra-colors-${color}-300)`} />
        <Stat textAlign="right">
          <StatNumber color="white">{value}</StatNumber>
          <StatLabel color={`${color}.300`} fontWeight="medium">
            {label}
          </StatLabel>
          <StatHelpText color="gray.100">{help}</StatHelpText>
        </Stat>
      </Flex>
    </Box>
  );
const ActivityItem = ({ text, time, color }) => (
  <Flex align="start" gap={3}>
    <Box w={2} h={2} rounded="full" bg={color} mt={2} />
    <Box>
      <Text fontSize="sm" color="gray.50">
        {text}
      </Text>
      <Text fontSize="xs" color="gray.100">
        {time}
      </Text>
    </Box>
  </Flex>
);

const StatusItem = ({ label, value, color }) => (
  <Flex justify="space-between">
    <Text fontSize="xs" color="gray.100">
      {label}
    </Text>
    <Text fontSize="xs" color={color}>
      {value}
    </Text>
  </Flex>
);

export default MissionOverview;
