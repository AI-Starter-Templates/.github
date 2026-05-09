<h1 align="center">AI Starter Templates</h1>

<p align="center">
  <em>Production-grade scaffolding for the apps AI agents build.</em>
</p>

---

## Why this exists

Tools like Lovable, Replit Agent, v0, Bolt and friends are genuinely
incredible for prototyping. You can validate an idea in hours and _see_
your product before you commit to building it.

But the moment you open the generated code as a working engineer, the
cracks show:

- No domain-driven design, no separation of concerns, no DRY.
- Tokens hard-coded in frontend code.
- Database calls inside route handlers.
- "Auth" that's a vibe, not an implementation.
- Webhook handlers without signature verification.
- Logs leaking PII straight into whatever observability stack picks them up.

That code is great for a demo. It is **not** code you ship to
production. Not unless you enjoy leaking your customers' data, losing
their money, and getting sued for it.

## What this is

A set of starter templates I built from codebases I've been running in
production for **15 years** — the boring, load-bearing, audited bits
every serious app needs, distilled into three repos you can spawn from
on day one:

| Repo        | What it is                                                                                                                                                                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`api`**   | Bun + Elysia + Drizzle + Postgres. Auth, OAuth, Stripe billing, pluggable email, cache, queues, audit log, structured logging. Strict types. 14 custom ESLint plugins enforcing the architecture. |
| **`ui`**    | React + Vite + TypeScript SPA shell. Auth flow wired to the API. Design tokens. _(coming next)_                                                                                                   |
| **`infra`** | Docker Compose for local + single-host. Kustomize manifests for K3s / Kubernetes (CNPG, Vault, Traefik, cert-manager).                                                                            |

The three are **deliberately decoupled**. Not a monolith. Not a
mega-repo. Each one stands alone, has its own CI, and ships its own
contract.

## Why decoupled

- **Smaller context per task.** Editing a route handler shouldn't pull
  K3s manifests into the agent's window. Tweaking ingress shouldn't
  load the Drizzle schema. Sharper context, cheaper tokens.
- **Independent change cadence.** Bumping Postgres or rolling out a
  Traefik middleware doesn't touch the API codebase. Shipping an API
  release doesn't rebuild the UI bundle.
- **Reusable across projects.** The infra repo applies to the next
  product you spin up. So does the API auth flow. Coupling them once
  means disentangling them every time.

Three repos, three contracts, three independent CI runs. Each one
stays small enough to fit comfortably in an agent's working memory.

## The token-cost argument

The other reason: **tokens are expensive**.

Every time you start a new project with an AI agent, it re-implements
the same infrastructure from scratch. Auth, sessions, password reset,
email verification, OAuth handshakes, Stripe webhooks, rate limiting,
secret validation, cache layers — the same scaffolding, every time,
tokens burning.

The honest truth is that the **majority** of code an AI writes for
a typical SaaS is boilerplate: the same auth flow, the same email
provider integration, the same Stripe setup, the same set of admin
endpoints. You don't want to pay for that to be regenerated on every
new project.

You want the agent to focus on **your product** — the differentiated
part — and treat the rest as a solved problem.

That's what this is for.

## How to use it

Click **"Use this template"** on each of the three repos to spawn your
own copy. They're set up to live as siblings:

```
your-project/
├── api/
├── infra/
└── ui/
```

Then read the `README.md` in each. The `api` repo has the most depth —
14 ESLint plugins, an `AGENT_CONTRACT.md` for AI agents, a
`SECURITY.md` checklist, and a strict separation between routes /
services / schemas / types that lint enforces automatically.

## Status

| Repo    | Status                                                                        |
| ------- | ----------------------------------------------------------------------------- |
| `api`   | ✅ Ready — auth, billing, email, OAuth, queues, audit log, structured logging |
| `infra` | ✅ Ready — Compose + K3s/Kustomize with CNPG, Vault, Traefik                  |
| `ui`    | 🚧 In progress                                                                |

## License

Each repo is MIT. Use them, fork them, instantiate them, change them
— just don't blame me when your `.env` ends up on GitHub anyway.
