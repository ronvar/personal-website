'use client';

import { useRef, useEffect, useState, ReactNode, CSSProperties } from 'react';
import { Box } from '@mantine/core';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  threshold?: number;
  style?: CSSProperties;
}

export function FadeIn({ children, delay = 0, threshold = 0.1, style }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return (
    <Box
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </Box>
  );
}
