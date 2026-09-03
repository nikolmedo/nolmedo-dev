import { createContext, useCallback, useContext } from "react";

export const SectionObserverContext = createContext<(el: Element) => void>(() => {});

export function useSectionRef() {
  const observe = useContext(SectionObserverContext);
  return useCallback((el: HTMLElement | null) => {
    if (el) observe(el);
  }, [observe]);
}
