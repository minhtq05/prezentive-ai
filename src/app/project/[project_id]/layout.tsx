import { notFound } from "next/navigation";
import { getProjectById } from "./actions";

export default async function ProjectLayout({
  params,
  children,
}: {
  params: Promise<{ project_id: string }>;
  children: React.ReactNode;
}) {
  const project_id = (await params).project_id;
  const project = await getProjectById(project_id);

  if (!project) {
    notFound();
  }

  return <>{children}</>;
}
