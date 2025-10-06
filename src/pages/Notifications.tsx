import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, XCircle, Trash2, Check } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  category: string;
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: 'NOT-001',
    type: 'error',
    title: 'Critical Threat Detected',
    message: 'Malware detected on WEB-SERVER-01. Immediate action required.',
    timestamp: '2024-01-15 14:30:00',
    read: false,
    category: 'Security Alert',
    actionUrl: '/alerts/ALR-001'
  },
  {
    id: 'NOT-002',
    type: 'warning',
    title: 'Failed Login Attempts',
    message: '5 failed login attempts detected from IP 192.168.1.105',
    timestamp: '2024-01-15 13:45:00',
    read: false,
    category: 'Authentication',
    actionUrl: '/logs'
  },
  {
    id: 'NOT-003',
    type: 'success',
    title: 'Backup Completed',
    message: 'System backup completed successfully. 2.4 GB backed up.',
    timestamp: '2024-01-15 02:00:00',
    read: true,
    category: 'System'
  },
  {
    id: 'NOT-004',
    type: 'info',
    title: 'New Agent Connected',
    message: 'Agent DB-SERVER-03 has been successfully connected.',
    timestamp: '2024-01-14 16:20:00',
    read: true,
    category: 'Agent Management'
  },
  {
    id: 'NOT-005',
    type: 'warning',
    title: 'High CPU Usage',
    message: 'Agent WEB-SERVER-01 reporting 95% CPU usage.',
    timestamp: '2024-01-14 15:10:00',
    read: true,
    category: 'Performance',
    actionUrl: '/agent/AGENT-001'
  }
];

export default function Notifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-critical" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      success: 'default',
      warning: 'secondary',
      error: 'destructive',
      info: 'outline'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => notif.id === id ? { ...notif, read: true } : notif)
    );
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    toast({
      title: "All marked as read",
      description: "All notifications have been marked as read.",
    });
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification deleted",
      description: "The notification has been deleted.",
      variant: "destructive",
    });
  };

  const filteredNotifications = notifications.filter(notif => {
    const matchesCategory = selectedCategory === 'all' || notif.category === selectedCategory;
    const matchesReadStatus = !showUnreadOnly || !notif.read;
    return matchesCategory && matchesReadStatus;
  });

  const categories = Array.from(new Set(notifications.map(n => n.category)));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={handleMarkAllAsRead} className="gap-2">
          <Check className="h-4 w-4" />
          Mark All as Read
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Bell className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{unreadCount}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter(n => n.type === 'error').length}
                </p>
                <p className="text-sm text-muted-foreground">Errors</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {notifications.filter(n => n.type === 'warning').length}
                </p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={showUnreadOnly ? "default" : "outline"}
          onClick={() => setShowUnreadOnly(!showUnreadOnly)}
        >
          {showUnreadOnly ? "Show All" : "Show Unread Only"}
        </Button>
      </div>

      {/* Notifications List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>
            Notifications ({filteredNotifications.length} results)
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between p-4 border rounded-lg transition-colors ${
                  notification.read ? 'border-border/50 bg-background' : 'border-primary/50 bg-primary/5'
                }`}
              >
                <div className="flex items-start gap-4 flex-1">
                  {getTypeIcon(notification.type)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{notification.title}</h3>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">NEW</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{notification.timestamp}</span>
                      <Badge variant="outline" className="text-xs">{notification.category}</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {getTypeBadge(notification.type)}
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  {notification.actionUrl && (
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(notification.id)}
                  >
                    <Trash2 className="h-4 w-4 text-critical" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}
