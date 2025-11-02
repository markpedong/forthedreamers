//@ts-nocheck
'use client';

import { useState } from 'react';
import { Shield, Key, Lock, Monitor, LogOut, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const initialSessions = [
  {
    id: '1',
    device: 'Chrome on MacOS',
    location: 'San Francisco, CA',
    lastActive: '2024-01-15 10:30 AM',
    status: 'Active',
  },
  {
    id: '2',
    device: 'Safari on iPhone',
    location: 'Los Angeles, CA',
    lastActive: '2024-01-14 03:20 PM',
    status: 'Active',
  },
  {
    id: '3',
    device: 'Firefox on Windows',
    location: 'New York, NY',
    lastActive: '2024-01-12 08:15 AM',
    status: 'Inactive',
  },
];

const auditLogs = [
  {
    id: '1',
    action: 'Login',
    timestamp: '2024-01-15 10:30 AM',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    id: '2',
    action: 'Product Updated',
    timestamp: '2024-01-15 09:45 AM',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    id: '3',
    action: 'User Deleted',
    timestamp: '2024-01-14 03:20 PM',
    ip: '192.168.1.1',
    status: 'Success',
  },
  {
    id: '4',
    action: 'Failed Login',
    timestamp: '2024-01-13 05:10 PM',
    ip: '203.0.113.42',
    status: 'Failed',
  },
];

export default function SecurityPage() {
  const [sessions, setSessions] = useState(initialSessions);
  const [twoFAEnabled, setTwoFAEnabled] = useState(true);
  const [toast, setToast] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const handleUpdateTwoFA = (checked) => {
    setTwoFAEnabled(checked);
    showNotification(`Two-Factor Authentication ${checked ? 'enabled' : 'disabled'}`);
  };

  const handleUpdate2FASettings = () => {
    showNotification('Opening 2FA settings dialog');
  };

  const handleManageAPIKeys = () => {
    showNotification('Opening API key management');
  };

  const handleChangePassword = () => {
    showNotification('Password change initiated');
  };

  const handleManageDevices = () => {
    showNotification('Opening device management');
  };

  const handleLogoutSession = (sessionId) => {
    setSessions(sessions.filter((s) => s.id !== sessionId));
    showNotification('Session logged out successfully');
  };

  const handleViewLogDetails = (log) => {
    setSelectedLog(log);
    showNotification(`Viewing audit log: ${log.action}`);
  };

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Security</h1>
        <p className='text-muted-foreground mt-1'>Manage your account security and sessions</p>
      </div>

      {/* Security Settings */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Shield className='w-5 h-5' />
              Two-Factor Authentication
            </CardTitle>
            <CardDescription>Add an extra layer of security</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-sm'>Status</p>
                <p className='text-sm text-muted-foreground'>
                  {twoFAEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <Switch checked={twoFAEnabled} onCheckedChange={handleUpdateTwoFA} />
            </div>
            <Button className='w-full' onClick={handleUpdate2FASettings}>
              Update 2FA Settings
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Key className='w-5 h-5' />
              API Keys
            </CardTitle>
            <CardDescription>Manage your API credentials</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='font-medium text-sm'>Active Keys</p>
              <p className='text-sm text-muted-foreground'>2 active keys</p>
            </div>
            <Button
              className='w-full bg-transparent'
              variant='outline'
              onClick={handleManageAPIKeys}
            >
              <Download className='w-4 h-4 mr-2' />
              Manage API Keys
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lock className='w-5 h-5' />
              Password
            </CardTitle>
            <CardDescription>Change your account password</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='font-medium text-sm'>Last Changed</p>
              <p className='text-sm text-muted-foreground'>30 days ago</p>
            </div>
            <Button
              className='w-full bg-transparent'
              variant='outline'
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Monitor className='w-5 h-5' />
              Trusted Devices
            </CardTitle>
            <CardDescription>Manage your trusted devices</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div>
              <p className='font-medium text-sm'>Devices</p>
              <p className='text-sm text-muted-foreground'>3 trusted devices</p>
            </div>
            <Button
              className='w-full bg-transparent'
              variant='outline'
              onClick={handleManageDevices}
            >
              Manage Devices
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
          <CardDescription>Manage your active sessions across devices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Device</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((session) => (
                  <TableRow key={session.id}>
                    <TableCell className='font-medium'>{session.device}</TableCell>
                    <TableCell>{session.location}</TableCell>
                    <TableCell>{session.lastActive}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          session.status === 'Active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}
                      >
                        {session.status}
                      </span>
                    </TableCell>
                    <TableCell className='text-right'>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='text-destructive'
                        onClick={() => handleLogoutSession(session.id)}
                      >
                        <LogOut className='w-4 h-4 mr-1' />
                        Logout
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Recent admin activity and changes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow
                    key={log.id}
                    className='cursor-pointer hover:bg-muted/50'
                    onClick={() => handleViewLogDetails(log)}
                  >
                    <TableCell className='font-medium'>{log.action}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.status === 'Success'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Details Modal */}
      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Audit Log Details</DialogTitle>
              <DialogDescription>Log ID: {selectedLog.id}</DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <p className='text-sm text-muted-foreground'>Action</p>
                  <p className='font-medium'>{selectedLog.action}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Status</p>
                  <p className='font-medium'>{selectedLog.status}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>Timestamp</p>
                  <p className='font-medium'>{selectedLog.timestamp}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground'>IP Address</p>
                  <p className='font-medium'>{selectedLog.ip}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </div>
  );
}
