# How to re-enable the real AI API

Right now the wizard is running in **TEST MODE**: when the user clicks
"Create your masterpiece" the uploaded photo is used directly as the
result, no network call is made.

---

## Step 1 — Flip the flag

Open `src/app/components/portrait-wizard.tsx` and find this line near the
top of the file (around line 27):

```ts
const TEST_MODE = true;
```

Change it to:

```ts
const TEST_MODE = false;
```

Save the file. That's it — the full API flow is active again.

---

## What happens when TEST_MODE = false

1. User clicks "Create your masterpiece".
2. The loading screen appears with a progress bar (simulated up to 90%).
3. `POST /api/generate` is called with `image`, `subject`, `style`, and
   `personalize` fields in a FormData body.
4. The backend (`src/app/api/generate/route.ts`) uploads the image to
   Fal storage and submits a job to `fal-ai/nano-banana-2/edit`.
5. When the job finishes, the generated image URL is saved to
   `sessionStorage` as `generatedPortraitUrl` and the user is redirected
   to `/preview`.

---

## Environment variable required

The API route reads `FAL_KEY` from the server environment.  
Make sure `.env.local` contains:

```
FAL_KEY=<your-key>
```

For Vercel production, add `FAL_KEY` in:
**Settings → Environment Variables → Production**

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `/api/generate` returns 500 | Check `FAL_KEY` is set and correct |
| Progress bar stalls at 90% | The queue job may be slow; wait ~60 s |
| Preview shows blank image | The Fal URL domain may not be in `next.config.ts` — add it to `images.remotePatterns` |
