"use client";

import { play } from "cuelume";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand";
import {
  ACCENT_STORAGE_KEY,
  ENTRY_REOPEN_EVENT,
  accents,
} from "@/lib/accent";

/** Five seats, the first at twelve o'clock and the rest clockwise. */
const SEAT_DEG = 360 / accents.length;
const TOP_DEG = -90;

/** One revolution of the drift: slow enough to read as floating rather than
    spinning. */
const ORBIT_SEC = 54;

/** The drift's time constant for easing to a halt and back up again, so
    hovering a monogram glides the circle to a stop instead of cutting it. */
const DRIFT_TAU = 0.2;

/** Each monogram's float, as a fraction of a monogram. The periods are
    deliberately unrelated so the five never line up. */
const FLOAT_X = 0.05;
const FLOAT_Y = 0.1;
const FLOAT = accents.map((_, i) => ({
  periodX: 4.3 + i * 0.61,
  periodY: 3.1 + i * 0.43,
  phase: i * 1.87,
}));

/** The gap between monograms on the way in. */
const ARRIVE_GAP = 0.12;

/** The spring that carries a monogram wherever it belongs: into frame on
    arrival, back to its seat after a miss, down into the slot once it is
    chosen. Under-damped, so every move settles with a small overshoot
    instead of creeping in. */
const SPRING = 118;
const DAMPING = 12;

/** Posting is the one move that should feel decisive, so it gets its own
    stiffer, tighter spring. */
const POST_SPRING = 260;
const POST_DAMPING = 22;

/** A press that travels less than this is a click, and a click posts the
    monogram on its own. That is also what makes the entry work from a
    keyboard, where there is no drag to make. */
const TAP_PX = 6;

/** Slack around the mouth of the slot. Dropping is meant to be forgiving. */
const CATCH_PX = 52;

/** Long enough for the monogram to be all the way in before the floor goes. */
const POST_MS = 420;
/** The cream stage falling out the bottom of the viewport. */
const DROP_MS = 720;
/** The chosen canvas fading in over the empty frame. */
const WIPE_MS = 640;
/** Home stagger playing on the color that just landed. */
const CLEAR_MS = 700;

/** Matches `.entry-seat.is-held { scale: 1.14 }` so the slot mask is aimed
    at the disc you see, not the unscaled box. */
const HELD_SCALE = 1.14;

type Phase =
  | "gate"
  | "returning"
  | "unwinding"
  | "posting"
  | "dropping"
  | "wiping"
  | "clearing"
  | "closed";

/** A monogram's offset from the pentagon's center, and the velocity carrying
    it there. */
type Seat = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Seconds into the entry before this one falls in, and whether it still
      has that wait ahead of it. */
  wake: number;
  waiting: boolean;
};

type Grab = {
  index: number;
  pointerId: number;
  /** Where the pointer sat relative to the monogram's center at the press,
      so the monogram doesn't jump to be centered under the cursor. */
  dx: number;
  dy: number;
  /** The press's origin, to tell a tap from a drag. */
  fromX: number;
  fromY: number;
  /** The latest pointer position, parked here for the loop to read rather
      than written to the DOM on the spot, so a fast mouse can't outrun a
      frame or cost one layout per move. */
  x: number;
  y: number;
};

type Live = {
  phase: Phase;
  seats: Seat[];
  spin: number;
  drift: number;
  hot: number;
  grab: Grab | null;
  posted: number;
  armed: boolean;
  reduced: boolean;
};

function freshLive(): Live {
  return {
    phase: "gate",
    seats: accents.map((_, i) => ({
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      wake: i * ARRIVE_GAP,
      waiting: true,
    })),
    spin: 0,
    drift: 0,
    hot: -1,
    grab: null,
    posted: -1,
    armed: false,
    reduced: false,
  };
}

