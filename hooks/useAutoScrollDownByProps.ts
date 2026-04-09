import { useEffect, useRef } from "react";

export const useAutoScrollDown = (
  messageCount: number | undefined,
  roomId: number | null,
) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      el.scrollTop = el.scrollHeight;
      isFirstRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messageCount, roomId]);

  return { containerRef };
};
