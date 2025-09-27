import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database, Key, Mail, Globe } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [slackNotifications, setSlackNotifications] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure system settings and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                User Profile
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" defaultValue="Security" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" defaultValue="Admin" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="admin@company.com" defaultValue="admin@sentinelai.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="utc">
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="utc">UTC</SelectItem>
                    <SelectItem value="est">Eastern Time</SelectItem>
                    <SelectItem value="pst">Pacific Time</SelectItem>
                    <SelectItem value="gmt">GMT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button>Save Changes</Button>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                System Configuration
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input id="organizationName" placeholder="Your Organization" defaultValue="SentinelAI Security" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input id="sessionTimeout" type="number" placeholder="30" defaultValue="60" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logRetention">Log Retention (days)</Label>
                <Input id="logRetention" type="number" placeholder="90" defaultValue="365" />
              </div>
              <Button>Update Configuration</Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                </div>
                <Switch checked={slackNotifications} onCheckedChange={setSlackNotifications} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alertThreshold">Alert Severity Threshold</Label>
                <Select defaultValue="medium">
                  <SelectTrigger>
                    <SelectValue placeholder="Select threshold" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low and above</SelectItem>
                    <SelectItem value="medium">Medium and above</SelectItem>
                    <SelectItem value="high">High and above</SelectItem>
                    <SelectItem value="critical">Critical only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input id="webhookUrl" placeholder="https://your-webhook-url.com" />
              </div>

              <Button>Save Notification Settings</Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordPolicy">Password Policy</Label>
                <Select defaultValue="strong">
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic (8 characters)</SelectItem>
                    <SelectItem value="strong">Strong (12 characters, mixed case, numbers, symbols)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (16 characters, complex requirements)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Failed Login Attempts</Label>
                <Input id="loginAttempts" type="number" placeholder="5" defaultValue="3" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ipWhitelist">IP Whitelist</Label>
                <Input id="ipWhitelist" placeholder="192.168.1.0/24, 10.0.0.0/8" />
              </div>

              <Button>Update Security Settings</Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                External Integrations
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Slack Integration</h3>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channels</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Microsoft Teams</h3>
                    <p className="text-sm text-muted-foreground">Integrate with Teams for notifications</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">SIEM Integration</h3>
                    <p className="text-sm text-muted-foreground">Export logs to external SIEM</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <h3 className="font-medium">Active Directory</h3>
                    <p className="text-sm text-muted-foreground">LDAP/AD authentication</p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                SMTP Configuration
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtpServer">SMTP Server</Label>
                <Input id="smtpServer" placeholder="smtp.gmail.com" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">Port</Label>
                  <Input id="smtpPort" placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpSecurity">Security</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger>
                      <SelectValue placeholder="Select security" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpUsername">Username</Label>
                <Input id="smtpUsername" placeholder="your-email@domain.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPassword">Password</Label>
                <Input id="smtpPassword" type="password" placeholder="Your SMTP password" />
              </div>
              <Button>Test & Save SMTP Settings</Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Backup & Recovery
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Enable scheduled database backups</p>
                </div>
                <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupFrequency">Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                <Input id="backupRetention" type="number" placeholder="30" defaultValue="90" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupLocation">Backup Location</Label>
                <Input id="backupLocation" placeholder="/var/backups/sentinelai" defaultValue="/opt/sentinelai/backups" />
              </div>

              <div className="flex gap-2">
                <Button>Save Backup Settings</Button>
                <Button variant="outline">Backup Now</Button>
                <Button variant="outline">Restore</Button>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle>Recent Backups</SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent>
              <div className="space-y-3">
                {[
                  { date: '2024-01-15 02:00:00', size: '2.4 GB', status: 'Success' },
                  { date: '2024-01-14 02:00:00', size: '2.3 GB', status: 'Success' },
                  { date: '2024-01-13 02:00:00', size: '2.2 GB', status: 'Success' },
                  { date: '2024-01-12 02:00:00', size: '2.1 GB', status: 'Failed' },
                ].map((backup, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{backup.date}</p>
                      <p className="text-sm text-muted-foreground">{backup.size}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${backup.status === 'Success' ? 'text-success' : 'text-critical'}`}>
                        {backup.status}
                      </span>
                      <Button variant="ghost" size="sm">Download</Button>
                    </div>
                  </div>
                ))}
              </div>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}