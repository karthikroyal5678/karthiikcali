import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://vmdnnebpdbbzyapxasem.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtZG5uZWJwZGJienlhcHhhc2VtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEzNzA3NDUsImV4cCI6MjA1Njk0Njc0NX0.1PcVETJttveC2m4EGFxssd_mpTeEAs32YupqPrwHXCY';
const supabase = createClient(supabaseUrl, supabaseKey);

interface CalorieData {
  day: string;
  consumed: number;
  burned: number;
  goal: number;
}

const CalorieChart: React.FC = () => {
  const [chartData, setChartData] = useState<CalorieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchCalorieData = async () => {
      try {
        // Assuming you have a table 'calorie_logs' with columns: day, consumed, burned, goal, user_id
        // and you're tracking data for the authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw userError;
        if (!userData.user) throw new Error('No authenticated user found');

        const userId = userData.user.id;

        const { data, error } = await supabase
          .from('calorie_logs')
          .select('day, consumed, burned, goal')
          .eq('user_id', userId)
          .order('day', { ascending: true });

        if (error) throw error;

        // Format data for the chart
        const formattedData: CalorieData[] = data.map((entry: any) => ({
          day: entry.day,
          consumed: entry.consumed || 0,
          burned: entry.burned || 0,
          goal: entry.goal || 2000, // Default goal if not set
        }));

        setChartData(formattedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCalorieData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Weekly Calorie Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p>Loading...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Weekly Calorie Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-red-500">Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Weekly Calorie Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip 
                contentStyle={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="consumed" 
                stroke="#4CAF50" 
                strokeWidth={2}
                name="Calories Consumed" 
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                dataKey="burned" 
                stroke="#FF9800" 
                strokeWidth={2}
                name="Calories Burned" 
              />
              <Line 
                type="monotone" 
                dataKey="goal" 
                stroke="#2196F3" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="Daily Target" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieChart;