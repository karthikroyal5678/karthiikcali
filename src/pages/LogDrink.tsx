import React, { useState } from 'react';
import PageLayout from '@/components/shared/PageLayout';
import FoodLogForm from '@/components/Food/FoodLogForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getProductByBarcode } from '@/utils/openFoodFactsApi';
import { Barcode } from 'lucide-react';

const LogFood = () => {
  const { toast } = useToast();
  const [barcode, setBarcode] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [productDetails, setProductDetails] = useState<{
    name: string;
    imageUrl: string | null;
  } | null>(null);

  const handleFetchByBarcode = async () => {
    if (!barcode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid barcode',
        variant: 'destructive',
      });
      return;
    }

    setIsFetching(true);

    try {
      const product = await getProductByBarcode(barcode);

      console.log('Fetched product:', product); // Debugging: Log the fetched product

      if (product) {
        toast({
          title: 'Product Found',
          description: `Product: ${product.product_name}`,
        });
        setProductDetails({
          name: product.product_name || 'Unknown Product',
          imageUrl: product.image_url || '/assets/placeholder-image.png', // Fallback to a placeholder image
        });
      } else {
        toast({
          title: 'No Product Found',
          description: 'No product found for the entered barcode.',
          variant: 'destructive',
        });
        setProductDetails(null);
      }
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching the product.',
        variant: 'destructive',
      });
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Log Food</h1>
          <p className="text-muted-foreground">Track what you eat and monitor your calorie intake</p>
        </div>

        <Tabs defaultValue="log">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-4">
            <TabsTrigger value="log">Log Food</TabsTrigger>
            <TabsTrigger value="admin">Admin Tools</TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="max-w-lg mx-auto">
            <FoodLogForm />
          </TabsContent>

          <TabsContent value="admin" className="max-w-lg mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Barcode className="h-5 w-5" />
                  <span>Search by Barcode</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter barcode"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                  />
                  <Button
                    onClick={handleFetchByBarcode}
                    className="w-full"
                    disabled={isFetching || !barcode.trim()}
                  >
                    {isFetching ? 'Fetching...' : 'Fetch Product'}
                  </Button>

                  {productDetails && (
                    <div className="mt-4">
                      <h2 className="text-lg font-bold">Product Details</h2>
                      <div className="flex items-center gap-4 mt-2">
                        <img
                          src={productDetails.imageUrl}
                          alt={productDetails.name}
                          className="w-16 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/placeholder-image.png'; // Fallback to placeholder on error
                          }}
                        />
                        <p className="font-medium">{productDetails.name}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default LogFood;
