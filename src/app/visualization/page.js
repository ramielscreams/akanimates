import { redirect } from "next/navigation";

export default async function LegacyPage({ searchParams }) {
  const { mode } = await searchParams;

  redirect(mode === "design" ? "/work" : "/work?mode=cgi");
}
