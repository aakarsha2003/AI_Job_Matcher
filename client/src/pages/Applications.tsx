import { useApplications, useUpdateApplicationStatus } from "@/hooks/use-applications";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Briefcase, Calendar, Building2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Applications() {
  const { data: applications, isLoading } = useApplications();
  const { mutate: updateStatus } = useUpdateApplicationStatus();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-display font-bold mb-8">My Applications</h1>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const statusColors = {
    "Applied": "bg-blue-100 text-blue-700 border-blue-200",
    "Interview": "bg-purple-100 text-purple-700 border-purple-200",
    "Offer": "bg-emerald-100 text-emerald-700 border-emerald-200",
    "Rejected": "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground mt-1">Track and manage your job search progress.</p>
        </div>
        <div className="bg-white p-3 rounded-xl border shadow-sm flex gap-4">
           <div className="text-center">
             <div className="text-2xl font-bold font-display">{applications?.length || 0}</div>
             <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</div>
           </div>
           <div className="w-px bg-border"></div>
           <div className="text-center">
             <div className="text-2xl font-bold font-display text-emerald-600">
               {applications?.filter(a => a.status === "Offer").length || 0}
             </div>
             <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Offers</div>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        {applications?.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl border-2 border-dashed">
            <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium">No applications yet</h3>
            <p className="text-muted-foreground">Start applying to jobs to track them here.</p>
          </div>
        ) : (
          applications?.map((app) => (
            <Card key={app.id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display font-bold text-lg">{app.job.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 size={16} />
                    <span>{app.job.company}</span>
                    <span className="text-border">•</span>
                    <span className="text-sm">{app.job.location}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      Applied {app.appliedAt ? format(new Date(app.appliedAt), "MMM d, yyyy") : ""}
                    </div>
                    <Select 
                      defaultValue={app.status} 
                      onValueChange={(val: any) => updateStatus({ id: app.id, status: val })}
                    >
                      <SelectTrigger className={`w-[140px] h-8 text-xs font-semibold border-none shadow-none ${statusColors[app.status as keyof typeof statusColors]}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interviewing</SelectItem>
                        <SelectItem value="Offer">Offer Received</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
