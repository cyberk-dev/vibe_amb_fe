import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TodoStatus } from "@/lib/types/todo.types";
import { Search } from "lucide-react";

interface TodoFiltersProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: "all" | TodoStatus) => void;
  searchValue: string;
  statusValue: "all" | TodoStatus;
}

export function TodoFilters({ onSearchChange, onStatusChange, searchValue, statusValue }: TodoFiltersProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <Select value={statusValue} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value={TodoStatus.TODO}>To Do</SelectItem>
          <SelectItem value={TodoStatus.IN_PROGRESS}>In Progress</SelectItem>
          <SelectItem value={TodoStatus.DONE}>Done</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
