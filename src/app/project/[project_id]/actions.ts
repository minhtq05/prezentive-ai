"use server";

import { Project } from "@/types/database";
import { createClerkSupabaseClientSsr } from "@/utils/supabase/client";

export async function getProjectById(
  projectId: string
): Promise<Project | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    console.error("Error fetching project:", error);
    return null;
  }

  return data;
}

export async function updateProjectElements(
  projectId: string,
  elements: string
): Promise<Project | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .update({ elements, modified_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    return null;
  }

  return data;
}
