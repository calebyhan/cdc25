// Risk Prediction Form component - interactive form for astronaut risk assessment
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
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictInfo, setPredictInfo] = useState(null);
  const toast = useToast();

  useEffect(() => {
    fetchPredictInfo();
  }, []);

  const fetchPredictInfo = async () => {
    try {
      const response = await apiService.getPredictInfo();
      setPredictInfo(response);
    } catch (err) {
      console.error('Failed to fetch predict info:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear previous prediction when form changes
    if (prediction) {
      setPrediction(null);
    }
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
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack>
            <Icon as={FiShield} color="red.500" boxSize={6} />
            <VStack align="start" spacing={1}>
              <Heading size="md">🛡️ Astronaut Risk Assessment</Heading>
              <Text fontSize="sm" color="gray.600">
                Enter astronaut details to predict mission risk factors using our ML model
              </Text>
            </VStack>
          </HStack>
        </CardHeader>
        {predictInfo && (
          <CardBody pt={0}>
            <Alert status="info" borderRadius="md">
              <AlertIcon />
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">
                  <strong>Model Info:</strong> {predictInfo.model_info}
                </Text>
                <Text fontSize="xs" color="gray.600">
                  Expected input: Name, Age, Nationality, Mission Count, Space Time (days)
                </Text>
              </VStack>
            </Alert>
          </CardBody>
        )}
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Input Form */}
        <Card>
          <CardHeader>
            <Heading size="md">📋 Astronaut Information</Heading>
          </CardHeader>
          <CardBody pt={0}>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                {/* Name */}
                <FormControl isRequired>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiUser} />
                      <Text>Astronaut Name</Text>
                    </HStack>
                  </FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter astronaut name"
                  />
                </FormControl>

                {/* Age */}
                <FormControl>
                  <FormLabel>
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
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                {/* Nationality */}
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiGlobe} />
                      <Text>Nationality</Text>
                    </HStack>
                  </FormLabel>
                  <Select
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                  >
                    {nationalities.map(nat => (
                      <option key={nat} value={nat}>{nat}</option>
                    ))}
                  </Select>
                </FormControl>

                {/* Mission Count */}
                <FormControl>
                  <FormLabel>
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
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                {/* Space Time */}
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Icon as={FiClock} />
                      <Text>Total Space Time (days)</Text>
                    </HStack>
                  </FormLabel>
                  <NumberInput
                    value={formData.space_time}
                    onChange={(value) => handleInputChange('space_time', parseInt(value) || 0)}
                    min={0}
                    max={1000}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="red"
                  size="lg"
                  leftIcon={<Icon as={FiTrendingUp} />}
                  isLoading={loading}
                  loadingText="Analyzing..."
                  w="100%"
                >
                  Assess Risk
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <Heading size="md">📊 Risk Assessment Results</Heading>
          </CardHeader>
          <CardBody pt={0}>
            {loading && (
              <VStack spacing={4} py={8}>
                <Spinner size="xl" color="red.500" thickness="4px" />
                <Text>Running risk assessment...</Text>
                <Text fontSize="sm" color="gray.600">
                  Analyzing astronaut profile with ML model
                </Text>
              </VStack>
            )}

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={2}>
                  <Text fontWeight="bold">Prediction Failed</Text>
                  <Text fontSize="sm">{error.message}</Text>
                </VStack>
              </Alert>
            )}

            {prediction && (
              <VStack spacing={6}>
                {/* Risk Score Display */}
                <Box w="100%" textAlign="center">
                  <VStack spacing={3}>
                    <Icon as={FiAlertTriangle} boxSize={8} color={getRiskLevel(prediction.risk_score).color + '.500'} />
                    <Heading size="lg" color={getRiskLevel(prediction.risk_score).color + '.500'}>
                      {(prediction.risk_score * 100).toFixed(1)}%
                    </Heading>
                    <Badge
                      colorScheme={getRiskLevel(prediction.risk_score).color}
                      fontSize="md"
                      px={4}
                      py={2}
                    >
                      {getRiskLevel(prediction.risk_score).level} Risk
                    </Badge>
                    <Progress
                      value={prediction.risk_score * 100}
                      colorScheme={getRiskLevel(prediction.risk_score).color}
                      size="lg"
                      w="100%"
                      borderRadius="md"
                    />
                  </VStack>
                </Box>

                <Divider />

                {/* Prediction Details */}
                <VStack align="start" w="100%" spacing={3}>
                  <Text fontWeight="bold">Assessment Details:</Text>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium">Astronaut:</Text>
                    <Text fontSize="sm">{prediction.astronaut.name}</Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium">Profile:</Text>
                    <Text fontSize="sm">
                      {prediction.astronaut.age} years old, {prediction.astronaut.nationality}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="sm" fontWeight="medium">Experience:</Text>
                    <Text fontSize="sm">
                      {prediction.astronaut.missions} missions, {prediction.astronaut.space_time} days in space
                    </Text>
                  </Box>

                  {prediction.risk_factors && (
                    <Box>
                      <Text fontSize="sm" fontWeight="medium">Key Risk Factors:</Text>
                      <VStack align="start" spacing={1}>
                        {prediction.risk_factors.map((factor, index) => (
                          <Text key={index} fontSize="sm" color="gray.600">
                            • {factor}
                          </Text>
                        ))}
                      </VStack>
                    </Box>
                  )}

                  {prediction.model_version && (
                    <Box>
                      <Text fontSize="xs" color="gray.500">
                        Model Version: {prediction.model_version}
                      </Text>
                    </Box>
                  )}
                </VStack>
              </VStack>
            )}

            {!loading && !error && !prediction && (
              <VStack spacing={4} py={8} color="gray.500">
                <Icon as={FiShield} boxSize={12} />
                <Text textAlign="center">
                  Enter astronaut information and click "Assess Risk" to generate a prediction
                </Text>
              </VStack>
            )}
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Info Card */}
      <Card>
        <CardBody>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              💡 <strong>How it works:</strong> Our ML model analyzes astronaut profiles including age, experience,
              and mission history to predict potential risk factors for space missions.
            </Text>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Risk scores are calculated using ensemble machine learning methods trained on historical astronaut data.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default PredictForm;