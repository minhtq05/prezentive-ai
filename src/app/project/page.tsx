import { redirect } from "next/navigation";

export default async function ProjectPage() {
  redirect("/dashboard/projects");
}
