
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Utensils, Coffee, Activity } from 'lucide-react';

// Mock data for recent entries
const recentEntries = [
  {
    id: 1,
    name: 'Chicken Salad',
    calories: 450,
    time: '1:30 PM',
    type: 'food',
  },
  {
    id: 2,
    name: 'Coffee with Milk',
    calories: 120,
    time: '10:15 AM',
    type: 'drink',
  },
  {
    id: 3,
    name: 'Walking',
    calories: -150,
    time: '8:30 AM',
    duration: '30 min',
    type: 'activity',
  },
  {
    id: 4,
    name: 'Orange Juice',
    calories: 110,
    time: '7:45 AM',
    type: 'drink',
  },
  {
    id: 5,
    name: 'Breakfast Burrito',
    calories: 520,
    time: '7:30 AM',
    type: 'food',
  },
];

const RecentEntries = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'food':
        return <div className="icon-container food-icon"><Utensils size={18} /></div>;
      case 'drink':
        return <div className="icon-container drink-icon"><Coffee size={18} /></div>;
      case 'activity':
        return <div className="icon-container activity-icon"><Activity size={18} /></div>;
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Entries</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentEntries.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getIcon(entry.type)}
                <div>
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">{entry.time}</p>
                </div>
              </div>
              <span className={`font-medium ${entry.calories < 0 ? 'text-activity-orange' : ''}`}>
                {entry.calories > 0 ? `+${entry.calories}` : entry.calories} kcal
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
