import type { ReactNode } from "react";

// Passthrough root layout — html/body are provided by each sub-layout
// ([locale]/layout.tsx for the public site, joncoadm/layout.tsx for admin)
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
