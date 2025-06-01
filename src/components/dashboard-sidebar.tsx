import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useUserStateStore } from "@/store/userstate-store";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";

export function DashboardSidebar() {
  const view = useUserStateStore((state) => state.view);
  const setView = useUserStateStore((state) => state.setView);
  const username = useUserStateStore((state) => state.username);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10">
              <SignedIn>
                <div className="flex flex-row gap-2 items-center justify-center">
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "!rounded-sm",
                      },
                    }}
                  />
                  <div>{username}</div>
                </div>
              </SignedIn>
            </SidebarMenuButton>
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
                  variant="navigation"
                >
                  <Link href="/dashboard">Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "All Projects"}
                  onClick={() => setView("All Projects")}
                  variant="navigation"
                >
                  <Link href="/dashboard/projects">All Projects</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Templates"}
                  onClick={() => setView("Templates")}
                  variant="navigation"
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
                  variant="navigation"
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
                  variant="navigation"
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

function SearchForm({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search..."
            className="pl-9 peer rounded-full h-9"
          />
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          <kbd className="peer-focus:hidden text-xs pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 select-none opacity-50 flex items-center justify-center">
            Ctrl+K
          </kbd>
        </SidebarGroupContent>
      </SidebarGroup>
    </form>
  );
}
