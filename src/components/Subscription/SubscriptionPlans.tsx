
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SubscriptionPlans = () => {
  const { toast } = useToast();
  
  const handleSubscribe = (plan: string) => {
    toast({
      title: "Subscription selected",
      description: `You've selected the ${plan} plan. Payment processing coming soon!`,
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Subscription Plans</h2>
        <p className="text-muted-foreground">Unlock premium features to maximize your health journey</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Plan */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-8">
            <CardTitle className="text-xl">Monthly Plan</CardTitle>
            <CardDescription>Perfect for trying out premium features</CardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">$10</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>AI-powered food & drink recognition</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Advanced nutrition insights</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Barcode scanning for easy tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Sync across all your devices</span>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleSubscribe('monthly')}>
              <CreditCard className="mr-2 h-4 w-4" /> Subscribe Monthly
            </Button>
          </CardFooter>
        </Card>
        
        {/* Yearly Plan */}
        <Card className="relative overflow-hidden border-primary">
          <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
            Best Value
          </div>
          <CardHeader className="pb-8">
            <CardTitle className="text-xl">Yearly Plan</CardTitle>
            <CardDescription>Save $40 with our annual subscription</CardDescription>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-3xl font-bold">$80</span>
              <span className="text-muted-foreground">/year</span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>All features from Monthly Plan</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Premium analytics and insights</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <strong>Save $40 compared to monthly billing</strong>
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => handleSubscribe('yearly')}>
              <CreditCard className="mr-2 h-4 w-4" /> Subscribe Yearly
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
