
import React from "react";
import { 
  Home, 
  Camera, 
  Utensils, 
  Coffee, 
  BarChart, 
  UserCircle, 
  Settings, 
  CreditCard
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const location = useLocation();
  
  const mainMenuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: Home,
    },
    {
      title: "Scan Food",
      path: "/scan",
      icon: Camera,
    },
    {
      title: "Log Food",
      path: "/log-food",
      icon: Utensils,
    },
    {
      title: "Log Drink",
      path: "/log-drink",
      icon: Coffee,
    },
    {
      title: "Activity",
      path: "/activity",
      icon: BarChart,
    },
  ];

  const accountMenuItems = [
    {
      title: "Profile",
      path: "/profile",
      icon: UserCircle,
    },
    {
      title: "Settings",
      path: "/settings",
      icon: Settings,
    },
    {
      title: "Subscription",
      path: "/subscription",
      icon: CreditCard,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary/90 p-1 text-primary-foreground">
            <Utensils size={24} />
          </div>
          <span className="font-bold text-xl">FoodieScope</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountMenuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.path} className="flex items-center gap-3">
                        <item.icon size={18} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="text-xs text-muted-foreground text-center">
          FoodieScope v1.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
