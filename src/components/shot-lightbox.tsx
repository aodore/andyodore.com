"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { ArrowUpRightIcon, CloseIcon, ExpandIcon, ImageIcon, PresentationIcon, SidebarIcon, TalkIcon } from "@/components/brand";
import type { CaseStudyGuide, CaseStudyGuideBlock, CaseStudyShot } from "@/lib/case-studies";
import { TALK_CHANNEL, readTalkMessage } from "@/lib/talk-sync";
const OpenShot = createContext<{
  openAt: (index: number, origin?: OpenOrigin) => void;
  jumpTo: (index: number) => void;
  openLive: (src: string) => void;
  openIndex: number | null;
}>({
  openAt: () => {},
  jumpTo: () => {},
  openLive: () => {},
  openIndex: null,
});

type ShotField = {
  background: string;
  chrome: string;
};

type ShotTransit = {
  shot: CaseStudyShot;
  index: number;
};

type OpenOrigin = {
  x: number;
  y: number;
  w: number;
  h: number;
};

type SlidePhase = "idle" | "park" | "go";
type Presence =
  | "closed"
  | "enter-prep"
  | "enter-image"
  | "enter-play"
  | "open"
  | "exit-image";

const SLIDE_MS = 480;
const LIFT_MS = 560;
const DRAG_PX = 48;
const NOTES_MIN = 256;

function isVideoShot(shot: CaseStudyShot) {
  return shot.kind === "video";
}

function isPlaceholderShot(shot: CaseStudyShot) {
  return shot.kind === "placeholder";
}

function clampNotesWidth(width: number) {
  const vw = window.innerWidth;
  const min = Math.min(NOTES_MIN, Math.round(vw * 0.4));
  const max =
    vw < 768
      ? Math.round(vw * 0.9)
      : Math.min(Math.round(vw * 0.7), vw - 320);
  return Math.round(Math.min(max, Math.max(min, width)));
}

function destRect(img: HTMLElement) {
  const previous = img.style.transform;
  img.style.transform = "none";
  const dest = img.getBoundingClientRect();
  img.style.transform = previous;
  return dest;
}

function flipFromOrigin(img: HTMLElement, from: OpenOrigin) {
  const dest = destRect(img);
  if (dest.width < 1 || dest.height < 1) return null;
  const scale = from.w / dest.width;
  const dx = from.x + from.w / 2 - (dest.x + dest.width / 2);
  const dy = from.y + from.h / 2 - (dest.y + dest.height / 2);
  return {
    flip: `translate3d(${dx}px, ${dy}px, 0) scale(${scale})`,
    radius: `${24 / scale}px`,
  };
}

