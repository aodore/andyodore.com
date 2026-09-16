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
import { CloseIcon } from "@/components/brand";
import type { CaseStudyShot } from "@/lib/case-studies";
import { dismissCues } from "@/lib/sound";

const OpenShot = createContext<{
  openAt: (index: number, origin?: OpenOrigin) => void;
  openIndex: number | null;
}>({
  openAt: () => {},
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
  children,
}: {
  shots: CaseStudyShot[];
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const [field, setField] = useState<ShotField | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [leaving, setLeaving] = useState<ShotTransit | null>(null);
  const [phase, setPhase] = useState<SlidePhase>("idle");
  const [presence, setPresence] = useState<Presence>("closed");
  const origin = useRef<OpenOrigin | null>(null);
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

  function applyField(next: ShotField) {
    if (phase === "idle") {
      setField(next);
      return;
    }
    pendingField.current = next;
  }

  return (
    <OpenShot.Provider value={{ openAt, openIndex: index }}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Case study images"
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
          requestClose();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) requestClose();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            step(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            step(-1);
          } else if (event.key === "Escape") {
            event.preventDefault();
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
            onClose={requestClose}
            onStep={step}
            onField={applyField}
            onSlideEnd={endSlide}
          />
        )}
      </dialog>
    </OpenShot.Provider>
  );
}

export function ShotTrigger({
  shot,
  index,
}: {
  shot: CaseStudyShot;
  index: number;
}) {
  const { openAt, openIndex } = useContext(OpenShot);

  return (
    <figure
      className={`t-stagger-line overflow-hidden rounded-3xl${
        openIndex === index ? " invisible" : ""
      }`}
    >
      <button
        type="button"
        aria-label={`View image ${index + 1}: ${shot.alt}`}
        className="block w-full cursor-zoom-in"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          openAt(index, {
            x: rect.left,
            y: rect.top,
            w: rect.width,
            h: rect.height,
          });
        }}
      >
        <ShotImage shot={shot} className="h-auto w-full" />
      </button>
    </figure>
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
  onReady?: (img: HTMLImageElement) => void;
} & Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height">) {
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
  onClose,
  onStep,
  onField,
  onSlideEnd,
}: {
  shot: CaseStudyShot;
  index: number;
  total: number;
  direction: 1 | -1;
  leaving: ShotTransit | null;
  phase: SlidePhase;
  shots: CaseStudyShot[];
  canDrag: boolean;
  onClose: () => void;
  onStep: (delta: number) => void;
  onField: (field: ShotField) => void;
  onSlideEnd: () => void;
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
  const grab = many && canDrag && phase === "idle";

  function closeFromField(event: React.MouseEvent<HTMLElement>) {
    if (event.target === event.currentTarget) onClose();
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
      ]
    : [];

  return (
    <div
      className={`shot-dialog-stage relative flex h-full w-full flex-col${
        dragging ? " is-dragging" : ""
      }${many ? " has-many" : ""}`}
    >
      <div className="shot-chrome pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute top-4 right-4 flex items-center gap-3 md:top-6 md:right-6">
          <p
            aria-live="polite"
            className="text-[13px] leading-none tabular-nums"
          >
            {index + 1} / {total}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="shot-dialog-control"
            {...dismissCues}
          >
            <CloseIcon className="size-4" />
          </button>
        </div>
        {many && (
          <>
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous image"
              className="shot-dialog-control pointer-events-auto absolute top-1/2 left-4 -translate-y-1/2 md:left-6"
            >
              <ChevronIcon className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next image"
              className="shot-dialog-control pointer-events-auto absolute top-1/2 right-4 -translate-y-1/2 md:right-6"
            >
              <ChevronIcon className="size-4 -scale-x-100" />
            </button>
          </>
        )}
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
            className="flex w-full items-center justify-center px-16 py-12 md:px-24"
            onClick={onCloseField}
          >
            <ShotImage
              shot={shot}
              className="shot-hero h-auto w-full max-w-[1636px]"
              onPointerDown={onHeroPointerDown}
              onPointerMove={onHeroPointerMove}
              onPointerUp={onHeroPointerUp}
              onPointerCancel={onHeroPointerUp}
              onReady={
                onField
                  ? (img) => {
                      const background = sampleImageField(img);
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
function sampleImageField(img: HTMLImageElement): string | null {
  const width = img.naturalWidth;
  const height = img.naturalHeight;
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

  return `rgb(${Math.round(best.r / best.n)} ${Math.round(best.g / best.n)} ${Math.round(best.b / best.n)})`;
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
