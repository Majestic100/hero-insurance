# insurance-leads

Danish insurance comparison site (car, home contents, house). See
[CLAUDE.md](./CLAUDE.md) for the stack, structure, module plan and rules.

## Getting started

```bash
nvm use            # Node 22
npm install
cp .env.example .env.local   # then fill in the Supabase keys
npm run dev
```

Open http://localhost:3000. Check the database connection at
http://localhost:3000/api/health. It should report `"supabase": "ok"`.
