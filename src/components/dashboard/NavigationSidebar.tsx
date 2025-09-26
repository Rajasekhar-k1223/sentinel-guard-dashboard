import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Server, 
  AlertTriangle, 
  Search, 
  Settings,
  Target,
  Network,
  FileText,
  TrendingUp
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import sentinelLogo from '@/assets/sentinel-logo.jpg';

const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: TrendingUp,
  },
  {
    title: "Alerts & Threats",
    url: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "Endpoint Security",
    url: "/endpoints",
    icon: Shield,
  },
  {
    title: "Infrastructure",
    url: "/infrastructure",
    icon: Server,
  },
  {
    title: "Network Security",
    url: "/network",
    icon: Network,
  },
  {
    title: "SIEM Logs",
    url: "/siem",
    icon: FileText,
  },
  {
    title: "Threat Hunting",
    url: "/hunting",
    icon: Target,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
];

const settingsItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function NavigationSidebar() {
  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-6">
        <div className="flex items-center space-x-3">
          <img 
            src={sentinelLogo} 
            alt="SentinelAI" 
            className="w-10 h-10 rounded-lg"
          />
          <div>
            <h2 className="text-xl font-bold text-primary">SentinelAI</h2>
            <p className="text-xs text-muted-foreground">Security Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Security Monitoring</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary/20 text-primary border border-primary/30 glow-primary' 
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive 
                            ? 'bg-primary/20 text-primary border border-primary/30 glow-primary' 
                            : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}