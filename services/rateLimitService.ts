// services/rateLimitService.ts
import {
  getFirestore,
  runTransaction,
  doc,
  serverTimestamp
} from 'firebase/firestore';

const db = getFirestore();

export type QuotaKind = 'chat' | 'roleplay' | 'journal';

export const DEFAULT_LIMITS: Record<QuotaKind, { perMinute: number; perDay: number }> = {
  chat:     { perMinute: 30, perDay: 300 },
  roleplay: { perMinute: 20, perDay: 200 },
  journal:  { perMinute: 10, perDay: 50  },
};

type RLDoc = {
  minuteWindowStart?: number;
  minuteCount?: number;
  dayWindowStart?: number;
  dayCount?: number;
  updatedAt?: any;
};

export async function checkAndConsumeQuota(
  uid: string,
  kind: QuotaKind,
  limits: { perMinute: number; perDay: number } = DEFAULT_LIMITS[kind]
): Promise<{ ok: boolean; reason?: string; remainingMinute?: number; remainingDay?: number; }> {
  const ref = doc(db, 'users', uid, 'rateLimits', kind);
  const now = Date.now();

  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    const data = (snap.exists() ? snap.data() : {}) as RLDoc;

    let { minuteWindowStart = 0, minuteCount = 0, dayWindowStart = 0, dayCount = 0 } = data;

    // Finestra d'1 minut
    if (now - minuteWindowStart >= 60_000) {
      minuteWindowStart = now;
      minuteCount = 0;
    }
    // Finestra d'1 dia
    if (now - dayWindowStart >= 86_400_000) {
      dayWindowStart = now;
      dayCount = 0;
    }

    if (minuteCount >= limits.perMinute) {
      return { ok: false, reason: 'S’ha superat el límit per minut', remainingMinute: 0, remainingDay: Math.max(0, limits.perDay - dayCount) };
    }
    if (dayCount >= limits.perDay) {
      return { ok: false, reason: 'S’ha superat el límit diari', remainingMinute: Math.max(0, limits.perMinute - minuteCount), remainingDay: 0 };
    }

    minuteCount += 1;
    dayCount += 1;

    tx.set(ref, {
      minuteWindowStart,
      minuteCount,
      dayWindowStart,
      dayCount,
      updatedAt: serverTimestamp()
    }, { merge: true });

    return {
      ok: true,
      remainingMinute: Math.max(0, limits.perMinute - minuteCount),
      remainingDay: Math.max(0, limits.perDay - dayCount),
    };
  });
}
