import { redirect } from "next/navigation";
export default async function LegacyPage({ searchParams }: { searchParams: Promise<{mode?: string}> }) {
  const { mode } = await searchParams;
  redirect(mode === "design" ? "/work" : "/work?mode=cgi");
}
