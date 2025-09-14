"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.geminiGenerate = exports.ping = void 0;
// functions/src/index.ts — Cloud Functions v2
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
// Secret de Gemini (set amb: firebase functions:secrets:set GEMINI_KEY)
const GEMINI_KEY = (0, params_1.defineSecret)('GEMINI_KEY');
// 0) Funció de prova
exports.ping = (0, https_1.onRequest)({ region: 'europe-west1', memory: '256MiB', timeoutSeconds: 10, cors: true }, async (_req, res) => {
    res.status(200).json({ ok: true, msg: 'pong from europe-west1 v2' });
});
// 1) Proxy segur per a Gemini
exports.geminiGenerate = (0, https_1.onRequest)({
    region: 'europe-west1',
    memory: '512MiB',
    timeoutSeconds: 30,
    cors: true,
    secrets: [GEMINI_KEY],
}, async (req, res) => {
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
        const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' +
            '?key=' + encodeURIComponent(apiKey);
        const payload = { contents, systemInstruction, generationConfig };
        const r = await (0, cross_fetch_1.default)(url, {
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
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'proxy_failed', message: err?.message });
    }
});
