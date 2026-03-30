import { DependencyList, useEffect, useRef } from "react";

export const useAutoScrollDown = (deps: DependencyList) => {
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
  }, deps);

  return { containerRef };
};
