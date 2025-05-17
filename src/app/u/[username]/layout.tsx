import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function UserLevelLayout({
  params,
  children,
}: {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
}) {
  const user = await currentUser();
  const username = (await params).username;

  if (!user || user.username !== username) {
    notFound(); // redirect to not found page
  }

  return <>{children}</>;
}
