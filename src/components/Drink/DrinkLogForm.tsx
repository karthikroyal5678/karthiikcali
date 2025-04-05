
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Coffee } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type DrinkEntry = {
  id: number;
  name: string;
  calories: number;
  sugar: number;
  serving: string;
};

const mockSearchResults = [
  { id: 1, name: 'Coffee (black)', calories: 2, sugar: 0, serving: '240ml' },
  { id: 2, name: 'Orange Juice', calories: 110, sugar: 22, serving: '240ml' },
  { id: 3, name: 'Green Tea', calories: 0, sugar: 0, serving: '240ml' },
  { id: 4, name: 'Cola', calories: 140, sugar: 39, serving: '330ml' },
  { id: 5, name: 'Latte', calories: 120, sugar: 10, serving: '240ml' },
];

const DrinkLogForm = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DrinkEntry[]>([]);
  const [selectedDrink, setSelectedDrink] = useState<DrinkEntry | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [timeOfDay, setTimeOfDay] = useState('morning');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    // Simulate API search
    setSearchResults(mockSearchResults.filter(drink => 
      drink.name.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  };

  const handleDrinkSelect = (drink: DrinkEntry) => {
    setSelectedDrink(drink);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDrink) return;
    
    // Calculate actual calories based on quantity
    const actualQuantity = parseFloat(quantity);
    const calories = Math.round(selectedDrink.calories * actualQuantity);
    
    toast({
      title: "Drink logged successfully",
      description: `Added ${selectedDrink.name} (${calories} kcal) - ${timeOfDay}`,
    });
    
    // Reset form
    setSelectedDrink(null);
    setSearchQuery('');
    setQuantity('1');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-drink-blue" />
          <span>Log Drink</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="drink-search">Search Drink</Label>
              <div className="relative">
                <Input
                  id="drink-search"
                  placeholder="Search for a drink..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 border rounded-md max-h-60 overflow-y-auto">
            {searchResults.map((drink) => (
              <div 
                key={drink.id}
                className="p-3 border-b last:border-b-0 hover:bg-muted cursor-pointer flex justify-between items-center"
                onClick={() => handleDrinkSelect(drink)}
              >
                <div>
                  <p className="font-medium">{drink.name}</p>
                  <p className="text-sm text-muted-foreground">{drink.serving}</p>
                </div>
                <p className="text-sm font-medium">{drink.calories} kcal</p>
              </div>
            ))}
          </div>
        )}

        {selectedDrink && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">{selectedDrink.name}</p>
                <p className="font-medium">{selectedDrink.calories} kcal per {selectedDrink.serving}</p>
              </div>
              <div className="mt-2 text-sm">
                <div>Sugar: {selectedDrink.sugar}g</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Servings</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0.25"
                  step="0.25"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time-of-day">Time of Day</Label>
                <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                  <SelectTrigger id="time-of-day">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning</SelectItem>
                    <SelectItem value="afternoon">Afternoon</SelectItem>
                    <SelectItem value="evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Drink Entry
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default DrinkLogForm;
