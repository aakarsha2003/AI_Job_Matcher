import { useState } from "react";
import { type JobWithScore } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MatchScoreBadge } from "./MatchScoreBadge";
import { 
  MapPin, 
  Building2, 
  Clock, 
  Briefcase,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useCreateApplication } from "@/hooks/use-applications";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export function JobCard({ job }: { job: JobWithScore }) {
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const { user } = useAuth();
  const { mutate: createApplication, isPending } = useCreateApplication();
  const { toast } = useToast();

  const handleApplyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (job.externalUrl) {
      window.open(job.externalUrl, '_blank');
      // Show confirmation dialog after a short delay
      setTimeout(() => setShowApplyDialog(true), 1000);
    }
  };

  const handleConfirmApplication = () => {
    if (!user) return;
    createApplication({
      userId: user.id,
      jobId: job.id,
      status: "Applied",
      notes: "Applied via external link",
    }, {
      onSuccess: () => {
        toast({ title: "Application Tracked!", description: "Good luck with your interview." });
        setShowApplyDialog(false);
      }
    });
  };

  return (
    <>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 border-border/60">
        <div className="p-6">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground font-medium">
                <Building2 size={16} />
                <span>{job.company}</span>
              </div>
            </div>
            <MatchScoreBadge score={job.matchScore} />
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-4 mb-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <MapPin size={15} />
              {job.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase size={15} />
              {job.jobType}
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={15} />
              {job.postedAt ? formatDistanceToNow(new Date(job.postedAt), { addSuffix: true }) : 'Recently'}
            </div>
          </div>

          <div className="mb-6">
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {job.skills?.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="font-normal bg-secondary/50">
                {skill}
              </Badge>
            ))}
            {job.skills && job.skills.length > 4 && (
              <Badge variant="outline" className="font-normal text-muted-foreground">
                +{job.skills.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-sm font-medium text-foreground">
              {job.salaryRange || "Salary not specified"}
            </span>
            <Button onClick={handleApplyClick} className="group-hover:translate-x-1 transition-transform">
              Apply Now 
              <ChevronRight size={16} className="ml-1 opacity-70" />
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Did you apply?</DialogTitle>
            <DialogDescription>
              We opened the application page for <strong>{job.title}</strong> at <strong>{job.company}</strong> in a new tab. 
              Did you complete the application?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowApplyDialog(false)} className="w-full sm:w-auto">
              No, just browsing
            </Button>
            <Button 
              onClick={handleConfirmApplication} 
              disabled={isPending}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isPending ? "Tracking..." : "Yes, I Applied!"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