/**
 * The way into the site: five monograms drift in a circle, you drag one down
 * into the slot of a ballot box, and the color it was wearing takes over the
 * page behind it.
 *
 * Rendered on every home page request but only ever raised by the pre-paint
 * script in `accentScript`, which adds `entry-pending` to the document root
 * when storage holds no choice. That is what keeps the home page from
 * flashing behind the gate, and it is why this component's first job is to
 * find out whether it was raised at all.
 */
export function MonogramEntry() {
  const [phase, setPhase] = useState<Phase>("gate");
  /** The monogram in hand, and the one that landed. */
  const [grabbed, setGrabbed] = useState(-1);
  const [posted, setPosted] = useState(-1);
  /** The monogram in hand is over the mouth and would land. */
  const [armed, setArmed] = useState(false);
  /** Bumped when the header monogram asks for another choice, so the
      animation loop mounts on a clean clock. */
  const [epoch, setEpoch] = useState(0);

  const orbitRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const seatRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const timers = useRef<number[]>([]);

  /** Everything the animation loop reads. Kept out of state so a frame never
      costs a render, and mirrored from state where the two overlap. */
  const live = useRef(freshLive());

  const advance = useCallback((next: Phase) => {
    live.current.phase = next;
    setPhase(next);
  }, []);

  /** Re-derives which monogram the cursor is over from what is actually under
      it. Pointer capture suppresses boundary events for everything but the
      element holding the capture, and React's enter/leave bookkeeping does
      not reliably recover when that capture is released — so a drag would
      otherwise end with the hover still set, and the drift parked for good. */
  const settleHover = useCallback((x: number, y: number) => {
    const seat = document
      .elementFromPoint(x, y)
      ?.closest<HTMLElement>(".entry-seat");
    live.current.hot = seat
      ? seatRefs.current.findIndex((el) => el === seat)
      : -1;
  }, []);

  /** Whether a monogram centered here would land. Measured off the slot on
      the spot rather than read from the armed flag, because a quick flick can
      be pressed, dragged, and released inside a single frame, and the loop
      would never have got a look at it. */
  const overMouth = useCallback((x: number, y: number) => {
    const slot = slotRef.current;
    if (!slot) return false;
    const mouth = slot.getBoundingClientRect();
    return (
      x > mouth.left - CATCH_PX &&
      x < mouth.right + CATCH_PX &&
      y > mouth.top - CATCH_PX &&
      y < mouth.bottom + CATCH_PX
    );
  }, []);

  useEffect(
    () => () => {
      timers.current.forEach(window.clearTimeout);
    },
    [],
  );

  useEffect(() => {
    const reopen = () => {
      timers.current.forEach(window.clearTimeout);
      timers.current = [];
      live.current = freshLive();
      live.current.phase = "returning";
      setGrabbed(-1);
      setPosted(-1);
      setArmed(false);
      setPhase("returning");
      setEpoch((n) => n + 1);
    };
    window.addEventListener(ENTRY_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(ENTRY_REOPEN_EVENT, reopen);
  }, []);

  /** Raise the overlay after a reopen. The home page is already hidden;
      the flood starts on the themed canvas and eases to cream, then the
      stage takes over on that same color. */
  useLayoutEffect(() => {
    if (epoch === 0) return;
    const root = document.documentElement;
    root.classList.add("entry-pending");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const fade = reduced ? 200 : WIPE_MS;

    let inner = 0;
    let settle = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        advance("unwinding");
        timers.current.push(
          window.setTimeout(() => {
            settle = requestAnimationFrame(() => {
              for (const accent of accents) {
                root.classList.remove(`accent-${accent.name}`);
              }
              advance("gate");
            });
          }, fade),
        );
      });
    });

    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
      cancelAnimationFrame(settle);
    };
  }, [epoch, advance]);

  /** The drift, the float, and every spring, on one clock. The loop owns
      `translate` on each seat and nothing else, so React keeps every class
      it sets and the two never overwrite each other. Mounted once: the phase
      it cares about is read from the ref, so no transition restarts it and
      drops the clock back to zero mid-float.

      This is also where the gate finds out whether it was raised. When the
      script left `entry-pending` off, the markup below is already
      `display: none` from the first paint — out of the layout, out of the
      accessibility tree, out of the tab order — so there is nothing to
      close, and declining to start the loop is the whole of standing down. */
  useEffect(() => {
    if (!document.documentElement.classList.contains("entry-pending")) return;

    live.current.reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let frame = 0;
    let last = performance.now();
    let clock = 0;

    function tick(now: number) {
      const state = live.current;
      // Past the choice the stage is CSS's, and there is nothing left to
      // schedule. Returning / unwinding keep the clock alive so the seats
      // can fall in once cream has covered, without a gap in rAF.
      if (state.phase !== "gate" && state.phase !== "posting") {
        last = now;
        if (state.phase === "returning" || state.phase === "unwinding") {
          frame = requestAnimationFrame(tick);
        }
        return;
      }
      frame = requestAnimationFrame(tick);

      // Clamped so a backgrounded tab doesn't resume with one enormous step
      // and fling every spring off screen.
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      clock += dt;

      const orbit = orbitRef.current;
      const slot = slotRef.current;
      if (!orbit || !slot) return;

      // Read before writing, once a frame: layout is already settled at the
      // top of a frame, so this is free, and nothing goes stale on a resize,
      // a zoom, or a font finally landing.
      const ring = orbit.getBoundingClientRect();
      const mouth = slot.getBoundingClientRect();
      if (!ring.width) return;

      const radius = ring.width / 2;
      const size = radius / 1.94;
      const cx = ring.left + ring.width / 2;
      const cy = ring.top + ring.height / 2;

      // The circle holds still while a monogram is under the cursor or in
      // hand, and glides back up to speed when it is let go.
      const wanted =
        state.reduced || state.hot >= 0 || state.grab || state.posted >= 0
          ? 0
          : 360 / ORBIT_SEC;
      state.drift += (wanted - state.drift) * Math.min(dt / DRIFT_TAU, 1);
      state.spin += state.drift * dt;

      let armedNow = false;

      state.seats.forEach((seat, i) => {
        const el = seatRefs.current[i];
        if (!el) return;

        const angle = ((TOP_DEG + i * SEAT_DEG + state.spin) * Math.PI) / 180;
        const float = FLOAT[i];

        // Where this monogram wants to be: its seat on the pentagon, plus a
        // slow float, unless it has been posted or picked up.
        let toX = Math.cos(angle) * radius;
        let toY = Math.sin(angle) * radius;
        let spring = SPRING;
        let damping = DAMPING;

        if (!state.reduced) {
          toX +=
            Math.cos((clock / float.periodX) * Math.PI * 2 + float.phase) *
            size *
            FLOAT_X;
          toY +=
            Math.sin((clock / float.periodY) * Math.PI * 2 + float.phase) *
            size *
            FLOAT_Y;
        }

        if (state.posted === i) {
          // Centered on the mouth and far enough into it that the clip in
          // CSS cuts the circle exactly at the slot's line.
          toX = mouth.left + mouth.width / 2 - cx;
          toY = mouth.top + mouth.height / 2 - size * 0.2 - cy;
          spring = POST_SPRING;
          damping = POST_DAMPING;
        }

        if (seat.waiting) {
          // Parked above the fold until its turn in the arrival comes up.
          if (!state.reduced && clock < seat.wake) {
            seat.x = toX;
            seat.y = -(cy + size * 1.6);
            el.style.translate = `${seat.x.toFixed(2)}px ${seat.y.toFixed(2)}px`;
            return;
          }
          seat.waiting = false;
        }

        const grab = state.grab;
        if (grab?.index === i) {
          // Straight to the pointer: a spring here would feel like the
          // monogram was on elastic. Velocity is carried across anyway, so
          // letting go mid-flick still throws it.
          const nextX = grab.x - grab.dx - cx;
          const nextY = grab.y - grab.dy - cy;
          seat.vx = (nextX - seat.x) / dt;
          seat.vy = (nextY - seat.y) / dt;
          seat.x = nextX;
          seat.y = nextY;

          armedNow = overMouth(cx + seat.x, cy + seat.y);
        } else if (state.reduced) {
          // No springs for anyone who asked for no motion: seats, spring-backs
          // after a miss, and the landing in the slot all just arrive.
          seat.x = toX;
          seat.y = toY;
        } else {
          // Semi-implicit Euler: stable at any frame rate we will ever see.
          seat.vx += (toX - seat.x) * spring * dt;
          seat.vy += (toY - seat.y) * spring * dt;
          seat.vx -= seat.vx * damping * dt;
          seat.vy -= seat.vy * damping * dt;
          seat.x += seat.vx * dt;
          seat.y += seat.vy * dt;
        }

        el.style.translate = `${seat.x.toFixed(2)}px ${seat.y.toFixed(2)}px`;

        // Clip anything below the slot's line while this disc is over the
        // mouth, so it reads as going into the box rather than sitting on it.
        const dipping = state.grab?.index === i || state.posted === i;
        if (!dipping) {
          el.style.removeProperty("--entry-sink");
        } else {
          const scale = state.grab?.index === i ? HELD_SCALE : 1;
          const centerY = cy + seat.y;
          const line = mouth.top + mouth.height / 2;
          const localLine = (line - centerY) / scale;
          const pct = ((size / 2 - localLine) / size) * 100;
          if (pct <= 0.4) el.style.removeProperty("--entry-sink");
          else el.style.setProperty("--entry-sink", `${Math.min(100, pct).toFixed(1)}%`);
        }
      });

      if (armedNow !== state.armed) {
        state.armed = armedNow;
        setArmed(armedNow);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [overMouth, epoch]);

  /** The choice, and the handover to the page behind. */
  const post = useCallback(
    (index: number) => {
      const state = live.current;
      if (state.posted >= 0 || state.phase !== "gate") return;

      const accent = accents[index];
      state.posted = index;
      state.grab = null;
      state.hot = -1;
      state.armed = false;
      setPosted(index);
      setGrabbed(-1);
      setArmed(false);
      advance("posting");
      play("success");

      try {
        localStorage.setItem(ACCENT_STORAGE_KEY, accent.name);
      } catch {
        // Storage is unavailable in private mode. The palette still applies;
        // the visitor just gets to choose again next time.
      }

      const root = document.documentElement;
      timers.current.push(
        // Floor first, then the color, then the page. Accent stays off the
        // document until the fade has covered the cream, so the hole the
        // stage leaves is not a flash of the destination.
        window.setTimeout(() => {
          advance("dropping");
        }, POST_MS),
        window.setTimeout(() => {
          advance("wiping");
        }, POST_MS + DROP_MS),
        window.setTimeout(() => {
          root.classList.add(`accent-${accent.name}`, "entry-revealed");
          advance("clearing");
        }, POST_MS + DROP_MS + WIPE_MS),
        window.setTimeout(() => {
          root.classList.remove("entry-pending", "entry-revealed");
          advance("closed");
        }, POST_MS + DROP_MS + WIPE_MS + CLEAR_MS),
      );
    },
    [advance],
  );

  function grabAt(event: React.PointerEvent<HTMLButtonElement>, index: number) {
    if (live.current.posted >= 0 || live.current.phase !== "gate") return;
    if (live.current.phase !== "gate") return;

    const box = event.currentTarget.getBoundingClientRect();
    live.current.grab = {
      index,
      pointerId: event.pointerId,
      dx: event.clientX - (box.left + box.width / 2),
      dy: event.clientY - (box.top + box.height / 2),
      fromX: event.clientX,
      fromY: event.clientY,
      x: event.clientX,
      y: event.clientY,
    };
    try {
      // Capture is what lets the monogram be dragged past its own bounds and
      // off the edge of the stage. It throws if the pointer is already gone
      // by the time this runs, which only costs the drag, not the choice:
      // the press still counts as a tap on release.
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Nothing to release.
    }
    setGrabbed(index);
  }

  function dragTo(event: React.PointerEvent<HTMLButtonElement>) {
    const grab = live.current.grab;
    if (!grab || grab.pointerId !== event.pointerId) return;
    grab.x = event.clientX;
    grab.y = event.clientY;
  }

  function release(event: React.PointerEvent<HTMLButtonElement>) {
    const state = live.current;
    const grab = state.grab;
    if (!grab || grab.pointerId !== event.pointerId) return;

    const travelled =
      Math.abs(event.clientX - grab.fromX) > TAP_PX ||
      Math.abs(event.clientY - grab.fromY) > TAP_PX;
    const landed = overMouth(
      event.clientX - grab.dx,
      event.clientY - grab.dy,
    );

    state.grab = null;
    setGrabbed(-1);

    // A press that went nowhere is a choice, so the monogram posts itself. A
    // drag only lands if it was let go near the mouth; anywhere else and the
    // spring carries it back to its seat.
    if (!travelled || landed) {
      post(grab.index);
      return;
    }

    state.armed = false;
    setArmed(false);
    settleHover(event.clientX, event.clientY);
    play("whisper");
  }

  /** A cancelled press — a gesture the browser took over, or a window that
      lost the pointer. Puts the monogram back without reading it as a miss. */
  function letGo(event: React.PointerEvent<HTMLButtonElement>) {
    const state = live.current;
    if (!state.grab || state.grab.pointerId !== event.pointerId) return;
    state.grab = null;
    state.armed = false;
    setGrabbed(-1);
    setArmed(false);
    settleHover(event.clientX, event.clientY);
  }

  if (phase === "closed") return null;

  const chosen = posted >= 0 ? accents[posted] : null;

  return (
    <div
      className="monogram-entry"
      data-phase={phase}
      role="dialog"
      aria-modal="true"
      aria-label="Choose your experience"
    >
      <div className={`entry-stage${grabbed >= 0 ? " is-holding" : ""}`}>
        <p className="sr-only">
          Five monograms, one for each color the site can wear. Drag one into
          the slot of the box below, or press it to post it.
        </p>

        <p className="entry-headline">Choose your experience.</p>

        <div className="entry-floor" />

        <div className={`entry-box${armed ? " is-armed" : ""}`}>
          <div className="entry-lid">
            <div ref={slotRef} className="entry-slot" />
          </div>
        </div>

        <div ref={orbitRef} className="entry-orbit">
          {accents.map((accent, i) => (
            <button
              key={accent.name}
              ref={(el) => {
                seatRefs.current[i] = el;
              }}
              type="button"
              className={`entry-seat accent-${accent.name}${
                grabbed === i ? " is-held" : ""
              }${posted === i ? " is-posted" : ""}`}
              aria-label={`${accent.label} — enter the site in this color`}
              disabled={posted >= 0 || phase !== "gate"}
              onPointerDown={(event) => grabAt(event, i)}
              onPointerMove={dragTo}
              onPointerUp={release}
              onPointerCancel={letGo}
              onPointerEnter={() => {
                live.current.hot = i;
              }}
              onPointerLeave={() => {
                if (live.current.hot === i) live.current.hot = -1;
              }}
              onFocus={() => {
                live.current.hot = i;
              }}
              onBlur={() => {
                if (live.current.hot === i) live.current.hot = -1;
              }}
              // Keyboard activation only: a mouse click is already settled on
              // release, and `detail` is 0 for Enter and Space.
              onClick={(event) => {
                if (event.detail === 0) post(i);
              }}
              data-cuelume-hover="press"
            >
              <span className="entry-mark">
                <Monogram />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chosen canvas, invisible until the stage has fallen, then it fades
          in over the whole screen. */}
      <div className={`entry-flood${chosen ? ` accent-${chosen.name}` : ""}`} />
    </div>
  );
}
