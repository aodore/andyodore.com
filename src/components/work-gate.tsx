"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { PasswordModal } from "@/components/password-modal";
import {
  caseStudyHref,
  getCaseStudy,
  type CaseStudy,
  type CaseStudySlug,
} from "@/lib/case-studies";
import { isGatedWorkSlug } from "@/lib/gated-work";

type WorkGateValue = {
  unlocked: boolean;
  requestUnlock: (slug: CaseStudySlug) => void;
};

const WorkGateContext = createContext<WorkGateValue>({
  unlocked: true,
  requestUnlock: () => {},
});

export function useWorkGate() {
  return useContext(WorkGateContext);
}

export function WorkGate({
  children,
  unlocked,
  initialSlug,
}: {
  children: React.ReactNode;
  unlocked: boolean;
  initialSlug?: CaseStudySlug;
}) {
  const router = useRouter();
  const [study, setStudy] = useState<CaseStudy | null>(
    () => (initialSlug ? (getCaseStudy(initialSlug) ?? null) : null),
  );

  const requestUnlock = useCallback(
    (slug: CaseStudySlug) => {
      if (unlocked || !isGatedWorkSlug(slug)) return;
      const next = getCaseStudy(slug);
      if (next) setStudy(next);
    },
    [unlocked],
  );

  const close = useCallback(() => {
    setStudy(null);
    if (initialSlug) router.replace("/", { scroll: false });
  }, [initialSlug, router]);

  const unlock = useCallback(
    (next: CaseStudy) => {
      setStudy(null);
      router.push(caseStudyHref(next.slug));
    },
    [router],
  );

  const value = useMemo(
    () => ({ unlocked, requestUnlock }),
    [unlocked, requestUnlock],
  );

  return (
    <WorkGateContext.Provider value={value}>
      {children}
      <PasswordModal study={study} onClose={close} onUnlock={unlock} />
    </WorkGateContext.Provider>
  );
}
