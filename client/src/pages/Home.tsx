import { useJobs } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { FilterSidebar } from "@/components/FilterSidebar";
import { JobCard } from "@/components/JobCard";
import { AiAssistant } from "@/components/AiAssistant";
import { FilterProvider, useFilterContext } from "@/context/FilterContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentResume } from "@/hooks/use-resumes";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Link } from "wouter";

function JobFeed() {
  const { filters } = useFilterContext();
  const { data: jobs, isLoading, error } = useJobs(filters);
  const { data: resume } = useCurrentResume();

  // Sort by match score if available
  const sortedJobs = jobs ? [...jobs].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)) : [];
  const bestMatches = sortedJobs.filter(j => (j.matchScore || 0) >= 80).slice(0, 3);
  const otherJobs = sortedJobs.filter(j => !bestMatches.includes(j));

  if (error) {
    return (
      <div className="p-8 text-center text-destructive bg-destructive/10 rounded-xl">
        Failed to load jobs. Please try again later.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <div className="sticky top-24">
          <FilterSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {!resume && (
           <Alert className="bg-primary/5 border-primary/20 text-primary">
             <Info className="h-4 w-4" />
             <AlertTitle>Unlock Match Scores</AlertTitle>
             <AlertDescription>
               Upload your resume in your <Link href="/profile" className="font-bold underline">Profile</Link> to see how well you match with these jobs.
             </AlertDescription>
           </Alert>
        )}

        {/* Best Matches Section */}
        {bestMatches.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-display font-bold text-2xl bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Best Matches for You
            </h2>
            <div className="grid gap-4">
              {bestMatches.map(job => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div className="space-y-4">
          <h2 className="font-display font-bold text-2xl text-foreground">
            {bestMatches.length > 0 ? "More Jobs" : "All Jobs"}
          </h2>
          
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="p-6 border rounded-xl space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              {jobs?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No jobs found matching your criteria.
                </div>
              ) : (
                otherJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
      
      <AiAssistant />
    </div>
  );
}

export default function Home() {
  return (
    <FilterProvider>
      <JobFeed />
    </FilterProvider>
  );
}
