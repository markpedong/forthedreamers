'use client';

import { useWindowSize } from '@uidotdev/usehooks';
import { useState, FC } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileLayoutProps } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const ProfileLayout: FC<ProfileLayoutProps> = ({ sections }) => {
  const { width } = useWindowSize();
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'profile');

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
      <Tabs defaultValue={sections[0]?.id} className='w-full'>
        <TabsList
          className='grid w-full h-[unset]'
          style={{ gridTemplateColumns: `repeat(${Math.min(sections.length, 6)}, 1fr)` }}
        >
          {sections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className='flex items-center gap-2'>
              {section.icon}
              <span className='hidden sm:inline'>{section.label}</span>
            </TabsTrigger>
          ))}
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
    <div className='flex gap-6'>
      <div className='w-48 space-y-2 flex-shrink-0'>
        {sections.map((section) => (
          <Button
            key={section.id}
            variant={activeSection === section.id ? 'default' : 'ghost'}
            className='w-full justify-start gap-2'
            onClick={() => setActiveSection(section.id)}
          >
            {section.icon}
            {section.label}
          </Button>
        ))}
      </div>

      <div className='flex-1'>{sections.find((s) => s.id === activeSection)?.content}</div>
    </div>
  );
};

export default ProfileLayout;
