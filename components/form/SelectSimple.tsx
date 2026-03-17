'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import React, { useState } from 'react';
import { CategoryIcon } from '../CategoryIcon';

export function SelectSimple({
  id,
  name,
  items,
  onValueChange,
  defaultValue,
  required = false,
  readonly = false,
}: {
  id: string;
  name: string;
  items: { value: string; label: string }[];
  onValueChange: (value: any) => any;
  defaultValue?: string;
  required?: boolean;
  readonly?: boolean;
}) {
  const [value, setValue] = useState<string | undefined>(defaultValue ?? '');
  const handleValueChange = (value: string) => {
    setValue(value);
    onValueChange(value);
  };

  return (
    <>
      <Select
        defaultValue={defaultValue?.toLowerCase()}
        onValueChange={handleValueChange}
        required={required}
        disabled={readonly}
      >
        <SelectTrigger className="w-fit cursor-pointer">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {items.map((item) => (
              <SelectItem value={item.value.toLowerCase()} key={item.value}>
                <CategoryIcon
                  category={item.value.toLowerCase()}
                  className="mr-2 h-2 w-2 cursor-pointer"
                  size="medium"
                />
                {item.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <input type="hidden" name={name} value={value ?? 'running'} id={id} />
    </>
  );
}
