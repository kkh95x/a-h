import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");
  return <AdminShell username={session.u}>{children}</AdminShell>;
}
