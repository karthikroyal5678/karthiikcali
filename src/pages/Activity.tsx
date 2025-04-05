
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import ActivityLogForm from '@/components/Activity/ActivityLogForm';
import WaterTracking from '@/components/Activity/WaterTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { initGoogleFitApi, fetchActivityData, GoogleFitData } from '@/utils/googleFitApi';

const activityData = [
  { day: 'Mon', steps: 5400, calories: 250 },
  { day: 'Tue', steps: 7800, calories: 350 },
  { day: 'Wed', steps: 9200, calories: 420 },
  { day: 'Thu', steps: 6700, calories: 310 },
  { day: 'Fri', steps: 8300, calories: 380 },
  { day: 'Sat', steps: 10500, calories: 480 },
  { day: 'Sun', steps: 4200, calories: 190 },
];

const Activity = () => {
  const { toast } = useToast();
  const [isConnectedToGoogleFit, setIsConnectedToGoogleFit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fitData, setFitData] = useState<GoogleFitData>({
    steps: 0,
    distance: 0,
    calories: 0
  });

  useEffect(() => {
    // Check if the user has previously connected to Google Fit
    const storedConnectionStatus = localStorage.getItem('googleFitConnected');
    if (storedConnectionStatus === 'true') {
      setIsConnectedToGoogleFit(true);
      fetchLatestData();
    }
  }, []);

  const connectToGoogleFit = async () => {
    setIsLoading(true);
    try {
      const success = await initGoogleFitApi();
      if (success) {
        setIsConnectedToGoogleFit(true);
        localStorage.setItem('googleFitConnected', 'true');
        fetchLatestData();
        toast({
          title: "Connected to Google Fit",
          description: "Your activity data will now sync automatically"
        });
      }
    } catch (error) {
      console.error("Failed to connect to Google Fit:", error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Google Fit. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLatestData = async () => {
    setIsLoading(true);
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const data = await fetchActivityData(startOfDay, new Date());
      if (data) {
        setFitData(data);
        toast({
          title: "Data Updated",
          description: `Latest data retrieved. Steps: ${data.steps}`
        });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Activity Tracking</h1>
          <p className="text-muted-foreground">Log your physical activities, track calorie burn and water intake</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ActivityLogForm />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-muted-foreground text-sm">Average Steps</p>
                    <p className="text-2xl font-bold text-activity-orange">7,443</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">Calories Burned</p>
                    <p className="text-2xl font-bold text-activity-orange">2,380</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Google Fit Integration</span>
                  {isConnectedToGoogleFit && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Connected</span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isConnectedToGoogleFit ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-muted-foreground text-sm">Steps Today</p>
                        <p className="text-xl font-bold">{fitData.steps?.toLocaleString() || '0'}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-muted-foreground text-sm">Distance</p>
                        <p className="text-xl font-bold">{fitData.distance?.toFixed(1) || '0'} km</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <p className="text-muted-foreground text-sm">Calories</p>
                        <p className="text-xl font-bold">{fitData.calories?.toLocaleString() || '0'}</p>
                      </div>
                    </div>
                    <Button 
                      onClick={fetchLatestData} 
                      variant="outline" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Refresh Data"}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3">
                    <p className="text-sm text-muted-foreground">Connect to Google Fit to sync your activity data.</p>
                    <Button 
                      onClick={connectToGoogleFit} 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Connecting..." : "Connect Google Fit"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <WaterTracking />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis yAxisId="left" orientation="left" stroke="#FF9800" />
                    <YAxis yAxisId="right" orientation="right" stroke="#4CAF50" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="steps" name="Steps" fill="#FF9800" />
                    <Bar yAxisId="right" dataKey="calories" name="Calories Burned" fill="#4CAF50" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Activity;
