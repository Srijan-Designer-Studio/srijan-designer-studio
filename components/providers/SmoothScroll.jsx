"use client";

import { useEffect } from "react";
import { ReactLenis } from "lenis/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function SmoothScroll({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      gsap.registerPlugin(ScrollTrigger);
      
      const resizeObserver = new ResizeObserver(() => {
        ScrollTrigger.refresh();
      });
      
      resizeObserver.observe(document.body);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.07, duration: 1.2, autoResize: true }}>
      {children}
    </ReactLenis>
  );
}