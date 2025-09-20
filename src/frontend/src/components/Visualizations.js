// Visualizations component - displays data analytics and charts
import React, { useState, useEffect } from 'react';
import {
  VStack,
  HStack,
  Heading,
  Text,
  Card,
  CardHeader,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
  Icon,
  Select,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  Area,
  AreaChart,
} from 'recharts';
import {
  FiBarChart,
  FiTrendingUp,
  FiActivity,
  FiUsers,
  FiGlobe,
} from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

const Visualizations = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('overview');

  useEffect(() => {
    fetchVisualizations();
  }, []);

  const fetchVisualizations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getVisualizations();
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
        <Text>Loading analytics data...</Text>
      </VStack>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <VStack align="start" spacing={2}>
          <Text fontWeight="bold">Failed to load visualization data</Text>
          <Text fontSize="sm">{error.message}</Text>
        </VStack>
      </Alert>
    );
  }

  // Color schemes for charts
  const colors = ['#3182CE', '#38A169', '#D69E2E', '#E53E3E', '#805AD5', '#DD6B20', '#319795'];

  // Chart type options
  const chartOptions = [
    { value: 'overview', label: 'Overview Dashboard' },
    { value: 'missions', label: 'Mission Analysis' },
    { value: 'demographics', label: 'Demographics' },
    { value: 'risk', label: 'Risk Assessment' },
  ];

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <HStack>
              <Icon as={FiBarChart} color="teal.500" boxSize={6} />
              <VStack align="start" spacing={1}>
                <Heading size="md">📊 Data Analytics Dashboard</Heading>
                <Text fontSize="sm" color="gray.600">
                  Interactive visualizations of astronaut data and mission statistics
                </Text>
              </VStack>
            </HStack>
            <Select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              w="200px"
            >
              {chartOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </HStack>
        </CardHeader>
      </Card>

      {/* Statistics Overview */}
      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiUsers} color="blue.500" />
              <Text>Total Astronauts</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="blue.500">{data?.statistics?.total_astronauts || 0}</StatNumber>
          <StatHelpText>In dataset</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiActivity} color="green.500" />
              <Text>Total Missions</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="green.500">{data?.statistics?.total_missions || 0}</StatNumber>
          <StatHelpText>Completed</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiGlobe} color="purple.500" />
              <Text>Countries</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="purple.500">{data?.statistics?.countries || 0}</StatNumber>
          <StatHelpText>Represented</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel>
            <HStack>
              <Icon as={FiTrendingUp} color="orange.500" />
              <Text>Avg Risk Score</Text>
            </HStack>
          </StatLabel>
          <StatNumber color="orange.500">
            {data?.statistics?.avg_risk_score ? (data.statistics.avg_risk_score * 100).toFixed(1) + '%' : 'N/A'}
          </StatNumber>
          <StatHelpText>Model prediction</StatHelpText>
        </Stat>
      </SimpleGrid>

      {/* Chart Content */}
      {selectedChart === 'overview' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <Heading size="sm">Age Distribution</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.age_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age_group" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={colors[0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Nationality Distribution */}
          <Card>
            <CardHeader>
              <Heading size="sm">Nationality Distribution</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.nationality_distribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.charts.nationality_distribution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {selectedChart === 'missions' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Mission Count Distribution */}
          <Card>
            <CardHeader>
              <Heading size="sm">Mission Experience Levels</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.mission_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mission_range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={colors[1]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Space Time vs Mission Count */}
          <Card>
            <CardHeader>
              <Heading size="sm">Space Time vs Mission Count</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart data={data.charts.scatter_data}>
                  <XAxis dataKey="missions" name="Missions" />
                  <YAxis dataKey="space_time" name="Space Time (days)" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter
                    name="Astronauts"
                    data={data.charts.scatter_data}
                    fill={colors[2]}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {selectedChart === 'demographics' && data?.charts && (
        <VStack spacing={6}>
          {/* Age vs Experience Trend */}
          <Card w="100%">
            <CardHeader>
              <Heading size="sm">Age vs Experience Correlation</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data.charts.age_experience_trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="avg_missions"
                    stroke={colors[3]}
                    strokeWidth={2}
                    name="Average Missions"
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_space_time"
                    stroke={colors[4]}
                    strokeWidth={2}
                    name="Average Space Time"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Gender Distribution */}
          <Card w="100%">
            <CardHeader>
              <Heading size="sm">Gender Representation Over Time</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data.charts.gender_timeline}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="decade" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="male"
                    stackId="1"
                    stroke={colors[0]}
                    fill={colors[0]}
                    name="Male"
                  />
                  <Area
                    type="monotone"
                    dataKey="female"
                    stackId="1"
                    stroke={colors[1]}
                    fill={colors[1]}
                    name="Female"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </VStack>
      )}

      {selectedChart === 'risk' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          {/* Risk Score Distribution */}
          <Card>
            <CardHeader>
              <Heading size="sm">Risk Score Distribution</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.charts.risk_distribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk_level" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={colors[5]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Risk Factors */}
          <Card>
            <CardHeader>
              <Heading size="sm">Primary Risk Factors</Heading>
            </CardHeader>
            <CardBody>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.charts.risk_factors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="percentage"
                  >
                    {data.charts.risk_factors?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {/* Data Source Information */}
      <Card>
        <CardBody>
          <VStack spacing={2}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              📈 <strong>Data Source:</strong> Visualizations are generated from real-time analysis of astronaut
              profiles and mission data processed by our ML pipeline.
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue">Interactive Charts</Badge>
              <Badge colorScheme="green">Real-time Data</Badge>
              <Badge colorScheme="purple">ML Insights</Badge>
              <Badge colorScheme="orange">Historical Analysis</Badge>
            </HStack>
            <Text fontSize="xs" color="gray.500" textAlign="center">
              Charts update automatically when new data is processed through the risk assessment system.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
};

export default Visualizations;