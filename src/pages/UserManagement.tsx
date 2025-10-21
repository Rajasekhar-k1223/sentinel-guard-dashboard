import React, { useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield, Mail, Phone, Search, Filter, Eye, Clock, Building } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'viewer' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  department: string;
  phone?: string;
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Admin User',
    email: 'admin@sentinel.ai',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30:00',
    department: 'Security Operations',
    phone: '+1 (555) 123-4567',
    createdAt: '2023-01-15'
  },
  {
    id: 'USR-002',
    name: 'Security Analyst',
    email: 'analyst@sentinel.ai',
    role: 'analyst',
    status: 'active',
    lastLogin: '2024-01-15 12:15:00',
    department: 'SOC Team',
    phone: '+1 (555) 234-5678',
    createdAt: '2023-03-20'
  },
  {
    id: 'USR-003',
    name: 'Enterprise User',
    email: 'enterprise@company.com',
    role: 'enterprise',
    status: 'active',
    lastLogin: '2024-01-14 16:45:00',
    department: 'IT Operations',
    createdAt: '2023-06-10'
  },
  {
    id: 'USR-004',
    name: 'Viewer User',
    email: 'viewer@company.com',
    role: 'viewer',
    status: 'inactive',
    lastLogin: '2024-01-10 09:20:00',
    department: 'Management',
    createdAt: '2023-08-05'
  }
];

export default function UserManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getRoleBadge = (role: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      admin: 'destructive',
      analyst: 'default',
      enterprise: 'secondary',
      viewer: 'outline'
    };
    return (
      <Badge variant={variants[role] || 'outline'}>
        {role.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      active: 'default',
      inactive: 'secondary',
      suspended: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleAddUser = () => {
    toast({
      title: "User Added",
      description: "New user has been added successfully.",
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "User Deleted",
      description: `User ${userId} has been deleted.`,
      variant: "destructive",
    });
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setDetailsDialogOpen(true);
  };

  const userStats = {
    total: mockUsers.length,
    active: mockUsers.filter(u => u.status === 'active').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
    analysts: mockUsers.filter(u => u.role === 'analyst').length,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Security Operations" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select defaultValue="viewer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="analyst">Analyst</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleAddUser} className="w-full">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.active}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.admins}</p>
                <p className="text-sm text-muted-foreground">Administrators</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.analysts}</p>
                <p className="text-sm text-muted-foreground">Analysts</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="analyst">Analyst</SelectItem>
            <SelectItem value="enterprise">Enterprise</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Users ({filteredUsers.length} results)</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{user.name}</h3>
                      <Badge variant="outline" className="text-xs">{user.id}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </span>
                      {user.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {user.phone}
                        </span>
                      )}
                      <span>{user.department}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last login: {user.lastLogin} • Created: {user.createdAt}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {getRoleBadge(user.role)}
                  {getStatusBadge(user.status)}
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleViewUser(user)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4 text-critical" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* User Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Comprehensive user account information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">User ID</p>
                  <p className="font-medium">{selectedUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedUser.email}
                  </p>
                </div>
                {selectedUser.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedUser.phone}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium flex items-center gap-1">
                    <Building className="h-3 w-3" />
                    {selectedUser.department}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Role</p>
                  <div className="mt-1">
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedUser.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedUser.lastLogin}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Permissions & Access</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  {selectedUser.role === 'admin' && (
                    <>
                      <p>• Full system access</p>
                      <p>• User management</p>
                      <p>• Configuration changes</p>
                      <p>• Audit log access</p>
                    </>
                  )}
                  {selectedUser.role === 'analyst' && (
                    <>
                      <p>• View all security alerts</p>
                      <p>• Manage incidents</p>
                      <p>• Run scans and reports</p>
                      <p>• Read-only configuration</p>
                    </>
                  )}
                  {selectedUser.role === 'viewer' && (
                    <>
                      <p>• View dashboard</p>
                      <p>• Read-only access to alerts</p>
                      <p>• View reports</p>
                      <p>• No configuration access</p>
                    </>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Activity Summary</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Login count (30 days): 47</p>
                  <p>• Actions performed: 156</p>
                  <p>• Alerts reviewed: 89</p>
                  <p>• Reports generated: 12</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
