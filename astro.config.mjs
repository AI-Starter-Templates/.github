import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import mermaid from "astro-mermaid";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://boringstack.xyz",

  integrations: [
    mermaid({
      theme: "default",
      autoTheme: true,
    }),
    starlight({
      title: "BoringStack",
      description:
        "SaaS starters with the boring parts already thought through. Auth, billing, an API contract, and a deploy story you can run locally, not a slideshow.",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: false,
      },
      favicon: "/favicon.svg",
      customCss: ["./src/styles/custom.css"],
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
          label: "Architecture",
          items: [
            { label: "The three repos", link: "/architecture/three-repos/" },
            {
              label: "Why not a monorepo",
              link: "/architecture/why-not-monorepo/",
            },
            { label: "Stack at a glance", link: "/architecture/stack/" },
            {
              label: "Lint as the contract",
              link: "/architecture/lint-as-contract/",
              badge: { text: "agent-critical", variant: "tip" },
            },
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
            {
              label: 'After "Use this template"',
              link: "/topics/use-this-template/",
            },
            { label: "Email in development", link: "/topics/email-in-dev/" },
            { label: "Cloudflare Email", link: "/topics/cloudflare-email/" },
            { label: "Error tracking", link: "/topics/error-tracking/" },
            { label: "Observability", link: "/topics/observability/" },
            { label: "Deployment", link: "/topics/deployment/" },
            {
              label: "Provisioning with OpenTofu",
              link: "/topics/provisioning-with-tofu/",
            },
            {
              label: "Supply-chain protection",
              link: "/topics/supply-chain/",
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

  adapter: cloudflare()
});