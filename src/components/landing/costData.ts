export type TierId = "side" | "early" | "growth" | "scale";

export interface Tier {
  id: TierId;
  label: string;
  blurb: string;
  mau: string;
  reqPerDay: string;
  egress: string;
  dbStorage: string;
}

export const tiers: Tier[] = [
  {
    id: "side",
    label: "Side project",
    blurb: "Pre-revenue, friends-and-family traffic.",
    mau: "~200",
    reqPerDay: "5k",
    egress: "5 GB / mo",
    dbStorage: "1 GB",
  },
  {
    id: "early",
    label: "Early startup",
    blurb: "First paying customers, growing weekly.",
    mau: "~2k",
    reqPerDay: "80k",
    egress: "50 GB / mo",
    dbStorage: "5 GB",
  },
  {
    id: "growth",
    label: "Growth",
    blurb: "Real traction, real bandwidth, real DB.",
    mau: "~20k",
    reqPerDay: "1M",
    egress: "500 GB / mo",
    dbStorage: "50 GB",
  },
  {
    id: "scale",
    label: "Scale",
    blurb: "Established, multi-region considerations.",
    mau: "~100k",
    reqPerDay: "10M",
    egress: "5 TB / mo",
    dbStorage: "250 GB",
  },
];

export type ColumnId = "boringstack" | "paas" | "saas";

export interface CostColumn {
  id: ColumnId;
  label: string;
  shorthand: string;
  costs: Record<TierId, number>;
  tradeOff: string;
  highlight?: boolean;
}

export const columns: CostColumn[] = [
  {
    id: "boringstack",
    label: "BoringStack",
    shorthand: "VPS + Cloudflare + B2",
    costs: { side: 5, early: 8, growth: 16, scale: 35 },
    tradeOff: "You own the box. You own the pager.",
    highlight: true,
  },
  {
    id: "paas",
    label: "Managed-PaaS bundle",
    shorthand: "Edge functions + managed Postgres",
    costs: { side: 45, early: 80, growth: 250, scale: 1200 },
    tradeOff: "Vendor lock-in; cold starts; bandwidth meter.",
  },
  {
    id: "saas",
    label: "Hosted SaaS platform",
    shorthand: "All-in-one with per-seat / per-event pricing",
    costs: { side: 25, early: 200, growth: 1500, scale: 6000 },
    tradeOff: "Price scales with users, not with usage.",
  },
];

export const pricingAsOf = "2026-05";
