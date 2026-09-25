"use client";

import { useEffect, useRef, useState } from "react";
import { FiPlay } from "react-icons/fi";

/**
 * Gold cursor: a small dot + a ring that smoothly follows the mouse.
 * The ring grows over links/buttons and shows "Play" over videos & songs.
 * Only on computers with a mouse (not on phones) and never when the
 * visitor prefers reduced motion.
 */
export default function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "hover" | "play">("default");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const mouse = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      setVisible(true);
      if (dot.current)
        dot.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    };
    const onOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor], a, button, select, label, input, textarea"
      );
      if (!el) return setMode("default");
      if (el.dataset.cursor === "play") return setMode("play");
      setMode("hover");
    };
    const loop = () => {
      pos.x += (mouse.x - pos.x) * 0.16;
      pos.y += (mouse.y - pos.y) * 0.16;
      if (ring.current)
        ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    const onLeave = () => setVisible(false);
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  const ringSize = mode === "play" ? 84 : mode === "hover" ? 56 : 36;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* follower ring */}
      <div ref={ring} className="absolute left-0 top-0">
        <div
          className={`rounded-full border transition-all duration-300 ease-out ${
            mode === "play"
              ? "grid place-items-center border-transparent bg-accent text-accent-fg"
              : mode === "hover"
                ? "border-blue-soft bg-blue/10"
                : "border-accent/60"
          }`}
          style={{
            width: ringSize,
            height: ringSize,
            transform: `translate(-50%, -50%) scale(${down ? 0.85 : 1})`,
          }}
        >
          {mode === "play" && (
            <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider">
              <FiPlay className="h-3 w-3" /> Play
            </span>
          )}
        </div>
      </div>
      {/* dot */}
      <div ref={dot} className="absolute left-0 top-0">
        <div
          className={`h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-opacity ${
            mode === "play" ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
    </div>
  );
}
