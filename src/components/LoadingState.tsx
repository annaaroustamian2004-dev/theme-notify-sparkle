import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading air quality data..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-blue-100 dark:border-blue-900" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      </div>
      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 space-y-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
