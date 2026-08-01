This is a [Next.js](https://nextjs.org) project using [Neon Postgres](https://neon.tech) and [Drizzle ORM](https://orm.drizzle.team).

## Database Setup

1. Create a Neon Postgres project and copy its connection string.
2. Create `.env.local` in the project root from `.env.example`.
3. Set `DATABASE_URL` to your Neon connection string.

The database client is available through `getDb` in `lib/db`. The connection-only setup includes a health endpoint at `/api/health/db`; product tables can be added to `lib/db/schema.ts` as the application domain is implemented.

Run Drizzle commands with:

```bash
npm run db:check
npm run db:generate
npm run db:migrate
```

Use `npm run db:push` for local schema iteration or `npm run db:studio` to inspect the database.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
