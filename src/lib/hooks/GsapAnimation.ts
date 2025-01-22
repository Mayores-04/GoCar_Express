
"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export function GsapAnimation() {
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = () => {
      const currentScroll = window.scrollY;

      if (headerRef.current) {
        if (currentScroll > lastScroll && currentScroll > 50) {
          // Scroll down: hide header with smooth transition
          gsap.to(headerRef.current, {
            y: -80,
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        } else {
          // Scroll up: show header with smooth transition
          gsap.to(headerRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        lastScroll = currentScroll;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return headerRef;
}