export function ShotLightbox({
  shots,
  guide,
  talkSlug,
  children,
}: {
  shots: CaseStudyShot[];
  guide?: CaseStudyGuide;
  talkSlug?: string;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const liveDialog = useRef<HTMLDialogElement>(null);
  const sawFullscreen = useRef(false);
  const [index, setIndex] = useState<number | null>(null);
  const [liveSrc, setLiveSrc] = useState<string | null>(null);
  const [field, setField] = useState<ShotField | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [leaving, setLeaving] = useState<ShotTransit | null>(null);
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const [presence, setPresence] = useState<Presence>("closed");
  const [notesOpen, setNotesOpen] = useState(true);
  const origin = useRef<OpenOrigin | null>(null);
  const talkSession = useRef<string | null>(null);
  const talkPopup = useRef<Window | null>(null);
  const talkChannel = useRef<BroadcastChannel | null>(null);
  const stepRef = useRef<(delta: number) => void>(() => {});
  const galleryRef = useRef({
    index: null as number | null,
    open: false,
    total: shots.length,
  });
  galleryRef.current = {
    index,
    open: index !== null && presence === "open",
    total: shots.length,
  };
  const [flip, setFlip] = useState({
    flip: "translate3d(0, 30vh, 0)",
    radius: "1.5rem",
  });
  const pendingField = useRef<ShotField | null>(null);
  const endSlide = useCallback(() => {
    setLeaving(null);
    setPhase("idle");
    if (pendingField.current) {
      setField(pendingField.current);
      pendingField.current = null;
    }
  }, []);
  const shot = index !== null ? shots[index] : null;

  const finishClose = useCallback(() => {
    setIndex(null);
    setField(null);
    setLeaving(null);
    setPhase("idle");
    setPresence("closed");
    origin.current = null;
    pendingField.current = null;
    setNotesOpen(true);
  }, []);

  const requestClose = useCallback(() => {
    if (index === null) return;
    if (presence === "exit-image" || presence === "closed") {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }
    setPresence("exit-image");
  }, [index, presence, finishClose]);

  function openAt(next: number, from?: OpenOrigin) {
    origin.current = from ?? null;
    setIndex(next);
    setNotesOpen(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPresence("open");
      return;
    }
    setPresence("enter-prep");
  }

  useLayoutEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (shot) {
      if (!node.open) node.showModal();
    } else if (node.open) {
      node.close();
    }
  }, [shot]);

  useLayoutEffect(() => {
    if (
      presence !== "enter-prep" &&
      presence !== "enter-image" &&
      presence !== "exit-image"
    ) {
      return;
    }

    const img = dialog.current?.querySelector(".shot-hero");
    const from = origin.current;
    if (img instanceof HTMLElement && from) {
      const next = flipFromOrigin(img, from);
      if (next) setFlip(next);
    } else if (presence !== "enter-image") {
      setFlip({
        flip: "translate3d(0, 30vh, 0)",
        radius: "1.5rem",
      });
    }

    if (presence === "enter-prep") {
      setPresence("enter-image");
      return;
    }

    if (presence !== "enter-image") return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPresence("enter-play"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [presence, shot]);

  useEffect(() => {
    if (presence === "enter-play") {
      const timer = window.setTimeout(() => setPresence("open"), LIFT_MS);
      return () => window.clearTimeout(timer);
    }
    if (presence === "exit-image") {
      const timer = window.setTimeout(finishClose, LIFT_MS + 40);
      return () => window.clearTimeout(timer);
    }
  }, [presence, finishClose]);

  const postTalkState = useCallback(() => {
    const channel = talkChannel.current;
    const session = talkSession.current;
    if (!channel || !session || !talkSlug) return;
    const gallery = galleryRef.current;
    channel.postMessage({
      type: "state",
      session,
      slug: talkSlug,
      index: gallery.index ?? 0,
      total: gallery.total,
      open: gallery.open,
    });
  }, [talkSlug]);

  useEffect(() => {
    if (!talkSlug) return;
    const channel = new BroadcastChannel(TALK_CHANNEL);
    talkChannel.current = channel;
    channel.onmessage = (event) => {
      const msg = readTalkMessage(event.data);
      if (!msg || msg.slug !== talkSlug || msg.session !== talkSession.current) return;
      if (msg.type === "hello") postTalkState();
      if (msg.type === "step") stepRef.current(msg.delta);
    };
    return () => {
      channel.close();
      if (talkChannel.current === channel) talkChannel.current = null;
    };
  }, [talkSlug, postTalkState]);

  useEffect(() => {
    postTalkState();
  }, [postTalkState, index, presence, shots.length]);

  useLayoutEffect(() => {
    if (phase !== "park") return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setPhase("go"));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [phase]);

  function step(delta: number) {
    if (
      shots.length === 0 ||
      index === null ||
      phase !== "idle" ||
      presence !== "open"
    ) {
      return;
    }
    setDirection(delta > 0 ? 1 : -1);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLeaving({ shot: shots[index], index });
      setPhase("park");
    }
    setIndex((index + delta + shots.length) % shots.length);
  }
  stepRef.current = step;

  function jumpTo(next: number) {
    if (
      shots.length === 0 ||
      index === null ||
      next === index ||
      phase !== "idle" ||
      presence !== "open"
    ) {
      return;
    }
    setDirection(next > index ? 1 : -1);
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLeaving({ shot: shots[index], index });
      setPhase("park");
    }
    setIndex(next);
  }

  function applyField(next: ShotField) {
    if (phase === "idle") {
      setField(next);
      return;
    }
    pendingField.current = next;
  }

  function openLive(src: string) {
    setLiveSrc(src);
    const node = liveDialog.current;
    if (!node) return;
    if (!node.open) node.showModal();
    void node.requestFullscreen?.().then(() => {
      sawFullscreen.current = true;
    }).catch(() => {});
  }

  function closeLive() {
    sawFullscreen.current = false;
    const node = liveDialog.current;
    if (document.fullscreenElement) void document.exitFullscreen();
    if (node?.open) node.close();
    setLiveSrc(null);
  }

  useEffect(() => {
    function onFullscreenChange() {
      if (document.fullscreenElement === liveDialog.current) {
        sawFullscreen.current = true;
        return;
      }
      if (!sawFullscreen.current) return;
      sawFullscreen.current = false;
      const node = liveDialog.current;
      if (node?.open) node.close();
      setLiveSrc(null);
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  function openTalkWindow() {
    if (!talkSlug) return;
    setNotesOpen(false);
    const open = talkPopup.current;
    if (open && !open.closed) {
      open.focus();
      postTalkState();
      return;
    }
    const session = talkSession.current ?? crypto.randomUUID();
    talkSession.current = session;
    const width = 560;
    const height = Math.min(960, window.screen.availHeight - 48);
    const left = window.screenX + window.outerWidth + 12;
    const top = window.screenY + 24;
    const popup = window.open(
      `/work/${talkSlug}/talk?session=${encodeURIComponent(session)}`,
      `talk-${talkSlug}`,
      `popup=yes,width=${width},height=${height},left=${Math.round(left)},top=${Math.round(top)}`,
    );
    talkPopup.current = popup;
    popup?.focus();
    postTalkState();
  }

  return (
    <OpenShot.Provider
      value={{
        openAt,
        jumpTo,
        openLive,
        openIndex:
          presence === "exit-image" || presence === "closed" ? null : index,
      }}
    >
      {children}
      <dialog
        ref={dialog}
        aria-label="Case study media"
        className={`shot-dialog is-${presence}`}
        style={
          {
            ...(field
              ? {
                  "--shot-field": field.background,
                  "--shot-chrome": field.chrome,
                }
              : {}),
            "--shot-flip": flip.flip,
            "--shot-radius": flip.radius,
          } as React.CSSProperties
        }
        onCancel={(event) => {
          event.preventDefault();
          if (liveSrc) return;
          if (notesOpen && window.matchMedia("(min-width: 768px)").matches) {
            setNotesOpen(false);
            return;
          }
          requestClose();
        }}
        onClick={(event) => {
          if (event.target !== dialog.current) return;
          if (notesOpen && window.matchMedia("(min-width: 768px)").matches) {
            setNotesOpen(false);
            return;
          }
          requestClose();
        }}
        onKeyDown={(event) => {
          if (liveSrc) return;
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          } else if (event.key === "Escape") {
            event.preventDefault();
            if (notesOpen && window.matchMedia("(min-width: 768px)").matches) {
              setNotesOpen(false);
              return;
            }
            requestClose();
          }
        }}
      >
        {shot && index !== null && (
          <ShotFrame
            shot={shot}
            index={index}
            total={shots.length}
            direction={direction}
            leaving={leaving}
            phase={phase}
            shots={shots}
            canDrag={presence === "open"}
            guide={guide}
            notesOpen={notesOpen}
            onToggleNotes={() => setNotesOpen((open) => !open)}
            onClose={requestClose}
            onStep={step}
            onField={applyField}
            onSlideEnd={endSlide}
            onOpenTalk={talkSlug ? openTalkWindow : undefined}
            onOpenLive={shot.live ? () => openLive(shot.live!) : undefined}
          />
        )}
      </dialog>
      <dialog
        ref={liveDialog}
        className="live-prototype"
        aria-label="Live prototype"
        onCancel={(event) => {
          event.preventDefault();
          closeLive();
        }}
      >
        {liveSrc && (
          <iframe
            src={liveSrc}
            title="Live prototype"
            className="block h-full w-full"
          />
        )}
        <button
          type="button"
          onClick={closeLive}
          aria-label="Close live prototype"
          className="shot-dialog-control live-prototype-close absolute top-[60px] right-4 z-10"
        >
          <CloseIcon className="size-4" />
        </button>
      </dialog>
    </OpenShot.Provider>
  );
}

export function PresentationLaunch() {
  const { openAt } = useContext(OpenShot);

  function open() {
    const first = document.querySelector<HTMLElement>(
      '[aria-label^="View image 1:"], [aria-label^="View film 1:"]',
    );
    if (first) {
      const rect = first.getBoundingClientRect();
      openAt(0, {
        x: rect.left,
        y: rect.top,
        w: rect.width,
        h: rect.height,
      });
      return;
    }
    openAt(0);
  }

  return (
    <button
      type="button"
      onClick={open}
      aria-label="Open presentation"
      className="bg-accent text-ink group relative hidden size-11 cursor-pointer place-items-center rounded-full motion-safe:transition-transform motion-safe:duration-300 md:grid xl:size-14"
    >
      <PresentationIcon className="size-4 xl:size-6" />
      <span
        aria-hidden
        className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        Presentation mode
      </span>
    </button>
  );
}

export function ShotTrigger({
  shot,
  index,
}: {
  shot: CaseStudyShot;
  index: number;
}) {
  const { openAt, openIndex, openLive } = useContext(OpenShot);
  const video = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const open = openIndex === index;

  useEffect(() => {
    const node = video.current;
    if (!node) return;
    if (open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.pause();
      return;
    }
    void node.play().catch(() => {});
  }, [open]);

  function openFrom(element: HTMLElement) {
    const rect = element.getBoundingClientRect();
    openAt(index, {
      x: rect.left,
      y: rect.top,
      w: rect.width,
      h: rect.height,
    });
  }

  if (isVideoShot(shot)) {
    return (
      <figure
        className={`t-stagger-line${open ? " invisible" : ""}`}
      >
        <div className="relative overflow-hidden rounded-3xl">
          <video
            ref={video}
            src={shot.src}
            width={shot.width}
            height={shot.height}
            autoPlay
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className={
              shot.maxHeight
                ? "shot-clip h-auto w-full cursor-zoom-in object-cover"
                : "shot-clip h-auto w-full cursor-zoom-in"
            }
            style={
              shot.maxHeight
                ? {
                    maxHeight: shot.maxHeight,
                    objectPosition: shot.objectPosition ?? "center",
                  }
                : undefined
            }
            aria-label={`View film ${index + 1}: ${shot.alt}`}
            onClick={(event) => openFrom(event.currentTarget)}
          />
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            className="shot-dialog-control absolute bottom-4 left-4 z-10"
            onClick={() => {
              const node = video.current;
              const next = !muted;
              setMuted(next);
              if (node) {
                node.muted = next;
                if (!next) void node.play().catch(() => {});
              }
            }}
          >
            <SpeakerIcon off={muted} className="size-4" />
          </button>
        </div>
        <ShotCaption shot={shot} />
      </figure>
    );
  }

  return (
    <figure
      className={`t-stagger-line${open ? " invisible" : ""}`}
    >
      <div className="relative overflow-hidden rounded-3xl">
        <button
          type="button"
          aria-label={`View image ${index + 1}: ${shot.alt}`}
          className="block w-full cursor-zoom-in"
          onClick={(event) => openFrom(event.currentTarget)}
        >
          <ShotImage
            shot={shot}
            className={
              shot.maxHeight
                ? "h-auto w-full object-cover"
                : "h-auto w-full"
            }
            style={
              shot.maxHeight
                ? {
                    maxHeight: shot.maxHeight,
                    objectPosition: shot.objectPosition ?? "center",
                  }
                : undefined
            }
          />
        </button>
        {shot.live && (
          <button
            type="button"
            aria-label="Open live prototype"
            className="bg-accent absolute bottom-4 left-4 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-2 text-[13px] leading-none font-light text-[var(--espresso)]"
            onClick={(event) => {
              event.stopPropagation();
              openLive(shot.live!);
            }}
          >
            <ExpandIcon className="size-3.5" />
            Open live
          </button>
        )}
      </div>
      <ShotCaption shot={shot} />
    </figure>
  );
}

function ShotCaption({ shot }: { shot: CaseStudyShot }) {
  if (!shot.caption) return null;
  const { label, href } = shot.caption;

  if (href) {
    return (
      <figcaption className="mt-3 text-right">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${label} (opens in a new tab)`}
          className="inline-flex items-center gap-1 text-sm font-light transition-colors hover:text-ink"
        >
          {label}
          <ArrowUpRightIcon className="size-3.5" />
        </a>
      </figcaption>
    );
  }

  return (
    <figcaption className="text-lede mt-3 text-sm leading-snug font-light">
      {label}
    </figcaption>
  );
}

function ShotImage({
  shot,
  className,
  onReady,
  ...rest
}: {
  shot: CaseStudyShot;
  className?: string;
  onReady?: (el: HTMLImageElement | HTMLVideoElement) => void;
} & Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height">) {
  if (isVideoShot(shot)) {
    return (
      <video
        src={shot.src}
        width={shot.width}
        height={shot.height}
        autoPlay
        muted
        loop
        playsInline
        controls
        className={["shot-clip", className].filter(Boolean).join(" ")}
        style={rest.style}
        aria-label={shot.alt}
        onLoadedData={(event) => onReady?.(event.currentTarget)}
      />
    );
  }

  if (isPlaceholderShot(shot)) {
    return (
      <div
        role="img"
        aria-label={shot.alt}
        className={[
          "flex items-center justify-center bg-[color-mix(in_oklab,var(--ink)_12%,var(--canvas))]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          aspectRatio: `${shot.width ?? 16} / ${shot.height ?? 10}`,
        }}
        onPointerDown={rest.onPointerDown}
        onPointerMove={rest.onPointerMove}
        onPointerUp={rest.onPointerUp}
        onPointerCancel={rest.onPointerCancel}
      >
        <span className="text-sm font-light tracking-[0.18em] text-[color-mix(in_oklab,var(--ink)_45%,transparent)]">
          Coming Soon
        </span>
      </div>
    );
  }

  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width ?? 1636}
      height={shot.height ?? 866}
      // These are UI screenshots at 2x. Next's optimizer resizes them to the
      // default srcset widths and recompresses, which is what made type muddy.
      unoptimized
      draggable={false}
      className={className}
      onLoad={(event) => onReady?.(event.currentTarget)}
      {...rest}
    />
  );
}

function ShotFrame({
  shot,
  index,
  total,
  direction,
  leaving,
  phase,
  shots,
  canDrag,
  guide,
  notesOpen,
  onToggleNotes,
  onClose,
  onStep,
  onField,
  onSlideEnd,
  onOpenTalk,
  onOpenLive,
}: {
  shot: CaseStudyShot;
  index: number;
  total: number;
  direction: 1 | -1;
  leaving: ShotTransit | null;
  phase: SlidePhase;
  shots: CaseStudyShot[];
  canDrag: boolean;
  guide?: CaseStudyGuide;
  notesOpen: boolean;
  onToggleNotes: () => void;
  onClose: () => void;
  onStep: (delta: number) => void;
  onField: (field: ShotField) => void;
  onSlideEnd: () => void;
  onOpenTalk?: () => void;
  onOpenLive?: () => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const pointer = useRef<{
    id: number;
    x: number;
    y: number;
    axis: "x" | "y" | null;
    dx: number;
  } | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    if (phase !== "go") return;
    const timer = window.setTimeout(onSlideEnd, SLIDE_MS + 80);
    return () => window.clearTimeout(timer);
  }, [phase, onSlideEnd]);

  useEffect(() => {
    if (phase === "idle") setDragX(0);
  }, [phase]);

  const many = total > 1;
  const sliding = leaving !== null;
  const grab = many && canDrag && phase === "idle" && !isVideoShot(shot);

  function closeFromField(event: React.MouseEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (notesOpen) {
      onToggleNotes();
      return;
    }
    onClose();
  }

  function onHeroPointerDown(event: React.PointerEvent<HTMLImageElement>) {
    if (!grab || event.button !== 0) return;
    pointer.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      axis: null,
      dx: 0,
    };
  }

  function onHeroPointerMove(event: React.PointerEvent<HTMLImageElement>) {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (start.axis === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      start.axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (start.axis === "x") {
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          /* Synthetic events (and some pens) have no capture. */
        }
        setDragging(true);
      }
    }
    if (start.axis !== "x") return;
    event.preventDefault();
    start.dx = dx;
    setDragX(dx);
  }

  function finishHeroPointer(event: React.PointerEvent<HTMLImageElement>) {
    const start = pointer.current;
    if (!start || start.id !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    const dx = start.dx;
    setDragging(false);
    if (start.axis !== "x") {
      setDragX(0);
      return;
    }
    if (dx > DRAG_PX) onStep(-1);
    else if (dx < -DRAG_PX) onStep(1);
    else requestAnimationFrame(() => setDragX(0));
  }

  const outgoingTrack =
    phase === "go"
      ? direction === 1
        ? "is-exit-left"
        : "is-exit-right"
      : "";
  const incomingTrack = !sliding
    ? ""
    : phase === "park"
      ? direction === 1
        ? "is-enter-right is-parked"
        : "is-enter-left is-parked"
      : "";

  const preload = many
      ? [
          shots[(index + 1) % total],
          shots[(index - 1 + total) % total],
        ].filter((item) => !isVideoShot(item) && !isPlaceholderShot(item))
    : [];

  return (
    <div
      className={`shot-dialog-stage relative flex h-full w-full${
        dragging ? " is-dragging" : ""
      }${many ? " has-many" : ""}${notesOpen ? " has-notes" : ""}`}
    >
      <div
        className="shot-stage-main relative flex min-h-0 min-w-0 flex-1 flex-col"
        onClick={closeFromField}
      >
        <div className="shot-chrome pointer-events-none relative z-20 flex shrink-0 justify-end px-4 pt-4 pb-2 md:px-6 md:pt-6">
            <div className="pointer-events-auto flex items-center gap-10 md:gap-12">
            <div className="flex items-center gap-3">
              {onOpenLive && (
                <button
                  type="button"
                  onClick={onOpenLive}
                  aria-label="Open live prototype"
                  className="shot-dialog-control group relative mr-1"
                >
                  <ExpandIcon className="size-4" />
                  <span
                    aria-hidden
                    className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    Open live
                  </span>
                </button>
              )}
              {shot.caption?.href && (
                <a
                  href={shot.caption.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${shot.caption.label} (opens in a new tab)`}
                  className="mr-3 inline-flex items-center gap-1 text-[13px] leading-none font-light underline-offset-2 hover:underline"
                >
                  {shot.caption.label}
                  <ArrowUpRightIcon className="size-3.5" />
                </a>
              )}
              <p
                aria-live="polite"
                className="text-[13px] leading-none tabular-nums"
              >
                {index + 1} / {total}
              </p>
              {many && (
                <>
                  <button
                    type="button"
                    onClick={() => onStep(-1)}
                    aria-label="Previous image"
                    className="shot-dialog-control"
                  >
                    <ChevronIcon className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStep(1)}
                    aria-label="Next image"
                    className="shot-dialog-control"
                  >
                    <ChevronIcon className="size-4 -scale-x-100" />
                  </button>
                </>
              )}
            </div>
            <div className="flex items-center gap-3">
              {guide && (
                <button
                  type="button"
                  onClick={onToggleNotes}
                  aria-label={
                    notesOpen ? "Hide case study notes" : "Show case study notes"
                  }
                  aria-expanded={notesOpen}
                  aria-pressed={notesOpen}
                  aria-controls="shot-notes"
                  className="shot-dialog-control shot-notes-toggle group relative"
                >
                  <SidebarIcon className="size-4" />
                  <span
                    aria-hidden
                    className="bg-ink text-canvas pointer-events-none absolute top-full left-1/2 z-10 mt-2 -translate-x-1/2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    {notesOpen
                      ? "Turn presentation mode off"
                      : "Turn presentation mode on"}
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shot-dialog-control"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="shot-lift relative min-h-0 flex-1 overflow-hidden">
          {leaving && (
            <ShotPane
              key={leaving.index}
              shot={leaving.shot}
              trackClass={outgoingTrack}
              settled={false}
              holdX={phase === "park" ? dragX : 0}
              onTransitionEnd={onSlideEnd}
              onCloseField={closeFromField}
            />
          )}
          <ShotPane
            key={index}
            shot={shot}
            scrollerRef={scroller}
            trackClass={incomingTrack}
            settled={!sliding}
            holdX={sliding ? 0 : dragX}
            dragging={dragging}
            onCloseField={closeFromField}
            onField={onField}
            onHeroPointerDown={grab ? onHeroPointerDown : undefined}
            onHeroPointerMove={grab || dragging ? onHeroPointerMove : undefined}
            onHeroPointerUp={grab || dragging ? finishHeroPointer : undefined}
          />
          {preload.map((item, i) => (
            <ShotImage
              key={`preload-${item.src}-${i}`}
              shot={item}
              className="hidden"
            />
          ))}
        </div>
      </div>
      {guide && (
        <ShotNotes
          guide={guide}
          index={index}
          open={notesOpen}
          onOpenTalk={onOpenTalk}
        />
      )}
    </div>
  );
}

