"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ArrowIcon, CloseIcon } from "@/components/brand";
import type { CaseStudyShot } from "@/lib/case-studies";
import { quietCues } from "@/lib/sound";

const OpenShot = createContext<(index: number) => void>(() => {});

export function ShotLightbox({
  shots,
  children,
}: {
  shots: CaseStudyShot[];
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);
  const shot = index !== null ? shots[index] : null;

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    if (shot) {
      if (!node.open) node.showModal();
    } else if (node.open) {
      node.close();
    }
  }, [shot]);

  function close() {
    setIndex(null);
  }

  function step(delta: number) {
    if (shots.length === 0) return;
    setIndex((current) => {
      if (current === null) return current;
      return (current + delta + shots.length) % shots.length;
    });
  }

  return (
    <OpenShot.Provider value={setIndex}>
      {children}
      <dialog
        ref={dialog}
        aria-label="Case study images"
        className="password-dialog"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) close();
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
            close();
          }
        }}
      >
        {shot && index !== null && (
          <ShotFrame
            shot={shot}
            index={index}
            total={shots.length}
            onClose={close}
            onStep={step}
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
  const openAt = useContext(OpenShot);

  return (
    <figure className="t-stagger-line overflow-hidden rounded-3xl">
      <button
        type="button"
        aria-label={`View image ${index + 1}: ${shot.alt}`}
        className="block w-full cursor-zoom-in"
        onClick={() => openAt(index)}
      >
        <ShotImage shot={shot} className="h-auto w-full" />
      </button>
    </figure>
  );
}

function ShotImage({
  shot,
  className,
}: {
  shot: CaseStudyShot;
  className?: string;
}) {
  return (
    <Image
      src={shot.src}
      alt={shot.alt}
      width={shot.width ?? 1636}
      height={shot.height ?? 866}
      // These are UI screenshots at 2x. Next's optimizer resizes them to the
      // default srcset widths and recompresses, which is what made type muddy.
      unoptimized
      className={className}
    />
  );
}

function ShotFrame({
  shot,
  index,
  total,
  onClose,
  onStep,
}: {
  shot: CaseStudyShot;
  index: number;
  total: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const swipe = useRef<number | null>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [index]);

  const many = total > 1;

  return (
    <div
      className="password-dialog-panel bg-canvas flex max-h-[calc(100dvh-2rem)] w-full max-w-[min(1636px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl p-4 md:p-6"
      onTouchStart={(event) => {
        swipe.current = event.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = swipe.current;
        swipe.current = null;
        if (start === null || !many) return;
        const delta = (event.changedTouches[0]?.clientX ?? start) - start;
        if (delta > 48) onStep(-1);
        if (delta < -48) onStep(1);
      }}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          {many && (
            <button
              type="button"
              onClick={() => onStep(-1)}
              aria-label="Previous image"
              className="text-ink hover:bg-ink/8 grid size-8 cursor-pointer place-items-center rounded-full transition-colors"
            >
              <ArrowIcon className="size-4 -scale-x-100" />
            </button>
          )}
          <p
            aria-live="polite"
            className="text-muted min-w-[4.5em] text-center text-xs leading-[1.46] xl:text-[13px]"
          >
            {index + 1} / {total}
          </p>
          {many && (
            <button
              type="button"
              onClick={() => onStep(1)}
              aria-label="Next image"
              className="text-ink hover:bg-ink/8 grid size-8 cursor-pointer place-items-center rounded-full transition-colors"
            >
              <ArrowIcon className="size-4" />
            </button>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-ink hover:bg-ink/8 grid size-8 cursor-pointer place-items-center rounded-full transition-colors"
          {...quietCues}
        >
          <CloseIcon className="size-4" />
        </button>
      </div>

      <div
        ref={scroller}
        className="mt-4 min-h-0 flex-1 overflow-auto rounded-2xl"
      >
        <ShotImage
          key={shot.src + String(index)}
          shot={shot}
          className="mx-auto h-auto w-full"
        />
      </div>
    </div>
  );
}
