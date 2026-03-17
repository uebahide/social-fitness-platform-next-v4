'use client';

import { useFormStatus } from 'react-dom';
import { Spinner } from '../ui/spinner';
import { Button } from './Button';
import { buttonColor } from '@/types/buttonType';
import { cn } from '@/lib/utils';

export const SubmitButton = ({
  color = 'primary',
  className,
  children,
  disabled,
}: {
  color?: buttonColor;
  className?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  const { pending } = useFormStatus();
  return (
    <Button color={color} type="submit" className={cn(className)} disabled={pending || disabled}>
      {pending ? <Spinner /> : children}
    </Button>
  );
};
