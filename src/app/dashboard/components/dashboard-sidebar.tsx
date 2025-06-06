import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStateStore } from "@/store/userstate-store";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import SearchForm from "./search-form";

export function DashboardSidebar() {
  const view = useUserStateStore((state) => state.view);
  const setView = useUserStateStore((state) => state.setView);
  const username = useUserStateStore((state) => state.username);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignedIn>
              <div className="flex gap-2 items-center p-2">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "!rounded-sm",
                    },
                  }}
                />
                <p>{username}</p>
              </div>
            </SignedIn>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Home"}
                  onClick={() => setView("Home")}
                >
                  <Link href="/dashboard">Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "All Projects"}
                  onClick={() => setView("All Projects")}
                >
                  <Link href="/dashboard/projects">All Projects</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Templates"}
                  onClick={() => setView("Templates")}
                >
                  <Link href="/dashboard/templates">Templates</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Media Vault</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Media Vault"}
                  onClick={() => setView("Media Vault")}
                >
                  <Link href="/dashboard/media">Media Vault</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Settings"}
                  onClick={() => setView("Settings")}
                >
                  <Link href="/dashboard/settings">Settings</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
