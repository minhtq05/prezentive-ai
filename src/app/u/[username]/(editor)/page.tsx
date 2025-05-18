import { redirect } from "next/navigation";

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  redirect(`./${username}/projects`); // Redirect to the dashboard page
}
