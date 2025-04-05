// src/services/edamamApi.ts
import axios from 'axios';

// Updated interface to include protein and fats
interface NutritionData {
  name: string;
  calories: number;
  protein: number; // In grams
  fats: number;    // In grams
}

const EDAMAM_APP_ID = '';
const EDAMAM_APP_KEY = ' ';   // Replace with your Edamam App Key
const EDAMAM_API_URL = 'https://api.edamam.com/api/nutrition-data';

export async function getNutritionData(foodItem: string): Promise<NutritionData> {
  try {
    const response = await axios.get(EDAMAM_API_URL, {
      params: {
        app_id: EDAMAM_APP_ID,
        app_key: EDAMAM_APP_KEY,
        ingr: foodItem, // Ingredient name (e.g., "1 cup rice")
      },
    });

    // Extract nutrient data from the response
    const nutrients = response.data.totalNutrients || {};
    const calories = nutrients.ENERC_KCAL?.quantity || 0; // Energy in kcal
    const protein = nutrients.PROCNT?.quantity || 0;      // Protein in grams
    const fats = nutrients.FAT?.quantity || 0;            // Fats in grams

    return {
      name: foodItem,
      calories: Math.round(calories),
      protein: Number(protein.toFixed(1)), // Round to 1 decimal place
      fats: Number(fats.toFixed(1)),       // Round to 1 decimal place
    };
  } catch (error) {
    console.error(`Error fetching nutrition data for ${foodItem}:`, error);
    // Fallback values if the API fails
    return {
      name: foodItem,
      calories: 0,
      protein: 0,
      fats: 0,
    };
  }
}
