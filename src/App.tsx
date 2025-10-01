import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavigationSidebar } from "@/components/dashboard/NavigationSidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import AgentManagement from "./pages/AgentManagement";
import AgentDetail from "./pages/AgentDetail";
import AddAgent from "./pages/AddAgent";
import AgentlessDetail from "./pages/AgentlessDetail";
import AddAgentless from "./pages/AddAgentless";
import FileIntegrityMonitoring from "./pages/FileIntegrityMonitoring";
import YaraAnalysis from "./pages/YaraAnalysis";
import AlertsSIEM from "./pages/AlertsSIEM";
import Sandbox from "./pages/Sandbox";
import NetworkSecurity from "./pages/NetworkSecurity";
import LogAnalysis from "./pages/LogAnalysis";
import Vulnerabilities from "./pages/Vulnerabilities";
import SOARAutomation from "./pages/SOARAutomation";
import CloudSecurity from "./pages/CloudSecurity";
import AIAnalysis from "./pages/AIAnalysis";
import TrainModel from "./pages/TrainModel";
import ViewInsight from "./pages/ViewInsight";
import ViewModel from "./pages/ViewModel";
import Compliance from "./pages/Compliance";
import Agentless from "./pages/Agentless";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/*" element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="min-h-screen flex w-full bg-background">
                    <NavigationSidebar />
                    <main className="flex-1 overflow-auto">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/agents" element={<AgentManagement />} />
                        <Route path="/agent/:id" element={<AgentDetail />} />
                        <Route path="/add-agent" element={<AddAgent />} />
                        <Route path="/agentless/:id" element={<AgentlessDetail />} />
                        <Route path="/add-agentless" element={<AddAgentless />} />
                        <Route path="/alerts" element={<AlertsSIEM />} />
                        <Route path="/fim" element={<FileIntegrityMonitoring />} />
                        <Route path="/yara" element={<YaraAnalysis />} />
                        <Route path="/sandbox" element={<Sandbox />} />
                        <Route path="/network" element={<NetworkSecurity />} />
                        <Route path="/logs" element={<LogAnalysis />} />
                        <Route path="/vulnerabilities" element={<Vulnerabilities />} />
                        <Route path="/soar" element={<SOARAutomation />} />
                        <Route path="/cloud" element={<CloudSecurity />} />
                        <Route path="/ai" element={<AIAnalysis />} />
                        <Route path="/train-model" element={<TrainModel />} />
                        <Route path="/view-insight/:id" element={<ViewInsight />} />
                        <Route path="/view-model/:id" element={<ViewModel />} />
                        <Route path="/compliance" element={<Compliance />} />
                        <Route path="/agentless" element={<Agentless />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </main>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
