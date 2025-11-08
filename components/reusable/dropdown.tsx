'use client';

import { FC } from 'react';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';
import classNames from 'classnames';
import { DropdownProps } from '@/lib/types';

const DropDown: FC<DropdownProps> = ({ trigger, menus, align = 'end' }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent align={align}>
        {menus.map((menu, index) => (
          <div key={index}>
            <DropdownMenuItem
              disabled={menu.isDisabled}
              onClick={menu.onClick}
              className={classNames(
                'flex items-center gap-2',
                menu.className,
                menu.isDestructive && 'text-destructive',
              )}
              asChild
            >
              {menu.label}
            </DropdownMenuItem>

            {menu.hasSeparatorBelow && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DropDown;
