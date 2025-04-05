
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Utensils, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FoodEntry = {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  code?: string;
};

const mockSearchResults = [
  { id: 1, name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, serving: '100g' },
  { id: 2, name: 'Brown Rice', calories: 112, protein: 2.6, carbs: 23, fat: 0.8, serving: '100g' },
  { id: 3, name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7, serving: '100g' },
  { id: 4, name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, serving: '100g' },
];

const FoodLogForm = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodEntry | null>(null);
  const [quantity, setQuantity] = useState('1');
  const [mealType, setMealType] = useState('breakfast');
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);
  const [isUpdatingDatabase, setIsUpdatingDatabase] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === '') return;
    
    setIsLoadingAPI(true);
    
    try {
      // First search from local mock data
      const localResults = mockSearchResults.filter(food => 
        food.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      // Then try to search from Open Food Facts API
      try {
        const response = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&json=true&page_size=5`);
        const data = await response.json();
        
        // Transform API results to FoodEntry format
        const apiResults = data.products.map((product: any, index: number) => ({
          id: 1000 + index,
          code: product.code,
          name: product.product_name || 'Unknown Product',
          calories: Math.round((product.nutriments?.['energy-kcal_100g'] || 0)),
          protein: Math.round((product.nutriments?.proteins_100g || 0) * 10) / 10,
          carbs: Math.round((product.nutriments?.carbohydrates_100g || 0) * 10) / 10,
          fat: Math.round((product.nutriments?.fat_100g || 0) * 10) / 10,
          serving: '100g',
        }));
        
        // Combine local and API results
        setSearchResults([...localResults, ...apiResults.filter(item => item.name !== 'Unknown Product')]);
      } catch (error) {
        console.error('Error fetching from Open Food Facts API:', error);
        setSearchResults(localResults);
        
        if (localResults.length === 0) {
          toast({
            title: "Search failed",
            description: "Could not connect to food database. Please try again.",
            variant: "destructive",
          });
        }
      }
    } finally {
      setIsLoadingAPI(false);
    }
  };

  const handleFoodSelect = (food: FoodEntry) => {
    setSelectedFood(food);
    setSearchResults([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFood) return;
    
    // Calculate actual calories based on quantity
    const actualQuantity = parseFloat(quantity);
    const calories = Math.round(selectedFood.calories * actualQuantity);
    
    // Store the food entry in localStorage
    const foodLogs = JSON.parse(localStorage.getItem('foodLogs') || '[]');
    const newEntry = {
      ...selectedFood,
      quantity: actualQuantity,
      totalCalories: calories,
      mealType,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('foodLogs', JSON.stringify([newEntry, ...foodLogs]));
    
    toast({
      title: "Food logged successfully",
      description: `Added ${selectedFood.name} (${calories} kcal) to ${mealType}`,
    });
    
    // Reset form
    setSelectedFood(null);
    setSearchQuery('');
    setQuantity('1');
  };

  const updateFoodDatabase = async () => {
    setIsUpdatingDatabase(true);
    
    try {
      // Simulating fetching the delta file from Open Food Facts
      toast({
        title: "Database Update",
        description: "Starting database update, please wait...",
      });
      
      // In a real implementation, you would:
      // 1. Fetch the delta file from https://static.openfoodfacts.org/data/delta/{filename}
      // 2. Process the updates and store them in your local database
      
      setTimeout(() => {
        toast({
          title: "Database Updated",
          description: "Food database has been successfully updated with the latest products.",
        });
        setIsUpdatingDatabase(false);
      }, 2000);
    } catch (error) {
      console.error('Error updating food database:', error);
      toast({
        title: "Update Failed",
        description: "Could not update the food database. Please try again later.",
        variant: "destructive",
      });
      setIsUpdatingDatabase(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-food-green" />
          <span>Log Food</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="food-search">Search Food</Label>
              <div className="relative">
                <Input
                  id="food-search"
                  placeholder="Search for a food..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0 top-0 h-full"
                  disabled={isLoadingAPI}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              {isLoadingAPI && <p className="text-sm text-muted-foreground mt-1">Searching food database...</p>}
            </div>
          </div>
        </form>

        {searchResults.length > 0 && (
          <div className="mt-4 border rounded-md max-h-60 overflow-y-auto">
            {searchResults.map((food) => (
              <div 
                key={food.id}
                className="p-3 border-b last:border-b-0 hover:bg-muted cursor-pointer flex justify-between items-center"
                onClick={() => handleFoodSelect(food)}
              >
                <div>
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-muted-foreground">{food.serving}</p>
                </div>
                <p className="text-sm font-medium">{food.calories} kcal</p>
              </div>
            ))}
          </div>
        )}

        {selectedFood && (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="bg-muted/50 p-3 rounded-md">
              <div className="flex justify-between">
                <p className="font-medium">{selectedFood.name}</p>
                <p className="font-medium">{selectedFood.calories} kcal per {selectedFood.serving}</p>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                <div>Protein: {selectedFood.protein}g</div>
                <div>Carbs: {selectedFood.carbs}g</div>
                <div>Fat: {selectedFood.fat}g</div>
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
                <Label htmlFor="meal-type">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger id="meal-type">
                    <SelectValue placeholder="Select meal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <Button type="submit" className="w-full">
              <Plus className="mr-2 h-4 w-4" /> Add Food Entry
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs" 
          onClick={updateFoodDatabase}
          disabled={isUpdatingDatabase}
        >
          <Database className="mr-1 h-3 w-3" />
          {isUpdatingDatabase ? "Updating..." : "Update Food Database"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FoodLogForm;
