import { useEffect, useRef } from "react";

type ScrollListener = (progress: number, scrollY: number) => void;

const listeners = new Set<ScrollListener>();
let maxScroll = 0;
let frame = 0;
let sizeObserver: ResizeObserver | null = null;

const measure = () => {
  maxScroll = document.documentElement.scrollHeight - window.innerHeight;
};

const flush = () => {
  frame = 0;
  const y = window.scrollY;
  const progress = maxScroll > 0 ? Math.min(y / maxScroll, 1) : 0;
  listeners.forEach((listener) => listener(progress, y));
};

const onScroll = () => {
  if (!frame) frame = requestAnimationFrame(flush);
};

const onResize = () => {
  measure();
  onScroll();
};

const attach = () => {
  measure();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize);
  if ("ResizeObserver" in window) {
    sizeObserver = new ResizeObserver(onResize);
    sizeObserver.observe(document.documentElement);
  }
};

const detach = () => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onResize);
  sizeObserver?.disconnect();
  sizeObserver = null;
  cancelAnimationFrame(frame);
  frame = 0;
};

/**
 * Shares one passive, rAF-coalesced scroll subscription between components.
 * `scrollHeight - innerHeight` is cached and refreshed on resize and when the
 * document grows (lazy sections mounting), never per scroll event.
 */
export function useScrollProgress(listener: ScrollListener) {
  const listenerRef = useRef(listener);
  listenerRef.current = listener;

  useEffect(() => {
    const subscriber: ScrollListener = (progress, y) =>
      listenerRef.current(progress, y);
    if (listeners.size === 0) attach();
    listeners.add(subscriber);
    onScroll();
    return () => {
      listeners.delete(subscriber);
      if (listeners.size === 0) detach();
    };
  }, []);
}
