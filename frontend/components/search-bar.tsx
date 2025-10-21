import { commandScore } from "@/lib/command-score";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { useEffect, useState } from "react";
import { Link as CourseLink, Node, BerkeleyEvalRating } from "@/lib/types";
import { BerkeleyEvalData } from "@/app/api/berkeley-eval/route";
import BerkeleyEvalDonut from "./berkeley-eval-donut";
import { LoaderCircle, X, Filter } from "lucide-react";
import BerkeleyEvalBar from "./berkeley-eval-bar";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SearchBarProps {
  courses: Node[];
  links: CourseLink[];
  onCourseSelect: (course: Node | null) => void;
  selectedCourse: Node | null;
  onSearchChange: (search: string) => void;
  search: string;
  isLoading: boolean;
  onFilterClick?: () => void;
  filterCount?: number;
}

type CourseInfo = {
  rating: BerkeleyEvalRating;
  prereqs: Node[];
  postreqs: Node[];
};

export default function SearchBar({
  courses,
  onCourseSelect,
  selectedCourse,
  search,
  onSearchChange,
  links,
  isLoading = true,
  onFilterClick,
  filterCount = 0,
}: SearchBarProps) {
  const [courseInfo, setCourseInfo] = useState<CourseInfo | null>(null);

  const filter = (value: string, search: string) => {
    return search.length > 0 ? commandScore(value, search, []) : 0;
  };

  const fullName = (course: Node) => {
    return `${course.id} - ${course.name}`;
  };

  const handleCourseSelect = (course: Node) => {
    onSearchChange(`${course.id} - ${course.name}`);
    onCourseSelect(course);
  };

  const handleValueChange = (value: string) => {
    onSearchChange(value);
    onCourseSelect(null);
    setCourseInfo(null);
  };

  const handleClearSearch = () => {
    onSearchChange("");
    onCourseSelect(null);
  };

  useEffect(() => {
    const fetchBerkeleyEvalData = async () => {
      if (selectedCourse !== null) {
        const apiRes = await fetch(
          "/api/berkeley-eval?" +
            new URLSearchParams({ courseCode: selectedCourse.id }).toString(),
          {
            method: "GET",
          }
        );

        const apiData = (await apiRes.json()) as BerkeleyEvalRating;
        // Needed because the force graph mutates links
        const fullLinks = links as unknown as { source: Node; target: Node }[];
        const prereqs = fullLinks
          .filter((link) => link.target.id === selectedCourse.id)
          .map(
            (link) => courses.find((course) => course.id === link.source.id)!
          );
        const postreqs = fullLinks
          .filter((link) => link.source.id === selectedCourse.id)
          .map(
            (link) => courses.find((course) => course.id === link.target.id)!
          );

        setCourseInfo({ rating: apiData, prereqs, postreqs });
      } else {
        setCourseInfo(null);
      }
    };

    fetchBerkeleyEvalData();
  }, [selectedCourse, courses, links]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search UC Berkeley courses..."
                value={search}
                onValueChange={handleValueChange}
              />
              <CommandList>
                {search.length > 0 && <CommandEmpty>No courses found.</CommandEmpty>}
                {courses
                  .map((course) => ({
                    value: fullName(course),
                    course,
                    score: filter(fullName(course), search),
                  }))
                  .filter((item) => item.score > 0)
                  .sort((a, b) => b.score - a.score)
                  .slice(0, 10)
                  .map((item) => (
                    <CommandItem
                      key={item.course.id}
                      value={item.value}
                      onSelect={() => handleCourseSelect(item.course)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{item.course.id}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.course.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </div>

          {onFilterClick && (
            <button
              onClick={onFilterClick}
              className={cn(
                "p-2 hover:bg-accent rounded-md relative",
                filterCount > 0 && "text-primary"
              )}
              title="Filter by department"
            >
              <Filter className="h-4 w-4" />
              {filterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {filterCount}
                </span>
              )}
            </button>
          )}

          {selectedCourse && (
            <button
              onClick={handleClearSearch}
              className="p-2 hover:bg-accent rounded-md"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          )}
        </div>

        {courseInfo && (
          <div className="mt-4 p-4 bg-card rounded-lg border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{selectedCourse?.id}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCourse?.name}
                </p>
                {selectedCourse?.units && (
                  <p className="text-sm text-muted-foreground">
                    {selectedCourse.units} units
                  </p>
                )}
              </div>

              <div className="flex gap-4">
                <BerkeleyEvalDonut rating={courseInfo.rating} />
                <BerkeleyEvalBar rating={courseInfo.rating} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Prerequisites</h4>
                <div className="space-y-1">
                  {courseInfo.prereqs.length > 0 ? (
                    courseInfo.prereqs.map((prereq) => (
                      <Link
                        key={prereq.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCourseSelect(prereq);
                        }}
                        className="block text-sm text-blue-600 hover:underline"
                      >
                        {prereq.id} - {prereq.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Postrequisites</h4>
                <div className="space-y-1">
                  {courseInfo.postreqs.length > 0 ? (
                    courseInfo.postreqs.map((postreq) => (
                      <Link
                        key={postreq.id}
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleCourseSelect(postreq);
                        }}
                        className="block text-sm text-green-600 hover:underline"
                      >
                        {postreq.id} - {postreq.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 