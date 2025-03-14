"use client";
import dynamic from "next/dynamic";
import { Suspense } from "react";

// Use dynamic import with SSR disabled to prevent hydration issues
const Analytics = dynamic(() => import("./analytics"), { ssr: false });

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <Analytics />
    </Suspense>
  );
}
