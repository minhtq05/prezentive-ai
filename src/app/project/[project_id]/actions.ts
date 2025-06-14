"use server";

import { createClerkSupabaseClientSsr } from "@/utils/supabase/client";

export type ProjectData = {
  id: string;
  name: string;
  description: string;
  created_at: string;
  modified_at: string;
  elements: string;
};

export async function getProjectById(
  projectId: string
): Promise<ProjectData | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .select("id, name, description, created_at, modified_at, elements")
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
): Promise<ProjectData | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .update({ elements, modified_at: new Date().toISOString() })
    .eq("id", projectId)
    .select("id, name, description, created_at, modified_at, elements")
    .single();

  if (error) {
    console.error("Error updating project:", error);
    return null;
  }

  return data;
}
