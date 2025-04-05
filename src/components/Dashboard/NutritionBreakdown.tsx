
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface NutritionBreakdownProps {
  data?: Array<{
    name: string;
    value: number;
  }>;
  userSpecific?: boolean;
}

// Default data if none provided
const defaultData = [
  { name: 'Protein', value: 25 },
  { name: 'Carbs', value: 45 },
  { name: 'Fat', value: 30 },
];

const COLORS = ['#4CAF50', '#2196F3', '#FF9800'];

const NutritionBreakdown: React.FC<NutritionBreakdownProps> = ({ data = defaultData, userSpecific = false }) => {
  const [chartData, setChartData] = useState(data);

  useEffect(() => {
    if (userSpecific) {
      // Get user's macronutrient goals from local storage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      if (userData.proteinGoal && userData.carbsGoal && userData.fatGoal) {
        setChartData([
          { name: 'Protein', value: userData.proteinGoal },
          { name: 'Carbs', value: userData.carbsGoal },
          { name: 'Fat', value: userData.fatGoal },
        ]);
      } else {
        // If no user data, use the provided data or default
        setChartData(data);
      }
    } else {
      // Use the provided data
      setChartData(data);
    }
  }, [data, userSpecific]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {userSpecific ? 'Your Nutrition Goals' : 'Nutrition Breakdown'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => `${value}%`}
                contentStyle={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionBreakdown;
