export const TALK_CHANNEL = "andyodore-talk";

export type TalkStateMessage = {
  type: "state";
  session: string;
  slug: string;
  index: number;
  total: number;
  open: boolean;
};

export type TalkHelloMessage = {
  type: "hello";
  session: string;
  slug: string;
};

export type TalkStepMessage = {
  type: "step";
  session: string;
  slug: string;
  delta: 1 | -1;
};

export type TalkMessage = TalkStateMessage | TalkHelloMessage | TalkStepMessage;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readTalkMessage(data: unknown): TalkMessage | null {
  if (!isRecord(data)) return null;
  const { type, session, slug } = data;
  if (typeof type !== "string" || typeof session !== "string" || session.length > 64) {
    return null;
  }
  if (typeof slug !== "string" || slug.length > 80) return null;

  if (type === "hello") return { type, session, slug };
  if (type === "step" && (data.delta === 1 || data.delta === -1)) {
    return { type, session, slug, delta: data.delta };
  }
  if (
    type === "state" &&
    typeof data.index === "number" &&
    Number.isInteger(data.index) &&
    data.index >= 0 &&
    typeof data.total === "number" &&
    Number.isInteger(data.total) &&
    data.total >= 0 &&
    typeof data.open === "boolean"
  ) {
    return {
      type,
      session,
      slug,
      index: data.index,
      total: data.total,
      open: data.open,
    };
  }
  return null;
}
