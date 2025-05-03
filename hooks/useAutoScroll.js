"use client";

import React from "react";

import { useEffect, useRef } from "react";

export function useAutoScroll({
  scrollContainer,
  threshold = 150,
  speed = 10,
}) {
  const scrollingRef = useRef(null);
  const pointerPositionRef = useRef(null);

  // Start tracking pointer position
  const startTracking = () => {
    const handlePointerMove = (e) => {
      pointerPositionRef.current = { clientY: e.clientY };
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  };

  // Handle auto-scrolling
  useEffect(() => {
    const container = scrollContainer.current;
    if (!container) return;

    const cleanup = startTracking();

    const handleScroll = () => {
      if (!pointerPositionRef.current || !container) {
        return;
      }

      const { clientY } = pointerPositionRef.current;
      const { top, bottom, height } = container.getBoundingClientRect();

      // Calculate distances from top and bottom edges
      const distanceFromTop = clientY - top;
      const distanceFromBottom = bottom - clientY;

      // Calculate scroll amount based on distance from edges
      let scrollAmount = 0;

      if (distanceFromTop < threshold) {
        // Scroll up - the closer to the edge, the faster
        const intensity = 1 - Math.max(0, distanceFromTop) / threshold;
        scrollAmount = -speed * intensity * 2; // Increased speed multiplier
      } else if (distanceFromBottom < threshold) {
        // Scroll down - the closer to the edge, the faster
        const intensity = 1 - Math.max(0, distanceFromBottom) / threshold;
        scrollAmount = speed * intensity * 2; // Increased speed multiplier
      }

      if (scrollAmount !== 0) {
        container.scrollBy(0, scrollAmount);
        scrollingRef.current = requestAnimationFrame(handleScroll);
      } else if (scrollingRef.current) {
        cancelAnimationFrame(scrollingRef.current);
        scrollingRef.current = null;
      }
    };

    const startAutoScroll = () => {
      if (scrollingRef.current === null) {
        scrollingRef.current = requestAnimationFrame(handleScroll);
      }
    };

    const stopAutoScroll = () => {
      if (scrollingRef.current !== null) {
        cancelAnimationFrame(scrollingRef.current);
        scrollingRef.current = null;
      }
    };

    window.addEventListener("pointerdown", startAutoScroll);
    window.addEventListener("pointerup", stopAutoScroll);
    window.addEventListener("pointercancel", stopAutoScroll);

    return () => {
      cleanup();
      stopAutoScroll();
      window.removeEventListener("pointerdown", startAutoScroll);
      window.removeEventListener("pointerup", stopAutoScroll);
      window.removeEventListener("pointercancel", stopAutoScroll);
    };
  }, [scrollContainer, threshold, speed]);
}
