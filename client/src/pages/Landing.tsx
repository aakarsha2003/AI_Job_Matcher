import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

export default function LandingPage() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="w-full border-b bg-background/80 backdrop-blur z-50 fixed top-0">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-display">
              <Sparkles size={18} />
            </div>
            <span className="font-display font-bold text-xl tracking-tight">JobAI</span>
          </div>
          <Button onClick={handleLogin}>Log In</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles size={14} />
              <span>AI-Powered Job Search</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold tracking-tight leading-[1.1]">
              Find your dream job <br/>
              <span className="text-gradient">faster with AI.</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
              Stop scrolling through endless listings. Our AI analyzes your resume and finds jobs that match your skills instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" onClick={handleLogin} className="text-lg h-12 px-8 shadow-lg shadow-primary/25">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="relative">
             {/* Abstract visual decoration */}
             <div className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"></div>
             <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
             
             {/* Card Mockup */}
             <div className="relative bg-card border rounded-2xl shadow-2xl p-6 rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="flex justify-between items-start mb-6">
                 <div>
                   <h3 className="font-display font-bold text-xl">Senior React Engineer</h3>
                   <p className="text-muted-foreground">TechCorp Inc.</p>
                 </div>
                 <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg font-bold font-display">
                   98% Match
                 </div>
               </div>
               <div className="space-y-3 mb-6">
                 <div className="h-2 w-full bg-muted rounded-full"></div>
                 <div className="h-2 w-3/4 bg-muted rounded-full"></div>
                 <div className="h-2 w-5/6 bg-muted rounded-full"></div>
               </div>
               <div className="flex gap-2">
                 <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">React</span>
                 <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">TypeScript</span>
                 <span className="px-2 py-1 bg-secondary rounded text-xs font-medium">Node.js</span>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Smart Matching", desc: "Our AI scores every job against your resume so you only apply to relevant roles." },
              { title: "Application Tracking", desc: "Keep track of every application status from applied to offer in one dashboard." },
              { title: "AI Assistant", desc: "Chat with our intelligent assistant to filter jobs and find hidden opportunities." }
            ].map((feature, i) => (
              <div key={i} className="bg-background p-8 rounded-2xl shadow-sm border">
                <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  <CheckCircle2 size={20} />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
