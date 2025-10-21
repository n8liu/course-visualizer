import { cn } from "@/lib/utils";

interface LevelFilterProps {
  selectedLevels: string[];
  onLevelsChange: (levels: string[]) => void;
}

const LEVELS = [
  { id: "lower", label: "Lower Division", description: "1-99", range: [1, 99] },
  { id: "upper", label: "Upper Division", description: "100-199", range: [100, 199] },
  { id: "graduate", label: "Graduate", description: "200+", range: [200, 9999] },
];

export default function LevelFilter({
  selectedLevels,
  onLevelsChange,
}: LevelFilterProps) {
  const toggleLevel = (levelId: string) => {
    if (selectedLevels.includes(levelId)) {
      onLevelsChange(selectedLevels.filter((l) => l !== levelId));
    } else {
      onLevelsChange([...selectedLevels, levelId]);
    }
  };

  const selectAll = () => {
    onLevelsChange(LEVELS.map((l) => l.id));
  };

  const clearAll = () => {
    onLevelsChange([]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Course Level</h4>
        <div className="flex gap-2">
          <button
            onClick={selectAll}
            className="text-xs text-blue-600 hover:underline"
            disabled={selectedLevels.length === LEVELS.length}
          >
            All
          </button>
          <button
            onClick={clearAll}
            className="text-xs text-blue-600 hover:underline"
            disabled={selectedLevels.length === 0}
          >
            None
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {LEVELS.map((level) => {
          const isSelected = selectedLevels.includes(level.id);
          return (
            <button
              key={level.id}
              onClick={() => toggleLevel(level.id)}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md border transition-colors text-left",
                isSelected
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-background border-border hover:bg-accent"
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">{level.label}</span>
                <span className="text-xs text-muted-foreground">
                  Courses {level.description}
                </span>
              </div>
              <div
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  isSelected
                    ? "bg-primary border-primary"
                    : "border-input"
                )}
              >
                {isSelected && (
                  <svg
                    className="w-3 h-3 text-primary-foreground"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {selectedLevels.length > 0 && (
        <div className="text-xs text-muted-foreground pt-1">
          {selectedLevels.length} level{selectedLevels.length !== 1 ? "s" : ""} selected
        </div>
      )}
    </div>
  );
}

export { LEVELS };

