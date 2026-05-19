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
      theme: "base",
      autoTheme: true,
      mermaidConfig: {
        // Clean vector look — sharper, "futuristic" reads better than rough.js sketch
        // for the BoringStack brand. CSS in custom.css adds neon glow + gradient
        // border chrome on top of the mermaid output.
        look: "classic",
        flowchart: {
          curve: "basis",
          padding: 26,
          nodeSpacing: 60,
          rankSpacing: 70,
          useMaxWidth: true,
        },
        sequence: {
          actorMargin: 60,
          messageMargin: 40,
          wrap: true,
          useMaxWidth: true,
        },
        themeVariables: {
          // Surfaces — Starlight owns the page background.
          background: "transparent",
          mainBkg: "rgba(251, 191, 36, 0.14)",
          secondBkg: "rgba(103, 232, 249, 0.10)",
          tertiaryColor: "rgba(240, 171, 252, 0.10)",
          clusterBkg: "rgba(251, 191, 36, 0.05)",
          clusterBorder: "rgba(253, 230, 138, 0.42)",

          // Primary palette — violet, the BoringStack accent.
          primaryColor: "rgba(251, 191, 36, 0.16)",
          primaryBorderColor: "#fcd34d",
          primaryTextColor: "#fef9c3",

          // Secondary palette — cyan accent for alt nodes.
          secondaryColor: "rgba(103, 232, 249, 0.12)",
          secondaryBorderColor: "#67e8f9",
          secondaryTextColor: "#cffafe",

          // Tertiary palette — pink accent.
          tertiaryBorderColor: "#f0abfc",
          tertiaryTextColor: "#fae8ff",

          // Edges / lines.
          lineColor: "#fde68a",
          arrowheadColor: "#fde68a",

          // Text & default node.
          textColor: "#fef9c3",
          nodeBorder: "#fcd34d",
          nodeTextColor: "#fef9c3",
          titleColor: "#fef3c7",

          // Edge label chips — mermaid paints a `.labelBkg` div per edge even when
          // there's no label. We restore the colored backing so real labels cover
          // the edge line behind their text, then strip empty edge labels via JS
          // (see the wireMermaidCleanup head script).
          edgeLabelBackground: "rgba(13, 15, 18, 0.92)",
          labelBackground: "rgba(13, 15, 18, 0.92)",
          labelTextColor: "#fef9c3",
          labelBoxBorderColor: "transparent",

          // Notes (sequence / generic).
          noteBkgColor: "rgba(253, 230, 138, 0.12)",
          noteTextColor: "#fef3c7",
          noteBorderColor: "#fcd34d",

          // Sequence diagram surfaces.
          actorBkg: "rgba(251, 191, 36, 0.16)",
          actorBorder: "#fcd34d",
          actorTextColor: "#fef9c3",
          actorLineColor: "rgba(253, 230, 138, 0.4)",
          signalColor: "#fde68a",
          signalTextColor: "#fef9c3",
          loopTextColor: "#fef3c7",
          activationBkgColor: "rgba(251, 191, 36, 0.22)",
          activationBorderColor: "#fcd34d",
          sequenceNumberColor: "#0b0d11",

          // Typography.
          fontFamily:
            "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          fontSize: "14px",
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

  // Mermaid renders a <g class="edgeLabel"> for every edge — even unlabeled ones.
  // That stub contains an empty span/foreignObject + a colored .labelBkg div, which
  // surfaces as a tiny dark pill mid-edge. Hide stubs whose text is whitespace-only.
  function pruneEmptyEdgeLabels() {
    var labels = document.querySelectorAll(".mermaid g.edgeLabel");
    for (var i = 0; i < labels.length; i++) {
      var el = labels[i];
      if (el.dataset.bsPruned === "1") continue;
      var text = (el.textContent || "").replace(/\\s+/g, "");
      if (text.length === 0) {
        el.style.display = "none";
        el.dataset.bsPruned = "1";
      }
    }
  }

  function tick() {
    wireZoom();
    pruneEmptyEdgeLabels();
  }

  function start() {
    tick();
    // SVG can inject async after page-load; retry a few times
    [50, 200, 500, 1200, 2500].forEach(function (d) { setTimeout(tick, d); });
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
