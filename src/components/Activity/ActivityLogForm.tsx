import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ActivitySquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const activityTypes = [
  { id: 'walking', name: 'Walking', caloriesPerMinute: 5, stepsPerMinute: 100 },
  { id: 'running', name: 'Running', caloriesPerMinute: 10, stepsPerMinute: 160 },
  { id: 'cycling', name: 'Cycling', caloriesPerMinute: 8, stepsPerMinute: 0 },
  { id: 'swimming', name: 'Swimming', caloriesPerMinute: 9, stepsPerMinute: 0 },
  { id: 'weight_training', name: 'Weight Training', caloriesPerMinute: 7, stepsPerMinute: 0 },
];

const ActivityLogForm = () => {
  const { toast } = useToast();
  const [activityType, setActivityType] = useState(activityTypes[0].id);
  const [duration, setDuration] = useState('30');
  const [steps, setSteps] = useState('');
  const [weight, setWeight] = useState('70'); // Default weight in kg
  const [distance, setDistance] = useState(''); // Distance in km

  const selectedActivity = activityTypes.find(activity => activity.id === activityType);
  
  const calculateCaloriesBurned = () => {
    if (!selectedActivity) return 0;
    
    // Basic calculation based on activity and duration
    let baseCals = selectedActivity.caloriesPerMinute * parseInt(duration);
    
    // Weight-adjusted calculation (simple formula: calories * weight / 70)
    // Where 70kg is the reference weight
    const weightFactor = parseFloat(weight) / 70;
    
    return Math.round(baseCals * weightFactor);
  };
  
  const calculateSteps = () => {
    if (!selectedActivity || selectedActivity.stepsPerMinute === 0) return '';
    
    // If steps are manually entered, use those
    if (steps) return steps;
    
    // Otherwise, calculate based on duration and activity type
    return Math.round(selectedActivity.stepsPerMinute * parseInt(duration)).toString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivity) return;
    
    const caloriesBurned = calculateCaloriesBurned();
    const calculatedSteps = calculateSteps();
    
    // For walking and running, also calculate distance if not provided
    let distanceMsg = '';
    if ((activityType === 'walking' || activityType === 'running') && !distance) {
      const avgSpeed = activityType === 'walking' ? 5 : 10; // km/h
      const calculatedDistance = (avgSpeed / 60) * parseInt(duration);
      distanceMsg = ` (${calculatedDistance.toFixed(2)} km)`;
    }
    
    toast({
      title: "Activity logged successfully",
      description: `Added ${selectedActivity.name} - ${caloriesBurned} calories burned${distanceMsg}`,
    });
    
    // Reset form
    setDuration('30');
    if (activityType === 'walking' || activityType === 'running') {
      setSteps('');
      setDistance('');
    }
  };

  // Show steps input only for walking and running
  const showSteps = activityType === 'walking' || activityType === 'running';
  const showDistance = activityType === 'walking' || activityType === 'running' || activityType === 'cycling';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ActivitySquare className="h-5 w-5 text-activity-orange" />
          <span>Log Activity</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="activity-type">Activity Type</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger id="activity-type">
                <SelectValue placeholder="Select activity" />
              </SelectTrigger>
              <SelectContent>
                {activityTypes.map((activity) => (
                  <SelectItem key={activity.id} value={activity.id}>
                    {activity.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>
          
          <div>
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="30"
              max="200"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Used to personalize calorie calculations
            </p>
          </div>
          
          {showDistance && (
            <div>
              <Label htmlFor="distance">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                min="0"
                step="0.1"
                placeholder="Optional"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
              />
            </div>
          )}
          
          {showSteps && (
            <div>
              <Label htmlFor="steps">Steps (optional)</Label>
              <Input
                id="steps"
                type="number"
                min="0"
                placeholder="Number of steps"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
              />
            </div>
          )}
          
          <div className="bg-muted/50 p-3 rounded-md">
            <p className="font-medium text-center">
              Estimated Calories Burned: {calculateCaloriesBurned()}
            </p>
            {showSteps && calculateSteps() && (
              <p className="text-sm text-center text-muted-foreground mt-1">
                Estimated Steps: {calculateSteps()}
              </p>
            )}
          </div>
          
          <Button type="submit" className="w-full" variant="default">
            <Plus className="mr-2 h-4 w-4" /> Log Activity
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ActivityLogForm;