function ShotNotes({
  guide,
  index,
  open,
  onOpenTalk,
}: {
  guide: CaseStudyGuide;
  index: number;
  open: boolean;
  onOpenTalk?: () => void;
}) {
  const root = useRef<HTMLElement>(null);
  const resize = useRef<{
    id: number;
    startX: number;
    startW: number;
  } | null>(null);
  const [width, setWidth] = useState<number | null>(null);
  const [resizing, setResizing] = useState(false);
  const { jumpTo } = useContext(OpenShot);

  useEffect(() => {
    if (!open) return;
    const current = root.current?.querySelector(`[data-shot-note="${index}"]`);
    if (!(current instanceof HTMLElement)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    current.scrollIntoView({
      block: "center",
      behavior: reduce ? "auto" : "smooth",
    });
  }, [index, open]);

  function currentWidth() {
    return width ?? root.current?.getBoundingClientRect().width ?? NOTES_MIN;
  }

  function onResizePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const node = root.current;
    if (!node) return;
    resize.current = {
      id: event.pointerId,
      startX: event.clientX,
      startW: node.getBoundingClientRect().width,
    };
    setResizing(true);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* Synthetic events (and some pens) have no capture. */
    }
  }

  function onResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const start = resize.current;
    if (!start || start.id !== event.pointerId) return;
    event.preventDefault();
    setWidth(clampNotesWidth(start.startW + (start.startX - event.clientX)));
  }

  function onResizePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    const start = resize.current;
    if (!start || start.id !== event.pointerId) return;
    resize.current = null;
    setResizing(false);
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }

  function onResizeKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    event.stopPropagation();
    const delta = event.key === "ArrowLeft" ? 16 : -16;
    setWidth(clampNotesWidth(currentWidth() + delta));
  }

  return (
    <aside
      ref={root}
      id="shot-notes"
      className={`shot-notes${open ? " is-open" : ""}${
        resizing ? " is-resizing" : ""
      }`}
      style={
        width
          ? ({ "--shot-notes-width": `${width}px` } as React.CSSProperties)
          : undefined
      }
      aria-label="Case study notes"
      inert={!open}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize notes"
        aria-valuenow={width ?? undefined}
        aria-valuemin={NOTES_MIN}
        tabIndex={open ? 0 : -1}
        className="shot-notes-handle"
        onPointerDown={onResizePointerDown}
        onPointerMove={onResizePointerMove}
        onPointerUp={onResizePointerUp}
        onPointerCancel={onResizePointerUp}
        onKeyDown={onResizeKeyDown}
      />
      <div className="shot-notes-inner text-[15px] leading-relaxed">
        <div className="flex items-start justify-between gap-4">
          <h2 className="min-w-0 font-display text-[28px] leading-tight font-thin">
            {guide.title}
          </h2>
          {onOpenTalk && (
            <button
              type="button"
              onClick={onOpenTalk}
              aria-label="Open talk track"
              className="text-ink hover:text-accent group relative mt-1.5 grid size-7 shrink-0 cursor-pointer place-items-center rounded-full"
            >
              <TalkIcon className="size-4" />
              <span
                aria-hidden
                className="bg-ink text-canvas pointer-events-none absolute top-full right-0 z-10 mt-2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                Talk track
              </span>
            </button>
          )}
        </div>
        <p className="text-lede mt-2 text-[15px] leading-snug font-light">
          {guide.meta}
        </p>
        {guide.tags.length > 0 && (
          <p className="mt-3 text-xs font-light tracking-wide opacity-70">
            {guide.tags.join(" · ")}
          </p>
        )}
        {guide.blocks.map((block, i) => (
          <GuideBlockView
            key={i}
            block={block}
            current={index}
            onJump={jumpTo}
          />
        ))}
      </div>
    </aside>
  );
}

