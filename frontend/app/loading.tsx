import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Loading Course Visualizer</h2>
        <p className="text-muted-foreground">
          Preparing 3D visualization and course data...
        </p>
      </div>
    </div>
  );
}

