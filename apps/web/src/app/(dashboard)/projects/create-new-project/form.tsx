"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProjects } from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { NewProjectSchema, NewProjectValues } from "./validate";

export function CreateNewProjectForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { addProject } = useProjects();

  const form = useForm<NewProjectValues>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      title: "",
      description: "Untitled project",
      orientation: "landscape",
      fps: 30,
    },
  });

  function onSubmit(data: NewProjectValues) {
    startTransition(async () => {
      const newProjects = await addProject({
        ...data,
        isPublic: false,
        isTemplate: false,
      });

      if (newProjects) {
        router.push("/projects");
      } else {
        router.push("/projects");
      }
    });
  }

  return (
    <div className={cn("size-full flex flex-col gap-6", className)} {...props}>
      <h2>Create New Project</h2>
      <div className="size-full flex flex-col gap-6 p-2">
        Please fill out the form below to create a new project.
        <br />
        This will allow you to start working on your video project.
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="gap-3">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Project Title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Project Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="gap-3">
                  <FormField
                    control={form.control}
                    name="orientation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orientation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Project Orientation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectItem value="landscape">Landscape</SelectItem>
                            <SelectItem value="portrait" disabled>
                              Portrait
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="gap-3">
                  <FormField
                    control={form.control}
                    name="fps"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frames Per Second</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(parseInt(value))
                          }
                          defaultValue={String(field.value)}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Frames Per Second" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="30">30</SelectItem>
                            <SelectItem value="60">60</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