function GuideBlockView({
  block,
  current,
  onJump,
}: {
  block: CaseStudyGuideBlock;
  current: number;
  onJump: (index: number) => void;
}) {
  if (block.kind === "heading") {
    return (
      <h3 className="text-accent mt-8 text-base font-medium">{block.text}</h3>
    );
  }
  if (block.kind === "copy") {
    return (
      <p className="mt-4 font-light">
        {block.lead ? (
          <>
            <strong className="block font-bold">{block.lead}</strong>
            {block.rest}
          </>
        ) : (
          block.rest
        )}
      </p>
    );
  }
  if (block.kind === "bullets") {
    return (
      <ul className="mt-4 list-disc space-y-2 pl-[1.1em] font-light xl:space-y-3">
        {block.items.map((item) =>
          typeof item === "string" ? (
            <li key={item}>{item}</li>
          ) : (
            <li key={item.lead}>
              <strong className="font-bold">{item.lead}</strong> {item.rest}
            </li>
          ),
        )}
      </ul>
    );
  }
  return (
    <button
      type="button"
      data-shot-note={block.shotIndex}
      onClick={() => onJump(block.shotIndex)}
      aria-current={block.shotIndex === current ? "true" : undefined}
      className={`shot-note-caption mt-4 font-light${
        block.shotIndex === current ? " is-current" : ""
      }`}
    >
      <ImageIcon className="size-3" />
      {block.text}
    </button>
  );
}

