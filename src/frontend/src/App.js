// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box } from '@chakra-ui/react';
import MissionOverview from './components/MissionOverview';
import PredictForm from './components/PredictForm';
import Visualizations from './components/Visualizations';
import TopBar from './components/TopBar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const MotionDiv = motion.div;

function Starfield() {
  return (
    <Box position="fixed" inset="0" zIndex={-1} bgGradient="linear(to-b, gray.900, #0b1020 50%, black)">
      <Box position="absolute" inset="0" opacity={0.22}
        bgImage="radial-gradient(1px 1px at 20px 20px, rgba(255,255,255,0.7) 1px, transparent 1px)"
        backgroundSize="22px 22px"
      />
      <Box position="absolute" top="-1rem" left="-1rem" w="24rem" h="24rem" rounded="full" bg="purple.500" mixBlendMode="multiply" filter="auto" blur="72px" opacity={0.12} />
      <Box position="absolute" top="-1rem" right="-1rem" w="24rem" h="24rem" rounded="full" bg="cyan.500" mixBlendMode="multiply" filter="auto" blur="72px" opacity={0.12} />
      <Box position="absolute" bottom="0" left="5rem" w="24rem" h="24rem" rounded="full" bg="pink.500" mixBlendMode="multiply" filter="auto" blur="72px" opacity={0.12} />
    </Box>
  );
}

export default function App() {
  return (
    <Box minH="100vh" bg="#0b1020" position="relative" overflow="hidden">
      <Starfield />
      <TopBar />
      <Navbar />
      <Box as="main" maxW="7xl" mx="auto" px={{ base: 4, lg: 8 }} py={8}>
        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Routes>
            <Route path="/" element={<MissionOverview />} />
            <Route path="/predict" element={<PredictForm />} />
            <Route path="/analytics" element={<Visualizations />} />
          </Routes>
        </MotionDiv>
      </Box>
      <Footer />
    </Box>
  );
}
