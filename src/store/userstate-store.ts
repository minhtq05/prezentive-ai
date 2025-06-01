import { create } from "zustand";

// Import the View type from dashboard-sidebar for type consistency
export type View =
  | "Home"
  | "All Projects"
  | "Templates"
  | "Media Vault"
  | "Settings";

// Map routes to views for automatic view setting based on URL
export const routeToViewMap: Record<string, View> = {
  "/dashboard": "Home",
  "/dashboard/projects": "All Projects",
  "/dashboard/templates": "Templates",
  "/dashboard/media": "Media Vault",
  "/dashboard/settings": "Settings",
};

interface UserStateStore {
  // Current selected view in the dashboard
  view: View;
  // Function to set the view
  setView: (view: View) => void;
  // Function to set the view based on the current route
  setViewFromRoute: (pathname: string) => void;
  // Clerk Session State
  clerkIsLoaded: boolean;
  // Function to set isLoaded state
  setClerkIsLoaded: (isLoaded: boolean) => void;
  // User information
  username: string | null;
  // Set username
  setUsername: (username: string | null) => void;
}

export const useUserStateStore = create<UserStateStore>((set) => ({
  // Default view
  view: "All Projects",

  // Set view function
  setView: (view) => set({ view }),

  // Set view based on route function
  setViewFromRoute: (pathname) => {
    const view = routeToViewMap[pathname] || "Home";
    set({ view });
  },

  // Default username
  username: null,

  // Set username function
  setUsername: (username) => set({ username }),

  // Default isLoaded state
  clerkIsLoaded: false,

  // Set isLoaded function
  setClerkIsLoaded: (isLoaded) => set({ clerkIsLoaded: isLoaded }),
}));
