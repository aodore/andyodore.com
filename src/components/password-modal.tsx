"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowIcon,
  CloseIcon,
  EyeIcon,
  EyeOffIcon,
  Monogram,
} from "@/components/brand";
import type { CaseStudy } from "@/lib/case-studies";
import { helloCues, quietCues } from "@/lib/sound";
import { unlockWork } from "@/lib/unlock-work";

export function PasswordModal({
  study,
  onClose,
  onUnlock,
}: {
  study: CaseStudy | null;
  onClose: () => void;
  onUnlock: (study: CaseStudy) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;

    if (study) {
      if (!node.open) node.showModal();
      input.current?.focus();
    } else if (node.open) {
      node.close();
    }
  }, [study]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="work-password-title"
      aria-describedby="work-password-copy"
      className="password-dialog"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      {study && (
        <PasswordForm
          study={study}
          inputRef={input}
          onDismiss={onClose}
          onUnlock={onUnlock}
        />
      )}
    </dialog>
  );
}

function PasswordForm({
  study,
  inputRef,
  onDismiss,
  onUnlock,
}: {
  study: CaseStudy;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onDismiss: () => void;
  onUnlock: (study: CaseStudy) => void;
}) {
  const [password, setPassword] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const alive = useRef(true);

  function toggleReveal() {
    const node = inputRef.current;
    const start = node?.selectionStart ?? null;
    const end = node?.selectionEnd ?? null;
    setRevealed((open) => !open);
    requestAnimationFrame(() => {
      node?.focus();
      if (start !== null && end !== null) {
        node?.setSelectionRange(start, end);
      }
    });
  }

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    const result = await unlockWork(password);
    if (!alive.current) return;
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      inputRef.current?.select();
      return;
    }

    onUnlock(study);
  }

  return (
    <form
      onSubmit={submit}
      className="password-dialog-panel bg-canvas flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-y-auto rounded-3xl p-6 md:p-10"
    >
      <div className="flex items-start justify-between">
        <Monogram className="size-12" />
        <button
          type="button"
          onClick={onDismiss}
          disabled={pending}
          aria-label="Close"
          className="text-ink hover:bg-ink/8 grid size-8 cursor-pointer place-items-center rounded-full transition-colors disabled:opacity-70"
          {...quietCues}
        >
          <CloseIcon className="size-4" />
        </button>
      </div>

      <h2
        id="work-password-title"
        className="text-ink font-display mt-8 text-[2rem] leading-[1.05] font-thin text-balance md:text-[2.5rem]"
      >
        This work is for the curious.
      </h2>
      <p
        id="work-password-copy"
        className="text-lede mt-4 text-base leading-snug font-light md:text-lg"
      >
        Ask me for the password. One unlock opens all three case studies.
      </p>

      <label
        htmlFor="work-password"
        className="text-accent mt-8 text-lg leading-tight font-medium xl:text-2xl"
      >
        Password
      </label>
      <div
        className={`bg-ink/6 relative mt-3 rounded-2xl ${
          error ? "password-field-error" : ""
        }`}
      >
        <input
          ref={inputRef}
          id="work-password"
          type={revealed ? "text" : "password"}
          name="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (error) setError(null);
          }}
          autoComplete="current-password"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? "work-password-error" : undefined}
          className="w-full rounded-2xl bg-transparent py-3.5 pr-12 pl-4 text-lg text-ink placeholder:text-muted/50"
        />
        <button
          type="button"
          onClick={toggleReveal}
          aria-label={revealed ? "Hide password" : "Show password"}
          aria-pressed={revealed}
          className="text-ink hover:bg-ink/8 group absolute top-1/2 right-1.5 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full transition-colors"
          {...quietCues}
        >
          {revealed ? (
            <EyeIcon className="size-4" />
          ) : (
            <EyeOffIcon className="size-4" />
          )}
          {/* Flavor text only. The aria-label above stays the accessible name. */}
          <span
            aria-hidden
            className="bg-ink text-canvas pointer-events-none absolute top-full right-0 z-10 mt-2 rounded-md px-2 py-1 text-xs whitespace-nowrap opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            {revealed ? "Hide it" : "Have a peek"}
          </span>
        </button>
      </div>
      {error && (
        <p
          id="work-password-error"
          role="alert"
          className="text-lede mt-3 text-sm"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink text-canvas hover:bg-ink/85 mt-8 flex h-12 w-fit cursor-pointer items-center gap-2 rounded-full px-5 font-medium transition-colors disabled:cursor-wait disabled:opacity-70"
        {...helloCues}
      >
        <span className="translate-y-[1px]">
          {pending ? "Opening…" : `Open ${study.title}`}
        </span>
        <ArrowIcon className="size-4" />
      </button>
    </form>
  );
}
