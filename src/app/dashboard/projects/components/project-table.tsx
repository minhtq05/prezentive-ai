import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/time";
import { ProjectInfo } from "../actions";

export interface ProjectsTableProps {
  projects: ProjectInfo[];
  navigateToProject: (projectId: string) => void;
}

export default function ProjectsTable({
  projects,
  navigateToProject,
}: ProjectsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Last Modified</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project) => (
          <TableRow
            key={project.id}
            className="cursor-pointer hover:bg-accent/50"
            onClick={() => navigateToProject(project.id)}
          >
            <TableCell>{project.name}</TableCell>
            <TableCell className="max-w-md truncate">
              {project.description || "No description"}
            </TableCell>
            <TableCell>{formatDate(project.created_at)}</TableCell>
            <TableCell>{formatDate(project.modified_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
