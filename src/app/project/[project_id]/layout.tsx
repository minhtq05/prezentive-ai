import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Fragment } from "react";
import { getProjectById } from "./actions";

export default async function EditorLayout({
  params,
  children,
}: {
  params: Promise<{ project_id: string }>;
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const project_id = (await params).project_id;
  const project = await getProjectById(project_id);

  if (!project) {
    redirect("/dashboard/projects");
  }

  return <Fragment>{children}</Fragment>;
}
