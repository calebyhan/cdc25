// components/Visualizations.js
import React, { useState, useEffect, useMemo } from 'react';
import {
  Box, VStack, HStack, Heading, Text, Card, CardHeader, CardBody, Spinner, Alert, AlertIcon,
  SimpleGrid, Icon, Select, Badge, Stat, StatLabel, StatNumber, StatHelpText, useColorModeValue, Divider,
} from '@chakra-ui/react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts';
import { FiBarChart2, FiTrendingUp, FiActivity, FiUsers, FiGlobe } from 'react-icons/fi';
import { apiService, handleApiError } from '../services/api';

export default function Visualizations() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChart, setSelectedChart] = useState('overview');

  const panelBg = useColorModeValue('whiteAlpha.50', 'whiteAlpha.50');
  const panelBorder = useColorModeValue('whiteAlpha.200', 'whiteAlpha.200');

  useEffect(() => {
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
    fetchVisualizations();
  }, []);

  const colors = ['#60a5fa', '#34d399', '#f59e0b', '#f87171', '#a78bfa', '#fb923c', '#22d3ee'];
  const chartOptions = [
    { value: 'overview', label: 'Overview Dashboard' },
    { value: 'missions', label: 'Mission Analysis' },
    { value: 'demographics', label: 'Demographics' },
    { value: 'risk', label: 'Risk Assessment' },
  ];
  const axisTick = { fill: 'rgba(226,232,240,0.85)', fontSize: 12 };
  const gridStroke = 'rgba(255,255,255,0.15)';
  const tooltipStyle = {
    background: '#0b1020',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
  };

  // Move hooks ABOVE conditional returns
  const ageDist = useMemo(() => data?.charts?.age_distribution ?? [], [data]);
  const nationalityDist = useMemo(() => data?.charts?.nationality_distribution ?? [], [data]);

  if (loading) {
    return (
      <VStack spacing={4} align="center" py={8}>
        <Spinner size="xl" color="cyan.400" thickness="4px" />
        <Text color="cyan.200" fontWeight="medium">Loading analytics data…</Text>
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

  return (
    <VStack spacing={6} align="stretch">
      <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
        <CardHeader>
          <HStack justify="space-between" align="start">
            <HStack spacing={3}>
              <Box w="36px" h="36px" rounded="full" bgGradient="linear(to-r, cyan.500, purple.500)"
                   display="grid" placeItems="center" color="white"
                   boxShadow="0 0 18px rgba(56,189,248,0.45)">
                <Icon as={FiBarChart2} />
              </Box>
              <VStack align="start" spacing={1}>
                <Heading size="md" bgGradient="linear(to-r, cyan.300, purple.300)" bgClip="text">Data Analytics Dashboard</Heading>
                <Text fontSize="sm" color="gray.200">
                  Interactive visualizations of astronaut data and mission statistics
                </Text>
              </VStack>
            </HStack>
            <Select
              value={selectedChart}
              onChange={(e) => setSelectedChart(e.target.value)}
              w="64"
              size="md"
              bg="whiteAlpha.200"
              borderColor="whiteAlpha.500"
              color="white"
              fontWeight="medium"
              _focus={{ borderColor: 'cyan.300', boxShadow: '0 0 0 2px var(--chakra-colors-cyan-300)', bg: 'whiteAlpha.300' }}
              _hover={{ borderColor: 'whiteAlpha.600' }}
              borderRadius="md"
            >
              {chartOptions.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </HStack>
        </CardHeader>
      </Card>

      <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
        <StatTile icon={FiUsers} color="cyan" label="Total Astronauts"
                  value={data?.statistics?.total_astronauts ?? 0} help="In dataset" />
        <StatTile icon={FiActivity} color="green" label="Total Missions"
                  value={data?.statistics?.total_missions ?? 0} help="Completed" />
        <StatTile icon={FiGlobe} color="purple" label="Countries"
                  value={data?.statistics?.countries ?? 0} help="Represented" />
        <StatTile icon={FiTrendingUp} color="orange" label="Avg Risk Score"
                  value={data?.statistics?.avg_risk_score ? `${(data.statistics.avg_risk_score * 100).toFixed(1)}%` : 'N/A'}
                  help="Model prediction" />
      </SimpleGrid>

      {selectedChart === 'overview' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="cyan.300">Age Distribution</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <BarChart data={ageDist}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="age_group" tick={axisTick} />
                    <YAxis tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" radius={[6,6,0,0]} fill={colors[0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="gray.200">Nationality Distribution</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={nationalityDist} dataKey="value" nameKey="name"
                         cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={2}
                         label={({ name, value }) => `${name}: ${value}`}>
                      {nationalityDist.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {selectedChart === 'missions' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="cyan.300">Mission Experience Analysis</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <BarChart data={data.charts.experience_analysis}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="missions" tick={axisTick} label={{ value: 'Mission Count', position: 'insideBottom', offset: -10 }} />
                    <YAxis tick={axisTick} label={{ value: 'Avg Duration (hrs)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [value.toFixed(1), name === 'avg_duration' ? 'Avg Duration (hrs)' : 'Avg Age']} />
                    <Bar dataKey="avg_duration" radius={[6,6,0,0]} fill={colors[1]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="green.300">Age vs Mission Experience</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <LineChart data={data.charts.experience_analysis}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="missions" tick={axisTick} label={{ value: 'Mission Count', position: 'insideBottom', offset: -10 }} />
                    <YAxis tick={axisTick} label={{ value: 'Average Age', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value.toFixed(1), 'Average Age']} />
                    <Line type="monotone" dataKey="avg_age" stroke={colors[2]} strokeWidth={3} dot={{ fill: colors[2], strokeWidth: 2, r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {selectedChart === 'demographics' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="purple.300">Age Distribution Details</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <AreaChart data={ageDist}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="age_group" tick={axisTick} />
                    <YAxis tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Area type="monotone" dataKey="count" stroke={colors[3]} fill={colors[3]} fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="orange.300">Nationality Breakdown</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <BarChart data={nationalityDist} layout="horizontal">
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis type="number" tick={axisTick} />
                    <YAxis dataKey="name" type="category" tick={axisTick} width={60} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" radius={[0,6,6,0]} fill={colors[4]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      {selectedChart === 'risk' && data?.charts && (
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="red.300">Risk Level Distribution</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <BarChart data={data.charts.risk_distribution}>
                    <CartesianGrid stroke={gridStroke} strokeDasharray="3 3" />
                    <XAxis dataKey="risk_level" tick={axisTick} />
                    <YAxis tick={axisTick} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" radius={[6,6,0,0]} fill={colors[5]} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>

          <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
            <CardHeader pb={0}><Heading size="sm" color="yellow.300">Risk Distribution Pie Chart</Heading></CardHeader>
            <CardBody>
              <Box w="100%" h="300px">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.charts.risk_distribution}
                      dataKey="count"
                      nameKey="risk_level"
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={90}
                      paddingAngle={2}
                      label={({ risk_level, count }) => `${risk_level}: ${count}`}
                    >
                      {data.charts.risk_distribution.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Pie>
                    <Legend />
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardBody>
          </Card>
        </SimpleGrid>
      )}

      <Card bg={panelBg} border="1px solid" borderColor={panelBorder}>
        <CardBody>
          <VStack spacing={3}>
            <Text fontSize="sm" color="gray.100" textAlign="center" fontWeight="medium">
              Data Source: Visualizations are generated from real-time analysis of astronaut profiles and mission data processed by our ML pipeline.
            </Text>
            <HStack spacing={2} wrap="wrap" justify="center">
              <Badge colorScheme="blue" variant="subtle">Interactive Charts</Badge>
              <Badge colorScheme="green" variant="subtle">Real-time Data</Badge>
              <Badge colorScheme="purple" variant="subtle">ML Insights</Badge>
              <Badge colorScheme="orange" variant="subtle">Historical Analysis</Badge>
            </HStack>
            <Divider borderColor="whiteAlpha.200" />
            <Text fontSize="xs" color="gray.200" textAlign="center">
              Charts update automatically when new data is processed through the risk assessment system.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </VStack>
  );
}

function StatTile({ icon: IconCmp, value, label, help, color }) {
  return (
    <Card bg="whiteAlpha.50" border="1px solid" borderColor="whiteAlpha.200">
      <CardBody>
        <HStack justify="space-between" mb={1}>
          <Icon as={IconCmp} color={`${color}.300`} boxSize={5} />
          <Stat textAlign="right">
          <StatNumber color={`${color}.200`}>{value}</StatNumber>
            <StatLabel color={`${color}.300`}>{label}</StatLabel>
            <StatHelpText color="gray.300">{help}</StatHelpText>
          </Stat>
        </HStack>
      </CardBody>
    </Card>
  );
}
