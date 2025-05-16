import { auth, currentUser } from "@clerk/nextjs/server";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  params,
  children,
}: {
  params: { user: string };
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (user === null || user.username !== params.user) {
    return <p>You do not have access to this page</p>;
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
