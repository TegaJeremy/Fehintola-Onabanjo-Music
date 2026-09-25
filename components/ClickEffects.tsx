"use client";

import { useEffect } from "react";

/**
 * Click / tap feedback for the whole site:
 *  - a light ripple spreads inside any button or button-style link
 *  - a small gold→blue ring bursts where you tapped
 */
export default function ClickEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>(
        ".btn, .btn-primary, .btn-outline, [data-ripple]"
      );

      if (el) {
        const r = el.getBoundingClientRect();
        const size = Math.max(r.width, r.height) * 2.2;
        const span = document.createElement("span");
        span.className = "ripple";
        span.style.width = span.style.height = `${size}px`;
        span.style.left = `${e.clientX - r.left}px`;
        span.style.top = `${e.clientY - r.top}px`;
        el.appendChild(span);
        span.addEventListener("animationend", () => span.remove());
      }

      if (target?.closest("a, button, [data-ripple]")) {
        const ring = document.createElement("span");
        ring.className = "tap-burst";
        ring.style.left = `${e.clientX}px`;
        ring.style.top = `${e.clientY}px`;
        document.body.appendChild(ring);
        ring.addEventListener("animationend", () => ring.remove());
      }
    };

    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
