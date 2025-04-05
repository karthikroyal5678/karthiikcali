
// Open Food Facts API utilities

export interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  nutriments: {
    'energy-kcal_100g'?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    salt_100g?: number;
  };
  image_url?: string;
  brands?: string;
  quantity?: string;
}

export interface ProductSearchResult {
  page: number;
  count: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
}

// Search for products in the Open Food Facts database
export const searchProducts = async (query: string, pageSize = 5): Promise<ProductSearchResult> => {
  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(query)}&json=true&page_size=${pageSize}`
  );

  if (!response.ok) {
    throw new Error(`Open Food Facts search failed with status: ${response.status}`);
  }

  return await response.json();
};

// Get product details by barcode
export const getProductByBarcode = async (barcode: string): Promise<OpenFoodFactsProduct> => {
  const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
  
  if (!response.ok) {
    throw new Error(`Failed to get product with barcode ${barcode}`);
  }
  
  const data = await response.json();
  return data.product;
};

// Process delta updates
export const processDeltaUpdates = async (filename: string): Promise<boolean> => {
  try {
    // In a real implementation, you would download and process the delta file
    console.log(`Processing delta file: ${filename}`);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return true;
  } catch (error) {
    console.error('Error processing delta updates:', error);
    return false;
  }
};

// Helper to format nutrition data
export const formatNutrimentValue = (value: number | undefined, precision = 1): string => {
  if (value === undefined) return 'N/A';
  return value.toFixed(precision);
};
