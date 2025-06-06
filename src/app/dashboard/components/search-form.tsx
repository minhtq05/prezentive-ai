import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";
import { Search } from "lucide-react";

export default function SearchForm({ ...props }: React.ComponentProps<"form">) {
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
