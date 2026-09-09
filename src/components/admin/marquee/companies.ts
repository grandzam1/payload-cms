import type { CompanyId } from "./types";

export type Company = {
  id: CompanyId;
  name: string;
  src: string;
};

export const COMPANIES: Company[] = [
  { id: "neuralink", name: "Neuralink", src: "/images/marquee/neuralink.png" },
  { id: "grok", name: "Grok", src: "/images/marquee/grok.png" },
  { id: "spacex", name: "SpaceX", src: "/images/marquee/spacex.png" },
  { id: "tesla", name: "Tesla", src: "/images/marquee/tesla.png" },
  { id: "boring", name: "The Boring Company", src: "/images/marquee/boring.png" },
  { id: "x", name: "X", src: "/images/marquee/x.png" },
];
