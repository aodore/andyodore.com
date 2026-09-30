"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TALK_CHANNEL, readTalkMessage } from "@/lib/talk-sync";

export type TalkSlide = {
  title: string;
  onScreen: string;
  paragraphs: string[];
};

const TIP =
  "bg-ink text-canvas pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100";

function formatElapsed(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mm = String(minutes).padStart(2, "0");
  const ss = String(seconds).padStart(2, "0");
  if (hours > 0) return `${hours}:${mm}:${ss}`;
  return `${mm}:${ss}`;
}

function useTalkTimer() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const runningRef = useRef(false);
  const anchorRef = useRef(0);

  useEffect(() => {
    if (!running) return;
    anchorRef.current = Date.now();
    const id = window.setInterval(() => {
      setElapsed(elapsedRef.current + (Date.now() - anchorRef.current));
    }, 200);
    return () => {
      elapsedRef.current += Date.now() - anchorRef.current;
      setElapsed(elapsedRef.current);
      window.clearInterval(id);
    };
  }, [running]);

  function play() {
    if (runningRef.current) return;
    runningRef.current = true;
    setRunning(true);
  }

  function pause() {
    if (!runningRef.current) return;
    runningRef.current = false;
    setRunning(false);
  }

  function restart() {
    elapsedRef.current = 0;
    anchorRef.current = Date.now();
    setElapsed(0);
  }

  return { running, elapsed, play, pause, restart };
}

export function TalkWindow({
  slug,
  session,
  slides,
}: {
  slug: string;
  session: string;
  slides: Array<TalkSlide | null>;
}) {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(slides.length);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [ready, setReady] = useState(session === "");
  const [heard, setHeard] = useState(session === "");
  const timer = useTalkTimer();
  const connected = session !== "";
  const canStep = slides.length > 1 && (!connected || galleryOpen);
  const slide =
    !connected || ready ? (slides[index] ?? null) : null;

  const step = useCallback(
    (delta: 1 | -1) => {
      if (connected) {
        if (!galleryOpen) return;
        channelRef.current?.postMessage({
          type: "step",
          session,
          slug,
          delta,
        });
        return;
      }
      setIndex((current) => {
        if (slides.length === 0) return 0;
        return (current + delta + slides.length) % slides.length;
      });
    },
    [connected, galleryOpen, session, slug, slides.length],
  );

  useEffect(() => {
    if (!session) return;
    const channel = new BroadcastChannel(TALK_CHANNEL);
    channelRef.current = channel;
    const ask = () => {
      channel.postMessage({ type: "hello", session, slug });
    };
    channel.onmessage = (event) => {
      const msg = readTalkMessage(event.data);
      if (!msg || msg.type !== "state" || msg.session !== session || msg.slug !== slug) {
        return;
      }
      const count = slides.length;
      setIndex(count === 0 ? 0 : Math.min(msg.index, count - 1));
      setTotal(msg.total);
      setGalleryOpen(msg.open);
      setHeard(true);
      setReady(true);
    };
    ask();
    const id = window.setInterval(ask, 1000);
    const giveUp = window.setTimeout(() => setReady(true), 1500);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(giveUp);
      channel.close();
      if (channelRef.current === channel) channelRef.current = null;
    };
  }, [session, slug, slides.length]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      step(event.key === "ArrowRight" ? 1 : -1);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  useEffect(() => {
    if (!slide) return;
    window.scrollTo(0, 0);
  }, [slide, index]);

  const shown = !connected || ready ? index + 1 : null;

  return (
    <div data-talk-window="" data-case-study={slug} className="bg-canvas text-ink min-h-dvh">
      <header className="border-rule bg-canvas sticky top-0 z-10 border-b">
        <div className="mx-auto w-full max-w-2xl px-6 pt-6 pb-5">
          <div className="flex items-center gap-3">
            <p aria-live="polite" className="text-[13px] leading-none tabular-nums">
              {shown === null ? "–" : shown} / {total}
            </p>
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={!canStep}
              aria-label="Previous image"
              className="shot-dialog-control disabled:cursor-default disabled:opacity-40"
            >
              <ChevronIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={!canStep}
              aria-label="Next image"
              className="shot-dialog-control disabled:cursor-default disabled:opacity-40"
            >
              <ChevronIcon className="size-4 -scale-x-100" />
            </button>
          </div>

          <p className="font-display mt-6 text-6xl leading-none font-thin tabular-nums">
            <span className="sr-only">Elapsed time </span>
            {formatElapsed(timer.elapsed)}
          </p>
          <div className="mt-4 flex items-center gap-3" role="group" aria-label="Timer">
            <TimerButton label="Play" pressed={timer.running} marked={timer.running} onClick={timer.play}>
              <PlayIcon className="size-4 translate-x-px" />
            </TimerButton>
            <TimerButton label="Pause" pressed={!timer.running} onClick={timer.pause}>
              <PauseIcon className="size-4" />
            </TimerButton>
            <TimerButton label="Restart" onClick={timer.restart}>
              <RestartIcon className="size-4" />
            </TimerButton>
          </div>
          {connected && !heard && (
            <p className="text-lede mt-4 text-xs font-light">
              {ready
                ? "Open the presentation to control the gallery."
                : "Connecting to the presentation…"}
            </p>
          )}
          {connected && heard && !galleryOpen && (
            <p className="text-lede mt-4 text-xs font-light">The presentation is closed.</p>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl px-6 pt-8 pb-24">
        {connected && !ready ? (
          <p className="text-lede text-sm font-light">Connecting to the presentation…</p>
        ) : slide ? (
          <>
            <h1 className="font-display text-[2rem] leading-tight font-thin">{slide.title}</h1>
            <p className="text-lede mt-4 text-sm leading-snug font-light">
              On screen: {slide.onScreen}
            </p>
            {slide.paragraphs.map((paragraph, i) => (
              <p key={i} className="mt-6 text-[1.1875rem] leading-[1.65] font-light text-pretty">
                {paragraph}
              </p>
            ))}
          </>
        ) : (
          <p className="text-lede text-sm font-light">No talk track for this image.</p>
        )}
      </main>
    </div>
  );
}

function TimerButton({
  label,
  pressed,
  marked = false,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  marked?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      className="shot-dialog-control group relative"
      style={
        marked
          ? { background: "var(--accent)", color: "var(--espresso)" }
          : undefined
      }
    >
      {children}
      <span aria-hidden className={TIP}>
        {label}
      </span>
    </button>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function PlayIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <path d="M6 3.4 12.2 8 6 12.6V3.4Z" />
    </svg>
  );
}

function PauseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden {...props}>
      <rect x="4.25" y="3.25" width="2.15" height="9.5" rx="0.4" />
      <rect x="9.6" y="3.25" width="2.15" height="9.5" rx="0.4" />
    </svg>
  );
}

function RestartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...props}
    >
      <path d="M3.2 8a4.8 4.8 0 1 0 1.15-3.1" />
      <path d="M3 2.7v2.9h2.9" />
    </svg>
  );
}
