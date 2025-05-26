import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ProjectPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    notFound(); // redirect to not found page
  }

  return <>{children}</>;
}
