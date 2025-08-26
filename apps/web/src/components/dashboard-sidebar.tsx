"use client";

import {
  Clapperboard,
  Folder,
  HelpCircleIcon,
  Home,
  Image,
  LayoutPanelTop,
  Mic,
  Plus,
  Search,
  Settings,
  Trash2,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./theme-toggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "./ui/sidebar";

const main = [
  {
    group_title: "Platform",
    children: [
      {
        title: "Home",
        href: "/home",
        icon: Home,
      },
      {
        title: "Projects",
        href: "/projects",
        icon: Folder,
      },
      {
        title: "Templates",
        href: "/templates",
        icon: LayoutPanelTop,
      },
      {
        title: "Public Gallery",
        href: "/public-gallery",
        icon: Clapperboard,
      },
      {
        title: "Recently Deleted",
        href: "/recently-deleted",
        icon: Trash2,
      },
    ],
  },
  {
    group_title: "My Gallery",
    children: [
      {
        title: "Videos",
        href: "/my-gallery/videos",
        icon: Clapperboard,
      },
      {
        title: "Images",
        href: "/my-gallery/images",
        icon: Image,
      },
      {
        title: "Audio",
        href: "/my-gallery/audio",
        icon: Mic,
      },
    ],
  },
];

const footer = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Get Help",
    href: "/help",
    icon: HelpCircleIcon,
  },
  // {
  //   title: "Search",
  //   href: "/search",
  //   icon: Search,
  // },
];

const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarGroup>
          {/* Logo */}
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/">
                  <span className="text-base font-bold">Prezentive AI</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          {/* Create New Project Button */}
          <SidebarMenu>
            <SidebarMenuItem className="flex items-center gap-2">
              <Link href="/projects/create-new-project" className="w-full">
                <Button className="w-full justify-start">
                  <Plus />
                  <span>Create New Project</span>
                </Button>
              </Link>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {/* Main Navigation */}
        {main.map((group) => (
          <SidebarGroup key={group.group_title}>
            <SidebarGroupLabel>{group.group_title}</SidebarGroupLabel>
            <SidebarMenu>
              {group.children.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          {/* Settings and Get Help */}
          <SidebarMenu>
            {footer.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                >
                  <Link href={item.href}>
                    <item.icon />
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {/* User Account */}
            <SidebarMenuItem key="user-account">
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith("/account")}
              >
                <Link href="/account">
                  <UserIcon />
                  Account
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
};

export const DashboardHeader = () => {
  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <SidebarTrigger />
      <div className="relative">
        <Input placeholder="Search" className="pl-8" />
        <Search className="size-4 text-muted-foreground absolute top-1/2 -translate-y-1/2 left-2" />
      </div>
      <div className="ml-auto">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default DashboardSidebar;
