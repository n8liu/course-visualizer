import { Node } from "@/lib/types";
import { useState, useMemo } from "react";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";

interface DepartmentFilterProps {
  courses: Node[];
  selectedDepartments: string[];
  onDepartmentsChange: (departments: string[]) => void;
}

export default function DepartmentFilter({
  courses,
  selectedDepartments,
  onDepartmentsChange,
}: DepartmentFilterProps) {
  const [search, setSearch] = useState("");

  // Get unique departments with course counts
  const departments = useMemo(() => {
    const deptMap = new Map<string, number>();
    courses.forEach((course) => {
      if (course.department) {
        deptMap.set(course.department, (deptMap.get(course.department) || 0) + 1);
      }
    });
    return Array.from(deptMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [courses]);

  const filteredDepartments = useMemo(() => {
    if (!search) return departments;
    const searchLower = search.toLowerCase();
    return departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchLower)
    );
  }, [departments, search]);

  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      onDepartmentsChange(selectedDepartments.filter((d) => d !== dept));
    } else {
      onDepartmentsChange([...selectedDepartments, dept]);
    }
  };

  const clearAll = () => {
    onDepartmentsChange([]);
  };

  const selectAll = () => {
    onDepartmentsChange(departments.map((d) => d.name));
  };

  const selectedCount = selectedDepartments.length;
  const totalCount = departments.length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2 px-2">
        <div className="text-sm font-medium">
          Departments ({selectedCount}/{totalCount})
        </div>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-blue-600 hover:underline"
            disabled={selectedCount === totalCount}
          >
            All
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline"
            disabled={selectedCount === 0}
          >
            None
          </button>
        </div>
      </div>

      <Command className="rounded-lg border">
        <CommandInput
          placeholder="Filter departments..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[300px]">
          <CommandEmpty>No departments found.</CommandEmpty>
          <CommandGroup>
            {filteredDepartments.slice(0, 50).map((dept) => {
              const isSelected = selectedDepartments.includes(dept.name);
              return (
                <CommandItem
                  key={dept.name}
                  value={dept.name}
                  onSelect={() => toggleDepartment(dept.name)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={cn(
                        "w-4 h-4 border rounded flex items-center justify-center",
                        isSelected ? "bg-primary border-primary" : "border-input"
                      )}
                    >
                      {isSelected && <Check className="h-3 w-3 text-primary-foreground" />}
                    </div>
                    <span className="font-medium">{dept.name}</span>
                    <span className="text-sm text-muted-foreground ml-auto">
                      {dept.count}
                    </span>
                  </div>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}

