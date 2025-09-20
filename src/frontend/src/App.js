// Main App component with routing and navigation
import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  useColorModeValue,
  Icon,
  Badge,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiHome,
  FiInfo,
  FiUsers,
  FiActivity,
  FiBarChart,
  FiShield,
  FiSettings,
  FiAlertTriangle,
} from 'react-icons/fi';

// Import components
import ServerStatus from './components/ServerStatus';
import ApiInfo from './components/ApiInfo';
import About from './components/About';
import Astronauts from './components/Astronauts';
import PredictForm from './components/PredictForm';
import Health from './components/Health';
import Visualizations from './components/Visualizations';
import ErrorTest from './components/ErrorTest';

// Animated Box component
const MotionBox = motion(Box);

// Navigation items configuration
const navItems = [
  { path: '/', label: 'Server Status', icon: FiHome, color: 'blue' },
  { path: '/api', label: 'API Info', icon: FiInfo, color: 'green' },
  { path: '/about', label: 'About', icon: FiUsers, color: 'purple' },
  { path: '/astronauts', label: 'Astronauts', icon: FiActivity, color: 'orange' },
  { path: '/predict', label: 'Risk Prediction', icon: FiShield, color: 'red' },
  { path: '/visualizations', label: 'Analytics', icon: FiBarChart, color: 'teal' },
  { path: '/health', label: 'Health Check', icon: FiSettings, color: 'cyan' },
  { path: '/error-test', label: 'Error Test', icon: FiAlertTriangle, color: 'yellow' },
];

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} px={4} py={4}>
        <Container maxW="container.xl">
          <Flex align="center">
            <VStack align="start" spacing={0}>
              <Heading size="lg" color="brand.600">
                🚀 CDC25 Astronaut Risk Assessment
              </Heading>
              <Text fontSize="sm" color="gray.600">
                Carolina Data Challenge 2025 - Space Mission Analytics
              </Text>
            </VStack>
            <Spacer />
            <Badge colorScheme="green" fontSize="sm" px={3} py={1}>
              Live Demo
            </Badge>
          </Flex>
        </Container>
      </Box>

      {/* Navigation */}
      <Box bg={bgColor} borderBottom="1px" borderColor={borderColor} px={4} py={2}>
        <Container maxW="container.xl">
          <HStack spacing={2} overflowX="auto" py={2}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                leftIcon={<Icon as={item.icon} />}
                colorScheme={location.pathname === item.path ? item.color : 'gray'}
                variant={location.pathname === item.path ? 'solid' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                whiteSpace="nowrap"
                flexShrink={0}
              >
                {item.label}
              </Button>
            ))}
          </HStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="container.xl" py={8}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Routes>
            <Route path="/" element={<ServerStatus />} />
            <Route path="/api" element={<ApiInfo />} />
            <Route path="/about" element={<About />} />
            <Route path="/astronauts" element={<Astronauts />} />
            <Route path="/predict" element={<PredictForm />} />
            <Route path="/health" element={<Health />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/error-test" element={<ErrorTest />} />
          </Routes>
        </MotionBox>
      </Container>

      {/* Footer */}
      <Box bg={bgColor} borderTop="1px" borderColor={borderColor} mt={16}>
        <Container maxW="container.xl" py={6}>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              Built with React, Chakra UI, and Flask • Carolina Data Challenge 2025
            </Text>
            <HStack spacing={4}>
              <Text fontSize="xs" color="gray.500">
                Team: Caleb Han • Ethan Tran • Erae Ko • Jeffery Liu
              </Text>
            </HStack>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}

export default App;