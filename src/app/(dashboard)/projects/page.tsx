import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Projects() {
  return (
    <div className="flex flex-col gap-2 w-full p-4">
      <h1 className="text-2xl font-bold">Projects</h1>
      <div>
        <Button>
          <Plus />
          Create New Project
        </Button>
      </div>
      <div className="flex flex-col w-full"></div>
    </div>
  );
}
