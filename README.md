## George English (Frontend)

Space-themed **English learning website** built with **Next.js (App Router)** and **TypeScript**.

### Features
- **Lessons**: `/lessons` and `/lessons/[slug]`
- **Vocabulary**: `/vocab`
- **Quizzes**: `/quizzes` and `/quizzes/[id]`
- **Static content** (no backend, no login)

## Getting Started

Install and run the dev server:

```bash
npm install
npm run dev
```

Open `https://george-production.up.railway.app`.

### Add / edit content (static)

All learning content lives in `src/content/`:
- `src/content/lessons/*.json`
- `src/content/vocab/*.json`
- `src/content/quizzes/*.json`

The content registry is in `src/content/index.ts`. Add a new JSON file and then import it there so it appears in the UI.

### Production build

```bash
npm run build
npm run start
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy

Any Next.js-compatible platform works (Vercel, Netlify, etc). Build output is standard Next.js.
