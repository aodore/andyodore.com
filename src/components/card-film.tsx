"use client";

import { useEffect, useRef } from "react";

export function CardFilm({ src, priority }: { src: string; priority?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (motion.matches) {
        node.pause();
        return;
      }
      void node.play().catch(() => {});
    };
    sync();
    motion.addEventListener("change", sync);
    return () => motion.removeEventListener("change", sync);
  }, []);

  return (
    <video
      ref={video}
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload={priority ? "auto" : "metadata"}
      aria-hidden
      className="absolute inset-0 size-full object-cover object-center motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.03]"
    />
  );
}
