"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import Loader from "@/components/loader";
import { CommandMenu } from "@/components/search-bar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { routeToViewMap, useUserStateStore } from "@/store/userstate-store";
import { useClerk, useUser } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { clerkIsLoaded, view } = useDashboardLayoutEffects();

  return clerkIsLoaded ? (
    <>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <header className="flex flex-row gap-2 items-center h-14 p-4 border-b">
            <h1>{view}</h1>
          </header>
          {children}
        </SidebarInset>
        <CommandMenu />
      </SidebarProvider>
    </>
  ) : (
    <Loader size="xl" />
  );
}

function useDashboardLayoutEffects() {
  const { signOut } = useClerk();
  const { isLoaded, user } = useUser();
  const pathname = usePathname();
  const setUsername = useUserStateStore((state) => state.setUsername);
  const clerkIsLoaded = useUserStateStore((state) => state.clerkIsLoaded);
  const setClerkIsLoaded = useUserStateStore((state) => state.setClerkIsLoaded);
  const view = useUserStateStore((state) => state.view);
  const setView = useUserStateStore((state) => state.setView);

  useEffect(() => {
    if (
      routeToViewMap[pathname] !== undefined &&
      routeToViewMap[pathname] !== view
    ) {
      // Update the view in the store based on the current pathname
      setView(routeToViewMap[pathname]);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // Set the username in the store
        setUsername(user.username);
        setClerkIsLoaded(true);
      } else {
        // If user is not loaded, redirect to sign-in page
        setUsername(null);
        setClerkIsLoaded(false);
        signOut();
        redirect("/");
      }
    } else {
      setUsername(null);
      setClerkIsLoaded(false);
    }
  }, [isLoaded, user, signOut]);

  return { clerkIsLoaded, view };
}
