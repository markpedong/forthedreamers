//@ts-nocheck
'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
  const [toast, setToast] = useState('');
  const [storeInfo, setStoreInfo] = useState({
    name: 'My Ecommerce Store',
    email: 'store@example.com',
    description: 'A premium ecommerce platform for selling products online.',
    currency: 'USD',
    timezone: 'EST',
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    payments: true,
    userActivity: true,
    systemUpdates: true,
  });

  const [taxSettings, setTaxSettings] = useState({
    taxRate: '8.5%',
    taxId: '12-3456789',
    shippingTax: '5%',
  });

  const [apiSettings, setApiSettings] = useState({
    apiKey: 'sk_live_xxxxxxxxxxxx',
    webhookUrl: 'https://your-domain.com/webhooks',
  });

  const handleSaveStoreInfo = () => {
    showNotification('Store information saved successfully');
  };

  const handleSaveNotifications = () => {
    showNotification('Notification preferences saved');
  };

  const handleSaveTaxSettings = () => {
    showNotification('Tax settings updated');
  };

  const handleSaveAPISettings = () => {
    showNotification('API settings saved');
  };

  const handleToggleNotification = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const showNotification = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <div className='p-6 space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Settings</h1>
        <p className='text-muted-foreground mt-1'>Manage your store configuration</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue='store' className='w-full'>
        <TabsList className='grid w-full grid-cols-4'>
          <TabsTrigger value='store'>Store Info</TabsTrigger>
          <TabsTrigger value='notifications'>Notifications</TabsTrigger>
          <TabsTrigger value='tax'>Tax Settings</TabsTrigger>
          <TabsTrigger value='api'>API Keys</TabsTrigger>
        </TabsList>

        {/* Store Info */}
        <TabsContent value='store' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Basic store details</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Store Name</label>
                  <Input
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                    className='mt-2'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Store Email</label>
                  <Input
                    type='email'
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                    className='mt-2'
                  />
                </div>
              </div>
              <div>
                <label className='text-sm font-medium'>Store Description</label>
                <Textarea
                  value={storeInfo.description}
                  onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                  className='mt-2'
                />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <label className='text-sm font-medium'>Store Currency</label>
                  <Input
                    value={storeInfo.currency}
                    onChange={(e) => setStoreInfo({ ...storeInfo, currency: e.target.value })}
                    className='mt-2'
                  />
                </div>
                <div>
                  <label className='text-sm font-medium'>Store Timezone</label>
                  <Input
                    value={storeInfo.timezone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, timezone: e.target.value })}
                    className='mt-2'
                  />
                </div>
              </div>
              <Button onClick={handleSaveStoreInfo}>
                <Save className='w-4 h-4 mr-2' />
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value='notifications' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-4'>
                {[
                  {
                    key: 'newOrders',
                    label: 'New Order Notifications',
                    description: 'Get notified when a new order is placed',
                  },
                  {
                    key: 'lowStock',
                    label: 'Low Stock Alerts',
                    description: 'Receive alerts when products run low on stock',
                  },
                  {
                    key: 'payments',
                    label: 'Payment Notifications',
                    description: 'Get notified of payment events',
                  },
                  {
                    key: 'userActivity',
                    label: 'User Activity',
                    description: 'Receive updates on user activities',
                  },
                  {
                    key: 'systemUpdates',
                    label: 'System Updates',
                    description: 'Get notified about system maintenance',
                  },
                ].map((item) => (
                  <div key={item.key} className='flex items-center justify-between'>
                    <div>
                      <p className='font-medium text-sm'>{item.label}</p>
                      <p className='text-xs text-muted-foreground'>{item.description}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={() => handleToggleNotification(item.key)}
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveNotifications}>
                <Save className='w-4 h-4 mr-2' />
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value='tax' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax rules for your store</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                {[
                  { key: 'taxRate', label: 'Tax Rate', placeholder: 'e.g. 8.5%' },
                  { key: 'taxId', label: 'Tax ID', placeholder: 'Your tax identification number' },
                  { key: 'shippingTax', label: 'Shipping Tax', placeholder: 'Shipping tax rate' },
                ].map((field) => (
                  <div key={field.key}>
                    <label className='text-sm font-medium'>{field.label}</label>
                    <Input
                      placeholder={field.placeholder}
                      value={taxSettings[field.key]}
                      onChange={(e) =>
                        setTaxSettings({ ...taxSettings, [field.key]: e.target.value })
                      }
                      className='mt-2'
                    />
                  </div>
                ))}
              </div>
              <Button onClick={handleSaveTaxSettings}>
                <Save className='w-4 h-4 mr-2' />
                Save Tax Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys */}
        <TabsContent value='api' className='space-y-4'>
          <Card>
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage your API keys and webhooks</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <label className='text-sm font-medium'>API Key</label>
                <Input value={apiSettings.apiKey} className='mt-2' disabled />
              </div>
              <div>
                <label className='text-sm font-medium'>Webhook URL</label>
                <Input
                  placeholder='https://your-domain.com/webhooks'
                  value={apiSettings.webhookUrl}
                  onChange={(e) => setApiSettings({ ...apiSettings, webhookUrl: e.target.value })}
                  className='mt-2'
                />
              </div>
              <Button onClick={handleSaveAPISettings}>
                <Save className='w-4 h-4 mr-2' />
                Update API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Toast notification */}
      {toast && (
        <div className='fixed bottom-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm'>
          {toast}
        </div>
      )}
    </div>
  );
}
