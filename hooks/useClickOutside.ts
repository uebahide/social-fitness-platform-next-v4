import { useEffect, useRef, useState } from "react";

export const useClickOutside = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [boolean, setBoolean] = useState(false);
  //handle click outside emoji picker
  useEffect(() => {
    if (!boolean) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setBoolean(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [boolean]);

  return { ref, boolean, setBoolean };
};
