import { Skeleton } from "@/components/ui/skeleton";

export default function ProjectSkeletons({ view }: { view: "grid" | "table" }) {
  return view === "grid" ? (
    <div className="flex flex-row flex-wrap gap-4">
      <Skeleton className="w-64 h-56" />
      <Skeleton className="w-64 h-56" />
      <Skeleton className="w-64 h-56" />
      <Skeleton className="w-64 h-56" />
      <Skeleton className="w-64 h-56" />
      <Skeleton className="w-64 h-56" />
    </div>
  ) : (
    <div className="flex flex-col space-y-2">
      <Skeleton className="w-full h-9" />
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-full h-9" />
      <Skeleton className="w-1/3 h-4" />
      <Skeleton className="w-full h-9" />
      <Skeleton className="w-1/3 h-4" />
    </div>
  );
}
