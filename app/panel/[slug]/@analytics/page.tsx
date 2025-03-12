"use client";
import dynamic from "next/dynamic";

// Use dynamic import with SSR disabled to prevent hydration issues
const Analytics = dynamic(() => import("./analytics"), { ssr: false });

export default function Page() {
  return <Analytics />;
}
