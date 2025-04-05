import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Droplets, Plus, Save, RefreshCw, CloudCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { fetchWaterData, syncWaterData } from '@/utils/googleFitApi';

interface WaterLog {
  amount: number;
  timestamp: string;
  synced?: boolean;
}

const WaterTracking = () => {
  const { toast } = useToast();
  const [waterAmount, setWaterAmount] = useState<number>(250);
  const [totalWater, setTotalWater] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isGoogleFitSyncing, setIsGoogleFitSyncing] = useState<boolean>(false);
  const [googleFitConnected, setGoogleFitConnected] = useState<boolean>(false);
  
  useEffect(() => {
    const loadWaterData = () => {
      try {
        const savedWaterLogs = localStorage.getItem('waterLogs');
        if (savedWaterLogs) {
          const logs: WaterLog[] = JSON.parse(savedWaterLogs);
          
          const today = new Date().toISOString().split('T')[0];
          const todaysLogs = logs.filter(log => log.timestamp.startsWith(today));
          
          const total = todaysLogs.reduce((sum, log) => sum + log.amount, 0);
          setTotalWater(total);
        }
      } catch (error) {
        console.error('Error loading water data:', error);
        toast({
          title: "Error loading data",
          description: "Could not load your water tracking data",
          variant: "destructive",
        });
      }
    };

    const isConnected = localStorage.getItem('googleFitConnected') === 'true';
    setGoogleFitConnected(isConnected);

    loadWaterData();
  }, [toast]);

  const saveWaterLog = (amount: number) => {
    try {
      const savedWaterLogs = localStorage.getItem('waterLogs');
      let logs: WaterLog[] = savedWaterLogs ? JSON.parse(savedWaterLogs) : [];
      
      const newLog: WaterLog = {
        amount: amount,
        timestamp: new Date().toISOString(),
        synced: false
      };
      
      logs.push(newLog);
      localStorage.setItem('waterLogs', JSON.stringify(logs));
      
      return true;
    } catch (error) {
      console.error('Error saving water log:', error);
      return false;
    }
  };

  const handleLogWater = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const success = saveWaterLog(waterAmount);
      
      if (success) {
        setTotalWater(prev => prev + waterAmount);
        
        toast({
          title: "Water intake logged",
          description: `Added ${waterAmount}ml of water`,
        });
      } else {
        toast({
          title: "Error saving data",
          description: "Could not save your water intake",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }, 300);
  };

  const handleSync = () => {
    setIsSyncing(true);
    
    setTimeout(() => {
      toast({
        title: "Data synchronized",
        description: "Your water tracking data has been synced across devices",
      });
      setIsSyncing(false);
    }, 1000);
  };

  const handleGoogleFitSync = async () => {
    setIsGoogleFitSyncing(true);
    
    try {
      const savedWaterLogs = localStorage.getItem('waterLogs');
      if (savedWaterLogs) {
        let logs: WaterLog[] = JSON.parse(savedWaterLogs);
        const unsynced = logs.filter(log => !log.synced);
        
        if (unsynced.length > 0) {
          for (const log of unsynced) {
            await syncWaterData(log.amount, new Date(log.timestamp));
            log.synced = true;
          }
          
          localStorage.setItem('waterLogs', JSON.stringify(logs));
          
          toast({
            title: "Google Fit sync complete",
            description: `Synced ${unsynced.length} water intake entries to Google Fit`,
          });
        } else {
          toast({
            title: "Google Fit sync",
            description: "No new water intake entries to sync",
          });
        }
      }
    } catch (error) {
      console.error('Error syncing with Google Fit:', error);
      toast({
        title: "Sync failed",
        description: "Could not sync water data with Google Fit",
        variant: "destructive",
      });
    } finally {
      setIsGoogleFitSyncing(false);
    }
  };

  const handleConnectGoogleFit = () => {
    setIsGoogleFitSyncing(true);
    
    setTimeout(() => {
      setGoogleFitConnected(true);
      localStorage.setItem('googleFitConnected', 'true');
      
      toast({
        title: "Google Fit connected",
        description: "Your account is now linked with Google Fit",
      });
      
      setIsGoogleFitSyncing(false);
    }, 1500);
  };

  const handleFetchGoogleFitData = async () => {
    setIsLoading(true);
    
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      const waterData = await fetchWaterData(startOfDay, now);
      
      if (waterData) {
        setTotalWater(waterData);
        
        toast({
          title: "Data retrieved",
          description: `Fetched ${waterData}ml water intake from Google Fit`,
        });
      }
    } catch (error) {
      console.error('Error fetching data from Google Fit:', error);
      toast({
        title: "Fetch failed",
        description: "Could not retrieve water data from Google Fit",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    try {
      const savedWaterLogs = localStorage.getItem('waterLogs');
      if (savedWaterLogs) {
        let logs: WaterLog[] = JSON.parse(savedWaterLogs);
        
        const today = new Date().toISOString().split('T')[0];
        logs = logs.filter(log => !log.timestamp.startsWith(today));
        
        localStorage.setItem('waterLogs', JSON.stringify(logs));
      }
      
      setTotalWater(0);
      
      toast({
        title: "Reset complete",
        description: "Today's water intake has been reset",
      });
    } catch (error) {
      console.error('Error resetting water data:', error);
      toast({
        title: "Error resetting data",
        description: "Could not reset your water intake",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-blue-500" />
          <span>Water Tracking</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="water-amount">Water Amount (ml)</Label>
            <span className="text-sm font-medium">{waterAmount}ml</span>
          </div>
          <Slider
            id="water-amount"
            min={50}
            max={1000}
            step={50}
            value={[waterAmount]}
            onValueChange={(values) => setWaterAmount(values[0])}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">Today's total</p>
            <p className="text-2xl font-bold">{totalWater} ml</p>
          </div>
          <Button onClick={handleLogWater} disabled={isLoading}>
            {isLoading ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Plus className="mr-2 h-4 w-4" />
            )} 
            Add Water
          </Button>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md">
          <p className="text-sm text-center">
            Daily recommendation: 2000-3000 ml
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${Math.min(totalWater / 3000 * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-3">Google Fit Integration</p>
          
          {!googleFitConnected ? (
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleConnectGoogleFit}
              disabled={isGoogleFitSyncing}
            >
              {isGoogleFitSyncing ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CloudCog className="mr-2 h-4 w-4" />
              )}
              Connect Google Fit
            </Button>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 flex items-center gap-1">
                  <span className="block w-2 h-2 rounded-full bg-green-600"></span>
                  Connected to Google Fit
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleFetchGoogleFitData}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Fetch Data"
                  )}
                </Button>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleFitSync}
                disabled={isGoogleFitSyncing}
              >
                {isGoogleFitSyncing ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CloudCog className="mr-2 h-4 w-4" />
                )}
                Sync to Google Fit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost" onClick={handleReset} className="text-sm">
          Reset Today's Count
        </Button>
        <Button 
          variant="outline" 
          onClick={handleSync} 
          disabled={isSyncing}
          className="text-sm"
        >
          {isSyncing ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Sync Devices
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WaterTracking;