function ShotPane({
  shot,
  trackClass,
  settled,
  holdX = 0,
  dragging = false,
  scrollerRef,
  onTransitionEnd,
  onCloseField,
  onField,
  onHeroPointerDown,
  onHeroPointerMove,
  onHeroPointerUp,
}: {
  shot: CaseStudyShot;
  trackClass: string;
  settled: boolean;
  holdX?: number;
  dragging?: boolean;
  scrollerRef?: React.Ref<HTMLDivElement>;
  onTransitionEnd?: () => void;
  onCloseField: (event: React.MouseEvent<HTMLElement>) => void;
  onField?: (field: ShotField) => void;
  onHeroPointerDown?: (event: React.PointerEvent<HTMLImageElement>) => void;
  onHeroPointerMove?: (event: React.PointerEvent<HTMLImageElement>) => void;
  onHeroPointerUp?: (event: React.PointerEvent<HTMLImageElement>) => void;
}) {
  return (
    <div
      className={settled ? "shot-slide is-settled" : "shot-slide"}
      onClick={onCloseField}
    >
      <div
        ref={scrollerRef}
        className="shot-slide-scroll"
        onClick={onCloseField}
      >
        <div
          className={`shot-slide-track ${trackClass}`.trim()}
          style={
            holdX
              ? {
                  transform: `translate3d(${holdX}px, 0, 0)`,
                  transition: dragging ? "none" : undefined,
                }
              : dragging
                ? { transition: "none" }
                : undefined
          }
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) onTransitionEnd?.();
          }}
        >
          <div
            className="shot-slide-frame flex w-full items-center justify-center px-16 md:px-24"
            onClick={onCloseField}
          >
            <ShotImage
              shot={shot}
              className={
                shot.maxHeight
                  ? "shot-hero h-auto w-full max-w-[1636px] object-cover"
                  : "shot-hero h-auto w-full max-w-[1636px]"
              }
              style={
                shot.maxHeight
                  ? {
                      maxHeight: shot.maxHeight,
                      objectPosition: shot.objectPosition ?? "center",
                    }
                  : undefined
              }
              onPointerDown={onHeroPointerDown}
              onPointerMove={onHeroPointerMove}
              onPointerUp={onHeroPointerUp}
              onPointerCancel={onHeroPointerUp}
              onReady={
                onField
                  ? (el) => {
                      const background = sampleImageField(el);
                      if (background) {
                        onField({ background, chrome: chromeOn(background) });
                      }
                    }
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/** Most common color on the shot's edge, so the lightbox field matches the
    image instead of the page canvas. */
function sampleImageField(
  img: HTMLImageElement | HTMLVideoElement,
): string | null {
  const width =
    img instanceof HTMLVideoElement ? img.videoWidth : img.naturalWidth;
  const height =
    img instanceof HTMLVideoElement ? img.videoHeight : img.naturalHeight;
  if (!width || !height) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  const inset = Math.min(4, Math.floor(Math.min(width, height) / 4));
  const span = 48;
  const buckets = new Map<number, { r: number; g: number; b: number; n: number }>();

  function collect(sx: number, sy: number, sw: number, sh: number, dw: number, dh: number) {
    canvas.width = dw;
    canvas.height = dh;
    ctx!.drawImage(img, sx, sy, sw, sh, 0, 0, dw, dh);
    const { data } = ctx!.getImageData(0, 0, dw, dh);
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 128) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const key = ((r >> 3) << 10) | ((g >> 3) << 5) | (b >> 3);
      const bucket = buckets.get(key);
      if (bucket) {
        bucket.r += r;
        bucket.g += g;
        bucket.b += b;
        bucket.n += 1;
      } else {
        buckets.set(key, { r, g, b, n: 1 });
      }
    }
  }

  try {
    collect(inset, inset, width - inset * 2, 1, span, 1);
    collect(inset, height - 1 - inset, width - inset * 2, 1, span, 1);
    collect(inset, inset, 1, height - inset * 2, 1, span);
    collect(width - 1 - inset, inset, 1, height - inset * 2, 1, span);
  } catch {
    return null;
  }

  let best: { r: number; g: number; b: number; n: number } | null = null;
  for (const bucket of buckets.values()) {
    if (!best || bucket.n > best.n) best = bucket;
  }
  if (!best) return null;

  const r = Math.round(best.r / best.n);
  const g = Math.round(best.g / best.n);
  const b = Math.round(best.b / best.n);
  // A white field disappears behind a white shot. A light gray keeps the edge.
  if (r >= 242 && g >= 242 && b >= 242) return "#efeeeb";
  return `rgb(${r} ${g} ${b})`;
}

function chromeOn(background: string) {
  const channels = background.match(/\d+/g)?.map(Number);
  if (!channels || channels.length < 3) return "var(--ink)";
  const [r, g, b] = channels;
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
    ? "var(--espresso)"
    : "var(--parchment)";
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

function SpeakerIcon({
  off,
  ...props
}: React.SVGProps<SVGSVGElement> & { off?: boolean }) {
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
      <path d="M11 5L6 9H3v6h3l5 4V5z" />
      {off ? (
        <path d="M16 9l5 6M21 9l-5 6" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      )}
    </svg>
  );
}
