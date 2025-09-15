// services/seedService.ts
import { app } from './firebase';
import { getFunctions, httpsCallable } from 'firebase/functions';

export async function runCloudSeed(): Promise<{ articles: number; myths: number; skipped: boolean }> {
  const functions = getFunctions(app, 'europe-west1');
  const seedFn = httpsCallable(functions, 'seedDemoContent');
  const res = await seedFn({});
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = res.data as any;
  return {
    articles: data.articles ?? 0,
    myths: data.myths ?? 0,
    skipped: !!data.skipped,
  };
}
