import { useEffect, useRef, type ElementType } from "react";

let sharedRevealObserver: IntersectionObserver | null = null;

function getSharedRevealObserver() {
  if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
    return null;
  }

  if (!sharedRevealObserver) {
    sharedRevealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target as HTMLElement;
          element.dataset.revealed = "true";
          sharedRevealObserver?.unobserve(element);
        }
      },
      { rootMargin: "0px 0px -80px 0px" }
    );
  }

  return sharedRevealObserver;
}

export function useRevealRef<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = getSharedRevealObserver();
    if (!observer) {
      element.dataset.revealed = "true";
      return;
    }

    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return ref;
}

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
}) {
  const ref = useRevealRef<HTMLDivElement>();

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal=""
      style={delay ? ({ "--reveal-delay": `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

export function RevealGroup({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const ref = useRevealRef<HTMLElement>();

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export function stepDelay(index: number): React.CSSProperties {
  return { "--reveal-delay": `${(index * 0.08).toFixed(2)}s` } as React.CSSProperties;
}
