import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import mermaid from "astro-mermaid";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://boringstack.xyz",

  integrations: [
    react(),
    mermaid({
      theme: "default",
      autoTheme: true,
      mermaidConfig: {
        // Rough.js sketch strokes. Applies to flowchart and other diagram types that
        // wire `look` into their renderer. sequenceDiagram (and several others) still
        // render in the classic vector style in Mermaid 11.14 — only `neo` is special-
        // cased there. Broader handDrawn coverage is tracked upstream (e.g. PR #7130).
        look: "handDrawn",
        handDrawnSeed: 42,
        themeVariables: {
          // Starlight owns the page surface. Mermaid dark theme defaults use #333
          // (canvas) and secondBkg-derived fills for subgraph clusters; both read as
          // a separate "card" on the docs background.
          background: "transparent",
          clusterBkg: "transparent",
        },
      },
    }),
    starlight({
      title: "BoringStack",
      description:
        "Postgres, HTTP, React, and Compose wired into a SaaS spine you can run locally. Fast Bun and Vite feedback, lint as the contract for humans and agents, OpenAPI between API and UI.",
      favicon: "/favicon.svg",
      customCss: ["./src/styles/tailwind.css", "./src/styles/custom.css"],
      tableOfContents: false,
      components: {
        Footer: "./src/components/Footer.astro",
        Header: "./src/components/Header.astro",
        Pagination: "./src/components/Pagination.astro",
      },
      head: [
        {
          tag: "script",
          content: `
(function () {
  function openZoom(svg) {
    var dialog = document.createElement("dialog");
    dialog.className = "mermaid-zoom-dialog";

    var close = document.createElement("button");
    close.className = "mermaid-zoom-close";
    close.setAttribute("aria-label", "Close");
    close.textContent = "\\u00d7";
    close.addEventListener("click", function (e) {
      e.stopPropagation();
      dialog.close();
    });
    dialog.appendChild(close);

    var clone = svg.cloneNode(true);
    clone.removeAttribute("style");
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    dialog.appendChild(clone);

    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      dialog.remove();
    });

    document.body.appendChild(dialog);
    dialog.showModal();
  }

  function wireZoom() {
    var diagrams = document.querySelectorAll(".mermaid");
    for (var i = 0; i < diagrams.length; i++) {
      var el = diagrams[i];
      if (el.dataset.zoomBound === "1") continue;
      var svg = el.querySelector("svg");
      if (!svg) continue;
      el.dataset.zoomBound = "1";
      (function (target, sourceSvg) {
        target.addEventListener("click", function () {
          openZoom(sourceSvg);
        });
      })(el, svg);
    }
  }

  function start() {
    wireZoom();
    // SVG can inject async after page-load; retry a few times
    [50, 200, 500, 1200, 2500].forEach(function (d) { setTimeout(wireZoom, d); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
  document.addEventListener("astro:page-load", start);
})();
          `.trim(),
        },
        {
          tag: "script",
          content: `
(function () {
  var scrolledClass = "bs-nav-scrolled";

  function updateHeaderSurface() {
    document.documentElement.classList.toggle(scrolledClass, window.scrollY > 8);
  }

  function start() {
    updateHeaderSurface();
  }

  if (!window.__boringStackLandingBound) {
    window.__boringStackLandingBound = true;
    window.addEventListener("scroll", updateHeaderSurface, { passive: true });
    window.addEventListener("resize", updateHeaderSurface);
    document.addEventListener("astro:page-load", start);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
          `.trim(),
        },
      ],
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
          label: "Why BoringStack",
          link: "/architecture/why-boringstack/",
        },
        { label: "Deployment", link: "/topics/deployment/" },
        {
          label: "Architecture",
          items: [
            {
              label: "Separation of concerns",
              link: "/architecture/separation-of-concerns/",
            },
            {
              label: "Background work",
              link: "/architecture/background-work/",
            },
            { label: "Repository layout", link: "/architecture/three-repos/" },
            { label: "Stack at a glance", link: "/architecture/stack/" },
            {
              label: "Lint as the contract",
              link: "/architecture/lint-as-contract/",
              badge: { text: "agent-critical", variant: "tip" },
            },
            {
              label: "Agent docs as an index",
              link: "/architecture/agent-docs/",
              badge: { text: "agent-critical", variant: "tip" },
            },
          ],
        },
        {
          label: "API template",
          items: [
            { label: "Overview", link: "/api/overview/" },
            { label: "Authentication", link: "/api/auth/" },
            { label: "Billing", link: "/api/billing/" },
            { label: "Email", link: "/api/email/" },
            { label: "Queues", link: "/api/queues/" },
            { label: "Audit log", link: "/api/audit-log/" },
            { label: "Notifications", link: "/api/notifications/" },
            { label: "ACL & feature resolution", link: "/api/acl/" },
            { label: "Multi-tenant model", link: "/api/multi-tenant/" },
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
            { label: "Notifications", link: "/ui/notifications/" },
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
            { label: "Email in development", link: "/topics/email-in-dev/" },
            { label: "Cloudflare Email", link: "/topics/cloudflare-email/" },
            { label: "Error tracking", link: "/topics/error-tracking/" },
            { label: "Observability", link: "/topics/observability/" },
            {
              label: "Provisioning with OpenTofu",
              link: "/topics/provisioning-with-tofu/",
            },
            {
              label: "Supply-chain protection",
              link: "/topics/supply-chain/",
            },
            {
              label: "Security pipeline",
              link: "/topics/security/",
            },
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

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: cloudflare()
});
