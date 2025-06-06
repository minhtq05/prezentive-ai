import { format } from "date-fns";

export function getTime() {
  return Date.now();
}

export function formatDate(dateString: string) {
  try {
    return format(new Date(dateString), "MMM d, yyyy");
  } catch (error) {
    console.log(error);
    return dateString.split("T")[0] || "Unknown date";
  }
}
