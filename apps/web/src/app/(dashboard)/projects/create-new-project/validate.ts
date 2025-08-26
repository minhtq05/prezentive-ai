import { z } from "zod";

export const NewProjectSchema = z.object({
  title: z.string().min(1, {
    message: "Project title is required",
  }),
  description: z.string(),
  orientation: z.enum(["landscape", "portrait"]),
  fps: z.number().refine((val) => [24, 30, 60].includes(val), {
    message: "Value must be one of 24, 30, or 60",
  }),
});

export type NewProjectValues = z.infer<typeof NewProjectSchema>;
