'use client';

import { useLocalStorage, useWindowSize } from '@uidotdev/usehooks';
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileLayoutProps } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const ProfileLayout: FC<ProfileLayoutProps> = ({ sections, hasPassword }) => {
  const tab = useSearchParams().get('tab');
  const { width } = useWindowSize();
  const [activeSection, setActiveSection] = useLocalStorage('tab', tab || sections[0]?.id);

  if (!width) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='animate-spin w-8 h-8' />
      </div>
    );
  }

  const isMobile = width < 768;
  const effectiveLayout = isMobile ? 'tabs' : 'sidebar';

  if (effectiveLayout === 'tabs') {
    return (
      <Tabs defaultValue={sections[0]?.id} className='w-full gap-8 mt-8'>
        <TabsList
          className='grid w-full h-[unset]'
          style={{
            gridTemplateColumns: `repeat(${Math.min(sections.length, 6)}, 1fr)`,
            ...(isMobile && { rowGap: '0.3rem', padding: '1rem' }),
          }}
        >
          {sections.map((section) => {
            const disabled = section.id === '2fa' && !hasPassword;
            return (
              <TabsTrigger
                key={section.id}
                value={section.id}
                disabled={disabled}
                className={`flex items-center gap-2 ${disabled ? 'opacity-50 grayscale' : ''}`}
              >
                {section.icon}
                <span className='hidden sm:inline'>{section.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {sections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            {section.content}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  return (
    <div className='flex gap-6 mt-8'>
      <Card className='w-48 px-2 gap-1 py-2'>
        {sections.map((section) => {
          const disabled = section.id === '2fa' && !hasPassword;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'ghost'}
              className={`w-full justify-start gap-2 transition ${
                disabled ? 'opacity-50 grayscale' : ''
              }`}
              onClick={() => {
                if (disabled) {
                  toast.error('Please set a password before enabling 2FA.');
                  return;
                }

                setActiveSection(section.id);
              }}
            >
              {section.icon}
              {section.label}
            </Button>
          );
        })}
      </Card>

      <div className='flex-1'>{sections.find((s) => s.id === activeSection)?.content}</div>
    </div>
  );
};

export default ProfileLayout;
