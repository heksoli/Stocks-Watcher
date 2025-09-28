import {headers} from "next/headers";
import {redirect} from "next/navigation";
import type {ReactNode} from "react";
import Header from "@/components/header";
import {auth} from "@/lib/better-auth/auth";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  const user = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
  };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
};

export default RootLayout;
