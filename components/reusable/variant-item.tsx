import VariantOptionEditor from '@/app/(admin)/products/components/variant-option-editor';
import { TVariantItemProps, TVariantOption } from '@/lib/types';
import classNames from 'classnames';
import { ChevronDown, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { Button } from '../ui/button';

const VariantItem = memo(({ variant, expanded, onExpand, onEdit, onDelete, onOptionsChange }: TVariantItemProps) => (
  <div className='border border-border rounded-lg overflow-hidden'>
    <div
      role='button'
      tabIndex={0}
      onClick={() => onExpand(variant.id!)}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && onExpand(variant.id!)}
      className='w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer'
    >
      <div className='flex items-center gap-3 flex-1 text-left'>
        <ChevronDown
          size={18}
          className={classNames('text-muted-foreground transition-transform', {
            'rotate-180': expanded
          })}
        />
        <div>
          <p className='font-medium'>{variant.name}</p>
          <p className='text-xs text-muted-foreground'>{variant.isRequired ? 'Required' : 'Optional'}</p>
        </div>
      </div>
      <div className='flex gap-1' onClick={e => e.stopPropagation()}>
        <Button variant='outline' size='sm' onClick={() => onEdit(variant.id!)}>
          Edit
        </Button>
        <Button variant='outline' size='sm' className='text-destructive hover:text-destructive' onClick={() => onDelete(variant.id!)}>
          <Trash2 size={16} />
        </Button>
      </div>
    </div>

    {expanded && (
      <VariantOptionEditor
        variantName={variant.name}
        options={variant.options as TVariantOption[]}
        onOptionsChange={opt => onOptionsChange(variant.id!, opt)}
      />
    )}
  </div>
));

export default memo(VariantItem);
