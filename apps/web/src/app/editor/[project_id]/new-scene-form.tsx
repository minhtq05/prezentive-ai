"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor-store";
import { zodResolver } from "@hookform/resolvers/zod";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CircleCheck, Plus } from "lucide-react";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface TemplateOption {
  value: string;
}

const options: TemplateOption[] = [
  {
    value: "Blank",
  },
  {
    value: "Introduction",
  },
  {
    value: "Conclusion",
  },
];

const NewSceneSchema = z.object({
  template: z.enum(options.map((option) => option.value)),
});

type NewSceneValues = z.infer<typeof NewSceneSchema>;

export function NewSceneForm() {
  const addScene = useEditorStore((state) => state.addScene);
  const projectId = useEditorStore((state) => state.project.id);
  const scenesLength = useEditorStore((state) => state.scenes.length);

  const form = useForm<NewSceneValues>({
    resolver: zodResolver(NewSceneSchema),
    defaultValues: {
      template: options[0].value,
    },
  });

  function onSubmit(data: NewSceneValues) {
    startTransition(async () => {
      if (!projectId) {
        console.error("Project ID is not set");
        return;
      }
      const now = new Date();
      const newScene = {
        title: data.template,
        createdAt: now,
        updatedAt: now,
        userId: "", // Set to current user if available
        projectId,
        sceneNumber: scenesLength, // You may want to auto-increment or set properly
        notes: "",
        backgroundType: "solid",
        backgroundColor: "#ffffff",
        backgroundGradientStart: "#ffffff",
        backgroundGradientEnd: "#ffffff",
        backgroundGradientAngle: 0,
        backgroundImageUrl: "",
        backgroundImageFit: "cover",
        transitionType: "none",
        transitionDuration: 0,
        durationInSeconds: 5, // Default duration, can be adjusted
        isHidden: false,
        isLocked: false,
        sceneElements: [],
      };
      await addScene(newScene);
    });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Plus /> New Scene
        </Button>
      </SheetTrigger>
      <SheetContent className="!max-w-full !w-240">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="size-full">
            <SheetHeader>
              <SheetTitle asChild>
                <h4>Scene Templates</h4>
              </SheetTitle>
              <SheetDescription>
                Choose your scene template to create a new scene.
              </SheetDescription>
            </SheetHeader>
            <FormField
              control={form.control}
              name="template"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup.Root
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-4 p-6 gap-4"
                    >
                      {options.map((option) => (
                        <FormItem
                          key={option.value}
                          className="flex items-center gap-3"
                        >
                          <FormControl>
                            <RadioGroup.Item
                              value={option.value}
                              className={cn(
                                "size-full aspect-video flex items-center justify-center",
                                "relative group ring-[1px] ring-border rounded",
                                "data-[state=checked]:ring-2 data-[state=checked]:ring-primary"
                              )}
                            >
                              <CircleCheck className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 h-6 w-6 text-primary fill-primary stroke-primary-foreground group-data-[state=unchecked]:hidden" />
                              <p className="font-semibold">{option.value}</p>
                            </RadioGroup.Item>
                          </FormControl>
                        </FormItem>
                      ))}
                    </RadioGroup.Root>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter>
              <SheetClose asChild>
                <div className="grid grid-cols-2 gap-2">
                  <Button type="submit">Create Scene</Button>
                  <Button variant="secondary">Cancel</Button>
                </div>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
