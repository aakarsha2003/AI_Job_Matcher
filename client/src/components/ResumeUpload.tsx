import { useState, useRef } from "react";
import { useUploadResume, useCurrentResume } from "@/hooks/use-resumes";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ResumeUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: currentResume, isLoading: isLoadingResume } = useCurrentResume();
  const { mutate: uploadResume, isPending } = useUploadResume();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf" && file.type !== "text/plain") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or TXT file.",
          variant: "destructive",
        });
        return;
      }
      
      uploadResume(file, {
        onSuccess: () => {
          toast({ title: "Resume Uploaded", description: "Your resume has been processed for job matching." });
        },
        onError: (err) => {
          toast({ 
            title: "Upload Failed", 
            description: err.message, 
            variant: "destructive" 
          });
        }
      });
    }
  };

  return (
    <Card className="p-6 border-dashed border-2 bg-muted/30">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-4 rounded-full ${currentResume ? "bg-emerald-100 text-emerald-600" : "bg-primary/10 text-primary"}`}>
          {currentResume ? <CheckCircle2 size={32} /> : <FileText size={32} />}
        </div>
        
        <div className="space-y-1">
          <h3 className="font-display font-bold text-lg">
            {currentResume ? "Resume Active" : "Upload Resume"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs mx-auto">
            {currentResume 
              ? `Using "${currentResume.fileName}" for AI matching.`
              : "Upload your resume (PDF/TXT) to unlock AI job matching scores."}
          </p>
        </div>

        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.txt"
            onChange={handleFileChange}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isPending}
            variant={currentResume ? "outline" : "default"}
          >
            {isPending ? "Uploading..." : (currentResume ? "Update Resume" : "Upload Resume")}
            <Upload size={16} className="ml-2" />
          </Button>
        </div>
        
        {currentResume && (
           <p className="text-xs text-muted-foreground pt-2">
             Last updated: {new Date(currentResume.createdAt!).toLocaleDateString()}
           </p>
        )}
      </div>
    </Card>
  );
}
