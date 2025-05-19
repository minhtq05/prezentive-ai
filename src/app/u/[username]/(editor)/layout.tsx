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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  Film,
  GearFill,
  HouseDoorFill,
  ImageFill,
  Images,
  KanbanFill,
  Search,
} from "react-bootstrap-icons";

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
        <header className="flex flex-row gap-2 items-center p-2 border-b">
          <SidebarTrigger className="shrink-0" />
          <Separator orientation="vertical" className="!h-4" />
          <div className="ml-2 text-sm text-muted-foreground">{view}</div>
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
  const { setTheme } = useTheme();

  return (
    <Sidebar>
      <SidebarHeader className="px-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="h-10 px-4">
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
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-4">Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Home"}
                  onClick={() => setView("Home")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/home`}>
                    <HouseDoorFill />
                    <span className="text-sm">Home</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "All Projects"}
                  onClick={() => setView("All Projects")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/projects`}>
                    <KanbanFill />
                    <span className="text-sm">All Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Templates"}
                  onClick={() => setView("Templates")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/templates`}>
                    <ImageFill />
                    <span className="text-sm">Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="px-0">
          <SidebarGroupLabel className="px-4">Media Vault</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Images"}
                  onClick={() => setView("Images")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/media`}>
                    <Images />
                    <span className="text-sm">Images</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Videos"}
                  onClick={() => setView("Videos")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/media`}>
                    <Film />
                    <span className="text-sm">Videos</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-4">
          <Separator />
        </div>
        <SidebarGroup className="px-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={view === "Settings"}
                  onClick={() => setView("Settings")}
                  className="px-4 font-medium"
                >
                  <Link href={`/u/${username}/settings`}>
                    <GearFill />
                    <span className="text-sm">Settings</span>
                  </Link>
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
      <SidebarGroup className="py-0 px-4">
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
