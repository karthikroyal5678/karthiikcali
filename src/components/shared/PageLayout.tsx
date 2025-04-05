
import React from 'react';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from '@/components/Layout/AppSidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider defaultOpen={!isMobile} className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex-1 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <SidebarTrigger />
          </div>
          <div>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <UserCircle size={20} />
                <span className="hidden md:inline">Sign In</span>
              </Button>
            </Link>
          </div>
        </div>
        <main>
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PageLayout;
