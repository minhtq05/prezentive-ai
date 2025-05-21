"use client";

import { CommandMenu } from "@/components/search-bar";
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
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { Search } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

export type View =
  | "Home"
  | "All Projects"
  | "Templates"
  | "Images"
  | "Videos"
  | "Settings";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const { username } = params as { username: string };
  const [view, setView] = useState<View>("All Projects");

  return (
    <SidebarProvider>
      <DashboardSidebar username={username} view={view} setView={setView} />
      <SidebarInset>
        <header className="flex flex-row gap-2 items-center h-14 p-4 border-b">
          <h1>{view}</h1>
        </header>
        {children}
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  );
}

interface DashboardSidebarProps {
  username: string;
  view: View;
  setView: React.Dispatch<React.SetStateAction<View>>;
}

function DashboardSidebar({ username, view, setView }: DashboardSidebarProps) {
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
                  <Link href={`/u/${username}/home`}>Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "All Projects"}
                  onClick={() => setView("All Projects")}
                  variant="navigation"
                >
                  <Link href={`/u/${username}/projects`}>All Projects</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Templates"}
                  onClick={() => setView("Templates")}
                  variant="navigation"
                >
                  <Link href={`/u/${username}/templates`}>Templates</Link>
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
                  isActive={view === "Images"}
                  onClick={() => setView("Images")}
                  variant="navigation"
                >
                  <Link href={`/u/${username}/media`}>Images</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Videos"}
                  onClick={() => setView("Videos")}
                  variant="navigation"
                >
                  <Link href={`/u/${username}/media`}>Videos</Link>
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
                  <Link href={`/u/${username}/settings`}>Settings</Link>
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
