import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/server-auth";
import AccountContent from "./AccountContent";

export const metadata = {
  title: "Account",
  description: "Manage your RemoteGig account and subscription.",
};

export default async function AccountPage() {
  const { user, plan } = await getServerAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <AccountContent
      user={user}
      plan={plan}
    />
  );
}
