'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import useFormSchema from '@/hooks/useFormSchema';
import { SchemaForm } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Dummy suggestions data
const DUMMY_SUGGESTIONS = [
  { type: 'product', label: 'Wireless Headphones', category: 'Electronics' },
  { type: 'product', label: 'Running Shoes', category: 'Fashion' },
  { type: 'category', label: 'Electronics', category: 'Category' },
  { type: 'category', label: 'Fashion & Apparel', category: 'Category' },
  { type: 'shop', label: 'TechHub Store', category: 'Shop' },
  { type: 'shop', label: 'Fashion Plus', category: 'Shop' },
];

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<typeof DUMMY_SUGGESTIONS>([]);
const SearchOverlay = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { searchSchema } = useFormSchema();
  const form = useForm<SchemaForm<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: '' },
  });

  const onSubmit = async ({ search }: SchemaForm<typeof searchSchema>) => {
    console.log('Searching for:', search);
  };

  useEffect(() => {
    // Handle Cmd+K / Ctrl+K
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // This will be handled by parent component
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    // Filter suggestions based on search query
    if (searchQuery.trim()) {
      setSuggestions(
        DUMMY_SUGGESTIONS.filter((item) =>
          item.label.toLowerCase().includes(searchQuery.toLowerCase()),
        ),
      );
    } else {
      setSuggestions(DUMMY_SUGGESTIONS.slice(0, 4));
    }
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
          />

          {/* Search Overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 z-50 flex items-start justify-center pt-20 md:pt-32 px-4'
          >
            <div className='w-full max-w-2xl'>
              {/* Search Input */}
              <form onSubmit={handleSearch} className='relative mb-4'>
                <div className='relative bg-background rounded-lg shadow-lg overflow-hidden'>
                  <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                  <Input
                    autoFocus
                    type='text'
                    placeholder='Search products, categories, shops...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='w-full pl-12 pr-12 py-3 text-base border-0 bg-background focus-visible:ring-2 focus-visible:ring-primary'
                  />
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon'
                    onClick={onClose}
                    className='absolute right-2 top-1/2 -translate-y-1/2'
                  >
                    <X className='w-5 h-5' />
                  </Button>
                </div>
              </form>

              {/* Suggestions */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className='bg-background rounded-lg shadow-lg overflow-hidden'
              >
                {suggestions.length > 0 ? (
                  <div className='divide-y divide-border'>
                    {suggestions.map((suggestion, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ backgroundColor: 'var(--muted)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setSearchQuery(suggestion.label);
                          onClose();
                        }}
                        className='w-full px-4 py-3 text-left flex items-center justify-between hover:bg-muted transition-colors'
                      >
                        <div className='flex items-center gap-3'>
                          <Search className='w-4 h-4 text-muted-foreground' />
                          <div>
                            <p className='text-sm font-medium'>{suggestion.label}</p>
                            <p className='text-xs text-muted-foreground'>{suggestion.category}</p>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className='px-4 py-8 text-center text-muted-foreground'>
                    <p>No results found for "{searchQuery}"</p>
                  </div>
                )}
              </motion.div>

              {/* Keyboard Hint */}
              <div className='mt-4 text-center text-xs text-muted-foreground'>
                <p>
                  Press <kbd className='px-2 py-1 bg-muted rounded text-foreground'>ESC</kbd> to
                  close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchOverlay;
