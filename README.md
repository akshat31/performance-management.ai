# AI Performance Manager — Demo (React, Vite, JS)

A single-repo demo implementing an **AI‑assisted performance management** flow, inspired by the attached spec:

- Employee **Self‑Evaluation** with AI draft
- **Manager Review** with AI assistance
- **Rating Drop > 2** requires justification; HR auto‑flag
- **Employee visibility** of changed ratings + reason
- **HR Panel** to review deviations
- **Audit Trail** for transparency

## Run
```bash
npm i
npm run dev
```
Open the URL shown by Vite.

## Notes
- No TypeScript.
- The "AI" is mocked in `src/lib/ai.js`. Replace functions with real LLM calls if desired.
- Data persists in `localStorage`. Use **Dashboard → Reset Demo Data** to start over.
