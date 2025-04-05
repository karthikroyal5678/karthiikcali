
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Utensils, Coffee, ActivitySquare } from 'lucide-react';

interface CalorieSummaryProps {
  consumed: number;
  burned: number;
  goal: number;
}

const CalorieSummary: React.FC<CalorieSummaryProps> = ({ consumed, burned, goal }) => {
  const net = consumed - burned;
  const percentage = Math.min(Math.round((net / goal) * 100), 100);
  const remaining = goal - net;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Today's Calories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2 text-sm">
              <span>Net: {net} kcal</span>
              <span>Goal: {goal} kcal</span>
            </div>
            <Progress value={percentage} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              {remaining > 0 
                ? `${remaining} kcal remaining` 
                : `${Math.abs(remaining)} kcal over goal`}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="icon-container food-icon">
                  <Utensils size={18} />
                </div>
                <span>Food</span>
              </div>
              <span className="font-medium">{Math.round(consumed * 0.7)} kcal</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="icon-container drink-icon">
                  <Coffee size={18} />
                </div>
                <span>Drinks</span>
              </div>
              <span className="font-medium">{Math.round(consumed * 0.3)} kcal</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="icon-container activity-icon">
                  <ActivitySquare size={18} />
                </div>
                <span>Activity</span>
              </div>
              <span className="font-medium">-{burned} kcal</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalorieSummary;
