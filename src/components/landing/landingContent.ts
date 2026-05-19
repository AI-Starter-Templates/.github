export type CodeLine =
  | { kind: "muted"; text: string }
  | { kind: "command"; text: string }
  | { kind: "ok"; text: string }
  | { kind: "spacer" };

export interface CodeTab {
  id: string;
  label: string;
  lines: CodeLine[];
}

export const codeTabs: CodeTab[] = [
  {
    id: "boot",
    label: "Boot locally",
    lines: [
      { kind: "muted", text: "# compose/dev.sh" },
      { kind: "command", text: "./compose/dev.sh up -d --build" },
      { kind: "spacer" },
      { kind: "ok", text: "postgres ready on 5432" },
      { kind: "ok", text: "valkey ready on 6379" },
      { kind: "ok", text: "api-dev migrated and serving /openapi.json" },
      { kind: "ok", text: "ui-dev generated client and started Vite" },
      { kind: "ok", text: "mailpit, queues, logs, and metrics are overlays" },
      { kind: "spacer" },
      { kind: "muted", text: "# open http://localhost:3001 and sign in" },
    ],
  },
  {
    id: "api",
    label: "Typed API",
    lines: [
      { kind: "muted", text: "# api-template" },
      { kind: "command", text: "bun run generate:openapi" },
      { kind: "spacer" },
      { kind: "ok", text: "TypeBox routes emitted /openapi.json" },
      { kind: "ok", text: "UI client regenerated from the live schema" },
      { kind: "ok", text: "route contracts fail before drift reaches review" },
      { kind: "spacer" },
      { kind: "muted", text: "# server and client move together" },
    ],
  },
  {
    id: "jobs",
    label: "Background jobs",
    lines: [
      { kind: "muted", text: "# api-template queues" },
      { kind: "command", text: "WITH_BULLMQ=1 ./compose/dev.sh up -d" },
      { kind: "spacer" },
      { kind: "ok", text: "Valkey is shared by cache and queue workers" },
      { kind: "ok", text: "idempotent processors guard retry paths" },
      { kind: "ok", text: "bull-board is available in development only" },
      { kind: "spacer" },
      { kind: "muted", text: "# delayed work stays visible while you build" },
    ],
  },
  {
    id: "deploy",
    label: "Deploy path",
    lines: [
      { kind: "muted", text: "# infra-template" },
      { kind: "command", text: "./compose/prod.sh up -d --pull always" },
      { kind: "spacer" },
      { kind: "ok", text: "Traefik routes same-origin API and UI traffic" },
      { kind: "ok", text: "TLS, backups, secrets, and updates live beside code" },
      { kind: "ok", text: "OpenTofu can provision the first VPS when needed" },
      { kind: "spacer" },
      { kind: "muted", text: "# local shape and deploy shape stay related" },
    ],
  },
];

export const stackLinks = [
  {
    href: "/api/overview/",
    label: "api-template",
    detail: "Bun / Elysia / Drizzle / auth / billing",
  },
  {
    href: "/ui/overview/",
    label: "ui-template",
    detail: "React / Vite / OpenAPI client / Playwright",
  },
  {
    href: "/infra/overview/",
    label: "infra-compose",
    detail: "Postgres / Valkey / Traefik / observability",
  },
  {
    href: "/topics/provisioning-with-tofu/",
    label: "infra-tofu",
    detail: "VPS bootstrap / DNS / firewall / first boot",
  },
] as const;

export const docsSteps = [
  {
    href: "/architecture/why-boringstack/",
    number: "01",
    title: "Start with the bet.",
    detail: "Understand the product-time and token-budget trade before memorizing parts.",
  },
  {
    href: "/architecture/stack/",
    number: "02",
    title: "Map what already exists.",
    detail: "Find the feature, template, tool, service, or workflow before you rebuild it.",
  },
  {
    href: "/quickstart/",
    number: "03",
    title: "Boot it, then read on demand.",
    detail: "Open auth while changing auth, queues while adding work, deploy when you are ready to ship.",
  },
] as const;

export const docsCoverage = [
  "auth",
  "billing",
  "queues",
  "email",
  "tenancy",
  "testing",
  "deploys",
  "architecture rules",
] as const;

export const stackFlow = [
  {
    href: "/api/overview/",
    label: "api-template",
    title: "Business backend",
    detail: "Auth, billing, queues, email, audit, roles, memberships, and Stripe hooks.",
  },
  {
    href: "/ui/overview/",
    label: "ui-template",
    title: "Typed product surface",
    detail: "React, Vite, TanStack Query, Playwright, i18n, and generated OpenAPI client.",
  },
  {
    href: "/infra/overview/",
    label: "infra-compose",
    title: "Production-like local shape",
    detail: "Postgres, Valkey, Mailpit, observability, logs, metrics, and overlays.",
  },
  {
    href: "/topics/provisioning-with-tofu/",
    label: "infra-tofu",
    title: "First real deploy path",
    detail: "Traefik, TLS, backups, image updates, secrets, firewall rules, and optional OpenTofu.",
  },
] as const;

export const proofRows = [
  {
    label: "tenant model",
    value:
      "Accounts, memberships, roles, plan features, and active membership checks are part of the data model.",
  },
  {
    label: "COGS posture",
    value:
      "Open-source runtime services come first. Paid providers are integrations, not required foundations.",
  },
  {
    label: "AI review contract",
    value: "Architecture lint rules turn intent into concrete failures before human review.",
  },
  {
    label: "real deploy shape",
    value: "TLS, firewall, backups, image updates, secrets, and runbooks live beside the code.",
  },
] as const;
