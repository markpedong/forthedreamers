import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmptyPanel = ({ description }: { description: string }) => (
  <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 px-6 text-center">
    <p className="text-sm font-medium">Nothing configured yet</p>
    <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
  </div>
);

const sections = [
  {
    value: 'store',
    label: 'Store Info',
    title: 'Store Information',
    description: 'Basic store details',
    empty: 'Store details will appear here once a settings record exists.',
  },
  {
    value: 'notifications',
    label: 'Notifications',
    title: 'Notification Preferences',
    description: 'Manage how you receive notifications',
    empty: 'Notification preferences will appear here once they are stored.',
  },
  {
    value: 'tax',
    label: 'Tax Settings',
    title: 'Tax Settings',
    description: 'Configure tax rules for your store',
    empty: 'Tax settings will appear here once configured.',
  },
  {
    value: 'api',
    label: 'API Keys',
    title: 'API Configuration',
    description: 'Manage your API keys and webhooks',
    empty: 'API credentials will appear here once they are issued.',
  },
];

export default function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your store configuration</p>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {sections.map(section => (
            <TabsTrigger key={section.value} value={section.value}>
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {sections.map(section => (
          <TabsContent key={section.value} value={section.value} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <EmptyPanel description={section.empty} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
