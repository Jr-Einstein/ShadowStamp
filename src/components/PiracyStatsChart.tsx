
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - in a real app, this would come from an API
const piracyData = [
  {
    year: '2018',
    loss: 230,
    incidents: 120,
    growth: 5,
  },
  {
    year: '2019',
    loss: 290,
    incidents: 150,
    growth: 12,
  },
  {
    year: '2020',
    loss: 350,
    incidents: 210,
    growth: 18,
  },
  {
    year: '2021',
    loss: 400,
    incidents: 250,
    growth: 22,
  },
  {
    year: '2022',
    loss: 520,
    incidents: 320,
    growth: 26,
  },
  {
    year: '2023',
    loss: 600,
    incidents: 380,
    growth: 32,
  },
  {
    year: '2024',
    loss: 720,
    incidents: 460,
    growth: 38,
  },
];

const sectorData = [
  {
    name: 'Software',
    value: 42,
    color: '#6e59a5',
  },
  {
    name: 'Music',
    value: 28,
    color: '#8a75c9',
  },
  {
    name: 'Movies',
    value: 35,
    color: '#a691dd',
  },
  {
    name: 'Publishing',
    value: 20,
    color: '#c4b3f1',
  },
  {
    name: 'Gaming',
    value: 30,
    color: '#e2d7ff',
  },
];

const formatCurrency = (value: number) => {
  return `$${value}B`;
};

const PiracyStatsChart: React.FC = () => {
  const [chartType, setChartType] = useState('financial');
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div 
      className="w-full bg-card rounded-lg p-6 border border-border"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <motion.h3 
        className="text-2xl font-bold mb-2"
        variants={itemVariants}
      >
        Digital Piracy Impact Statistics
      </motion.h3>
      
      <motion.p 
        className="text-muted-foreground mb-6"
        variants={itemVariants}
      >
        Real-time visualization of financial losses and growing piracy incidents
      </motion.p>
      
      <motion.div variants={itemVariants}>
        <Tabs defaultValue="financial" value={chartType} onValueChange={setChartType} className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="financial">Financial Losses</TabsTrigger>
            <TabsTrigger value="incidents">Piracy Incidents</TabsTrigger>
            <TabsTrigger value="sectors">Affected Sectors</TabsTrigger>
          </TabsList>

          <TabsContent value="financial" className="pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={piracyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6e59a5" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#6e59a5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" />
                  <YAxis tickFormatter={formatCurrency} />
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <Tooltip 
                    formatter={(value: number) => [`${formatCurrency(value)}`, 'Financial Loss']}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="loss"
                    stroke="#6e59a5"
                    fillOpacity={1}
                    fill="url(#colorLoss)"
                    strokeWidth={2}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">Annual financial losses due to digital piracy (in billions USD)</p>
          </TabsContent>

          <TabsContent value="incidents" className="pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={piracyData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="incidents"
                    name="Incidents (millions)"
                    stroke="#6e59a5"
                    strokeWidth={2}
                    dot={{ stroke: '#6e59a5', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="growth"
                    name="Growth Rate (%)"
                    stroke="#e2d7ff"
                    strokeWidth={2}
                    dot={{ stroke: '#e2d7ff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">Piracy incidents (millions) and year-over-year growth rate (%)</p>
          </TabsContent>

          <TabsContent value="sectors" className="pt-4">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, 'Market Affected']}
                    contentStyle={{ backgroundColor: '#1a1a1a', borderColor: '#333' }}
                  />
                  <Bar 
                    dataKey="value" 
                    name="Percentage Affected"
                    fill="#6e59a5" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">Percentage of market affected by piracy across different sectors</p>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default PiracyStatsChart;
