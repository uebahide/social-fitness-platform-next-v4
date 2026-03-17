import { Textarea } from "@/components/ui/textarea";

export function TextareaSimple({
  placeholder,
  className,
  id,
  name,
  defaultValue,
  onChange,
  value,
  onKeyDown,
}: {
  placeholder?: string;
  className?: string;
  id: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (e: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <Textarea
      placeholder={placeholder}
      id={id}
      name={name}
      value={value}
      defaultValue={defaultValue}
      className={className}
      onChange={(e) => onChange?.(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
}
