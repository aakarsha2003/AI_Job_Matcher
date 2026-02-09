import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Briefcase, 
  UserCircle, 
  LogOut, 
  Search,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Find Jobs", href: "/", icon: Search },
    { label: "Applications", href: "/applications", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-white font-bold font-display text-lg shadow-lg shadow-primary/25">
                <Sparkles size={18} />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-foreground">
                JobAI
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={isActive ? "secondary" : "ghost"} 
                      className={`gap-2 ${isActive ? "text-primary font-medium" : "text-muted-foreground"}`}
                    >
                      <Icon size={16} />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                  <Avatar className="h-9 w-9 border-2 border-background ring-2 ring-primary/10 transition-transform hover:scale-105">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || "User"} />
                    <AvatarFallback className="bg-primary/5 text-primary">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-2 rounded-xl">
                <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
                  {user?.firstName} {user?.lastName}
                </div>
                <Link href="/profile">
                  <DropdownMenuItem className="rounded-lg cursor-pointer">
                    <UserCircle className="mr-2 h-4 w-4" />
                    Profile & Resume
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem 
                  className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
