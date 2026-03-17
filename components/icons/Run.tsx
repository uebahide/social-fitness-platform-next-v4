import { cn } from '@/lib/utils';

export default function RunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('icon icon-tabler icons-tabler-outline icon-tabler-run h-6 w-6', className)}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 4a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
      <path d="M4 17l5 1l.75 -1.5" />
      <path d="M15 21l0 -4l-4 -3l1 -6" />
      <path d="M7 12l0 -3l5 -1l3 3l3 1" />
    </svg>
  );
}
