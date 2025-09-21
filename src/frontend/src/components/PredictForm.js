// components/PredictForm.jsx
import React, { useState, useEffect } from 'react';
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
  Spinner,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  Input,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  SimpleGrid,
  Icon,
  Badge,
  Progress,
  Divider,
  useToast,
  Flex,
  Tag
} from '@chakra-ui/react';
import {
  FiShield,
  FiUser,
  FiCalendar,
  FiGlobe,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiAlertTriangle,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const PredictForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: 35,
    nationality: 'USA',
    missions: 0,
    space_time: 0,
    mission_type: 'ISS Expedition',
    role: 'mission_specialist',
    launch_weather: 'Clear',
    manufacturer: 'SpaceX',
    mission_complexity: 0.5,
    success_probability: 0.9,
    military: false,
    experience_level: 'Intermediate',
    age_group: 'Middle',
    career_stage: 'Mid'
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictInfo, setPredictInfo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPredictInfo = async () => {
      try {
        const response = await apiService.getPredictInfo();
        setPredictInfo(response);
      } catch (err) {
        console.error('Failed to fetch predict info:', err);
      }
    };
    fetchPredictInfo();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (prediction) setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please enter an astronaut name',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.makePrediction(formData);
      setPrediction(response);
      toast({
        title: 'Prediction Complete',
        description: 'Risk assessment generated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError);
      toast({
        title: 'Prediction Failed',
        description: apiError.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskLevel = (score) => {
    if (score >= 0.8) return { level: 'Very High', color: 'red' };
    if (score >= 0.6) return { level: 'High', color: 'orange' };
    if (score >= 0.4) return { level: 'Moderate', color: 'yellow' };
    if (score >= 0.2) return { level: 'Low', color: 'blue' };
    return { level: 'Very Low', color: 'green' };
  };

  const nationalities = [
    'USA', 'Russia', 'China', 'Japan', 'Canada', 'Germany', 'France',
    'Italy', 'UK', 'India', 'Australia', 'Other'
  ];

  return (
    <Box position="relative" minH="100%" bg="#0b1020" overflow="hidden">
      <Box position="absolute" inset="0" opacity={0.35}
        bgImage={`
          radial-gradient(1500px 600px at 10% -10%, rgba(56,189,248,0.20), transparent 60%),
          radial-gradient(1200px 500px at 90% 0%, rgba(168,85,247,0.18), transparent 60%),
          radial-gradient(900px 400px at 50% 100%, rgba(34,197,94,0.14), transparent 60%)
        `}
      />
      <Box position="absolute" inset="0" opacity={0.25}
        sx={{
          backgroundImage:
            'radial-gradient(1px 1px at 20px 20px, rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '22px 22px'
        }}
      />
      <VStack spacing={6} align="stretch" position="relative">
        <Card bg="rgba(255,255,255,0.05)" border="1px solid" borderColor="whiteAlpha.300" backdropFilter="blur(8px)" boxShadow="0 0 24px rgba(56,189,248,0.18)">
          <CardHeader pb={3}>
            <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
              <HStack spacing={3}>
                <Box boxSize={9} bgGradient="linear(to-r, cyan.400, purple.400)" borderRadius="full" display="grid" placeItems="center">
                  <Icon as={FiShield} color="white" />
                </Box>
                <Heading size="md" color="white">
                  Astronaut Risk Assessment
                </Heading>
              </HStack>
              <Tag colorScheme="green" variant="subtle">LIVE</Tag>
            </Flex>
            <Text fontSize="sm" color="gray.200" mt={2}>
              Enter astronaut and mission details to predict risk factors using our enhanced ML model
            </Text>
          </CardHeader>
          {predictInfo && (
            <CardBody pt={0}>
              <Alert status="info" borderRadius="md" bg="blue.900" color="blue.100" borderColor="blue.300">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontSize="sm">
                    <strong>Model Info:</strong> {predictInfo.model_info}
                  </Text>
                  <Text fontSize="xs" color="blue.200">
                    Expected input: Name, Age, Nationality, Mission Count, Space Time days
                  </Text>
                </VStack>
              </Alert>
            </CardBody>
          )}
        </Card>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg="rgba(255,255,255,0.06)" border="1px solid" borderColor="whiteAlpha.300" backdropFilter="blur(8px)">
            <CardHeader>
              <HStack spacing={3}>
                <Box boxSize={7} bg="whiteAlpha.300" borderRadius="md" display="grid" placeItems="center">
                  <Icon as={FiCalendar} color="whiteAlpha.900" boxSize={4} />
                </Box>
                <Heading size="md" color="white">Astronaut Information</Heading>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              <form onSubmit={handleSubmit}>
                <VStack spacing={5}>
                  <FormControl isRequired>
                    <FormLabel color="white" fontWeight="semibold">
                      <HStack>
                        <Icon as={FiUser} />
                        <Text>Astronaut Name</Text>
                      </HStack>
                    </FormLabel>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter astronaut name"
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _placeholder={{ color: 'whiteAlpha.700' }}
                      _focus={{ borderColor: 'cyan.300', boxShadow: '0 0 0 1px var(--chakra-colors-cyan-300)' }}
                      height="48px"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">
                      <HStack>
                        <Icon as={FiCalendar} />
                        <Text>Age</Text>
                      </HStack>
                    </FormLabel>
                    <NumberInput
                      value={formData.age}
                      onChange={(value) => handleInputChange('age', parseInt(value) || 0)}
                      min={20}
                      max={70}
                    >
                      <NumberInputField bg="whiteAlpha.200" borderColor="whiteAlpha.500" color="white" _focus={{ borderColor: 'cyan.300' }} height="48px" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">
                      <HStack>
                        <Icon as={FiGlobe} />
                        <Text>Nationality</Text>
                      </HStack>
                    </FormLabel>
                    <Select
                      value={formData.nationality}
                      onChange={(e) => handleInputChange('nationality', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      {nationalities.map(nat => (
                        <option key={nat} value={nat}>{nat}</option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">
                      <HStack>
                        <Icon as={FiAward} />
                        <Text>Mission Count</Text>
                      </HStack>
                    </FormLabel>
                    <NumberInput
                      value={formData.missions}
                      onChange={(value) => handleInputChange('missions', parseInt(value) || 0)}
                      min={0}
                      max={20}
                    >
                      <NumberInputField bg="whiteAlpha.200" borderColor="whiteAlpha.500" color="white" _focus={{ borderColor: 'cyan.300' }} height="48px" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">
                      <HStack>
                        <Icon as={FiClock} />
                        <Text>Total Space Time days</Text>
                      </HStack>
                    </FormLabel>
                    <NumberInput
                      value={formData.space_time}
                      onChange={(value) => handleInputChange('space_time', parseInt(value) || 0)}
                      min={0}
                      max={1000}
                    >
                      <NumberInputField bg="whiteAlpha.200" borderColor="whiteAlpha.500" color="white" _focus={{ borderColor: 'cyan.300' }} height="48px" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <Divider borderColor="whiteAlpha.400" />
                  <Text color="cyan.300" fontWeight="bold" fontSize="md">Mission Details</Text>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Mission Type</FormLabel>
                    <Select
                      value={formData.mission_type}
                      onChange={(e) => handleInputChange('mission_type', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="ISS Expedition">ISS Expedition</option>
                      <option value="Space Shuttle">Space Shuttle</option>
                      <option value="Commercial Crew">Commercial Crew</option>
                      <option value="Lunar Mission">Lunar Mission</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Role</FormLabel>
                    <Select
                      value={formData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="commander">Commander</option>
                      <option value="pilot">Pilot</option>
                      <option value="mission_specialist">Mission Specialist</option>
                      <option value="flight_engineer">Flight Engineer</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Launch Weather</FormLabel>
                    <Select
                      value={formData.launch_weather}
                      onChange={(e) => handleInputChange('launch_weather', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="Clear">Clear</option>
                      <option value="Partly Cloudy">Partly Cloudy</option>
                      <option value="Overcast">Overcast</option>
                      <option value="Poor">Poor</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Manufacturer</FormLabel>
                    <Select
                      value={formData.manufacturer}
                      onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="SpaceX">SpaceX</option>
                      <option value="Boeing">Boeing</option>
                      <option value="Roscosmos">Roscosmos</option>
                      <option value="Other">Other</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Mission Complexity (0.0 - 1.0)</FormLabel>
                    <NumberInput
                      value={formData.mission_complexity}
                      onChange={(value) => handleInputChange('mission_complexity', parseFloat(value) || 0)}
                      min={0}
                      max={1}
                      step={0.1}
                      precision={1}
                    >
                      <NumberInputField bg="whiteAlpha.200" borderColor="whiteAlpha.500" color="white" _focus={{ borderColor: 'cyan.300' }} height="48px" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Success Probability (0.0 - 1.0)</FormLabel>
                    <NumberInput
                      value={formData.success_probability}
                      onChange={(value) => handleInputChange('success_probability', parseFloat(value) || 0)}
                      min={0}
                      max={1}
                      step={0.01}
                      precision={2}
                    >
                      <NumberInputField bg="whiteAlpha.200" borderColor="whiteAlpha.500" color="white" _focus={{ borderColor: 'cyan.300' }} height="48px" />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Military Background</FormLabel>
                    <Select
                      value={formData.military.toString()}
                      onChange={(e) => handleInputChange('military', e.target.value === 'true')}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Experience Level</FormLabel>
                    <Select
                      value={formData.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="Junior">Junior</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Senior">Senior</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Age Group</FormLabel>
                    <Select
                      value={formData.age_group}
                      onChange={(e) => handleInputChange('age_group', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="Young">Young</option>
                      <option value="Middle">Middle</option>
                      <option value="Senior">Senior</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel color="white" fontWeight="semibold">Career Stage</FormLabel>
                    <Select
                      value={formData.career_stage}
                      onChange={(e) => handleInputChange('career_stage', e.target.value)}
                      bg="whiteAlpha.200"
                      borderColor="whiteAlpha.500"
                      color="white"
                      _focus={{ borderColor: 'cyan.300' }}
                      height="48px"
                    >
                      <option value="Early">Early</option>
                      <option value="Mid">Mid</option>
                      <option value="Experienced">Experienced</option>
                    </Select>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="cyan"
                    size="lg"
                    leftIcon={<Icon as={FiTrendingUp} />}
                    isLoading={loading}
                    loadingText="Analyzing"
                    w="100%"
                    bgGradient="linear(to-r, cyan.500, indigo.600)"
                    _hover={{ bgGradient: 'linear(to-r, cyan.600, indigo.700)' }}
                    boxShadow="0 0 22px rgba(56,189,248,0.45)"
                    height="52px"
                    fontWeight="bold"
                  >
                    Assess Risk
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>

          <Card bg="rgba(255,255,255,0.06)" border="1px solid" borderColor="whiteAlpha.300" backdropFilter="blur(8px)">
            <CardHeader>
              <Heading size="md" color="white">Risk Assessment Results</Heading>
            </CardHeader>
            <CardBody pt={0}>
              {loading && (
                <VStack spacing={4} py={8}>
                  <Spinner size="xl" color="cyan.300" thickness="4px" />
                  <Text color="gray.100">Running risk assessment</Text>
                  <Text fontSize="sm" color="gray.300">
                    Analyzing astronaut profile with the model
                  </Text>
                </VStack>
              )}

              {error && (
                <Alert status="error" borderRadius="md" bg="red.900" color="red.100" borderColor="red.300">
                  <AlertIcon />
                  <VStack align="start" spacing={2}>
                    <Text fontWeight="bold">Prediction Failed</Text>
                    <Text fontSize="sm">{error.message}</Text>
                  </VStack>
                </Alert>
              )}

              {prediction && (
                <VStack spacing={6}>
                  <Box w="100%" textAlign="center">
                    <VStack spacing={3}>
                      <Icon as={FiAlertTriangle} boxSize={8} color={getRiskLevel(prediction.risk_score).color + '.400'} />
                      <Heading size="lg" bgGradient={`linear(to-r, ${getRiskLevel(prediction.risk_score).color}.300, cyan.300)`} bgClip="text">
                        {(prediction.risk_score * 100).toFixed(1)}%
                      </Heading>
                      <Badge colorScheme={getRiskLevel(prediction.risk_score).color} fontSize="md" px={4} py={2}>
                        {getRiskLevel(prediction.risk_score).level} Risk
                      </Badge>
                      <Progress
                        value={Math.min(100, Math.max(0, prediction.risk_score * 100))}
                        colorScheme={getRiskLevel(prediction.risk_score).color}
                        size="lg"
                        w="100%"
                        borderRadius="md"
                        bg="whiteAlpha.300"
                      />
                    </VStack>
                  </Box>

                  <Divider borderColor="whiteAlpha.400" />

                  <VStack align="start" w="100%" spacing={3} color="gray.100">
                    <Text fontWeight="bold">Assessment Details</Text>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Astronaut</Text>
                      <Text fontSize="sm">{prediction.astronaut.name}</Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Profile</Text>
                      <Text fontSize="sm">
                        {prediction.astronaut.age} years old, {prediction.astronaut.nationality}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Experience</Text>
                      <Text fontSize="sm">
                        {prediction.astronaut.missions} missions, {prediction.astronaut.space_time} days in space
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Mission Details</Text>
                      <Text fontSize="sm">
                        {prediction.astronaut.mission_type} - {prediction.astronaut.role}
                      </Text>
                      <Text fontSize="xs" color="gray.300">
                        Weather: {prediction.astronaut.launch_weather}, Manufacturer: {prediction.astronaut.manufacturer}
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Mission Parameters</Text>
                      <Text fontSize="sm">
                        Complexity: {(prediction.astronaut.mission_complexity * 100).toFixed(0)}%,
                        Success Rate: {(prediction.astronaut.success_probability * 100).toFixed(0)}%
                      </Text>
                      <Text fontSize="xs" color="gray.300">
                        Military: {prediction.astronaut.military ? 'Yes' : 'No'},
                        Experience: {prediction.astronaut.experience_level}
                      </Text>
                    </Box>

                    {prediction.risk_factors && (
                      <Box>
                        <Text fontSize="sm" fontWeight="medium">Key Risk Factors</Text>
                        <VStack align="start" spacing={1}>
                          {prediction.risk_factors.map((factor, index) => (
                            <Text key={index} fontSize="sm" color="gray.200">• {factor}</Text>
                          ))}
                        </VStack>
                      </Box>
                    )}

                    {prediction.model_version && (
                      <Box>
                        <Text fontSize="xs" color="gray.300">
                          Model Version: {prediction.model_version}
                        </Text>
                      </Box>
                    )}
                  </VStack>
                </VStack>
              )}

              {!loading && !error && !prediction && (
                <VStack spacing={4} py={8} color="gray.200">
                  <Icon as={FiShield} boxSize={12} />
                  <Text textAlign="center">
                    Enter astronaut information and select Assess Risk to generate a prediction
                  </Text>
                </VStack>
              )}
            </CardBody>
          </Card>
        </SimpleGrid>

        <Card bg="rgba(255,255,255,0.05)" border="1px solid" borderColor="whiteAlpha.300" backdropFilter="blur(8px)">
          <CardBody>
            <VStack spacing={2}>
              <Text fontSize="sm" color="gray.100" textAlign="center">
                How it works: The enhanced model analyzes astronaut profile, mission complexity, environmental factors, and role responsibilities to estimate comprehensive risk.
              </Text>
              <Text fontSize="xs" color="gray.300" textAlign="center">
                Scores are produced by an ensemble model trained on historical data with mission-specific parameters.
              </Text>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default PredictForm;
