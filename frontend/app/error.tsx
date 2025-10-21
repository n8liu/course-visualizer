"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="max-w-md w-full p-8 bg-card border rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-destructive">
          Something went wrong!
        </h2>
        <p className="text-muted-foreground mb-6">
          The course visualizer encountered an error. This might be due to a
          problem loading the 3D visualization or the course data.
        </p>
        <div className="flex gap-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = "/"}
            className="px-4 py-2 border rounded-md hover:bg-accent"
          >
            Reload page
          </button>
        </div>
        {error.digest && (
          <p className="mt-4 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}

