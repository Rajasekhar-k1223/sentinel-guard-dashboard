import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
  Wifi,
  LogOut,
  User,
  Bell,
  Users,
  BookOpen,
  BarChart,
  ClipboardList,
  FileWarning,
  Database
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
  SidebarFooter,
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
  {
    title: "Threat Intelligence",
    url: "/threat-intelligence",
    icon: Database,
  },
  {
    title: "Incidents",
    url: "/incidents",
    icon: ClipboardList,
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart,
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: FileWarning,
  },
];

const settingsItems = [
  {
    title: "User Management",
    url: "/users",
    icon: Users,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function NavigationSidebar() {
  const { user, logout } = useAuth();

  const getVisibleItems = () => {
    if (!user) return [];
    
    // Role-based navigation filtering
    const baseItems = navigationItems.filter(item => {
      switch (user.role) {
        case 'admin':
          return true; // Admin sees everything
        case 'enterprise':
          return !['fim', 'yara'].includes(item.url.slice(1)); // Enterprise excludes some advanced features
        case 'analyst':
          return !['settings'].includes(item.url.slice(1)); // Analyst excludes settings
        case 'viewer':
          return ['/', '/alerts', '/logs', '/ai'].includes(item.url); // Viewer has limited access
        default:
          return false;
      }
    });
    
    return baseItems;
  };

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
              {getVisibleItems().map((item) => (
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

        {(user?.role === 'admin' || user?.role === 'enterprise') && (
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
        )}
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="p-3 rounded-lg bg-card border border-border/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role} Role</p>
            </div>
          </div>
          {user?.organization && (
            <p className="text-xs text-muted-foreground truncate mb-3 px-1">
              {user.organization}
            </p>
          )}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="w-full justify-start h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-3 w-3 mr-2" />
            Sign Out
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}