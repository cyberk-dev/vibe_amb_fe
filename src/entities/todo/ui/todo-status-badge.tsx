import { Badge } from "@/shared/ui/badge";
import type { TodoStatus } from "../model/types";

const statusVariants: Record<TodoStatus, "default" | "secondary" | "outline"> = {
  TODO: "default",
  IN_PROGRESS: "secondary",
  DONE: "outline",
};

const statusLabels: Record<TodoStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

interface TodoStatusBadgeProps {
  status: TodoStatus;
}

export function TodoStatusBadge({ status }: TodoStatusBadgeProps) {
  return <Badge variant={statusVariants[status]}>{statusLabels[status]}</Badge>;
}
