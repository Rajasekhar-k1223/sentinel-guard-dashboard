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
  TrendingUp,
  Monitor,
  FileCheck,
  Package,
  Bug,
  Zap,
  Cloud,
  Brain,
  Wifi
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
    title: "Agent Management",
    url: "/agents",
    icon: Monitor,
  },
  {
    title: "Alerts & SIEM",
    url: "/alerts",
    icon: AlertTriangle,
  },
  {
    title: "File Integrity",
    url: "/fim",
    icon: FileCheck,
  },
  {
    title: "YARA Analysis",
    url: "/yara",
    icon: Search,
  },
  {
    title: "Sandbox",
    url: "/sandbox",
    icon: Package,
  },
  {
    title: "Network Security",
    url: "/network",
    icon: Network,
  },
  {
    title: "Log Analysis",
    url: "/logs",
    icon: FileText,
  },
  {
    title: "Vulnerabilities",
    url: "/vulnerabilities",
    icon: Bug,
  },
  {
    title: "SOAR Automation",
    url: "/soar",
    icon: Zap,
  },
  {
    title: "Cloud Security",
    url: "/cloud",
    icon: Cloud,
  },
  {
    title: "AI Analysis",
    url: "/ai",
    icon: Brain,
  },
  {
    title: "Compliance",
    url: "/compliance",
    icon: Shield,
  },
  {
    title: "Agentless",
    url: "/agentless",
    icon: Wifi,
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