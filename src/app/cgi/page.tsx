import { redirect } from "next/navigation";

export default function CgiPage() {
  redirect("/visualization?mode=cgi");
}
