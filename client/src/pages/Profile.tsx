import { useAuth } from "@/hooks/use-auth";
import { ResumeUpload } from "@/components/ResumeUpload";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20 border-4 border-background shadow-xl">
          <AvatarImage src={user?.profileImageUrl} />
          <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
            {user?.firstName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-display font-bold">{user?.firstName} {user?.lastName}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Resume & Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumeUpload />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Your resume is analyzed by our AI to calculate Match Scores for every job listing. 
              Keeping this updated ensures you see the most relevant opportunities first.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="flex justify-between items-center py-2">
               <span className="font-medium">Job Alerts</span>
               <span className="text-sm text-muted-foreground">Enabled</span>
             </div>
             <Separator />
             <div className="flex justify-between items-center py-2">
               <span className="font-medium">Profile Visibility</span>
               <span className="text-sm text-muted-foreground">Private</span>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
