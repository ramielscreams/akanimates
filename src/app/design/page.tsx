import { redirect } from "next/navigation";

export default function DesignPage() {
  redirect("/visualization?mode=design");
}
