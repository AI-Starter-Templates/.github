import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  site: "https://boringstack.xyz",
  integrations: [
    starlight({
      title: "BoringStack",
      description:
        "SaaS starters with the boring parts already thought through. Auth, billing, an API contract, and a deploy story you can run locally — not a slideshow.",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: false,
      },
      favicon: "/favicon.svg",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/AI-Starter-Templates",
        },
      ],
      editLink: {
        baseUrl:
          "https://github.com/AI-Starter-Templates/.github/edit/main/",
      },
      lastUpdated: true,
      sidebar: [
        { label: "Welcome", link: "/" },
        { label: "Quickstart", link: "/quickstart/" },
        {
          label: "Architecture",
          items: [
            { label: "The three repos", link: "/architecture/three-repos/" },
            {
              label: "Why not a monorepo",
              link: "/architecture/why-not-monorepo/",
            },
            { label: "Stack at a glance", link: "/architecture/stack/" },
          ],
        },
        {
          label: "API template",
          items: [
            { label: "Overview", link: "/api/overview/" },
            { label: "Authentication", link: "/api/auth/" },
            { label: "Email", link: "/api/email/" },
            { label: "Queues", link: "/api/queues/" },
            { label: "Audit log", link: "/api/audit-log/" },
            { label: "Env validator", link: "/api/env-validator/" },
          ],
        },
        {
          label: "UI template",
          items: [
            { label: "Overview", link: "/ui/overview/" },
            {
              label: "Architecture rules",
              link: "/ui/architecture-rules/",
            },
            { label: "OpenAPI client", link: "/ui/openapi-client/" },
            { label: "i18n", link: "/ui/i18n/" },
            { label: "Testing", link: "/ui/testing/" },
          ],
        },
        {
          label: "Infra template",
          items: [
            { label: "Overview", link: "/infra/overview/" },
            {
              label: "Profiles & overlays",
              link: "/infra/profiles-and-overlays/",
            },
            { label: "Resource limits", link: "/infra/resource-limits/" },
            { label: "Secrets", link: "/infra/secrets/" },
          ],
        },
        {
          label: "Topics",
          items: [
            { label: "Cloudflare Email", link: "/topics/cloudflare-email/" },
            { label: "Error tracking", link: "/topics/error-tracking/" },
            { label: "Observability", link: "/topics/observability/" },
            { label: "Deployment", link: "/topics/deployment/" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Environment variables", link: "/reference/env-vars/" },
            { label: "Commands cheatsheet", link: "/reference/commands/" },
            { label: "Glossary", link: "/reference/glossary/" },
          ],
        },
        {
          label: "Runbooks",
          items: [
            {
              label: "Firewall & TLS",
              link: "/runbooks/firewall-and-tls/",
            },
            { label: "Backups", link: "/runbooks/backups/" },
            {
              label: "Cloudflare Email setup",
              link: "/runbooks/cloudflare-email-setup/",
            },
            { label: "Image updates", link: "/runbooks/image-updates/" },
          ],
        },
      ],
    }),
  ],
});
