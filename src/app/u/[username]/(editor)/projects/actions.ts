"use server";

import { Project } from "@/types/database";
import { createClerkSupabaseClientSsr } from "@/utils/supabase/client";

export async function getProjects(): Promise<Project[]> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error);
    return [];
  }

  return data;
}

export async function createProject(
  userId: string,
  name: string,
  description: string
): Promise<Project | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .insert([{ user_id: userId, name, description, elements: "" }])
    .select()
    .single();

  if (error) {
    console.error("Error creating project:", error);
    return null;
  }

  return data;
}

export async function updateProject(
  projectId: string,
  name: string,
  description: string
): Promise<Project | null> {
  const supabase = await createClerkSupabaseClientSsr();
  const { data, error } = await supabase
    .from("projects")
    .update({ name, description, modified_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();

  if (error) {
    console.error("Error updating project:", error);
    return null;
  }

  return data;
}

export async function deleteProject(projectId: string): Promise<boolean> {
  const supabase = await createClerkSupabaseClientSsr();
  const { error } = await supabase
    .from("projects")
    .delete()
    .eq("id", projectId);

  if (error) {
    console.error("Error deleting project:", error);
    return false;
  }

  return true;
}
