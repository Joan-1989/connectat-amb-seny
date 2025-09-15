// functions/src/index.ts — Cloud Functions v2
import fetch from 'cross-fetch';
import type { Request, Response } from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';

// Secret de Gemini (set amb: firebase functions:secrets:set GEMINI_KEY)
const GEMINI_KEY = defineSecret('GEMINI_KEY');

// 0) Funció de prova
export const ping = onRequest(
  { region: 'europe-west1', memory: '256MiB', timeoutSeconds: 10, cors: true },
  async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json({ ok: true, msg: 'pong from europe-west1 v2' });
  }
);
export { seedDemoContent } from './seedDemo';


// 1) Proxy segur per a Gemini
export const geminiGenerate = onRequest(
  {
    region: 'europe-west1',
    memory: '512MiB',
    timeoutSeconds: 30,
    cors: true,
    secrets: [GEMINI_KEY],
  },
  async (req: Request, res: Response): Promise<void> => {
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    try {
      const apiKey = process.env.GEMINI_KEY;
      if (!apiKey) {
        res.status(500).json({ error: 'Missing GEMINI key (secret)' });
        return;
      }

      const { contents, systemInstruction, generationConfig } = (req.body || {});
      if (!Array.isArray(contents)) {
        res.status(400).json({ error: 'contents[] required' });
        return;
      }

      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' +
        '?key=' + encodeURIComponent(apiKey);

      const payload = { contents, systemInstruction, generationConfig };

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await r.json().catch(() => ({}));

      if (!r.ok) {
        res.status(r.status).json({ error: data });
        return;
      }
      res.status(200).json(data);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ error: 'proxy_failed', message: err?.message });
    }
  }
);
