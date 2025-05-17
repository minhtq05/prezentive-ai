import { redirect } from "next/navigation";

export default function UserPage({ params }: { params: { username: string } }) {
  const { username } = params;
  redirect(`./${username}/dashboard`); // Redirect to the dashboard page
}
