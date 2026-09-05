import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkBrowser } from "@/components/work/work-browser";
export const metadata: Metadata = { title: "Work | AK", description: "Selected automotive stills and CGI by AK." };
export default function WorkPage() {
  return <Suspense fallback={<main className="min-h-dvh bg-bg" aria-label="Loading Work" />}><WorkBrowser /></Suspense>;
}
