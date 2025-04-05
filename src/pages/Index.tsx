
import React, { useState, useEffect } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import CalorieChart from '@/components/Dashboard/CalorieChart';
import CalorieSummary from '@/components/Dashboard/CalorieSummary';
import RecentEntries from '@/components/Dashboard/RecentEntries';
import NutritionBreakdown from '@/components/Dashboard/NutritionBreakdown';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trophy, Target } from 'lucide-react';

const Index = () => {
  const { toast } = useToast();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  
  // User data with defaults
  const [userData, setUserData] = useState({
    name: 'User',
    calorieGoal: 2000,
    proteinGoal: 25, // % of calories
    carbsGoal: 45,  // % of calories
    fatGoal: 30,    // % of calories
  });
  
  // Current calorie data
  const [calorieData, setCalorieData] = useState({
    consumed: 1850,
    burned: 320,
    goal: userData.calorieGoal
  });
  
  // Macros data for the breakdown
  const [macrosData, setMacrosData] = useState([
    { name: 'Protein', value: userData.proteinGoal },
    { name: 'Carbs', value: userData.carbsGoal },
    { name: 'Fat', value: userData.fatGoal },
  ]);
  
  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const parsedData = JSON.parse(savedUserData);
      setUserData(parsedData);
      
      // Update calorie data with the user's goal
      setCalorieData(prev => ({
        ...prev,
        goal: parsedData.calorieGoal
      }));
      
      // Update macros data
      setMacrosData([
        { name: 'Protein', value: parsedData.proteinGoal },
        { name: 'Carbs', value: parsedData.carbsGoal },
        { name: 'Fat', value: parsedData.fatGoal },
      ]);
    }
  }, []);
  
  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);
  
  // Handle saving goal changes
  const saveGoals = () => {
    // Ensure macros add up to 100%
    let { proteinGoal, carbsGoal, fatGoal } = userData;
    const total = proteinGoal + carbsGoal + fatGoal;
    
    if (total !== 100) {
      // Normalize to 100%
      proteinGoal = Math.round((proteinGoal / total) * 100);
      carbsGoal = Math.round((carbsGoal / total) * 100);
      fatGoal = 100 - proteinGoal - carbsGoal;
      
      setUserData(prev => ({
        ...prev,
        proteinGoal,
        carbsGoal,
        fatGoal
      }));
    }
    
    // Update the calorie data with new goal
    setCalorieData(prev => ({
      ...prev,
      goal: userData.calorieGoal
    }));
    
    // Update nutrition breakdown with new macro goals
    setMacrosData([
      { name: 'Protein', value: userData.proteinGoal },
      { name: 'Carbs', value: userData.carbsGoal },
      { name: 'Fat', value: userData.fatGoal },
    ]);
    
    setIsEditingGoals(false);
    
    toast({
      title: "Goals updated",
      description: `New calorie target: ${userData.calorieGoal} kcal`
    });
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {userData.name}</h1>
            <p className="text-muted-foreground">Track your nutrition and activities</p>
          </div>
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsEditingGoals(!isEditingGoals)}
          >
            <Target size={18} />
            {isEditingGoals ? 'Cancel' : 'Edit Goals'}
          </Button>
        </div>

        {isEditingGoals ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy size={20} className="text-primary" />
                Customize Your Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="calorie-goal">Daily Calorie Target</Label>
                <div className="flex items-center gap-4">
                  <Slider 
                    id="calorie-goal"
                    value={[userData.calorieGoal]} 
                    min={1200} 
                    max={4000} 
                    step={50}
                    onValueChange={(values) => 
                      setUserData(prev => ({ ...prev, calorieGoal: values[0] }))
                    }
                    className="flex-1"
                  />
                  <div className="w-16 text-center font-medium">{userData.calorieGoal}</div>
                </div>
              </div>
              
              <div className="grid gap-6">
                <div>
                  <Label className="mb-2 block">Macronutrient Breakdown (%)</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    Set your target percentages for each macronutrient (total should be 100%)
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="protein-goal">Protein</Label>
                      <span>{userData.proteinGoal}%</span>
                    </div>
                    <Slider 
                      id="protein-goal"
                      value={[userData.proteinGoal]} 
                      min={10} 
                      max={60} 
                      step={1}
                      onValueChange={(values) => 
                        setUserData(prev => ({ ...prev, proteinGoal: values[0] }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="carbs-goal">Carbohydrates</Label>
                      <span>{userData.carbsGoal}%</span>
                    </div>
                    <Slider 
                      id="carbs-goal"
                      value={[userData.carbsGoal]} 
                      min={10} 
                      max={70} 
                      step={1}
                      onValueChange={(values) => 
                        setUserData(prev => ({ ...prev, carbsGoal: values[0] }))
                      }
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="fat-goal">Fat</Label>
                      <span>{userData.fatGoal}%</span>
                    </div>
                    <Slider 
                      id="fat-goal"
                      value={[userData.fatGoal]} 
                      min={10} 
                      max={60} 
                      step={1}
                      onValueChange={(values) => 
                        setUserData(prev => ({ ...prev, fatGoal: values[0] }))
                      }
                    />
                  </div>
                  
                  <div className={`text-sm font-medium ${
                    userData.proteinGoal + userData.carbsGoal + userData.fatGoal === 100 
                      ? 'text-green-500' 
                      : 'text-amber-500'
                  }`}>
                    Total: {userData.proteinGoal + userData.carbsGoal + userData.fatGoal}%
                    {userData.proteinGoal + userData.carbsGoal + userData.fatGoal !== 100 && 
                      ' (should equal 100%)'}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveGoals} 
                className="w-full"
              >
                Save Goals
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <CalorieSummary 
                consumed={calorieData.consumed} 
                burned={calorieData.burned} 
                goal={calorieData.goal} 
              />
              <CalorieChart />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RecentEntries />
              <NutritionBreakdown data={macrosData} />
            </div>
          </>
        )}
      </div>
    </PageLayout>
  );
};

export default Index;
