
import React from 'react';
import PageLayout from '@/components/shared/PageLayout';
import SubscriptionPlans from '@/components/Subscription/SubscriptionPlans';

const Subscription = () => {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription</h1>
          <p className="text-muted-foreground">Upgrade your FoodieScope experience with premium features</p>
        </div>
        
        <SubscriptionPlans />
      </div>
    </PageLayout>
  );
};

export default Subscription;
